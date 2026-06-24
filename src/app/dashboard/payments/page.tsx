import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DollarSign, Calendar, FileText, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import UserPaymentsTableClient from "@/components/UserPaymentsTableClient";

export const dynamic = "force-dynamic";

export default async function PaymentHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const payments = await prisma.paymentRecord.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { paymentDate: "desc" },
  });

  const paidBalance = payments
    .filter(p => p.status === "COMPLETED")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingBalance = payments
    .filter(p => p.status === "PENDING" || p.status === "VERIFIED")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment History</h1>
              <p className="text-slate-600">Track your earnings and verified payouts.</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm min-w-[150px]">
                <p className="text-sm font-medium text-amber-600 mb-1">Pending / Processing</p>
                <p className="text-3xl font-bold text-amber-500">₹{pendingBalance.toFixed(2)}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-w-[150px]">
                <p className="text-sm font-medium text-slate-500 mb-1">Total Paid</p>
                <p className="text-3xl font-bold text-emerald-600">₹{paidBalance.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {payments.length === 0 ? (
              <div className="text-center py-24 px-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <DollarSign size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No payments yet</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Once your account is rented and payments are processed, they will appear here. Ensure your payout details are set in Settings.
                </p>
              </div>
            ) : (
              <UserPaymentsTableClient initialPayments={payments as any} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
