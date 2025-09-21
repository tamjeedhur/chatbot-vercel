
export function HowItWorks() {
    const steps = [
      {
        icon: "🗄️",
        title: "Connect data sources",
        description: "Feed the AI with your website, files or videos to train a chatbot with your business details."
      },
      {
        icon: "💬",
        title: "Integrate", 
        description: "Integrate your chatbot on multiple channels (Website, Messenger, Whatsapp,...) in a few clicks."
      },
      {
        icon: "📝",
        title: "Revise answers",
        description: "Read your customers' interaction with your chatbot to improve its knowledge."
      }
    ];
  
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-teal-400 text-sm font-medium tracking-wider uppercase">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-6">
              Integrate your AI
              <br />
              chatbot in minutes
            </h2>
            <p className="text-sm md:text-xl text-slate-400 max-w-3xl mx-auto">
              Dealing with customer support doesn't have to be hard and time-consuming. With Support AI, you can train and integrate a knowledgeable and friendly chatbot powered by ChatGPT on your website in a few clicks.
            </p>
          </div>
  
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-teal-400 to-transparent transform translate-x-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  