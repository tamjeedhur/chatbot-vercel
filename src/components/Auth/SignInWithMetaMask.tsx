"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import useMetamask from "../../hooks/useMetamask";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const SignInWithMetaMask: React.FC = () => {
  const { connectMetaMask, account, loading } = useMetamask();
  const router = useRouter();
  const handleMetaMaskLogin = async () => {
    const { address, signature } = await connectMetaMask();

    if (address && signature) {
      try {
        const response = await axiosInstance.post("/api/metamask-login", {
          address,
          signature,
        });

        if (response.status === 200) {
          // Let the middleware handle the redirect based on user's chatbots
          router.push("/sign-in");
          toast({
            title: "Signed in successfully",
            description: "You're now signed in with MetaMask.",
          });
        } else {
          toast({
            title: "Authentication failed",
            description: response.data.message || "An error occurred",
          });
        }
      } catch (error) {
        console.error("Error during MetaMask login:", error);
        toast({
          title: "An error occurred",
          description: "Unable to connect with MetaMask.",
        });
      }
    } else {
      toast({
        title: "MetaMask login failed",
        description: "Unable to get address or signature.",
      });
    }
  };

  return (
    <Button onClick={handleMetaMaskLogin} disabled={loading} className="w-full h-12">
      {loading ? "Connecting..." : "Sign In with MetaMask"}
    </Button>
  );
};

export default SignInWithMetaMask;
