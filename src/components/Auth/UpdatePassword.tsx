"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DefaultAuthLayout from "./authLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import * as Yup from "yup";
import { useMachine } from "@xstate/react";
import resetPasswordMachine from "@/machines/resetPasswordMachine/resetPasswordMachine";



export default function UpdatePassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [state,send]= useMachine(resetPasswordMachine,{
    input: {
      token: token || '',
    },
  })
  const updatePasswordValidationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Required"),
  });
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData(e.currentTarget);
    const values = {
      password: String(formData.get("password") || ""),
      confirmPassword: String(formData.get("confirmPassword") || ""),
    };
    try {
      await updatePasswordValidationSchema.validate(values, { abortEarly: false });
      // Proceed with submit flow here
      send({type:'SUBMIT'})
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
 if(state.matches('redirecting')){
  router.push('/sign-in')
 }
  if(state.matches('error')){
    return (
      <DefaultAuthLayout>
        <div className="w-full flex items-center justify-center">
          <div className="w-full max-w-[420px] px-6 lg:px-0 mt-16 mb-10">
            <div className="mb-9 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Update Failed</h1>
              <p className="text-sm text-muted-foreground mb-6">Something went wrong while updating your password. Please try again.</p>
            </div>
            <div className="space-y-4">
              <Button 
                onClick={() => send({ type: 'SUBMIT' })}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
              >
                Try Again
              </Button>
              <Link href="/sign-in" className="block text-center text-sm text-muted-foreground hover:text-primary">
                Back to Sign In
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Update Password</h1>
            <p className="text-sm text-muted-foreground">Enter your new password to update your account.</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                New Password<span className="text-primary">*</span>
              </label>
              <Input
                id="password"
                name="password"
                placeholder="Min. 8 characters"
                type="password"
                value={state.context.password}
                onChange={(e)=>send({type:'EDIT_PASSWORD',password:e.target.value})}
                className="h-11"
              />
              {errors.password ? (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                Confirm New Password<span className="text-primary">*</span>
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Min. 8 characters"
                type="password"
                className="h-11"
                value={state.context.confirmPassword}
                onChange={(e)=>send({type:'EDIT_CONFIRM_PASSWORD',confirmPassword:e.target.value})}
              />
              {errors.confirmPassword ? (
                <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
              ) : null}
            </div>

            <Button type="submit" className={`w-full h-12 ${state.matches('success') ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`} disabled={state.matches('submitting') || state.matches('success')}>
              {state.matches('submitting') ? 'Updating...' : state.matches('success') ? 'Password Updated Successfully' : 'Update Password'}
            </Button>
          </form>
          <div className="mt-2 text-sm text-muted-foreground">
            <Link href={{ pathname: "/sign-in" }} className="text-primary font-medium">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </DefaultAuthLayout>
  );
}
