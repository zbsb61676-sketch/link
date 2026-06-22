"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { Send, ShieldCheck, MessageCircle, ImagePlus, X } from "lucide-react";

export default function UserMessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages with admin
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages`);
        if (res.ok) {
          setMessages(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // Polling every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !imagePreview) return;

    const tempMessage = {
      id: "temp-" + Date.now(),
      content: newMessage,
      imageUrl: imagePreview,
      senderId: (session?.user as any)?.id,
      receiverId: "admin", // Will be resolved by the backend
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, tempMessage]);
    setNewMessage("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: tempMessage.content,
          imageUrl: tempMessage.imageUrl,
        }) 
      });
      if (!res.ok) {
        throw new Error("Failed to send");
      }
      const refreshRes = await fetch(`/api/messages`);
      if (refreshRes.ok) {
        setMessages(await refreshRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="flex-1 flex flex-col pt-20 px-4 pb-4">
        <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-4">
          
          {/* Chat Header */}
          <div className="bg-white p-4 border-b border-slate-200 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg">LinkRent Support</h1>
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Typically replies in a few hours
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <MessageCircle size={48} className="mb-4 text-slate-300" />
                <p>Send a message to our support team.</p>
                <p className="text-sm">We're here to help with 2FA or account issues.</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMine = msg.senderId === (session?.user as any)?.id;
                return (
                  <div key={msg.id || idx} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                      isMine ? "bg-brand text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
                    }`}>
                      {msg.imageUrl && (
                        <div className="mb-2 mt-1 relative rounded-lg overflow-hidden border border-black/10">
                          <img src={msg.imageUrl} alt="Attachment" className="max-w-full h-auto max-h-64 object-contain bg-black/5" />
                        </div>
                      )}
                      {msg.content && <p className="text-sm md:text-base">{msg.content}</p>}
                      <span className={`text-[10px] mt-1 block ${isMine ? "text-brand-100" : "text-slate-400"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-slate-200 flex flex-col gap-2">
            {imagePreview && (
              <div className="relative inline-block w-24 h-24 mb-2">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg border border-slate-200" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <form onSubmit={sendMessage} className="flex gap-2 items-center">
              <input 
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-slate-400 hover:text-brand hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
                title="Attach Image"
              >
                <ImagePlus size={24} />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 border border-slate-300 rounded-full px-4 md:px-6 py-3 text-sm md:text-base text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim() && !imagePreview}
                className="bg-brand text-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-brand-hover disabled:opacity-50 transition-colors shrink-0 shadow-md"
              >
                <Send size={20} className="ml-1" />
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
