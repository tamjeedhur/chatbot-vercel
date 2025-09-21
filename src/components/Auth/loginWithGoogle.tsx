import React from "react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";


const LoginWithGoogle = () => {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", {
        redirect: true,
        callbackUrl: "http://localhost:3000/sign-in" 
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      return true;
    } catch (error: any) {
      console.error("Google sign in error:", error.message);
    }
  };

  return (
    <Button 
      type="button" 
      onClick={handleGoogleSignIn} 
      variant="outline" 
      className="w-full h-12 text-foreground"
    >
      <FcGoogle className="h-5 w-5 mr-2" />
      Sign in with Google
    </Button>
  );
};

export default LoginWithGoogle;
