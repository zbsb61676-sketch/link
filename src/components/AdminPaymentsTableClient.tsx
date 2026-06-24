"use client";

import { useState } from "react";
import { CheckSquare, Square, DollarSign, Clock, ExternalLink, CheckCircle2, AlertTriangle, QrCode, X } from "lucide-react";
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
  const [qrPayment, setQrPayment] = useState<Payment | null>(null);
  const [upiIdInput, setUpiIdInput] = useState("");

  const filteredPayments = payments.filter(p => filter === "ALL" || p.status === filter);

  // Helper to extract UPI ID from bank details string
  const extractUpiId = (details: string | null) => {
    if (!details) return "";
    const words = details.split(/[\s,]+/);
    const upi = words.find(w => w.includes('@'));
    return upi || "";
  };

  const openQrModal = (payment: Payment) => {
    setQrPayment(payment);
    setUpiIdInput(extractUpiId(payment.user.bankDetails));
  };

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
                <th className="p-4 text-right text-sm font-semibold text-slate-600">Actions</th>
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
                    <td className="p-4 text-right">
                      {(payment.status === "REQUESTED" || payment.status === "VERIFIED") && (
                        <button 
                          onClick={() => openQrModal(payment)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand/10 text-brand rounded-lg hover:bg-brand/20 transition-colors text-sm font-bold"
                        >
                          <QrCode size={16} />
                          Pay UPI
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal */}
      {qrPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <QrCode className="text-brand" /> Scan & Pay
              </h3>
              <button onClick={() => setQrPayment(null)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col items-center">
              <div className="w-full mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Verify/Edit UPI ID</label>
                <input 
                  type="text" 
                  value={upiIdInput}
                  onChange={(e) => setUpiIdInput(e.target.value)}
                  placeholder="e.g. username@okicici"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                />
              </div>

              {upiIdInput.includes('@') ? (
                <div className="bg-white p-4 rounded-xl border-2 border-slate-100 shadow-sm mb-4">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${upiIdInput}&pn=${encodeURIComponent(qrPayment.user.name || 'User')}&am=${qrPayment.amount}&cu=INR`} 
                    alt="UPI QR Code"
                    className="w-48 h-48"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-center p-4 mb-4 border-2 border-dashed border-slate-300">
                  Enter a valid UPI ID (containing @) to generate QR
                </div>
              )}

              <div className="text-center mb-6">
                <p className="text-sm text-slate-500 mb-1">Paying <span className="font-semibold text-slate-800">{qrPayment.user.name}</span></p>
                <div className="text-3xl font-black text-brand">₹{qrPayment.amount.toFixed(2)}</div>
              </div>

              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setQrPayment(null)}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    const originalIds = new Set(selectedIds);
                    setSelectedIds(new Set([qrPayment.id]));
                    await updateStatus("COMPLETED");
                    setSelectedIds(originalIds);
                    setQrPayment(null);
                  }}
                  className="flex-1 px-4 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-hover transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  Mark as Paid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
