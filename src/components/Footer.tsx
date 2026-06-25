import Link from "next/link";
import { Briefcase, MessageCircle, Globe } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4 group">
            <div className="bg-brand text-white p-1 rounded-lg">
              <Logo size={20} />
            </div>
            <span className="font-bold text-xl text-white">LinkRent</span>
          </Link>
          <p className="text-sm text-slate-400 mb-6">
            The premier marketplace for renting established LinkedIn accounts. Boost your outreach immediately.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors"><MessageCircle size={20} /></a>
            <a href="#" className="hover:text-white transition-colors"><Globe size={20} /></a>
            <a href="#" className="hover:text-white transition-colors"><Briefcase size={20} /></a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4">Platform</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/how-it-works" className="hover:text-brand transition-colors">How It Works</Link></li>
            <li><Link href="/list-account" className="hover:text-brand transition-colors">List Your Account</Link></li>
            <li><Link href="/earnings" className="hover:text-brand transition-colors">Earnings & Payouts</Link></li>
            <li><Link href="/faq" className="hover:text-brand transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/about" className="hover:text-brand transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-brand transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4">Legal</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/terms" className="hover:text-brand transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-brand transition-colors">Privacy Policy</Link></li>
            <li><Link href="/guidelines" className="hover:text-brand transition-colors">Community Guidelines</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between">
        <p>&copy; {new Date().getFullYear()} LinkRent Inc. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Not affiliated with LinkedIn Corporation.</p>
      </div>
    </footer>
  );
}
