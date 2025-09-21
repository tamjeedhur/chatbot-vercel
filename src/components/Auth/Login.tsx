"use client";
import React from "react";
import Link from "next/link";
import * as Yup from "yup";
import LoginWithGoogle from "./loginWithGoogle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMachine } from "@xstate/react";
import { signInMachine } from "@/machines/signInMachine/signInMachine";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function SignIn() {
  const [state, send] = useMachine(signInMachine);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  // Check if we're in a loading state
  const isLoading = state.matches('submitting') || state.matches('settingUserInSession');
  
  const loginValidationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
      .required("Required"),
  });
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData(e.currentTarget);
    const values = {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };
    try {
      await loginValidationSchema.validate(values, { abortEarly: false });
      send({ type: 'SUBMIT' });
    } catch (err: any) {
      const nextErrors: Record<string, string> = {};
      if (err?.inner && Array.isArray(err.inner)) {
        err.inner.forEach((issue: any) => {
          if (issue.path && !nextErrors[issue.path]) {
            nextErrors[issue.path] = issue.message;
          }
        });
      } else if (err?.path) {
        nextErrors[err.path] = err.message;
      }
      setErrors(nextErrors);
    }
  };
  
  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-[420px] px-6 lg:px-0 mt-16 mb-10">
          <div className="mb-9">
            <h1 className="text-3xl font-bold text-foreground mb-2">Sign In</h1>
            <p className="text-sm text-muted-foreground">Enter your email and password to sign in!</p>
          </div>
          <div className="space-y-6">
            <LoginWithGoogle />
            {/* <SignInWithMetaMask /> */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-muted-foreground text-sm">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-1">
                  Email<span className="text-primary">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="whatsoever@email.com"
                  className="h-11"
                  onChange={(e) => send({ type: 'UPDATE_FIELD', field: 'email', value: e.target.value })}
                  value={state.context.email}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-1">
                  Password<span className="text-primary">*</span>
                </label>
                <Input
                  id="password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  className="h-11"
                  onChange={(e) => send({ type: 'UPDATE_FIELD', field: 'password', value: e.target.value })}
                  value={state.context.password}
                  disabled={isLoading}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    id="remember-login"
                    type="checkbox"
                    className="h-4 w-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    disabled={isLoading}
                  />
                  <label htmlFor="remember-login" className="text-sm text-foreground">
                    Keep me logged in
                  </label>
                </div>
                <Link href="/forgot-password" className="text-sm text-primary font-medium">
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12" 
                disabled={isLoading || state.context.isDisabled}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            <div className="mt-2 text-sm text-muted-foreground">
              Not registered yet?
              <Link
                href={{ pathname: "/sign-up" }}
                className="text-primary font-medium ml-1"
              >
                Create an Account
              </Link>
            </div>
          </div>
      </div>
    </div>
  );
}
