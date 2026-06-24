import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, MapPin, Users, Star, ShieldCheck, Edit2 } from "lucide-react";
import { prisma } from "@/lib/prisma";

import ListingCardActions from "@/components/ListingCardActions";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const listings = await prisma.accountListing.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Accounts</h1>
            <p className="text-slate-600">Manage the LinkedIn accounts you have listed for rent.</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-1">Weekly Payout Rates</h2>
              <p className="text-sm text-blue-800">Your accounts are automatically categorized based on their network size.</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm flex-1 text-center">
                <div className="text-xs font-semibold text-slate-500 uppercase">100+ Connections</div>
                <div className="text-xl font-extrabold text-slate-900">₹400<span className="text-sm text-slate-500 font-normal">/wk</span></div>
              </div>
              <div className="bg-brand rounded-lg p-3 shadow-md flex-1 text-center text-white">
                <div className="text-xs font-semibold text-blue-100 uppercase">1,000+ Connections</div>
                <div className="text-xl font-extrabold text-white">₹900<span className="text-sm text-blue-200 font-normal">/wk</span></div>
              </div>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-200">
              <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No accounts listed yet</h3>
              <p className="text-slate-500 mb-6">List your first account to start earning passive income.</p>
              <a href="/list-account" className="inline-block px-6 py-3 bg-brand text-white font-medium rounded-lg hover:bg-brand-hover transition-colors">
                List an Account
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((account: any) => {
                return (
                  <div key={account.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow flex flex-col relative">
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${account.status === 'AVAILABLE' ? 'bg-blue-100 text-blue-700' : 
                          account.status === 'RENTED' ? 'bg-green-100 text-green-700' : 
                          'bg-slate-100 text-slate-700'}`}>
                        {account.status}
                      </span>
                    </div>

                    <div className="p-6 flex-1 mt-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">LinkedIn Account</h3>
                      
                      {account.isVerified && (
                        <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium mb-4">
                          <ShieldCheck size={16} /> Identity Verified
                        </div>
                      )}

                      <div className="space-y-2 mt-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-slate-400" />
                          <span><strong>{account.connections.toLocaleString()}</strong> Connections</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase size={16} className="text-slate-400" />
                          <span><strong>{account.accountAge}</strong> Account Age</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-slate-400" />
                          <span>{account.location}</span>
                        </div>
                      </div>


                    </div>
                    
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-xl font-bold text-slate-900">₹{account.price}</span>
                        <span className="text-slate-500 text-sm"> / week</span>
                      </div>
                      <ListingCardActions listingId={account.id} status={account.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
