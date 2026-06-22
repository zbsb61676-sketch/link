"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { CreditCard, Landmark, Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    paypalEmail: "",
    bankDetails: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user) {
      // Initialize form with existing data if available
      // Note: We might want to fetch this from an API endpoint to ensure freshness
      // For now, we'll assume it's part of the session or start empty
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    
    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccessMessage("Payout settings updated successfully.");
      } else {
        alert("Failed to update settings");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Settings</h1>
            <p className="text-slate-600">Update your payout details to receive payments.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
            {successMessage && (
              <div className="p-4 bg-green-50 text-green-700 border border-green-100 rounded-lg text-sm font-medium">
                {successMessage}
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-brand" /> Payout Methods
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">PayPal Email Address</label>
                  <input 
                    type="email" 
                    placeholder="your@paypal.com" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-slate-900 bg-white" 
                    value={formData.paypalEmail}
                    onChange={(e) => setFormData({ ...formData, paypalEmail: e.target.value })}
                  />
                  <p className="text-xs text-slate-500 mt-1">We will send your monthly payments to this address.</p>
                </div>

                <div className="relative py-4 flex items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">OR</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Landmark size={16} /> Direct Bank Transfer (US/UK/EU Only)
                  </label>
                  <textarea 
                    placeholder="Account Name:&#10;Account Number:&#10;Routing/Sort Code:" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-slate-900 bg-white h-24 resize-none" 
                    value={formData.bankDetails}
                    onChange={(e) => setFormData({ ...formData, bankDetails: e.target.value })}
                  />
                  <p className="text-xs text-slate-500 mt-1">Provide necessary banking details securely.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-hover transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
