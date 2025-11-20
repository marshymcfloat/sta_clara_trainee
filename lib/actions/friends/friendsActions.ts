"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { cookies } from "next/headers";

export async function addFriendAction(userId: string) {
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

    const { data, error } = await supabase
      .from("Friend_request")
      .insert({ sender_id: user.id, request_to: userId });

    if (error) {
      return { success: false, error: error.message || "Failed to add friend" };
    }

    return { success: true, message: "Friend added successfully" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "An error occurred" };
  }
}

export async function acceptFriendRequestAction(requestId: number) {
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

    const { data: friendRequest, error: fetchError } = await supabase
      .from("Friend_request")
      .select("*")
      .eq("id", requestId)
      .eq("request_to", user.id)
      .eq("status", "PENDING")
      .single();

    if (fetchError || !friendRequest) {
      return {
        success: false,
        error: "Friend request not found or already processed",
      };
    }

    const { error: updateError } = await supabase
      .from("Friend_request")
      .update({ status: "ACCEPTED" })
      .eq("id", requestId);

    if (updateError) {
      return {
        success: false,
        error: updateError.message || "Failed to accept friend request",
      };
    }

    const { error: friendshipError1 } = await supabase
      .from("Friendship")
      .insert({
        user_id: user.id,
        friend_id: friendRequest.sender_id,
      });

    if (friendshipError1) {
      if (friendshipError1.code !== "23505") {
        return {
          success: false,
          error: friendshipError1.message || "Failed to create friendship",
        };
      }
    }

    const { error: friendshipError2 } = await supabase
      .from("Friendship")
      .insert({
        user_id: friendRequest.sender_id,
        friend_id: user.id,
      });

    if (friendshipError2) {
      if (friendshipError2.code !== "23505") {
        return {
          success: false,
          error: friendshipError2.message || "Failed to create friendship",
        };
      }
    }

    return { success: true, message: "Friend request accepted successfully" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "An error occurred" };
  }
}

export async function declineFriendRequestAction(requestId: number) {
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

    const { data: friendRequest, error: fetchError } = await supabase
      .from("Friend_request")
      .select("*")
      .eq("id", requestId)
      .eq("request_to", user.id)
      .eq("status", "PENDING")
      .single();

    if (fetchError || !friendRequest) {
      return {
        success: false,
        error: "Friend request not found or already processed",
      };
    }

    const { error: updateError } = await supabase
      .from("Friend_request")
      .update({ status: "DECLINED" })
      .eq("id", requestId);

    if (updateError) {
      return {
        success: false,
        error: updateError.message || "Failed to decline friend request",
      };
    }

    return { success: true, message: "Friend request declined successfully" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "An error occurred" };
  }
}
