import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: 'Contact Us | LinkRent',
  description: 'Get in touch with the LinkRent support team.',
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="flex-1 pb-20">
        <div className="bg-brand py-20 text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto">
            We're here to help you get the most out of LinkRent.
          </p>
        </div>

        <div className="container mx-auto px-4 max-w-4xl mt-12">
          <div className="grid md:grid-cols-2 gap-8">
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 text-brand rounded-full flex items-center justify-center mb-6">
                <MessageCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Live Support Chat</h2>
              <p className="text-slate-600 mb-6 flex-1">
                For existing account providers, the fastest way to get help is through your secure dashboard chat.
              </p>
              <Link href="/dashboard/messages" className="px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-brand-hover transition-colors w-full">
                Open Dashboard Chat
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-6">
                <Mail size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Us</h2>
              <p className="text-slate-600 mb-6 flex-1">
                Have a general inquiry or want to partner with us? Drop us an email and we'll get back to you within 24 hours.
              </p>
              <a href="mailto:support@linkrent.com" className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-medium hover:border-slate-300 hover:bg-slate-50 transition-colors w-full">
                support@linkrent.com
              </a>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
