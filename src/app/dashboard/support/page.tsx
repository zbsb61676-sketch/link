"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageSquare, Plus, ArrowRight, Loader2 } from "lucide-react";

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newMessage) return;
    
    setSubmitLoading(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: newSubject, message: newMessage })
      });
      
      if (res.ok) {
        setIsCreating(false);
        setNewSubject("");
        setNewMessage("");
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Help & Support</h1>
              <p className="text-slate-600">Need help with payments or your account? Open a ticket.</p>
            </div>
            {!isCreating && (
              <button 
                onClick={() => setIsCreating(true)}
                className="bg-brand text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-brand-hover"
              >
                <Plus size={18} /> New Ticket
              </button>
            )}
          </div>

          {isCreating && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Open a New Ticket</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Missing payment for last week"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your issue in detail..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitLoading}
                    className="px-6 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand-hover disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                    Submit Ticket
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand" size={32} /></div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No support tickets</h3>
              <p className="text-slate-500">You haven't opened any support tickets yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <ul className="divide-y divide-slate-100">
                {tickets.map((ticket) => (
                  <li key={ticket.id}>
                    <Link href={`/dashboard/support/${ticket.id}`} className="block hover:bg-slate-50 transition-colors p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {ticket.status}
                            </span>
                            <h3 className="text-lg font-bold text-slate-900">{ticket.subject}</h3>
                          </div>
                          <div className="text-sm text-slate-500 flex items-center gap-4">
                            <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                            <span>{ticket._count?.replies || 0} messages</span>
                          </div>
                        </div>
                        <ArrowRight className="text-slate-400" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
