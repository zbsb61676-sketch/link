import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, ShieldAlert, Lock, Banknote, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium mb-4">
              <HelpCircle size={16} /> Trust & Transparency
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">How Our Process Works</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We've designed our system from the ground up to protect your account and guarantee your monthly earnings.
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-2xl font-black">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Submit Your Account</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Fill out our brief listing form with your account details (connection count, account age, etc.). This helps us determine the appropriate monthly rate for your specific profile.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-start gap-3">
                  <ShieldAlert className="text-amber-500 mt-0.5 flex-shrink-0" size={20} />
                  <p className="text-sm text-slate-700"><strong>Security Note:</strong> We initially ask for your LinkedIn URL to verify the account exists. We do not ask for your password on this public form.</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 text-2xl font-black">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Verification & Intake</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Our team reviews your submission within 24 hours. If approved, we will reach out to you via WhatsApp to guide you through the secure login process.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={18} /> Identity Verification</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={18} /> Session Cookie Extraction (Password-less)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={18} /> Proxy Assignment</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-2xl font-black">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Earn Monthly Income</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Once the account is connected to our secure cloud network, your job is done. We handle all the B2B outreach on behalf of our corporate clients.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <Banknote className="text-green-600" size={24} />
                    <span className="font-semibold text-slate-800">Monthly Payouts</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <Lock className="text-slate-600" size={24} />
                    <span className="font-semibold text-slate-800">Complete Ownership</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/list-account" className="inline-flex px-8 py-4 bg-brand text-white text-lg font-medium rounded-full hover:bg-brand-hover transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 items-center gap-2">
              Ready to get started? List your account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
