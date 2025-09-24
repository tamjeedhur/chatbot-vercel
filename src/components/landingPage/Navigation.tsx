'use client'
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { useRouter } from "next/navigation";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">CA</span>
            </div>
            <span className="text-white font-bold text-2xl">ChatAgent</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors font-medium">
              Features
            </a>
            <a href="#features" className="text-slate-300 hover:text-white transition-colors font-medium">
              How It Works
            </a>
            <a href="#pricing" className="text-slate-300 hover:text-white transition-colors font-medium">
              Pricing
            </a>
            <Button variant="ghost" className="text-slate-300 hover:text-black font-medium" onClick={handleSignIn}>
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg shadow-purple-500/25">
              Start Free Trial
            </Button>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-slate-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#features" className="block px-3 py-2 text-slate-300 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="block px-3 py-2 text-slate-300 hover:text-white transition-colors">
                Pricing
              </a>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-black" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white">
                Start Free Trial
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
