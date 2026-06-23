import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <div className="h-8 bg-slate-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-96 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col relative h-[300px]">
                <div className="absolute top-4 right-4">
                  <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse"></div>
                </div>

                <div className="p-6 flex-1 mt-6">
                  <div className="h-6 bg-slate-200 rounded w-40 mb-4 animate-pulse"></div>
                  
                  <div className="space-y-3 mt-4">
                    <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
                  </div>
                </div>
                
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div className="h-6 bg-slate-200 rounded w-24 animate-pulse"></div>
                  <div className="flex gap-4">
                    <div className="h-4 bg-slate-200 rounded w-12 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
