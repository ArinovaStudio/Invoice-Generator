"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";
import LoadingComponent from "@/components/LoadingComponent";

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

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv))
    );

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
      const res = await fetch(`/api/user/invoices/${deleteModal.invoiceId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInvoices((prev) =>
          prev.filter((inv) => inv.id !== deleteModal.invoiceId)
        );
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
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading) return <LoadingComponent text={"Loading Invoices..."} />;

  return (
    <div className="p-8 lg:p-12 bg-[hsl(var(--background))] min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-7 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
            Invoice History
          </h2>
          <p className="text-sm mt-1 text-[hsl(var(--muted-foreground))]">
            Manage and track all your generated billing documents.
          </p>
        </div>

        <Link
          href="/user/invoices/new"
          className="h-10 px-4 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold hover:opacity-90 transition flex items-center gap-1.5 w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Invoice
        </Link>
      </div>

      <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[hsl(var(--muted)/0.45)] border-b border-[hsl(var(--border))]">
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-[hsl(var(--muted-foreground))]">
                  Number
                </th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-[hsl(var(--muted-foreground))]">
                  Client
                </th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-[hsl(var(--muted-foreground))]">
                  Date
                </th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-[hsl(var(--muted-foreground))]">
                  Amount
                </th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-[hsl(var(--muted-foreground))]">
                  Status
                </th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-right text-[hsl(var(--muted-foreground))]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[hsl(var(--border))]">
              {invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center italic text-sm text-[hsl(var(--muted-foreground))]"
                  >
                    No invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="group hover:bg-[hsl(var(--accent)/0.45)] transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-semibold text-[hsl(var(--primary))] text-[13px]">
                      {inv.invoiceNumber}
                    </td>

                    <td className="px-6 py-4 font-semibold text-[14px] text-[hsl(var(--foreground))]">
                      {inv.clientName}
                    </td>

                    <td className="px-6 py-4 text-[13px] font-medium text-[hsl(var(--muted-foreground))]">
                      {new Date(inv.issueDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-4 font-bold text-[14px] text-[hsl(var(--foreground))]">
                      {formatINR(inv.totalAmount)}
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={inv.status}
                        onChange={(e) =>
                          handleStatusChange(inv.id, e.target.value)
                        }
                        className={`h-8 px-3 rounded-full text-[10px] font-bold uppercase tracking-tight outline-none cursor-pointer appearance-none text-center border border-transparent
${
  inv.status === "PAID"
    ? "bg-emerald-500/10 text-emerald-600"
    : inv.status === "DRAFT"
    ? "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
    : inv.status === "OVERDUE"
    ? "bg-red-500/10 text-red-600"
    : inv.status === "CANCELLED"
    ? "bg-[hsl(var(--foreground))] text-[hsl(var(--background))]"
    : "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]"
}`}
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="SENT">SENT</option>
                        <option value="PAID">PAID</option>
                        <option value="OVERDUE">OVERDUE</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            router.push(
                              `/user/invoices/${inv.id}?download=true`
                            )
                          }
                          className="h-8 w-8 flex items-center justify-center rounded-md bg-[hsl(var(--muted)/0.6)] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--primary))] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            download
                          </span>
                        </button>

                        <Link
                          href={`/user/invoices/${inv.id}`}
                          className="h-8 w-8 flex items-center justify-center rounded-md bg-[hsl(var(--muted)/0.6)] text-[hsl(var(--muted-foreground))] hover:bg-amber-500/10 hover:text-amber-600 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            edit
                          </span>
                        </Link>

                        <button
                          onClick={() =>
                            triggerDelete(inv.id, inv.invoiceNumber)
                          }
                          className="h-8 w-8 flex items-center justify-center rounded-md bg-[hsl(var(--muted)/0.6)] text-[hsl(var(--muted-foreground))] hover:bg-red-500/10 hover:text-red-600 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
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
        onClose={() =>
          setDeleteModal({ isOpen: false, invoiceId: "", invoiceNumber: "" })
        }
        onConfirm={executeDelete}
        title="Delete Invoice"
        message={`Are you sure you want to permanently delete invoice ${deleteModal.invoiceNumber}? This action cannot be undone.`}
        confirmText="Delete Invoice"
        isDanger={true}
      />
    </div>
  );
}
