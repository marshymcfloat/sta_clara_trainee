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

    if (error) {
      return {
        success: false,
        error: error.message || "There was an error registering your account",
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
