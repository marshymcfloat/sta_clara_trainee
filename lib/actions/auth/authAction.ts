"use server";

import { authRegisterSchema, AuthRegisterTypes } from "@/lib/zod/authSchema";
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
