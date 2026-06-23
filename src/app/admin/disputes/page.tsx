import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDisputesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  const disputes = await prisma.dispute.findMany({
    include: {
      reporter: true,
      rental: {
        include: {
          listing: {
            include: {
              owner: true,
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dispute Resolution</h1>
          <p className="text-slate-600">Review and resolve reported issues with rented accounts.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {disputes.length === 0 ? (
            <div className="text-center py-24">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Disputes</h3>
              <p className="text-slate-500">All rentals are running smoothly.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                    <th className="p-4">Date Reported</th>
                    <th className="p-4">Reporter (Renter)</th>
                    <th className="p-4">Account Owner</th>
                    <th className="p-4">Reason</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {disputes.map((dispute) => (
                    <tr key={dispute.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-slate-600 text-sm">
                        {new Date(dispute.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{dispute.reporter.name}</div>
                        <div className="text-xs text-slate-500">{dispute.reporter.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{dispute.rental.listing.owner.name}</div>
                        <div className="text-xs text-slate-500">{dispute.rental.listing.owner.email}</div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-slate-700 max-w-xs line-clamp-2" title={dispute.reason}>
                          {dispute.reason}
                        </p>
                      </td>
                      <td className="p-4">
                        {dispute.status === "OPEN" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                            <AlertTriangle size={12} /> OPEN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                            RESOLVED
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm transition-colors">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
