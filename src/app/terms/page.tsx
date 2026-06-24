import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: 'Terms of Service | LinkRent',
  description: 'Terms of Service and User Agreement.',
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="flex-1 pb-20">
        <div className="bg-slate-900 py-16 text-white text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-slate-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="container mx-auto px-4 max-w-4xl mt-12 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
          <div className="max-w-none text-slate-600 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">1. Acceptance of Terms</h2>
            <p>By accessing, registering for, or using the LinkRent platform (the "Service"), you agree to be bound by these Terms of Service (the "Terms"). If you do not agree to all of the terms and conditions contained herein, do not use or access the Service. LinkRent ("Company", "we", "us", or "our") reserves the right to update or modify these Terms at any time without prior notice.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">2. Description of Service</h2>
            <p>LinkRent operates a digital marketplace that facilitates the rental of professional networking accounts (specifically LinkedIn) from Account Providers to vetted B2B Clients ("Renters") for the sole purpose of conducting professional, targeted B2B outreach and lead generation. We act purely as a platform connecting the two parties and managing the technical infrastructure.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">3. Account Provider Obligations & Representations</h2>
            <p>If you are an Account Provider listing your account for rent, you represent, warrant, and agree to the following:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are the sole and lawful owner of the LinkedIn account provided.</li>
              <li>You have not sold, transferred, or assigned the rights to the account to any third party.</li>
              <li>You will not drastically alter your profile information (including your name, primary photo, and employment history) while the account is actively rented.</li>
              <li>You will promptly respond to Two-Factor Authentication (2FA) requests and security checks communicated through the LinkRent dashboard to maintain account uptime.</li>
              <li>You will not manually send mass connection requests, aggressive outreach, or engage in behavior that could trigger spam filters while the account is under our management.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">4. B2B Client (Renter) Obligations</h2>
            <p>If you are a B2B Client renting an account, you represent, warrant, and agree to the following:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You will only use the account for professional, targeted B2B outreach.</li>
              <li>You will strictly refrain from sending spam, unsolicited commercial email in violation of the CAN-SPAM Act or GDPR, or any illegal, explicit, or defamatory content.</li>
              <li>You will not attempt to alter the Account Provider's password, recovery email, or primary profile data.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">5. Compensation and Payments</h2>
            <p>Account Providers are compensated on a rolling schedule, subject to account uptime and health. The first payment is processed 24 hours after a rental begins, with subsequent payments processed every 7 days. LinkRent reserves the right to withhold, pause, or cancel payments if:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The account is restricted or banned due to the Account Provider's manual actions outside of our system.</li>
              <li>The Account Provider fails to provide 2FA codes, resulting in significant downtime (exceeding 48 hours).</li>
              <li>Fraudulent activity or misrepresentation of the account's history is detected.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">6. Intellectual Property & Platform Rights</h2>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of LinkRent and its licensors. You agree not to copy, modify, create derivative works of, publicly display, or scrape any part of our website or proprietary software.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">7. Limitation of Liability</h2>
            <p>IN NO EVENT SHALL LINKRENT, ITS DIRECTORS, EMPLOYEES, PARTNERS, OR AGENTS, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (II) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; (III) ANY UNAUTHORIZED ACCESS, USE OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT; OR (IV) THE SUSPENSION, BAN, OR DELETION OF YOUR LINKEDIN ACCOUNT BY THE HOST PLATFORM, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE) OR ANY OTHER LEGAL THEORY.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">8. Disclaimer of Warranties</h2>
            <p>Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. LinkRent expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that your third-party networking account will not be restricted by its parent company as a result of using our Service.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">9. Governing Law and Dispute Resolution</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of the applicable jurisdiction, without regard to its conflict of law provisions. Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration, rather than in court.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">10. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at legal@linkrent.com.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
