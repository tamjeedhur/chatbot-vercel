"use client";

import React from "react";
import Link from "next/link";
import DefaultAuthLayout from "./authLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as Yup from "yup";
import { useMachine } from "@xstate/react";
import { forgotPasswordMachine } from "@/machines/forgotPasswordMachine/forgotPasswordMachine";
import { CheckCircle, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [state, send] = useMachine(forgotPasswordMachine); 
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const emailValidationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData(e.currentTarget);
    const values = {
      email: String(formData.get("email") || ""),
    };
    try {
      await emailValidationSchema.validate(values, { abortEarly: false });
      send({ type: 'SUBMIT' });
      // Proceed with submit flow here
    } catch (err: any) {
      const nextErrors: Record<string, string> = {};
      if (err?.inner && Array.isArray(err.inner)) {
        err.inner.forEach((issue: any) => {
          if (issue.path && !nextErrors[issue.path]) {
            nextErrors[issue.path] = issue.message;
          }
        });
      }
      setErrors(nextErrors);
    }
  };

  const handleResend = () => {
    send({ type: 'RESEND' });
  };
  
  // Success state UI
  if (state.matches('success') || (state.matches('sending') && state.context.isEmailSent)) {
    return (
      <DefaultAuthLayout>
        <div className="w-full flex items-center justify-center">
          <div className="w-full max-w-[420px] px-6 lg:px-0 mt-16 mb-10">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Check Your Email</h1>
              <p className="text-sm text-muted-foreground mb-6">
                We've sent a password reset link to <strong>{state.context.email}</strong>
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex flex-col items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Didn't receive the email?</p>
                    <p>Check your spam folder or try resending the email.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={handleResend} 
                  variant="outline" 
                  className="w-full h-12"
                  disabled={state.matches("sending")}
                >
                  {state.matches("sending") ? "Resending..." : "Resend Email"}
                </Button>
                {!state.matches("sending") && (
                  <Button 
                    onClick={() => send({ type: 'RESET' })} 
                    variant="ghost" 
                    className="w-full h-12"
                  >
                    Use Different Email
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Remember your password?
              <Link href={{ pathname: "/sign-in" }} className="text-primary font-medium ml-1">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </DefaultAuthLayout>
    );
  }
  
  return (
    <DefaultAuthLayout>
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-[420px] px-6 lg:px-0 mt-16 mb-10">
          <div className="mb-9">
            <h1 className="text-3xl font-bold text-foreground mb-2">Forgot Password</h1>
            <p className="text-sm text-muted-foreground">Enter your email to reset password!</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                Email<span className="text-primary">*</span>
              </label>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="whatever@example.com"
                className="h-11"
                value={state.context.email}
                onChange={(e) => send({ type: "UPDATE_FIELD", value: e.target.value })}
                disabled={state.matches("sending")}
              />
              {errors.email ? (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              ) : null}
            </div>

            <Button type="submit" className="w-full h-12" disabled={state.matches("sending") || state.context.isDisabled}>
              {state.matches("sending") ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
          <div className="mt-2 text-sm text-muted-foreground">
            Remember your password?
            <Link href={{ pathname: "/sign-in" }} className="text-primary font-medium ml-1">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </DefaultAuthLayout>
  );
}
