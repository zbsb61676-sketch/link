import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: 'FAQ | LinkRent',
  description: 'Frequently asked questions about renting your LinkedIn account.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: "Is it safe to rent my LinkedIn account?",
      a: "Yes. We use advanced proxy networks and anti-detect browsers to ensure your account looks like it's being accessed normally. We strictly prohibit spam, illegal content, or anything that violates our community guidelines."
    },
    {
      q: "Will my connections see spam messages?",
      a: "No. Our clients use your account to send highly targeted, professional B2B outreach messages to new prospects. They do not mass-message your existing personal connections."
    },
    {
      q: "Can I still use my account while it's rented?",
      a: "Yes, you can still use your account! However, we ask that you do not send bulk connection requests or drastically change your profile information while it is actively rented, as this can trigger security checks."
    },
    {
      q: "How and when do I get paid?",
      a: "Payments are issued weekly every Friday. You can choose to be paid via PayPal, Crypto, or direct bank transfer depending on your region. You can track all payments in your dashboard."
    },
    {
      q: "What happens if LinkedIn asks for a verification code?",
      a: "If LinkedIn requests a 2FA (Two-Factor Authentication) code, we will send you a message via the LinkRent Dashboard. You simply reply with the code, and your account resumes earning money. Quick responses ensure you don't miss out on weekly payouts."
    },
    {
      q: "Can I cancel at any time?",
      a: "Absolutely. You retain full ownership of your account and can revoke our access at any time by simply changing your LinkedIn password and notifying us to end the rental agreement."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="flex-1 pb-20">
        <div className="bg-brand py-20 text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto">
            Everything you need to know about the platform.
          </p>
        </div>

        <div className="container mx-auto px-4 max-w-3xl mt-12">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-3">{faq.q}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
