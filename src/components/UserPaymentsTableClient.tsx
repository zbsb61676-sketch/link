"use client";

import { useState } from "react";
import { Calendar, FileText, Download, DollarSign, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Payment {
  id: string;
  amount: number;
  paymentDate: Date;
  status: string;
  reference: string | null;
}

export default function UserPaymentsTableClient({ initialPayments }: { initialPayments: Payment[] }) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const requestPayout = async (id: string) => {
    setLoadingId(id);
    const toastId = toast.loading("Requesting payout...");
    
    try {
      const res = await fetch("/api/payments/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: id }),
      });

      if (res.ok) {
        toast.success("Payout requested successfully!", { id: toastId });
        setPayments(payments.map(p => 
          p.id === id ? { ...p, status: "REQUESTED" } : p
        ));
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to request payout", { id: toastId });
      }
    } catch (err) {
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
            <th className="p-4">Date</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Status</th>
            <th className="p-4">Reference Note</th>
            <th className="p-4 text-right">Action / Receipt</th>
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
                <span className="font-bold text-slate-900">₹{payment.amount.toFixed(2)}</span>
              </td>
              <td className="p-4">
                {payment.status === "PENDING" ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 w-fit">
                    AVAILABLE
                  </span>
                ) : payment.status === "REQUESTED" ? (
                  <span className="inline-flex flex-col gap-1">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 w-fit">
                      REQUESTED
                    </span>
                    <span className="text-[10px] text-slate-500">Processing shortly</span>
                  </span>
                ) : payment.status === "VERIFIED" ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 w-fit">
                    VERIFIED
                  </span>
                ) : payment.status === "CANCELLED" ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 w-fit">
                    CANCELLED
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 w-fit">
                    PAID
                  </span>
                )}
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
                {payment.status === "PENDING" ? (
                  <button 
                    onClick={() => requestPayout(payment.id)}
                    disabled={loadingId === payment.id}
                    className="flex items-center gap-1 ml-auto px-3 py-1.5 bg-brand text-white text-xs font-medium rounded hover:bg-brand-hover transition-colors disabled:opacity-50"
                  >
                    {loadingId === payment.id ? <Loader2 size={14} className="animate-spin" /> : <DollarSign size={14} />}
                    Request Payout
                  </button>
                ) : (
                  <button className="text-brand hover:text-brand-hover p-2 rounded-lg hover:bg-brand/10 transition-colors inline-flex" title="Download Receipt">
                    <Download size={18} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
