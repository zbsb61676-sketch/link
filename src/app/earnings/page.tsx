import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DollarSign, Calendar, ShieldAlert } from "lucide-react";

export const metadata = {
  title: 'Earnings & Payouts | LinkRent',
  description: 'Learn how much you can earn and how our weekly payout system works.',
};

export default function EarningsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="flex-1 pb-20">
        <div className="bg-brand py-20 text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Earnings & Payouts</h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto">
            Transparent pricing. Weekly payouts. Zero hassle.
          </p>
        </div>

        <div className="container mx-auto px-4 max-w-4xl mt-12">
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-6">
                <DollarSign size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Up to $100 / Week</h2>
              <p className="text-slate-600">
                Depending on the age, connection count, and geographical location of your LinkedIn account, you can earn up to $100 every single week just for keeping it connected.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-blue-50 text-brand rounded-lg flex items-center justify-center mb-6">
                <Calendar size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Weekly Payouts</h2>
              <p className="text-slate-600">
                We process your first payment 24 hours after your rental begins, and subsequent payments every 7 days. You can request payouts directly from your dashboard.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 mb-12">
            <h3 className="text-xl font-bold text-slate-900 mb-4">How is my account valued?</h3>
            <ul className="space-y-4 text-slate-600">
              <li className="flex gap-3">
                <span className="font-bold text-brand">•</span>
                <span><strong>Account Age:</strong> Older accounts are less likely to trigger security algorithms, making them more valuable.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-brand">•</span>
                <span><strong>Connection Count:</strong> Accounts with 500+ connections show high legitimacy.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-brand">•</span>
                <span><strong>Location:</strong> Accounts based in North America and Western Europe currently command the highest premiums.</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
            <ShieldAlert className="text-amber-600 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-amber-900 mb-1">Important Note on Downtime</h4>
              <p className="text-amber-800 text-sm">
                If your account gets temporarily disconnected or requires 2FA verification, payouts are paused until access is restored. Keep an eye on your dashboard messages to ensure maximum uptime!
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
