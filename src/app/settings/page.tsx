"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreditCard, Landmark, Save, Loader2, AlertCircle, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";

const settingsSchema = z.object({
  paypalEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  bankDetails: z.string().optional(),
  upiId: z.string().optional(),
}).refine(data => data.paypalEmail || data.bankDetails || data.upiId, {
  message: "Please provide either a PayPal Email, Bank Details, or UPI ID",
  path: ["paypalEmail"]
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      paypalEmail: "",
      bankDetails: "",
      upiId: "",
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user) {
      // If we fetch existing settings via API, we would setValue here
      const fetchSettings = async () => {
        try {
          const res = await fetch("/api/user/settings/get");
          if (res.ok) {
            const data = await res.json();
            setValue("paypalEmail", data.paypalEmail || "");
            setValue("bankDetails", data.bankDetails || "");
            setValue("upiId", data.upiId || "");
          }
        } catch(e) {
          console.error("Could not load existing settings");
        }
      }
      fetchSettings();
    }
  }, [status, session, router, setValue]);

  const onSubmit = async (data: SettingsFormValues) => {
    setLoading(true);
    const toastId = toast.loading("Saving settings...");
    
    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Payout settings updated successfully.", { id: toastId });
      } else {
        toast.error("Failed to update settings", { id: toastId });
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { id: toastId });
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

          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">

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
                    className={`w-full px-4 py-2 border ${errors.paypalEmail ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-brand'} rounded-lg focus:ring-2 outline-none text-slate-900 bg-white`} 
                    {...register("paypalEmail")}
                  />
                  {errors.paypalEmail && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14}/>{errors.paypalEmail.message}</p>}
                  {!errors.paypalEmail && <p className="text-xs text-slate-500 mt-1">We will send your monthly payments to this address.</p>}
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
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand outline-none text-slate-900 bg-white h-24 resize-none" 
                    {...register("bankDetails")}
                  />
                  <p className="text-xs text-slate-500 mt-1">Provide necessary banking details securely.</p>
                </div>

                <div className="relative py-4 flex items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">OR</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <CreditCard size={16} /> UPI ID (India Only)
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. username@okicici" 
                    className={`w-full px-4 py-2 border ${errors.upiId ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-brand'} rounded-lg focus:ring-2 outline-none text-slate-900 bg-white`} 
                    {...register("upiId")}
                  />
                  {errors.upiId && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14}/>{errors.upiId.message}</p>}
                  <p className="text-xs text-slate-500 mt-1">Directly receive payments to your UPI account.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="text-green-500" size={20} /> Account Security & Handover
              </h2>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <p className="text-sm text-slate-700">
                  To securely rent your account to our vetted B2B agency, you will need to provide your LinkedIn login credentials. Please follow these strict security guidelines:
                </p>
                
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                  <li><strong className="text-slate-800">Change Your Password First:</strong> Before handing over your account, change your LinkedIn password to a temporary, unique password (e.g., <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">LinkRentTemp2024!</code>). <strong>Never</strong> share a password that you use for your personal banking or email.</li>
                  <li><strong className="text-slate-800">Enable 2FA (Two-Factor Authentication):</strong> Keep 2FA enabled on your LinkedIn account. When our agency logs in for the first time, we will contact you via WhatsApp to get the 2FA code.</li>
                  <li><strong className="text-slate-800">Secure Communication:</strong> Only share your temporary password with our official support team via the encrypted Messages portal on this dashboard. Do not send it over unencrypted email or text message.</li>
                  <li><strong className="text-slate-800">You Are In Control:</strong> You can terminate the rental agreement at any time simply by changing your LinkedIn password. This immediately revokes our agency's access.</li>
                </ul>
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
