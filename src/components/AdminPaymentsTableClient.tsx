"use client";

import { useState } from "react";
import { CheckSquare, Square, DollarSign, Clock, ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

interface Payment {
  id: string;
  amount: number;
  paymentDate: Date;
  status: string;
  user: {
    name: string | null;
    email: string | null;
    paypalEmail: string | null;
    bankDetails: string | null;
  };
  rental: {
    lastHealthStatus: string;
    listing: {
      linkedinUrl: string | null;
    }
  } | null;
}

export default function AdminPaymentsTableClient({ initialPayments }: { initialPayments: Payment[] }) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>("REQUESTED");
  const [loading, setLoading] = useState(false);

  const filteredPayments = payments.filter(p => filter === "ALL" || p.status === filter);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredPayments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPayments.map(p => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const updateStatus = async (status: string) => {
    if (selectedIds.size === 0) return;
    
    setLoading(true);
    const loadingToast = toast.loading(`Marking ${selectedIds.size} payments as ${status}...`);
    
    try {
      const res = await fetch("/api/admin/payments/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIds: Array.from(selectedIds),
          status
        }),
      });

      if (res.ok) {
        toast.success(`Successfully updated ${selectedIds.size} payments!`, { id: loadingToast });
        setPayments(payments.map(p => 
          selectedIds.has(p.id) ? { ...p, status } : p
        ));
        setSelectedIds(new Set());
      } else {
        toast.error("Failed to update payments", { id: loadingToast });
      }
    } catch (err) {
      toast.error("An unexpected error occurred", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
          {["ALL", "PENDING", "REQUESTED", "VERIFIED", "COMPLETED"].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === status ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => updateStatus("VERIFIED")}
            disabled={selectedIds.size === 0 || loading}
            className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 disabled:opacity-50 font-medium"
          >
            <CheckCircle2 size={18} />
            Verify Selected
          </button>
          <button 
            onClick={() => updateStatus("COMPLETED")}
            disabled={selectedIds.size === 0 || loading}
            className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover disabled:opacity-50 font-medium"
          >
            <DollarSign size={18} />
            Mark as Paid
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-left">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600">
                    {selectedIds.size === filteredPayments.length && filteredPayments.length > 0 ? (
                      <CheckSquare size={20} className="text-brand" />
                    ) : (
                      <Square size={20} />
                    )}
                  </button>
                </th>
                <th className="p-4 text-left text-sm font-semibold text-slate-600">User</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-600">Payout Details</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-600">Amount</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-600">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-600">LinkedIn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No payments found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.has(payment.id) ? 'bg-blue-50/50' : ''}`}>
                    <td className="p-4">
                      <button onClick={() => toggleSelect(payment.id)} className="text-slate-400">
                        {selectedIds.has(payment.id) ? (
                          <CheckSquare size={20} className="text-brand" />
                        ) : (
                          <Square size={20} />
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{payment.user.name || "Unknown"}</div>
                      <div className="text-sm text-slate-500">{payment.user.email}</div>
                    </td>
                    <td className="p-4">
                      {payment.user.paypalEmail ? (
                        <div className="text-sm"><span className="font-semibold text-slate-700">PayPal:</span> {payment.user.paypalEmail}</div>
                      ) : (
                        <div className="text-sm truncate max-w-[200px]"><span className="font-semibold text-slate-700">Bank:</span> {payment.user.bankDetails || "Not Set"}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">₹{payment.amount.toFixed(2)}</div>
                      <div className="text-xs text-slate-500">{new Date(payment.paymentDate).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4">
                      {payment.status === "PENDING" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                          PENDING
                        </span>
                      ) : payment.status === "REQUESTED" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                          REQUESTED
                        </span>
                      ) : payment.status === "VERIFIED" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                          VERIFIED
                        </span>
                      ) : payment.status === "CANCELLED" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          CANCELLED
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          PAID
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {payment.rental?.listing?.linkedinUrl ? (
                        <div className="flex items-center gap-2">
                          <a href={payment.rental.listing.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand hover:underline text-sm font-medium">
                            Profile <ExternalLink size={14} />
                          </a>
                          {payment.rental.lastHealthStatus === "NEEDS_REVIEW" && (
                            <div className="text-red-500 bg-red-50 p-1 rounded-md" title="Health Check Failed: LinkedIn URL returned 404 or 999. Please review manually.">
                              <AlertTriangle size={16} />
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
