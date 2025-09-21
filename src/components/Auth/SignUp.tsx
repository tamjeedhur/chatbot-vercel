"use client";

import React from "react";
import Link from "next/link";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMachine } from "@xstate/react";
import { signUpFormMachine } from "@/machines/signUpFormMachine/signUpFormMachine";
import LoginWithGoogle from "./loginWithGoogle";
import { Loader2 } from "lucide-react";

const signUpValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  name: Yup.string().required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
    .required("Required"),
});

export default function SignUp() {
  const [state, send] = useMachine(signUpFormMachine);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  // Check if we're in a loading state
  const isLoading = state.matches('submitting') || state.matches('signingIn');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData(e.currentTarget);
    const values = {
      email: String(formData.get("email") || ""),
      name: String(formData.get("name") || ""),
      password: String(formData.get("password") || ""),
    };
    try {
      await signUpValidationSchema.validate(values, { abortEarly: false });
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Sign Up</h1>
            <p className="text-sm text-muted-foreground">Enter your email and password to create an account.</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
          <LoginWithGoogle />
          <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-muted-foreground text-sm">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>
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
                onChange={(e) => send({ type: 'UPDATE_FIELD', field: 'email', value: e.target.value })}
                disabled={isLoading}
              />
              {errors.email ? (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                Name<span className="text-primary">*</span>
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                className="h-11"
                value={state.context.name}
                onChange={(e) => send({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value })}
                disabled={isLoading}
              />
              {errors.name ? (
                <p className="text-sm text-destructive mt-1">{errors.name}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                Password<span className="text-primary">*</span>
              </label>
              <Input
                id="password"
                name="password"
                placeholder="Min. 8 characters"
                type="password"
                className="h-11"
                value={state.context.password}
                onChange={(e) => send({ type: 'UPDATE_FIELD', field: 'password', value: e.target.value })}
                disabled={isLoading}
              />
              {errors.password ? (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              ) : null}
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12" 
              disabled={isLoading || state.context.isDisabled}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="mt-2 text-sm text-muted-foreground">
            Already have an account?
            <Link href={{ pathname: "/sign-in" }} className="text-primary font-medium ml-1">
              Sign In
            </Link>
          </div>
      </div>
    </div>
  );
}
