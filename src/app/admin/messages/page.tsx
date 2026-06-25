import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminMessagesClient from "@/components/AdminMessagesClient";

export default async function AdminMessagesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-50"><div className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full"></div></div>}>
      <AdminMessagesClient />
    </Suspense>
  );
}
