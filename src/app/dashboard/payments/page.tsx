import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DollarSign, Calendar, FileText, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";

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

  const totalEarned = payments.reduce((sum, payment) => sum + payment.amount, 0);

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
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-w-[200px]">
              <p className="text-sm font-medium text-slate-500 mb-1">Total Earned</p>
              <p className="text-3xl font-bold text-emerald-600">${totalEarned.toFixed(2)}</p>
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
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                      <th className="p-4">Date</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Reference Note</th>
                      <th className="p-4 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-slate-900 font-medium">
                            <Calendar size={16} className="text-slate-400" />
                            {new Date(payment.paymentDate).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-slate-900">${payment.amount.toFixed(2)}</span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                            PAID
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 text-sm">
                          {payment.reference ? (
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-slate-400" />
                              {payment.reference}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No reference</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-brand hover:text-brand-hover p-2 rounded-lg hover:bg-brand/10 transition-colors inline-flex" title="Download Receipt">
                            <Download size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
