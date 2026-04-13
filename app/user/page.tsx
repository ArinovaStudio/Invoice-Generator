"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch("/api/user/invoices");
        const data = await res.json();
        if (data.invoices) setInvoices(data.invoices);
      } catch (error) {
        console.error("Failed to fetch invoices", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const totalOutstanding = invoices
    .filter(i => i.status === "SENT" || i.status === "OVERDUE")
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const totalPaid = invoices
    .filter(i => i.status === "PAID")
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const pendingDrafts = invoices.filter(i => i.status === "DRAFT").length;

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID": return <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-tertiary-container text-white">PAID</span>;
      case "DRAFT": return <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-outline-variant text-on-surface-variant">DRAFT</span>;
      case "OVERDUE": return <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-error-container text-on-error-container">OVERDUE</span>;
      default: return <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-primary-fixed text-on-primary-fixed-variant">{status}</span>;
    }
  };

  if (loading) return <div className="p-12 text-center">Loading dashboard...</div>;

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:p-12">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-primary font-bold tracking-widest text-[10px] uppercase mb-2 block">Management Hub</span>
          <h2 className="text-4xl lg:text-5xl font-headline font-extrabold text-on-surface tracking-tight leading-none">Invoices</h2>
        </div>
        <Link href="/user/invoices/new" className="bg-gradient-to-r from-primary to-primary-container text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
          <span className="material-symbols-outlined">add_circle</span>
          + New Invoice
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface-container-low p-6 rounded-xl border-none">
          <p className="text-on-surface-variant text-xs uppercase font-bold tracking-widest mb-1">Total Outstanding</p>
          <h3 className="text-3xl font-extrabold">{formatINR(totalOutstanding)}</h3>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border-none">
          <p className="text-on-surface-variant text-xs uppercase font-bold tracking-widest mb-1">Total Paid</p>
          <h3 className="text-3xl font-extrabold text-tertiary-container">{formatINR(totalPaid)}</h3>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border-none">
          <p className="text-on-surface-variant text-xs uppercase font-bold tracking-widest mb-1">Pending Drafts</p>
          <h3 className="text-3xl font-extrabold">{pendingDrafts}</h3>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <div className="p-8 pb-4">
          <h4 className="text-xl font-bold">Recent History</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Invoice Number</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Client Name</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Issue Date</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Amount</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Status</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {invoices.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No invoices found. Create one to get started!</td></tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="group hover:bg-surface-container-high transition-colors">
                    <td className="px-8 py-6 font-bold text-on-surface">{inv.invoiceNumber}</td>
                    <td className="px-8 py-6 font-medium">{inv.clientName}</td>
                    <td className="px-8 py-6 text-on-surface-variant text-sm">{new Date(inv.issueDate).toLocaleDateString()}</td>
                    <td className="px-8 py-6 font-bold">{formatINR(inv.totalAmount)}</td>
                    <td className="px-8 py-6">{getStatusBadge(inv.status)}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/user/invoices/${inv.id}`} className="p-2 hover:bg-white rounded-lg text-on-surface-variant hover:text-primary transition-all">
                          <span className="material-symbols-outlined">edit</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}