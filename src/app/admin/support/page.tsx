"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { MessageSquare, ArrowRight, Loader2, CheckCircle } from "lucide-react";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("OPEN");

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tickets?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Support Tickets</h1>
              <p className="text-slate-600">Manage user inquiries and issues.</p>
            </div>
            
            <div className="flex bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
              <button 
                onClick={() => setFilter("OPEN")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === "OPEN" ? 'bg-amber-100 text-amber-800' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Open
              </button>
              <button 
                onClick={() => setFilter("CLOSED")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === "CLOSED" ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Closed
              </button>
              <button 
                onClick={() => setFilter("ALL")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === "ALL" ? 'bg-blue-100 text-blue-800' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                All
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand" size={32} /></div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
              {filter === "OPEN" ? (
                <CheckCircle className="mx-auto text-green-400 mb-4" size={48} />
              ) : (
                <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {filter === "OPEN" ? "Inbox Zero!" : "No tickets found"}
              </h3>
              <p className="text-slate-500">
                {filter === "OPEN" ? "There are no open support tickets right now." : `No tickets matching filter: ${filter}`}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-sm uppercase tracking-wider text-slate-500">
                      <th className="p-4 font-semibold">User</th>
                      <th className="p-4 font-semibold">Subject</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Last Updated</th>
                      <th className="p-4 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-slate-900">{ticket.user.name}</div>
                          <div className="text-xs text-slate-500">{ticket.user.email}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-900">{ticket.subject}</div>
                          <div className="text-xs text-slate-500">{ticket._count?.replies || 0} messages</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          {new Date(ticket.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <Link href={`/admin/support/${ticket.id}`} className="inline-flex items-center gap-1 text-brand font-medium hover:underline text-sm">
                            View <ArrowRight size={16} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
