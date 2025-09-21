
import { Button } from "@/components/ui/button";
import { CheckCircle, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10"></div>
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          <div className="mb-8">
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 text-purple-300 text-sm font-medium rounded-full border border-purple-500/20 backdrop-blur-sm">
              🚀 The #1 AI Agent for Customer Service
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl 2xl:text-8xl font-bold text-white mb-8 leading-tight">
            Create outstanding
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
             AI Chatbots
            </span>
            <br />
            <span className="text-slate-300">10X faster</span>
          </h1>
          
          <p className="text-sm md:text-xl text-slate-400 mb-10 max-w-4xl mx-auto leading-relaxed">
            Start building your AI SaaS with the most advanced chatbot template. 
            Deliver exceptional support experiences that set you apart from the competition.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-2xl shadow-purple-500/25 transform hover:scale-105 transition-all duration-200"
            >
              Build Your Agent →
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-800/50 px-10 py-4 text-lg rounded-xl backdrop-blur-sm"
            >
              <Play className="w-5 h-5 mr-2" />
              See Live Preview
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              "💳 No credit card required",
              "🌍 Available in 80+ languages", 
              "⚡ Production-ready prompts"
            ].map((feature, index) => (
              <div key={index} className="flex items-center justify-center gap-3 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                <span className="text-slate-300 text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-12 border-t border-slate-700/50">
            <p className="text-slate-500 text-sm mb-6">Trusted by thousands of businesses worldwide</p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              {["Marshmallow", "Amplitude", "Moneybox", "Shutterstock", "Synthesia", "Lovable"].map((company) => (
                <span key={company} className="text-slate-400 font-medium">{company}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
