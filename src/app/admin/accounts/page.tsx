import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, MapPin, Users, ShieldCheck, Mail, Key } from "lucide-react";
import { prisma } from "@/lib/prisma";

import AdminAccountsTableClient from "@/components/AdminAccountsTableClient";

export const dynamic = 'force-dynamic';

export default async function AdminAccountsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  const listings = await prisma.accountListing.findMany({
    include: { owner: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Control Panel</h1>
            <p className="text-slate-600">Review and rent submitted LinkedIn accounts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Submitted</p>
                <p className="text-3xl font-bold text-slate-900">{listings.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Active Rentals</p>
                <p className="text-3xl font-bold text-slate-900">{listings.filter((l: any) => l.status === 'RENTED').length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <Briefcase className="text-green-600" size={24} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-slate-900">{listings.filter((l: any) => l.status === 'AVAILABLE').length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                <ShieldCheck className="text-amber-600" size={24} />
              </div>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-200">
               <h3 className="text-xl font-bold text-slate-900 mb-2">No accounts submitted</h3>
               <p className="text-slate-500">Wait for users to submit accounts.</p>
             </div>
          ) : (
            <AdminAccountsTableClient listings={listings} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
