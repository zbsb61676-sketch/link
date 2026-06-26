"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, DollarSign, MessageCircle, PlusCircle, Image as ImageIcon, X } from "lucide-react";

export default function AdminAccountTableRow({ account }: { account: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);

  // Check if button should be enabled
  const activeRental = account.rentals?.[0];
  let isCreditDisabled = false;
  let creditTooltip = "Manually credit this user's account";
  
  if (activeRental) {
    const referenceDate = activeRental.lastPaymentDate ? new Date(activeRental.lastPaymentDate) : new Date(activeRental.startDate);
    const daysSince = Math.floor((Date.now() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince < 7) {
      isCreditDisabled = true;
      creditTooltip = `Wait ${7 - daysSince} more days to credit this user (Next payout due every 7 days)`;
    }
  }

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

  const creditUser = async () => {
    const rawAmount = prompt(`Enter amount in ₹ to manually credit ${account.owner.name} for this rental:`, account.price.toString());
    if (!rawAmount) return;
    
    const amount = Number(rawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/listings/${account.id}/credit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        alert(`Successfully credited ₹${amount} to ${account.owner.name}! It is now AVAILABLE in their dashboard.`);
        router.refresh();
      } else {
        alert("Failed to credit user");
      }
    } catch (error) {
      alert("Error crediting user");
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
          {/* View Screenshot Action */}
          {account.screenshotBase64 && (
            <>
              <button 
                onClick={() => setShowScreenshot(true)}
                className="p-1.5 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors"
                title="View Verification Screenshot"
              >
                <ImageIcon size={16} />
              </button>

              {showScreenshot && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
                  <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                      <h3 className="font-bold text-slate-900">Verification Screenshot - {account.owner.name}</h3>
                      <button onClick={() => setShowScreenshot(false)} className="p-1 bg-slate-200 hover:bg-slate-300 rounded-full text-slate-600 transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                    <div className="overflow-auto p-4 flex-1">
                      <img src={account.screenshotBase64} alt="Screenshot" className="max-w-full h-auto object-contain mx-auto" />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

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
                onClick={creditUser}
                disabled={loading || isCreditDisabled}
                className={`flex items-center gap-1 px-3 py-1.5 text-white text-xs font-medium rounded transition-colors disabled:opacity-50 ${isCreditDisabled ? 'bg-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'}`}
                title={creditTooltip}
              >
                <PlusCircle size={14} /> Credit
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
