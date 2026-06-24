import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EarningsCalculator from "@/components/EarningsCalculator";
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, Lock, DollarSign } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-50 pt-24 pb-32">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-50 -z-10" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-blue-100/40 to-transparent -z-10" />
          
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 text-blue-700 text-sm font-medium mb-6 animate-slide-up" style={{ animationDelay: '0ms' }}>
              <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
              Secure, managed LinkedIn account leasing
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 max-w-4xl mx-auto leading-tight animate-slide-up" style={{ animationDelay: '100ms' }}>
              Turn your LinkedIn into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-blue-500">Passive Income</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
              Rent your established LinkedIn account to our vetted B2B agency. Earn consistent monthly payments securely with zero daily effort.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Link href="/list-account" className="px-8 py-4 bg-brand text-white text-lg font-medium rounded-full hover:bg-brand-hover transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2">
                Start Earning Now <ArrowRight size={20} />
              </Link>
              <Link href="/how-it-works" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 text-lg font-medium rounded-full hover:bg-slate-50 transition-all shadow-sm hover:shadow-md flex items-center gap-2">
                How It Works
              </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-slate-500 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={18} /> Guaranteed Payouts</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={18} /> Bank-Level Security</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={18} /> Cancel Anytime</div>
            </div>
          </div>
        </section>

        {/* Earnings Calculator Section */}
        <EarningsCalculator />

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why Rent To Us?</h2>
              <p className="text-lg text-slate-600">We take the risk and stress out of account renting. We don't act as a middleman; we are the sole renters, guaranteeing your security and payment.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <ShieldCheck className="text-green-500" size={32} />,
                  title: "100% Secure Process",
                  desc: "We use a proprietary secure proxy network to handle login sessions, meaning we don't need direct access to your password after initial setup."
                },
                {
                  icon: <DollarSign className="text-amber-500" size={32} />,
                  title: "Guaranteed Payments",
                  desc: "Since we are the renters, you don't have to wait for a buyer. Once your account is approved, your monthly payouts begin immediately."
                },
                {
                  icon: <Lock className="text-blue-500" size={32} />,
                  title: "Strict Usage Limits",
                  desc: "We use your account strictly for professional B2B networking. No spam, no scams, and we strictly adhere to daily connection limits to keep your account safe."
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats/Social Proof Section */}
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Stop leaving money on the table.</h2>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  Your aged, highly-connected LinkedIn account is a valuable asset. Let us put it to work for you while you retain complete ownership.
                </p>
                <ul className="space-y-4 mb-8">
                  {['Earn $200 - $500+ per month', 'We handle all the outreach', 'You can revoke access at any time'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-200">
                      <CheckCircle2 className="text-brand" size={20} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/list-account" className="inline-flex px-6 py-3 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-colors items-center gap-2">
                  Submit Your Account <TrendingUp size={18} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Active Partners", value: "2,500+" },
                  { label: "Total Paid Out", value: "$450k+" },
                  { label: "Avg. Monthly Earn", value: "$350" },
                  { label: "Account Safety", value: "99.8%" },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 text-center">
                    <div className="text-3xl font-extrabold text-white mb-2">{stat.value}</div>
                    <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
