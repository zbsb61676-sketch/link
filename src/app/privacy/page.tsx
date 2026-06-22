import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: 'Privacy Policy | LinkRent',
  description: 'Privacy Policy and Data Handling.',
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="flex-1 pb-20">
        <div className="bg-slate-900 py-16 text-white text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="container mx-auto px-4 max-w-4xl mt-12 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
          <div className="max-w-none text-slate-600 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">1. Introduction</h2>
            <p>At LinkRent ("we", "us", "our"), we respect your privacy and are committed to protecting it through our compliance with this policy. This Privacy Policy describes the types of information we may collect from you or that you may provide when you visit the website and use our platform, and our practices for collecting, using, maintaining, protecting, and disclosing that information.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">2. Information We Collect</h2>
            <p>We collect several types of information from and about users of our Website, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Identification Information:</strong> Name, email address, PayPal email, or bank details required for issuing payouts.</li>
              <li><strong>Account Credentials:</strong> LinkedIn username and passwords submitted through our secure listing portal.</li>
              <li><strong>Usage Data:</strong> Information on how you interact with our Website, IP addresses, browser types, and diagnostic data.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">3. How We Use Your Information</h2>
            <p>We use the information we collect about you or that you provide to us:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To present our Website and its contents to you.</li>
              <li>To securely facilitate the rental of your LinkedIn account to our vetted B2B partners.</li>
              <li>To process your weekly payouts and maintain a ledger of your transaction history.</li>
              <li>To communicate with you regarding 2FA requests, account health, or customer support queries.</li>
              <li>To detect, prevent, and address technical issues or fraudulent activity.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">4. Disclosure of Your Information</h2>
            <p>We do not sell, trade, or rent your Personal Identification Information to third parties. We may disclose aggregated information about our users without restriction. We may disclose personal information that we collect or you provide as described in this privacy policy:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To our B2B agency partners strictly for the purpose of utilizing the rented account infrastructure. Our partners never see your raw password; access is routed through our secure proxy system.</li>
              <li>To comply with any court order, law, or legal process, including responding to any government or regulatory request.</li>
              <li>To enforce or apply our Terms of Service and other agreements.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">5. Data Security</h2>
            <p>We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All credentials are encrypted both in transit and at rest using industry-standard AES-256 encryption. However, the transmission of information via the internet is not completely secure, and we cannot guarantee the absolute security of your data.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">6. Data Retention and Deletion</h2>
            <p>We retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. If you wish to terminate your account and have your data deleted, you can submit a request to our support team. Upon verification, we will purge your credentials and personally identifiable information from our active databases within 30 days.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">7. Changes to Our Privacy Policy</h2>
            <p>It is our policy to post any changes we make to our privacy policy on this page. If we make material changes to how we treat our users' personal information, we will notify you by email to the primary email address specified in your account. The date the privacy policy was last revised is identified at the top of the page.</p>
            
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">8. Contact Information</h2>
            <p>To ask questions or comment about this privacy policy and our privacy practices, contact us at: privacy@linkrent.com.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
