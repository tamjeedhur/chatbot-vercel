
export function Integrations() {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Control Your Bot Responses
              </h2>
              <p className="text-slate-400 mb-8">
                Improve your bot's responses by adding new content and updating existing content, making your bot smarter over time.
              </p>
              
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Can You Connect Me With A Sales Agent?</span>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-slate-300 text-sm">Can I Delay Or Cancel My Order?</span>
                    </div>
                    <p className="text-slate-400 text-sm">Sure, you can cancel your order...</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button className="text-teal-400 text-sm">👍</button>
                      <button className="text-slate-500 text-sm">👎</button>
                      <button className="text-teal-400 text-sm">Add to FAQ +</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Multiple Data Sources
              </h2>
              <p className="text-slate-400 mb-8">
                Train your chatbots with unlimited content from various data sources through our interface or API.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: "🌐", label: "Websites" },
                  { icon: "📄", label: "Files" }, 
                  { icon: "🗄️", label: "Database" },
                  { icon: "🎥", label: "Videos" }
                ].map((source, index) => (
                  <div key={index} className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700">
                    <div className="text-2xl mb-2">{source.icon}</div>
                    <span className="text-slate-300 text-sm">{source.label}</span>
                  </div>
                ))}
              </div>
              
              <div className="w-20 h-20 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto">
                <span className="text-slate-900 text-2xl">💬</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  