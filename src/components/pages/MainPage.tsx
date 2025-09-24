
import { Navigation } from "../landingPage/Navigation";
import { Hero } from "../landingPage/Hero"
import { Features } from "../landingPage/Features";
import { DashboardPreview } from "../landingPage/DashboardPreview";
import { HowItWorks } from "../landingPage/HowItWorks";
import { Integrations } from "../landingPage/Integrations";
import { Pricing } from "../landingPage/Pricing";
import { Footer } from "../landingPage/Footer";
 
export default function MainPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden w-full max-w-100vw">
      <Navigation />
      <Hero />
      <Features />
      <DashboardPreview />
      <HowItWorks />
      <Integrations />
      {/* <Security /> */}
      <Pricing />
      <Footer />
    </div>
  );
}
