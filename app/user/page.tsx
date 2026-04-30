"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LoadingComponent from "@/components/LoadingComponent";

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOutstanding: 0,
    totalPaid: 0,
    pendingDrafts: 0,
    totalClients: 0,
  });
  const [filter, setFilter] = useState<"ALL" | "PAID" | "OVERDUE">("ALL");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/user/dashboard");
        const data = await res.json();

        if (data.success) {
          setInvoices(data.recentInvoices);
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-tertiary-container text-white">
            PAID
          </span>
        );
      case "DRAFT":
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-outline-variant text-on-surface-variant">
            DRAFT
          </span>
        );
      case "OVERDUE":
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-error-container text-on-error-container">
            OVERDUE
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-primary-fixed text-on-primary-fixed-variant">
            {status}
          </span>
        );
    }
  };
  const filteredInvoices = useMemo(() => {
    let result = invoices;

    // status filter
    if (filter !== "ALL") {
      result = result.filter((inv) => inv.status === filter);
    }

    // search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      result = result.filter((inv) =>
        [inv.invoiceNumber, inv.clientName, inv.status, String(inv.totalAmount)]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query))
      );
    }

    return result;
  }, [invoices, filter, searchQuery]);
  if (loading) return <LoadingComponent text={"Loading Dashboard..."} />;

  return (
    <div className="flex-1 overflow-y-auto p-5 lg:p-7 bg-[hsl(var(--background))]">
      {/* Title */}
      <div className="mb-5">
        <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
          Invoice List
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        {/* Main Card */}
        <div className="lg:col-span-2 rounded-3xl p-5 bg-gradient-to-r from-[hsl(var(--primary)/0.75)] to-[hsl(var(--primary)/0.45)] text-white shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3 items-center">
              <div className="h-12 w-12 rounded-lg bg-white/50 flex items-center justify-center">
                <span className="material-symbols-outlined text-[50px]">
                  payments
                </span>
              </div>

              <div className="mt-3 flex-col flex items-start gap-3">
                <p className="text-sm opacity-90">Total Receivables</p>
                <h3 className="text-3xl font-semibold">
                  {formatINR(stats.totalOutstanding)}
                </h3>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Overdue</span>

              <span>
                {stats.totalOutstanding > 0
                  ? `${Math.min(
                      100,
                      Math.round(
                        (stats.totalOutstanding /
                          (stats.totalOutstanding + stats.totalPaid || 1)) *
                          100
                      )
                    )}%`
                  : "0%"}
              </span>
            </div>

            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-cyan-300 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    stats.totalOutstanding > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (stats.totalOutstanding /
                              (stats.totalOutstanding + stats.totalPaid || 1)) *
                              100
                          )
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Paid */}
        <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm">
          <div className="flex items-start justify-start gap-3">
            <div className="h-12 w-12 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[50px]">
                task_alt
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                Paid
              </p>

              <h3 className="text-3xl font-semibold text-emerald-600">
                {formatINR(stats.totalPaid)}
              </h3>
            </div>
          </div>

          <div className="mt-5 h-16 flex items-end gap-2">
            {[30, 55, 40, 35, 65, 80, 45].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className="flex-1 rounded-full bg-gradient-to-t from-emerald-600 to-emerald-300"
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-[hsl(var(--muted-foreground))]">
              Successfully collected payments
            </span>

            <span className="font-medium text-emerald-600">Revenue growth</span>
          </div>
        </div>

        {/* Draft */}
        <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm">
          <div className="flex items-start justify-start gap-3">
            <div className="h-12 w-12 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-[50px]">
                draft_orders
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                Pending Drafts
              </p>

              <h3 className="text-3xl font-semibold text-orange-500">
                {stats.pendingDrafts}
              </h3>
            </div>
          </div>

          <div className="mt-5 h-16 flex items-end gap-2">
            {[55, 35, 25, 60, 45, 30, 52].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className="flex-1 rounded-full bg-gradient-to-t from-orange-500 to-orange-300"
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-[hsl(var(--muted-foreground))]">
              Saved but not finalized
            </span>

            <span className="font-medium text-orange-500">Awaiting action</span>
          </div>
        </div>

        {/* Clients */}
        <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm">
          <div className="flex items-start justify-start gap-3">
            <div className="h-12 w-12 rounded-lg bg-violet-500/10 text-violet-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[50px]">
                groups
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                Total Clients
              </p>

              <h3 className="text-3xl font-semibold text-violet-600">
                {stats.totalClients}
              </h3>
            </div>
          </div>

          <div className="mt-5 h-16 flex items-end gap-2">
            {[55, 35, 25, 60, 45, 30, 52].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className="flex-1 rounded-full bg-gradient-to-t from-violet-600 to-violet-300"
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-[hsl(var(--muted-foreground))]">
              Active business relationships
            </span>

            <span className="font-medium text-violet-600">Client growth</span>
          </div>
        </div>
      </div>

      {/* Table */}
      {/* Toolbar - Separate from Table */}
      <div className="flex flex-col  md:flex-row md:items-center justify-between gap-3 mb-4">
        {/* Left Filters */}
        {/* Filters */}
        <div className="flex items-center gap-2  border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 rounded-xl flex-wrap">
          <button
            onClick={() => setFilter("ALL")}
            className={`h-9 px-4 rounded-2xl uppercase text-sm font-medium transition ${
              filter === "ALL"
                ? "bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]"
                : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("PAID")}
            className={`h-9 px-4 rounded-2xl uppercase text-sm font-medium transition ${
              filter === "PAID"
                ? "bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]"
                : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
            }`}
          >
            Paid
          </button>

          <button
            onClick={() => setFilter("OVERDUE")}
            className={`h-9 px-4 rounded-2xl text-sm font-medium transition ${
              filter === "OVERDUE"
                ? "bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]"
                : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
            }`}
          >
            OVERDUE
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[hsl(var(--muted-foreground))]">
              search
            </span>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoices..."
              className="h-9 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-10 pr-4 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.18)] focus:border-[hsl(var(--primary))] transition"
            />
          </div>

          <Link
            href="/user/invoices/new"
            className="h-9 px-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-sm font-medium text-[hsl(var(--foreground))] flex items-center gap-2 hover:bg-[hsl(var(--accent))] transition"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Invoice
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.7)]">
                <th className="px-5 py-3 text-xs font-medium text-[hsl(var(--muted-foreground))]">
                  Invoice ID
                </th>
                <th className="px-5 py-3 text-xs font-medium text-[hsl(var(--muted-foreground))]">
                  User Info
                </th>
                <th className="px-5 py-3 text-xs font-medium text-[hsl(var(--muted-foreground))]">
                  Create Date
                </th>
                <th className="px-5 py-3 text-xs font-medium text-[hsl(var(--muted-foreground))]">
                  Amount
                </th>
                <th className="px-5 py-3 text-xs font-medium text-[hsl(var(--muted-foreground))]">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-medium text-right text-[hsl(var(--muted-foreground))]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-sm text-[hsl(var(--muted-foreground))]"
                  >
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--accent)/0.45)] transition"
                  >
                    <td className="px-5 py-4 font-medium">
                      {inv.invoiceNumber}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-sm">
                        {inv.clientName}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-[hsl(var(--muted-foreground))]">
                      {new Date(inv.issueDate).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {formatINR(inv.totalAmount)}
                    </td>

                    <td className="px-5 py-4">{getStatusBadge(inv.status)}</td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/user/invoices/${inv.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-2xl hover:bg-[hsl(var(--accent))]"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          visibility
                        </span>
                      </Link>
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
