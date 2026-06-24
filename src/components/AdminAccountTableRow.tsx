"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, DollarSign, MessageCircle } from "lucide-react";

export default function AdminAccountTableRow({ account, onOpenPayment }: { account: any, onOpenPayment: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/listings/${account.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      alert("Error updating status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="p-4">
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{account.owner.name}</span>
          <span className="text-xs text-slate-500">{account.owner.email}</span>
          {account.isVerified && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-green-600 mt-1">
              <ShieldCheck size={12} /> Verified
            </span>
          )}
        </div>
      </td>
      
      <td className="p-4">
        <div className="flex flex-col text-sm text-slate-600">
          <span>{account.connections.toLocaleString()} Conns</span>
          <span>{account.accountAge}</span>
          <span className="text-xs text-slate-400">{account.location}</span>
        </div>
      </td>

      <td className="p-4">
        <div className="flex flex-col text-sm">
          {account.whatsappNumber ? (
            <a 
              href={`https://wa.me/${account.whatsappNumber.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noreferrer" 
              className="text-emerald-600 font-semibold hover:underline flex items-center gap-1"
            >
              WA: {account.whatsappNumber}
            </a>
          ) : (
            <span className="text-slate-600">WA: N/A</span>
          )}
          {account.linkedinUrl ? (
            <a href={account.linkedinUrl} target="_blank" rel="noreferrer" className="text-brand hover:underline truncate max-w-[150px] inline-block">
              Profile Link
            </a>
          ) : (
            <span className="text-slate-400 italic">No Link</span>
          )}
          {account.verificationCode && (
            <span className="mt-1 text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200" title="Check if this code is in their LinkedIn About section">
              {account.verificationCode}
            </span>
          )}
        </div>
      </td>

      <td className="p-4 font-bold text-slate-900">
        ₹{account.price}
      </td>

      <td className="p-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider
          ${account.status === 'AVAILABLE' ? 'bg-blue-100 text-blue-700' : 
            account.status === 'RENTED' ? 'bg-green-100 text-green-700' : 
            'bg-slate-100 text-slate-700'}`}>
          {account.status}
        </span>
      </td>

      <td className="p-4">
        <div className="flex items-center gap-2">
          {/* Action to Message the User - Added for Chat Feature */}
          <button 
            onClick={() => router.push(`/admin/messages?userId=${account.ownerId}`)}
            className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
            title="Message User"
          >
            <MessageCircle size={16} />
          </button>

          {account.status === 'AVAILABLE' ? (
            <>
              <button 
                onClick={() => updateStatus('RENTED')}
                disabled={loading}
                className="px-3 py-1.5 bg-brand text-white text-xs font-medium rounded hover:bg-brand-hover transition-colors disabled:opacity-50"
              >
                Rent
              </button>
              <button 
                onClick={() => updateStatus('REJECTED')}
                disabled={loading}
                className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-medium rounded hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
            </>
          ) : account.status === 'RENTED' ? (
            <>
              <button 
                onClick={onOpenPayment}
                className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded hover:bg-emerald-200 transition-colors flex items-center gap-1"
                title="Record Payment"
              >
                <DollarSign size={14} /> Pay
              </button>
              <button 
                onClick={() => updateStatus('AVAILABLE')}
                disabled={loading}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300 transition-colors disabled:opacity-50"
              >
                End
              </button>
            </>
          ) : (
            <button 
              onClick={() => updateStatus('AVAILABLE')}
              disabled={loading}
              className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300 transition-colors disabled:opacity-50"
            >
              Mark Avail
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
