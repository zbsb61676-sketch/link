"use client";

import AdminAccountTableRow from "./AdminAccountTableRow";

export default function AdminAccountsTableClient({ listings }: { listings: any[] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="p-4">Owner</th>
              <th className="p-4">Metrics</th>
              <th className="p-4">Contact & URL</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {listings.map((account: any) => (
              <AdminAccountTableRow 
                key={account.id} 
                account={account} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
