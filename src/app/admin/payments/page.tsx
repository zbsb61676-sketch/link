import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import AdminPaymentsTableClient from "@/components/AdminPaymentsTableClient";

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  const payments = await prisma.paymentRecord.findMany({
    orderBy: {
      paymentDate: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          paypalEmail: true,
          bankDetails: true,
        }
      },
      rental: {
        select: {
          lastHealthStatus: true,
          listing: {
            select: {
              linkedinUrl: true
            }
          }
        }
      }
    }
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Payouts Management</h1>
              <p className="text-slate-600">Review generated payments, verify account health, and process bulk payouts.</p>
            </div>
          </div>

          <AdminPaymentsTableClient initialPayments={payments as any} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
