"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ListingCardActions({ listingId, status }: { listingId: string, status: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (status === "RENTED") {
      toast.error("You cannot delete an account that is currently rented.");
      return;
    }

    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);
    const toastId = toast.loading("Deleting listing...");

    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Listing deleted successfully", { id: toastId });
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete listing", { id: toastId });
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={() => toast("Editing features coming soon!", { icon: "🚧" })}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand transition-colors"
      >
        <Edit2 size={16} /> Edit
      </button>
      <button 
        onClick={handleDelete}
        disabled={deleting || status === "RENTED"}
        className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
      >
        {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} 
        Delete
      </button>
    </div>
  );
}
