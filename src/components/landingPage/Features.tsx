
import { Headphones, Calendar, Phone, Gamepad2, GraduationCap, ArrowRight } from "lucide-react";

export function Features() {
  const useCases = [
    {
      icon: Headphones,
      title: "Customer Support",
      description: "Handle a wide range of customer inquiries 24/7, reducing wait times and improving customer satisfaction. Agents can troubleshoot issues, process returns, and even upsell products, all while maintaining a consistent brand voice.",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: Calendar,
      title: "Scheduling",
      description: "Simplify appointment booking and management, from healthcare to personal services. Clients can easily schedule, reschedule, or cancel appointments through natural conversation, reducing no-shows and improving operational efficiency.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Phone,
      title: "Outbound Sales",
      description: "Conduct personalized cold calling at scale, qualifying leads and setting appointments for your team. Agents can deliver their pitch based on customer responses, ensuring higher engagement and conversion rates.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Gamepad2,
      title: "Gaming",
      description: "Create immersive gaming experiences, responding dynamically to player actions and choices. Intelligent NPCs (Non-Player Characters) can offer quests, provide guidance, and even adapt their personalities based on the player's behavior.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: GraduationCap,
      title: "Education",
      description: "Provide personalized learning experiences, offering interactive quizzes, and adaptive learning paths. Students can receive immediate feedback on their progress in various subjects and learning styles.",
      color: "from-purple-500 to-indigo-500"
    }
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-800/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase">
            USE CASES
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-6 mb-8">
            Make customer experience
            <br />
            your <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">competitive edge</span>
          </h2>
          <p className="text-sm md:text-xl text-slate-400 max-w-3xl mx-auto">
            Use our AI agents to deliver exceptional support experiences that set you apart from the competition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <div 
                key={index} 
                className="group bg-slate-800/40 backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
              >
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${useCase.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
                      {useCase.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                  
                  <ArrowRight className="w-6 h-6 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-2 transition-all duration-300 hidden md:block" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
