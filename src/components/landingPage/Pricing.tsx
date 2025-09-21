"use client"
import { Button } from "@/components/ui/button";
import { CheckCircle, X } from "lucide-react";
import { useState } from "react";

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      price: "$0",
      yearlyPrice: "$0",
      period: "/mo",
      features: [
        { text: "20 messages / month", included: true },
        { text: "1 chatbot", included: true },
        { text: "10 pieces of training content", included: true },
        { text: "Collect leads", included: false },
        { text: "Unlimited websites integration", included: false },
        { text: "API Access", included: false },
        { text: "Remove Support AI branding", included: false }
      ]
    },
    {
      name: "Starter", 
      price: "$29",
      yearlyPrice: "$23",
      period: "/mo",
      features: [
        { text: "2,000 messages / month", included: true },
        { text: "5 chatbots", included: true },
        { text: "200 pieces of training content", included: true },
        { text: "Collect leads", included: true },
        { text: "Unlimited websites integration", included: true },
        { text: "API Access", included: true },
        { text: "Remove Support AI branding", included: false }
      ]
    },
    {
      name: "Pro",
      price: "$49",
      yearlyPrice: "$39", 
      period: "/mo",
      popular: true,
      features: [
        { text: "5,000 messages / month", included: true },
        { text: "10 chatbots", included: true },
        { text: "500 pieces of training content", included: true },
        { text: "Collect leads", included: true },
        { text: "Unlimited websites integration", included: true },
        { text: "API Access", included: true },
        { text: "Remove Support AI branding", included: true }
      ]
    },
    {
      name: "Enterprise",
      price: "$89",
      yearlyPrice: "$71",
      period: "/mo", 
      features: [
        { text: "10,000 messages / month", included: true },
        { text: "Unlimited chatbots", included: true },
        { text: "Unlimited training content", included: true },
        { text: "Collect leads", included: true },
        { text: "Unlimited websites integration", included: true },
        { text: "API Access", included: true },
        { text: "Remove Support AI branding", included: true },
        { text: "Access to GPT-4.5", included: true }
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-teal-400 text-sm font-medium tracking-wider uppercase">
            PRICING
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-8">
            Unlock customer satisfaction
            <br />
            on autopilot
          </h2>
          
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-slate-300 ${!isYearly ? 'text-white font-medium' : ''}`}>Pay Monthly</span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={isYearly}
                onChange={() => setIsYearly(!isYearly)}
              />
              <div 
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${
                  isYearly ? 'bg-teal-500' : 'bg-slate-600'
                }`}
                onClick={() => setIsYearly(!isYearly)}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${
                  isYearly ? 'transform translate-x-6' : 'left-0.5'
                }`}></div>
              </div>
            </div>
            <span className={`text-slate-300 ${isYearly ? 'text-white font-medium' : ''}`}>Pay Yearly</span>
            <span className="bg-teal-500/20 text-teal-400 px-2 py-1 rounded text-sm">4 months free 🎁</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-2xl p-6 border ${
                plan.popular 
                  ? 'bg-gradient-to-b from-teal-500/10 to-slate-800/50 border-teal-500/50' 
                  :'bg-slate-800/30 border-slate-700'
              }`}
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-white">
                    {isYearly ? plan.yearlyPrice : plan.price}
                  </span>
                  <span className="text-slate-400 ml-1">{plan.period}</span>
                  {isYearly && plan.name !== "Free" && (
                    <span className="text-xs text-teal-400 ml-2">
                      (billed yearly)
                    </span>
                  )}
                </div>
              </div>

              <Button 
                className={`w-full mb-6 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600' 
                    :'bg-teal-500 hover:bg-teal-600'
                } text-white`}
              >
                Request Demo
              </Button>

              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    {feature.included ? (
                      <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-slate-300' : 'text-slate-500'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
