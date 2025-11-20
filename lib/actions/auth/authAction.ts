"use server";

import {
  authRegisterSchema,
  AuthRegisterTypes,
  authLoginSchema,
  AuthLoginTypes,
} from "@/lib/zod/authSchema";
import { createClient } from "@/lib/utils/supabase/server";
import { cookies } from "next/headers";
import { StringFormatter } from "@/lib/utils";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

export async function authRegisterAction(types: AuthRegisterTypes) {
  try {
    const supabase = await createClient(cookies());

    const validationResult = authRegisterSchema.safeParse(types);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.message || "There was a validation error",
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: types.email,
      password: types.password,
      options: {
        data: {
          fullname: StringFormatter(types.fullname),
        },
      },
    });

    if (error || !data.user) {
      return {
        success: false,
        error: error?.message || "There was an error registering your account",
      };
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error(
        "SUPABASE_SERVICE_ROLE_KEY is not set in environment variables"
      );
      return {
        success: false,
        error: "Server configuration error. Please contact support.",
      };
    }

    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { error: profileError } = await supabaseAdmin.from("Profile").upsert(
      {
        id: data.user.id,
        email: types.email,
        fullname: StringFormatter(types.fullname),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      }
    );

    if (profileError) {
      console.error("Profile creation error:", profileError);

      if (
        profileError.message?.includes("Invalid API key") ||
        profileError.message?.includes("invalid") ||
        profileError.message?.toLowerCase().includes("api key") ||
        profileError.code === "PGRST301"
      ) {
        return {
          success: false,
          error:
            "Invalid API key. Please check your SUPABASE_SERVICE_ROLE_KEY in .env file.",
        };
      }

      if (
        profileError.message?.includes("does not exist") ||
        profileError.code === "42P01"
      ) {
        return {
          success: false,
          error:
            "Profile table not found. Please run the SQL setup script in Supabase.",
        };
      }

      return {
        success: false,
        error: profileError.message || "Failed to create user profile",
      };
    }

    return { success: true, data, message: "Account created successfully" };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "There was an error registering your account",
    };
  }
}

export async function authLoginAction(types: AuthLoginTypes) {
  try {
    const supabase = await createClient(cookies());

    const validationResult = authLoginSchema.safeParse(types);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.message || "There was a validation error",
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: types.email,
      password: types.password,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "There was an error logging in",
      };
    }

    return { success: true, data, message: "Logged in successfully" };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "There was an error logging in",
    };
  }
}

export async function authLogoutAction() {
  try {
    const supabase = await createClient(cookies());

    const { error: userErr } = await supabase.auth.getUser();

    if (userErr) {
      return {
        success: false,
        error: userErr.message || "There was an error logging out",
      };
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message || "There was an error logging out",
      };
    }

    return { success: true, message: "Logged out successfully" };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "There was an error logging out",
    };
  }
}

export async function authDeleteAccountAction() {
  try {
    const supabaseUserClient = await createClient(cookies());
    const { data: userData, error: userErr } =
      await supabaseUserClient.auth.getUser();

    if (userErr || !userData?.user) {
      return {
        success: false,
        error: "Please login first",
      };
    }

    const userId = userData.user.id;

    const { error: signOutErr } = await supabaseUserClient.auth.signOut();

    if (signOutErr) {
      console.error("Sign out error:", signOutErr);
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error(
        "SUPABASE_SERVICE_ROLE_KEY is not set in environment variables"
      );
      return {
        success: false,
        error: "Server configuration error. Please contact support.",
      };
    }

    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { error: profileErr } = await supabaseAdmin
      .from("Profile")
      .delete()
      .eq("id", userId);

    if (profileErr) {
      console.error("Profile delete error:", profileErr);

      if (
        profileErr.message?.includes("Invalid API key") ||
        profileErr.message?.includes("invalid") ||
        profileErr.message?.toLowerCase().includes("api key") ||
        profileErr.code === "PGRST301"
      ) {
        return {
          success: false,
          error:
            "Invalid API key. Please check your SUPABASE_SERVICE_ROLE_KEY in .env file.",
        };
      }

      return {
        success: false,
        error: profileErr.message || "Error deleting profile data",
      };
    }

    const { error: deleteUserErr } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    );

    if (deleteUserErr) {
      console.error("Auth delete error:", deleteUserErr);
      return {
        success: false,
        error: deleteUserErr.message || "Error deleting auth account",
      };
    }

    return {
      success: true,
      message: "Account deleted successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "There was an unexpected error deleting your account",
    };
  }
}
