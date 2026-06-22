"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Send, User as UserIcon, MessageCircle, ImagePlus, X } from "lucide-react";

export default function AdminMessagesPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(searchParams.get("userId"));
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        if (res.ok) {
          const data = await res.json();
          setConversations(data);
          
          // If no active user and we have conversations, select the first one
          if (!activeUserId && data.length > 0) {
            setActiveUserId(data[0].user.id);
            router.replace(`/admin/messages?userId=${data[0].user.id}`);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversations();
  }, [activeUserId, router]);

  // Fetch messages for active user
  useEffect(() => {
    if (!activeUserId) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?userId=${activeUserId}`);
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
    
    // Simple polling every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [activeUserId]);

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
    if ((!newMessage.trim() && !imagePreview) || !activeUserId) return;

    const tempMessage = {
      id: "temp-" + Date.now(),
      content: newMessage,
      imageUrl: imagePreview,
      senderId: (session?.user as any)?.id,
      receiverId: activeUserId,
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
          receiverId: activeUserId,
          content: tempMessage.content,
          imageUrl: tempMessage.imageUrl,
        })
      });
      if (!res.ok) {
        throw new Error("Failed to send");
      }
      // Re-fetch to get real ID
      const refreshRes = await fetch(`/api/messages?userId=${activeUserId}`);
      if (refreshRes.ok) {
        setMessages(await refreshRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeUser = conversations.find(c => c.user.id === activeUserId)?.user;

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 overflow-hidden flex pt-[72px]">
        {/* Left Sidebar - Conversations */}
        <div className="w-1/3 max-w-sm bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-72px)]">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 && !loading ? (
              <p className="p-4 text-sm text-slate-500 text-center">No messages yet.</p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.user.id}
                  onClick={() => {
                    setActiveUserId(conv.user.id);
                    router.push(`/admin/messages?userId=${conv.user.id}`);
                  }}
                  className={`w-full p-4 flex items-start gap-3 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left ${
                    activeUserId === conv.user.id ? "bg-brand/5 border-l-4 border-l-brand" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {conv.user.image ? (
                      <img src={conv.user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="text-slate-500" size={20} />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-sm text-slate-900 truncate">{conv.user.name}</h3>
                      {conv.unreadCount > 0 && (
                        <span className="bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {conv.lastMessage.imageUrl && !conv.lastMessage.content ? "📷 Image attached" : conv.lastMessage.content}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Chat Area */}
        <div className="flex-1 flex flex-col h-[calc(100vh-72px)] bg-slate-50">
          {activeUserId ? (
            <>
              {/* Chat Header */}
              <div className="bg-white p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                    <UserIcon className="text-slate-500" size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">{activeUser?.name || "Loading..."}</h2>
                    <p className="text-xs text-slate-500">{activeUser?.email || "User"}</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => {
                  const isMine = msg.senderId === (session?.user as any)?.id;
                  return (
                    <div key={msg.id || idx} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isMine ? "bg-brand text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
                      }`}>
                        {msg.imageUrl && (
                          <div className="mb-2 mt-1 relative rounded-lg overflow-hidden border border-black/10">
                            <img src={msg.imageUrl} alt="Attachment" className="max-w-full h-auto max-h-64 object-contain bg-black/5" />
                          </div>
                        )}
                        {msg.content && <p className="text-sm">{msg.content}</p>}
                        <span className={`text-[10px] mt-1 block ${isMine ? "text-brand-100" : "text-slate-400"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
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
                    placeholder="Type a message..."
                    className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim() && !imagePreview}
                    className="bg-brand text-white p-2 flex items-center justify-center w-10 h-10 rounded-full hover:bg-brand-hover disabled:opacity-50 transition-colors"
                  >
                    <Send size={18} className="ml-0.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <MessageCircle size={48} className="mb-4 text-slate-300" />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
