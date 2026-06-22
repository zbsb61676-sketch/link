import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, TrendingUp, Users } from "lucide-react";

export const metadata = {
  title: 'About Us | LinkRent',
  description: 'Learn about LinkRent and our mission to provide high-quality B2B outreach infrastructure.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="flex-1 pb-20">
        <div className="bg-brand py-20 text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About LinkRent</h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto">
            Connecting professionals with unused digital real estate to businesses that need it.
          </p>
        </div>

        <div className="container mx-auto px-4 max-w-4xl mt-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              At LinkRent, we believe that your established professional network holds immense value. Our mission is to provide a secure, transparent platform where individuals can monetize their unused LinkedIn accounts, while giving B2B companies the reliable infrastructure they need for successful outreach campaigns.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We bridge the gap between supply and demand in the B2B lead generation space, ensuring that both Account Providers and businesses benefit in a safe, controlled environment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
              <div className="w-16 h-16 bg-blue-50 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Secure & Safe</h3>
              <p className="text-sm text-slate-600">We prioritize the safety of your account with strict usage guidelines and secure credential handling.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={32} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Passive Income</h3>
              <p className="text-sm text-slate-600">We turn your dormant digital assets into a reliable weekly revenue stream with zero effort on your part.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Trusted Network</h3>
              <p className="text-sm text-slate-600">We only partner with vetted B2B agencies that adhere to strict anti-spam policies.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
