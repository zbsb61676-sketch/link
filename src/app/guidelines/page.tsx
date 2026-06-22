import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: 'Community Guidelines | LinkRent',
  description: 'Usage guidelines for the LinkRent platform.',
};

export default function GuidelinesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="flex-1 pb-20">
        <div className="bg-slate-900 py-16 text-white text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Community Guidelines</h1>
          <p className="text-slate-400">Strict rules for a safe ecosystem.</p>
        </div>

        <div className="container mx-auto px-4 max-w-3xl mt-12 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
          <div className="max-w-none text-slate-600 space-y-4">
            <p className="text-lg text-slate-700 font-medium mb-6">
              At LinkRent, we enforce strict guidelines to ensure that Account Providers' digital reputations are protected, and that B2B Clients receive high-quality outreach results.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">For B2B Clients (Renters)</h2>
            <ul className="list-disc pl-6 space-y-2 mb-8">
              <li><strong className="text-slate-800">No Spam:</strong> Outreach must be highly targeted, professional, and relevant to the recipient.</li>
              <li><strong className="text-slate-800">No Illegal Content:</strong> The promotion of illegal goods, services, or adult content is strictly prohibited.</li>
              <li><strong className="text-slate-800">Respect the Profile:</strong> You may not alter the primary job history, name, or profile picture of the rented account without explicit permission.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">For Account Providers</h2>
            <ul className="list-disc pl-6 space-y-2 mb-8">
              <li><strong className="text-slate-800">Maintain Uptime:</strong> Please respond promptly to 2FA requests or security checks via the LinkRent dashboard.</li>
              <li><strong className="text-slate-800">Do Not Interfere:</strong> Avoid sending mass connection requests or engaging in aggressive manual outreach while the account is rented.</li>
              <li><strong className="text-slate-800">Honesty:</strong> Provide accurate information regarding the age and history of your account during the listing process.</li>
            </ul>

            <div className="bg-red-50 text-red-800 p-4 rounded-lg mt-8">
              <strong>Zero Tolerance Policy:</strong> Violation of these guidelines will result in immediate termination of the rental agreement, forfeiture of pending payouts, and a permanent ban from the LinkRent platform.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
