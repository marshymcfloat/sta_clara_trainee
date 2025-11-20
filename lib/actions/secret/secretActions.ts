"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { cookies } from "next/headers";

export async function updateSecretMessageAction(message: string) {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: userError?.message || "Please login first",
      };
    }

    const { data: existingMessage, error: checkError } = await supabase
      .from("Secret_message")
      .select("id")
      .eq("author_id", user.id)
      .maybeSingle();

    if (checkError && checkError.code !== "PGRST116") {
      return {
        success: false,
        error: checkError.message || "Failed to check existing message",
      };
    }

    if (existingMessage) {
      const { error: updateError } = await supabase
        .from("Secret_message")
        .update({ message, updated_at: new Date().toISOString() })
        .eq("author_id", user.id);

      if (updateError) {
        return {
          success: false,
          error: updateError.message || "Failed to update secret message",
        };
      }

      return {
        success: true,
        message: "Secret message updated successfully",
      };
    } else {
      const { error: insertError } = await supabase
        .from("Secret_message")
        .insert({
          author_id: user.id,
          message,
        });

      if (insertError) {
        return {
          success: false,
          error: insertError.message || "Failed to create secret message",
        };
      }

      return {
        success: true,
        message: "Secret message created successfully",
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "An error occurred",
    };
  }
}

export async function getFriendSecretMessageAction(friendId: string) {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "Unauthorized",
        status: 401,
      };
    }

    const { data: friendship1, error: friendshipError1 } = await supabase
      .from("Friendship")
      .select("*")
      .eq("user_id", user.id)
      .eq("friend_id", friendId)
      .maybeSingle();

    const { data: friendship2, error: friendshipError2 } = await supabase
      .from("Friendship")
      .select("*")
      .eq("user_id", friendId)
      .eq("friend_id", user.id)
      .maybeSingle();

    const isFriend = !!friendship1 || !!friendship2;

    if (!isFriend) {
      return {
        success: false,
        error: "Unauthorized: You are not friends with this user",
        status: 401,
      };
    }

    const { data: secretMessage, error: messageError } = await supabase
      .from("Secret_message")
      .select("message")
      .eq("author_id", friendId)
      .maybeSingle();

    if (messageError) {
      return {
        success: false,
        error: messageError.message || "Failed to fetch secret message",
      };
    }

    return {
      success: true,
      data: secretMessage,
      message: "Secret message retrieved successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "An error occurred",
    };
  }
}
