"use client";

import { useState, useEffect } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import { City, State } from "country-state-city";
import { handleKeyDown } from "@/lib/InputKeyDown";
import { toast } from "sonner";
import LoadingComponent from "@/components/LoadingComponent";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "IN",
    companyGstin: "",
    name: "",
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    clientId: string;
    companyName: string;
  }>({
    isOpen: false,
    clientId: "",
    companyName: "",
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const url = searchQuery
          ? `/api/user/clients?search=${encodeURIComponent(searchQuery)}`
          : "/api/user/clients";

        const res = await fetch(url);
        const data = await res.json();
        if (data.success) setClients(data.clients);
      } catch (error) {
        console.error("Failed to fetch clients", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchClients();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle Form Inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open Form for Add or Edit
  const openForm = (client?: any) => {
    if (client) {
      setEditingId(client.id);
      setFormData({
        companyName: client.companyName || "",
        email: client.email || "",
        address: client.address || "",
        city: client.city || "",
        state: client.state || "",
        zip: client.zip || "",
        country: client.country || "IN",
        companyGstin: client.companyGstin || "",
        name: client.name || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        companyName: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "IN",
        name: "",
        companyGstin: "",
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingId
        ? `/api/user/clients/${editingId}`
        : "/api/user/clients";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setIsFormOpen(false);
        const refreshRes = await fetch(
          searchQuery
            ? `/api/user/clients?search=${encodeURIComponent(searchQuery)}`
            : "/api/user/clients"
        );
        const refreshData = await refreshRes.json();
        if (refreshData.success) setClients(refreshData.clients);
      } else {
        toast.error("Error: " + data.message);
      }
    } catch {
      toast.error("An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeDelete = async () => {
    try {
      const res = await fetch(`/api/user/clients/${deleteModal.clientId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setClients(clients.filter((c) => c.id !== deleteModal.clientId));
      } else {
        const data = await res.json();
        toast.error("Failed to delete: " + data.message);
      }
    } catch {
      toast.error("Error deleting client.");
    }
  };

  const inputStyles =
    "w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-2xl px-4 py-3 text-sm font-medium text-[hsl(var(--foreground))] outline-none transition-colors placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.18)]";

  const labelStyles =
    "mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]";

  if (loading) {
    return <LoadingComponent text={"Loading Clients..."} />;
  }
  return (
    <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-[hsl(var(--background))]">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-7 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              Clients
            </h2>
            <p className="text-sm mt-1 text-[hsl(var(--muted-foreground))]">
              Manage your client directory and billing details.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg pl-10 pr-4 text-sm text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)] focus:border-[hsl(var(--primary))] transition"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[hsl(var(--muted-foreground))]">
                search
              </span>
            </div>

            <button
              onClick={() => openForm()}
              className="h-10 px-4 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold hover:opacity-90 transition flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Client
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[hsl(var(--card))] rounded-sm border border-[hsl(var(--border))] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[hsl(var(--muted)/0.45)] border-b border-[hsl(var(--border))]">
                  <th className="px-6 py-3 text-[11px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))]">
                    Company / Client
                  </th>
                  <th className="px-6 py-3 text-[11px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))]">
                    Contact Email
                  </th>
                  <th className="px-6 py-3 text-[11px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))]">
                    Location
                  </th>
                                    <th className="px-6 py-3 text-[11px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))]">
                    COMPANY GST
                  </th>
                  <th className="px-6 py-3 text-[11px] uppercase tracking-wider font-semibold text-right text-[hsl(var(--muted-foreground))]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[hsl(var(--border))]">
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-sm text-[hsl(var(--muted-foreground))]"
                    >
                      Loading directory...
                    </td>
                  </tr>
                ) : clients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-3xl text-[hsl(var(--muted-foreground))] opacity-50">
                          folder_open
                        </span>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                          No clients found.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr
                      key={client.id}
                      className="group hover:bg-[hsl(var(--accent)/0.45)] transition-colors"
                    >
                      <td className="px-6 py-4 text-[14px] font-semibold text-[hsl(var(--foreground))]">
                        {client.companyName}
                      </td>

                      <td className="px-6 py-4 text-[13px] text-[hsl(var(--muted-foreground))]">
                        {client.email || "—"}
                      </td>

                      <td className="px-6 py-4 text-[13px] text-[hsl(var(--muted-foreground))]">
                        {client.city
                          ? `${client.city}, ${client.state}, ${client.country}`
                          : client.country}
                      </td>

                      <td className="px-6 py-4 text-[13px] text-[hsl(var(--muted-foreground))]">
                        {client.companyGstin || "—"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openForm(client)}
                            className="h-8 w-8 rounded-md bg-[hsl(var(--muted)/0.6)] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--primary))] flex items-center justify-center transition"
                          >
                            <span className="material-symbols-outlined text-xs">
                              edit
                            </span>
                          </button>

                          <button
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                clientId: client.id,
                                companyName: client.companyName,
                              })
                            }
                            className="h-8 w-8 rounded-md bg-[hsl(var(--muted)/0.6)] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--destructive)/0.12)] hover:text-[hsl(var(--destructive))] flex items-center justify-center transition"
                          >
                            <span className="material-symbols-outlined text-xs">
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
      </div>

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-4 sm:px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                {editingId ? "Edit Client" : "New Client"}
              </h3>

              <button
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-700 transition"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="px-4 sm:px-5 py-4 overflow-y-auto space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Company Name */}
                <div>
                  <label className={labelStyles}>Company Name *</label>
                  <input
                    required
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder="Studio Vertex Pvt Ltd"
                  />
                </div>

                {/* Client Name */}
                <div>
                  <label className={labelStyles}>Client Name</label>
                  <input
                    // required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder="John Smith"
                  />
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label className={labelStyles}>Contact Email</label>
                  <input
                    // required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder="billing@client.com"
                  />
                </div>

                {/* GSTIN */}
                <div className="sm:col-span-2">
                  <label className={labelStyles}>Company GSTIN</label>
                  <input
                    name="companyGstin"
                    value={formData.companyGstin}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder="GSTIN Number"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className={labelStyles}>Billing Address</label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder="Street / Building"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className={labelStyles}>Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={inputStyles}
                  >
                    <option value="IN">India</option>
                  </select>
                </div>

                {/* State */}
                <div>
                  <label className={labelStyles}>State</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={inputStyles}
                  >
                    <option value="">Select State</option>

                    {State.getStatesOfCountry(formData.country || "IN").map(
                      (state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className={labelStyles}>City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!formData.state}
                    className={inputStyles}
                  >
                    <option value="">Select City</option>

                    {City.getCitiesOfState(
                      formData.country || "IN",
                      formData.state
                    ).map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ZIP */}
                <div>
                  <label className={labelStyles}>ZIP Code</label>
                  <input
                    name="zip"
                    value={formData?.zip?.slice(0, 6)}
                    onKeyDownCapture={handleKeyDown}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder="ZIP Code"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 mt-1 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-600 font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:scale-95 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, clientId: "", companyName: "" })
        }
        onConfirm={executeDelete}
        title="Delete Client"
        message={`Are you sure you want to remove ${deleteModal.companyName} from your directory? Invoices attached to this client will remain in your history, but the link to this profile will be broken.`}
        confirmText="Delete Client"
        isDanger={true}
      />
    </div>
  );
}
