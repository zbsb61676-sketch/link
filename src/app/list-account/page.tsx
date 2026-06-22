"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, ShieldCheck, DollarSign } from "lucide-react";

export default function ListAccountPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    connections: "",
    accountAge: "",
    location: "",
    price: "",

    linkedinUrl: "",
    whatsappNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create listing");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">List Your LinkedIn Account</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Earn passive income by securely renting your established LinkedIn account to verified B2B professionals. You remain in complete control.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Account Details</h2>
                
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">


                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Number of Connections</label>
                      <input 
                        type="number" 
                        required
                        placeholder="e.g. 5000" 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-slate-900 bg-white" 
                        value={formData.connections}
                        onChange={(e) => setFormData({ ...formData, connections: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Account Age</label>
                      <select 
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none bg-white text-slate-900"
                        value={formData.accountAge}
                        onChange={(e) => setFormData({ ...formData, accountAge: e.target.value })}
                      >
                        <option value="">Select Age...</option>
                        <option value="Less than 1 year">Less than 1 year</option>
                        <option value="1-3 years">1-3 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5+ years">5+ years</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. New York, NY" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-slate-900 bg-white" 
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>



                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">WhatsApp Number</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+1 234 567 8900" 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-slate-900 bg-white" 
                        value={formData.whatsappNumber}
                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn Profile URL</label>
                      <input 
                        type="url" 
                        required
                        placeholder="https://linkedin.com/in/username" 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-slate-900 bg-white" 
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      />
                    </div>
                  </div>

                  <hr className="border-slate-200" />

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Rental Price ($)</label>
                    <div className="relative max-w-xs">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="number" 
                        required
                        placeholder="300" 
                        className="w-full pl-10 pr-4 py-3 text-lg font-medium border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-slate-900 bg-white" 
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                    <p className="text-sm text-slate-500 mt-2">We recommend $200-$500 for accounts with 5k+ connections.</p>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-hover transition-colors shadow-md disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Listing for Review"}
                  </button>
                  <p className="text-xs text-center text-slate-500 mt-4">
                    By submitting, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-green-400" /> Secure Process
                </h3>
                <ul className="space-y-4 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-brand shrink-0 mt-0.5" size={16} />
                    <span>Your password is never shared directly with renters.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-brand shrink-0 mt-0.5" size={16} />
                    <span>We use secure session tokens via our proprietary proxy network.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-brand shrink-0 mt-0.5" size={16} />
                    <span>You have the right to revoke access at any time.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">How much can I earn?</h3>
                <p className="text-sm text-slate-600 mb-4">Earnings depend on your industry, location, and connection count.</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Sales / IT (10k+ conn)</span>
                    <span className="font-semibold text-slate-900">~$500/mo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Marketing (5k+ conn)</span>
                    <span className="font-semibold text-slate-900">~$350/mo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Other (1k+ conn)</span>
                    <span className="font-semibold text-slate-900">~$150/mo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
