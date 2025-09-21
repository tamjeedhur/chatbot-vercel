
import { Shield, Database, Lock, Globe } from "lucide-react";

export function Security() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-pink-400 text-sm font-medium tracking-wider uppercase mb-4 block">
              🔒 Security
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Enterprise-grade
              <br />
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                security & privacy
              </span>
            </h2>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed">
              We take security and compliance seriously. Our platform is SOC 2 Type II and GDPR compliant, 
              trusted by thousands of businesses to build secure and compliant AI Agents.
            </p>
            
            <div className="flex items-center gap-6">
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xs font-medium text-slate-300">SOC 2</span>
                </div>
                <p className="text-xs text-slate-400">Type II</p>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-2">
                  <Shield className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-xs text-slate-400">GDPR</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Your data stays yours</h3>
                  <p className="text-slate-400 text-sm">
                    Your data is only accessible to your AI agent and is never used to train models.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Data encryption</h3>
                  <p className="text-slate-400 text-sm">
                    All data is encrypted at rest and in transit. We use industry-standard encryption algorithms.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Secure integrations</h3>
                  <p className="text-slate-400 text-sm">
                    We use verified variables to ensure users can access only their own data in your systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
