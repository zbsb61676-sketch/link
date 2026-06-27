"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Send, Loader2 } from "lucide-react";

export default function TicketPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const res = await fetch(`/api/tickets/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTicket(data.ticket);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage) return;
    
    setSending(true);
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage })
      });
      
      if (res.ok) {
        setReplyMessage("");
        fetchTicket(); // Reload chat
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 flex justify-center items-center">
          <Loader2 className="animate-spin text-brand" size={48} />
        </main>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 flex flex-col justify-center items-center p-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Ticket Not Found</h1>
          <Link href="/dashboard/support" className="text-brand hover:underline">Return to Support</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 py-8 max-w-4xl mx-auto w-full px-4 flex flex-col h-[calc(100vh-64px)]">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/support" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{ticket.subject}</h1>
              <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'
              }`}>
                {ticket.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {ticket.replies.map((reply: any, i: number) => {
              const isAdmin = reply.sender.role === 'ADMIN';
              return (
                <div key={reply.id} className={`flex flex-col max-w-[80%] ${isAdmin ? 'mr-auto' : 'ml-auto'}`}>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-xs font-medium text-slate-500">
                      {isAdmin ? 'Support Team' : 'You'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(reply.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <div className={`p-4 rounded-2xl ${
                    isAdmin 
                      ? 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200' 
                      : 'bg-brand text-white rounded-tr-none'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm">{reply.message}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {ticket.status === "OPEN" ? (
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <form onSubmit={handleReply} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  required
                />
                <button 
                  type="submit"
                  disabled={sending}
                  className="bg-brand text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-hover flex items-center gap-2 disabled:opacity-50"
                >
                  {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  Send
                </button>
              </form>
            </div>
          ) : (
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-center text-slate-500 text-sm">
              This ticket has been closed. If you need further assistance, please open a new ticket.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
