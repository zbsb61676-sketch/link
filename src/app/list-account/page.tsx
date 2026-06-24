"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, ShieldCheck, IndianRupee, AlertCircle, Copy } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";

const listingSchema = z.object({
  connections: z.string().min(1, "Connections are required").regex(/^\d+$/, "Must be a number"),
  accountAge: z.string().min(1, "Please select an account age").refine(val => val !== "Less than 1 year", "Account must be at least 1 year old to list"),
  location: z.string().min(2, "Location is required"),
  whatsappNumber: z.string().min(5, "Valid WhatsApp number is required"),
  linkedinUrl: z.string().url("Must be a valid LinkedIn URL"),
  price: z.string().min(1, "Price is required").regex(/^\d+(\.\d{1,2})?$/, "Must be a valid price"),
});

type ListingFormValues = z.infer<typeof listingSchema>;

export default function ListAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showTerms, setShowTerms] = useState(true);

  useEffect(() => {
    setVerificationCode(`Verify-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      connections: "",
      accountAge: "",
      location: "",
      whatsappNumber: "",
      linkedinUrl: "",
      price: "",
    },
  });

  const connections = watch("connections");

  useEffect(() => {
    const connCount = parseInt(connections) || 0;
    if (connCount >= 1000) {
      setValue("price", "900");
    } else if (connCount >= 500) {
      setValue("price", "400");
    } else if (connCount >= 100) {
      setValue("price", "200");
    } else {
      setValue("price", ""); // Or leave it blank if they don't qualify
    }
  }, [connections, setValue]);

  const onSubmit = async (data: ListingFormValues) => {
    setLoading(true);
    const loadingToast = toast.loading("Submitting your listing...");

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, verificationCode }),
      });

      if (res.ok) {
        toast.success("Listing created successfully!", { id: loadingToast });
        router.push("/dashboard");
        router.refresh();
      } else {
        const resData = await res.json();
        toast.error(resData.error || "Failed to create listing", { id: loadingToast });
      }
    } catch (err) {
      toast.error("An unexpected error occurred", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative border-t-4 border-amber-500">
            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <AlertCircle size={28} />
              <h2 className="text-2xl font-bold text-slate-900">Important Notice</h2>
            </div>
            <div className="space-y-4 text-slate-600 mb-8">
              <p>Welcome to LinkRent! Before you proceed, please read our strict guidelines:</p>
              <ul className="list-disc pl-5 space-y-3 font-medium text-slate-700 bg-amber-50 p-4 rounded-xl border border-amber-100">
                <li><strong className="text-amber-900">No Bargaining:</strong> Our weekly payout rates are strictly fixed based on our network tier system. <span className="underline">We do not negotiate.</span> This is a business, not a flea market.</li>
                <li><strong className="text-amber-900">Compliance:</strong> You must read and agree to all terms and conditions of renting your account.</li>
                <li><strong className="text-amber-900">Honesty:</strong> Providing false information about your connection count or account age will result in an immediate permanent ban.</li>
              </ul>
            </div>
            <button 
              onClick={() => setShowTerms(false)}
              className="w-full py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}

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
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Number of Connections</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 5000" 
                        className={`w-full px-4 py-2 border ${errors.connections ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-brand'} rounded-lg focus:ring-2 outline-none text-slate-900 bg-white`} 
                        {...register("connections")}
                      />
                      {errors.connections && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14}/> {errors.connections.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Account Age</label>
                      <select 
                        className={`w-full px-4 py-2 border ${errors.accountAge ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-brand'} rounded-lg focus:ring-2 outline-none bg-white text-slate-900`}
                        {...register("accountAge")}
                      >
                        <option value="">Select Age...</option>
                        <option value="Less than 1 year">Less than 1 year</option>
                        <option value="1-3 years">1-3 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5+ years">5+ years</option>
                      </select>
                      {errors.accountAge && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14}/> {errors.accountAge.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. New York, NY" 
                      className={`w-full px-4 py-2 border ${errors.location ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-brand'} rounded-lg focus:ring-2 outline-none text-slate-900 bg-white`} 
                      {...register("location")}
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14}/> {errors.location.message}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">WhatsApp Number</label>
                      <input 
                        type="tel" 
                        placeholder="+1 234 567 8900" 
                        className={`w-full px-4 py-2 border ${errors.whatsappNumber ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-brand'} rounded-lg focus:ring-2 outline-none text-slate-900 bg-white`} 
                        {...register("whatsappNumber")}
                      />
                      {errors.whatsappNumber && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14}/> {errors.whatsappNumber.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn Profile URL</label>
                      <input 
                        type="url" 
                        placeholder="https://linkedin.com/in/username" 
                        className={`w-full px-4 py-2 border ${errors.linkedinUrl ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-brand'} rounded-lg focus:ring-2 outline-none text-slate-900 bg-white`} 
                        {...register("linkedinUrl")}
                      />
                      {errors.linkedinUrl && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14}/> {errors.linkedinUrl.message}</p>
                      )}
                    </div>
                  </div>

                  <hr className="border-slate-200" />

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Weekly Rental Price (₹)</label>
                    <div className="relative max-w-xs">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="number" 
                        placeholder="Automatically calculated" 
                        className={`w-full pl-10 pr-4 py-3 text-lg font-medium border ${errors.price ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-brand'} rounded-lg focus:ring-2 outline-none text-slate-700 bg-slate-100 cursor-not-allowed`} 
                        {...register("price")}
                        readOnly
                      />
                    </div>
                    {errors.price ? (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14}/> {errors.price.message}</p>
                    ) : (
                      <p className="text-sm text-slate-500 mt-2">Price is automatically calculated based on your connection count.</p>
                    )}
                  </div>

                  {verificationCode && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
                      <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <ShieldCheck className="text-blue-600" size={20} />
                        Verify Account Ownership
                      </h3>
                      <p className="text-blue-800 text-sm mb-4">
                        To prove you own this LinkedIn profile, please copy the unique code below and paste it anywhere in your LinkedIn profile's <strong>"About"</strong> section. Our team will verify it during the approval process.
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <div className="bg-white border border-blue-300 px-4 py-3 rounded-lg flex-1 text-center font-mono font-bold text-lg text-slate-900 tracking-wider">
                          {verificationCode}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(verificationCode);
                            toast.success("Code copied to clipboard!");
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors flex items-center justify-center"
                          title="Copy Code"
                        >
                          <Copy size={20} />
                        </button>
                      </div>
                    </div>
                  )}

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
                    <span className="text-slate-500">Tier 3 (1,000+ conn)</span>
                    <span className="font-semibold text-slate-900">~₹900/wk</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tier 2 (500-999 conn)</span>
                    <span className="font-semibold text-slate-900">~₹400/wk</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tier 1 (100-499 conn)</span>
                    <span className="font-semibold text-slate-900">~₹200/wk</span>
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
