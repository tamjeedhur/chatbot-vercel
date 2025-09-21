"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, MessageSquare, Users, TrendingUp, Globe, Zap, Play, Activity, Database, Settings, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("Analytics");

  const tabs = [
    { 
      name: "Analytics", 
      icon: BarChart3,
      image: "/lovable-uploads/9abd2512-7721-4b78-9605-2c02cba3bf79.png",
      title: "Advanced Analytics Dashboard",
      subtitle: "Real-time insights at your fingertips",
      description: "Gain deep insights into your AI chatbot performance with comprehensive analytics. Track conversations, response accuracy, user satisfaction, and identify optimization opportunities in real-time."
    },
    { 
      name: "Training", 
      icon: Play,
      image: "/lovable-uploads/956bf3bd-7374-41dd-8a7e-7e273fd236e7.png",
      title: "Intelligent Training Hub",
      subtitle: "Smart AI that learns from your business",
      description: "Upload your knowledge base, documents, and FAQs to train your AI agent. Our advanced algorithms ensure your bot understands your business context and provides accurate, brand-consistent responses."
    },
    { 
      name: "Appearance", 
      icon: Settings,
      image: "/lovable-uploads/facf4148-27d9-403f-a559-c2ac9120aded.png",
      title: "Brand Customization Studio",
      subtitle: "Make it uniquely yours",
      description: "Customize every aspect of your chatbot's appearance to match your brand perfectly. From colors and fonts to conversation flow and personality - create a seamless brand experience."
    },
    { 
      name: "Sources", 
      icon: Database,
      image: "/lovable-uploads/9abd2512-7721-4b78-9605-2c02cba3bf79.png",
      title: "Multi-Source Integration",
      subtitle: "Connect all your data seamlessly",
      description: "Integrate multiple data sources including websites, documents, databases, and APIs. Your AI agent becomes smarter with every piece of information you connect."
    },
    { 
      name: "Responses", 
      icon: Activity,
      image: "/lovable-uploads/9abd2512-7721-4b78-9605-2c02cba3bf79.png",
      title: "Response Optimization",
      subtitle: "Continuous improvement made simple",
      description: "Monitor and improve your bot's responses with our intelligent feedback system. Track performance metrics and optimize conversations for better customer satisfaction."
    },
  ];

  const stats = [
    { label: "Active Conversations", value: "3,543", change: "+12%", icon: MessageSquare, color: "from-blue-500 to-cyan-500" },
    { label: "Messages Today", value: "12,543", change: "+24%", icon: BarChart3, color: "from-green-500 to-emerald-500" },
    { label: "Avg Response Time", value: "1.2s", change: "-15%", icon: TrendingUp, color: "from-purple-500 to-pink-500" },
    { label: "Satisfaction Rate", value: "98.2%", change: "+5%", icon: Users, color: "from-orange-500 to-red-500" },
  ];

  const activeTabData = tabs.find(tab => tab.name === activeTab) || tabs[0];

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-teal-500/10"></div>
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full border border-purple-500/20 backdrop-blur-sm mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
            <span className="text-purple-300 text-xs sm:text-sm font-medium">
              Interactive Dashboard Preview
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Experience the
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Future of AI
            </span>
            <br />
            <span className="text-slate-300">Customer Support</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed px-4">
            Explore our comprehensive dashboard with real screenshots showcasing the full power 
            of our AI chatbot platform in action
          </p>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="flex justify-center mb-8 sm:mb-12 px-2">
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border border-slate-700/50 shadow-2xl w-full max-w-5xl overflow-x-auto">
            <div className="flex gap-1 sm:gap-2 min-w-max sm:min-w-0 sm:justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`group px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.name 
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-xl scale-105" 
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50 hover:scale-102"
                  }`}
                >
                  <span className="flex items-center gap-1 sm:gap-2 lg:gap-3">
                    <tab.icon className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transition-transform ${
                      activeTab === tab.name ? "" : "group-hover:scale-110"
                    }`} />
                    <span className="font-semibold">{tab.name}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center mb-12 sm:mb-16 lg:mb-20">
          {/* Enhanced Dashboard Screenshot */}
          <div className="order-2 lg:order-1 w-full">
            <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl shadow-2xl overflow-hidden group w-full">
              <CardContent className="p-0">
                <div className="relative w-full">
                  {/* Image with enhanced effects */}
                  <div className="relative overflow-hidden rounded-lg w-full">
                    <img
                      src={activeTabData.image}
                      alt={`${activeTab} Dashboard`}
                      className="w-full h-auto max-w-full transition-all duration-700 group-hover:scale-110 object-contain"
                    />
                    
                    {/* Enhanced overlay with glassmorphism */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-3 sm:left-4 lg:left-6 right-3 sm:right-4 lg:right-6">
                        <div className="bg-white/10 backdrop-blur-xl rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 border border-white/20">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 lg:gap-4 text-white">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                              <span className="text-xs sm:text-sm lg:text-base font-medium">Live Dashboard</span>
                            </div>
                            <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20 text-xs sm:text-sm backdrop-blur-sm">
                              <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              Explore Features
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-4 h-4 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-sm animate-bounce"></div>
                  <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-3 h-3 sm:w-6 sm:h-6 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full blur-sm animate-bounce delay-500"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Content Description */}
          <div className="order-1 lg:order-2 space-y-4 sm:space-y-6 lg:space-y-8 w-full">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-purple-500/30 backdrop-blur-sm">
                  <activeTabData.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-purple-400" />
                </div>
                <div>
                  <span className="text-purple-400 text-xs sm:text-sm font-bold tracking-wider uppercase block">
                    {activeTab} Module
                  </span>
                  <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 mt-1"></div>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                  {activeTabData.title}
                </h3>
                <p className="text-base sm:text-lg lg:text-xl text-purple-300 font-medium">
                  {activeTabData.subtitle}
                </p>
              </div>
              
              <p className="text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed">
                {activeTabData.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-xl shadow-2xl shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base lg:text-lg font-semibold px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4"
              >
                Try This Feature
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-slate-600 text-slate-300 hover:bg-slate-800/50 rounded-xl backdrop-blur-sm text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 group"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-12 sm:mb-16 lg:mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800/40 border-slate-700/50 backdrop-blur-xl hover:bg-slate-800/60 transition-all duration-300 group hover:scale-105">
              <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-400 mb-1">{stat.label}</div>
                <div className="text-xs text-green-400 font-medium">{stat.change}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
          {[
            {
              icon: BarChart3,
              title: "Advanced Analytics",
              description: "Real-time insights with ML-powered predictions and automated reporting for data-driven decisions"
            },
            {
              icon: Globe,
              title: "Omnichannel Deployment",
              description: "Seamlessly integrate across web, mobile, social platforms, and messaging apps with unified management"
            },
            {
              icon: TrendingUp,
              title: "AI-Powered Learning",
              description: "Continuous improvement through machine learning algorithms that adapt to your business context"
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-slate-800/40 border-slate-700/50 backdrop-blur-xl hover:bg-slate-800/60 transition-all duration-300 group hover:scale-105">
              <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300 border border-purple-500/30">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-purple-400" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm lg:text-base leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-slate-600/50 backdrop-blur-xl shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              <span className="text-purple-300 text-xs sm:text-sm font-medium">Ready to get started?</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">
              Transform Your Customer Experience
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Starting Today
              </span>
            </h3>
            
            <p className="text-slate-400 mb-4 sm:mb-6 lg:mb-8 max-w-3xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed">
              Join thousands of businesses already using our AI platform to deliver exceptional customer support experiences that drive growth and satisfaction.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 text-base sm:text-lg lg:text-xl font-bold rounded-xl sm:rounded-2xl shadow-2xl shadow-purple-500/30 transform hover:scale-105 transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-slate-600 text-slate-300 hover:bg-slate-800/50 px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl backdrop-blur-sm group"
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform" />
                View Live Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
