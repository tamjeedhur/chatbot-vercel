
export function Footer() {
    return (
      <footer className="bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <span className="text-slate-900 font-bold text-lg">AI</span>
                </div>
                <span className="text-white font-semibold text-xl">Support AI</span>
              </div>
              <p className="text-slate-400 text-sm">
                Automate your customer support with AI-powered chatbots that work 24/7.
              </p>
            </div>
  
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white text-sm">Features</a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm">Pricing</a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm">Integrations</a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm">API</a>
              </div>
            </div>
  
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white text-sm">About</a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm">Blog</a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm">Careers</a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm">Contact</a>
              </div>
            </div>
  
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white text-sm">Help Center</a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm">Documentation</a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm">Status</a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm">Privacy Policy</a>
              </div>
            </div>
          </div>
  
          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2024 Support AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }
  