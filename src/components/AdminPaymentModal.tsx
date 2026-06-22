"use client";

import { useState } from "react";
import { X, DollarSign, Calendar, FileText, Loader2 } from "lucide-react";

interface AdminPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  userEmail: string;
  suggestedAmount: number;
}

export default function AdminPaymentModal({
  isOpen,
  onClose,
  userId,
  userName,
  userEmail,
  suggestedAmount,
}: AdminPaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(suggestedAmount.toString());
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          amount,
          reference,
        }),
      });

      if (res.ok) {
        onClose();
        // Reset form
        setAmount(suggestedAmount.toString());
        setReference("");
        alert("Payment recorded successfully!");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to record payment");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-slate-900">Record Payment</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-500 mb-1">Paying To:</p>
            <p className="font-medium text-slate-900">{userName}</p>
            <p className="text-sm text-slate-600">{userEmail}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <DollarSign size={16} className="text-slate-400" /> Amount (USD)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <FileText size={16} className="text-slate-400" /> Reference / Notes
              </label>
              <input
                type="text"
                placeholder="e.g. PayPal TXN-123456"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">Optional. Helps the user verify the payment.</p>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Save Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
