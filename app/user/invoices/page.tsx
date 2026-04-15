"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";

export default function InvoicesListPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    invoiceId: "",
    invoiceNumber: "",
  });

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/user/invoices");
      const data = await res.json();
      if (data.success) setInvoices(data.invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, status: newStatus } : inv));

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({ status: newStatus }));

      const res = await fetch(`/api/user/invoices/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        alert("Failed to update status: " + data.message);
        fetchInvoices();
      }
    } catch (error) {
      console.error("Status update error:", error);
      fetchInvoices();
    }
  };

  const triggerDelete = (id: string, invoiceNumber: string) => {
    setDeleteModal({ isOpen: true, invoiceId: id, invoiceNumber });
  };

  const executeDelete = async () => {
    try {
      const res = await fetch(`/api/user/invoices/${deleteModal.invoiceId}`, { method: "DELETE" });
      if (res.ok) {
        setInvoices((prev) => prev.filter((inv) => inv.id !== deleteModal.invoiceId));
      } else {
        alert("Failed to delete invoice.");
      }
    } catch (error) { 
      console.error("Delete error:", error); 
    } finally {
      setDeleteModal({ isOpen: false, invoiceId: "", invoiceNumber: "" });
    }
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
  };

  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Loading Invoices...</div>;

  return (
    <div className="p-8 lg:p-12 bg-[#FAFBFF] min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Invoice History</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage and track all your generated billing documents.</p>
        </div>
        <Link 
          href="/user/invoices/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 w-fit"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Invoice
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F7FE] border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-slate-400">Number</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-slate-400">Client</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-slate-400">Date</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-slate-400">Amount</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-slate-400">Status</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic font-medium">No invoices found.</td></tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 font-mono font-bold text-blue-600 text-sm">{inv.invoiceNumber}</td>
                    <td className="px-6 py-5 font-bold text-slate-800">{inv.clientName}</td>
                    <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                      {new Date(inv.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-5 font-black text-slate-900">{formatINR(inv.totalAmount)}</td>
                    <td className="px-6 py-5">
                      <select
                        value={inv.status}
                        onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight outline-none cursor-pointer appearance-none text-center
                          ${inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 
                            inv.status === 'DRAFT' ? 'bg-slate-100 text-slate-500' : 
                            inv.status === 'OVERDUE' ? 'bg-red-50 text-red-600' : 
                            inv.status === 'CANCELLED' ? 'bg-slate-800 text-white' :
                            'bg-blue-50 text-blue-600'}`}
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="SENT">SENT</option>
                        <option value="PAID">PAID</option>
                        <option value="OVERDUE">OVERDUE</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => router.push(`/user/invoices/${inv.id}?download=true`)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><span className="material-symbols-outlined text-[20px]">download</span></button>
                        <Link href={`/user/invoices/${inv.id}`} className="p-2 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50"><span className="material-symbols-outlined text-[20px]">edit</span></Link>
                        <button onClick={() => triggerDelete(inv.id, inv.invoiceNumber)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, invoiceId: "", invoiceNumber: "" })}
        onConfirm={executeDelete}
        title="Delete Invoice"
        message={`Are you sure you want to permanently delete invoice ${deleteModal.invoiceNumber}? This action cannot be undone.`}
        confirmText="Delete Invoice"
        isDanger={true}
      />
    </div>
  );
}