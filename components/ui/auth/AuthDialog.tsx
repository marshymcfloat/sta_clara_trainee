"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import AuthRegisterForm from "./AuthRegisterForm";
import AuthLoginForm from "./AuthLoginForm";

export default function AuthDialog({ open }: { open: boolean | null }) {
  const [content, setContent] = useState<"LOGIN" | "REGISTER">("LOGIN");

  return (
    <Dialog open={open ?? undefined}>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold">
            {content === "LOGIN" ? "Login" : "Register"}
          </DialogTitle>
          <DialogDescription>
            {content === "LOGIN"
              ? "Login to Sta. Clara"
              : "Get started with Sta. Clara"}
          </DialogDescription>
        </DialogHeader>
        {content === "LOGIN" ? (
          <AuthLoginForm setContent={setContent} />
        ) : (
          <AuthRegisterForm setContent={setContent} />
        )}
      </DialogContent>
    </Dialog>
  );
}
