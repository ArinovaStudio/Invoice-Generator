"use client";

import { useState, useEffect } from "react";
import ConfirmModal from "@/components/ConfirmModal";

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
    country: "India",
  });

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; clientId: string; companyName: string }>({
    isOpen: false,
    clientId: "",
    companyName: "",
  });

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
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

    const timeoutId = setTimeout(() => { fetchClients(); }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle Form Inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        country: client.country || "India",
      });
    } else {
      setEditingId(null);
      setFormData({ companyName: "", email: "", address: "", city: "", state: "", zip: "", country: "India" });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingId ? `/api/user/clients/${editingId}` : "/api/user/clients";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setIsFormOpen(false);
        const refreshRes = await fetch(searchQuery ? `/api/user/clients?search=${encodeURIComponent(searchQuery)}` : "/api/user/clients");
        const refreshData = await refreshRes.json();
        if (refreshData.success) setClients(refreshData.clients);
      } else {
        alert("Error: " + data.message);
      }
    } catch {
      alert("An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeDelete = async () => {
    try {
      const res = await fetch(`/api/user/clients/${deleteModal.clientId}`, { method: "DELETE" });
      if (res.ok) {
        setClients(clients.filter(c => c.id !== deleteModal.clientId));
      } else {
        const data = await res.json();
        alert("Failed to delete: " + data.message);
      }
    } catch {
      alert("Error deleting client.");
    }
  };

  const inputStyles = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all outline-none font-medium text-slate-900";
  const labelStyles = "text-[12px] uppercase tracking-wider font-bold text-slate-500 mb-2 block";

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-[#f8f9ff]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Clients</h2>
            <p className="text-slate-500 font-medium">Manage your client directory and billing details.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <input 
                type="text" 
                placeholder="Search clients..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all outline-none font-medium text-slate-900 shadow-sm"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            </div>
            
            <button onClick={() => openForm()} className="shrink-0 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-xl">add</span>
              Add Client
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold">Company / Client</th>
                  <th className="px-8 py-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold">Contact Email</th>
                  <th className="px-8 py-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold">Location</th>
                  <th className="px-8 py-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-12 text-slate-400 font-medium">Loading directory...</td></tr>
                ) : clients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-4xl text-slate-300">folder_open</span>
                        <p className="text-slate-500 font-medium">No clients found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5 font-bold text-slate-900">{client.companyName}</td>
                      <td className="px-8 py-5 text-slate-500 font-medium">{client.email || "—"}</td>
                      <td className="px-8 py-5 text-slate-500 font-medium">
                        {client.city ? `${client.city}, ${client.country}` : client.country}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openForm(client)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button onClick={() => setDeleteModal({ isOpen: true, clientId: client.id, companyName: client.companyName })} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-red-600 hover:border-red-200 shadow-sm transition-all">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">
                {editingId ? "Edit Client" : "New Client"}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelStyles}>Company / Client Name *</label>
                  <input required name="companyName" value={formData.companyName} onChange={handleChange} className={inputStyles} placeholder="Studio Vertex Architecture" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelStyles}>Contact Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputStyles} placeholder="billing@client.com" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelStyles}>Billing Address</label>
                  <input name="address" value={formData.address} onChange={handleChange} className={inputStyles} placeholder="Street Name, Building No." />
                </div>
                <div>
                  <label className={labelStyles}>City</label>
                  <input name="city" value={formData.city} onChange={handleChange} className={inputStyles} placeholder="City" />
                </div>
                <div>
                  <label className={labelStyles}>State / Province</label>
                  <input name="state" value={formData.state} onChange={handleChange} className={inputStyles} placeholder="State" />
                </div>
                <div>
                  <label className={labelStyles}>ZIP / Postal Code</label>
                  <input name="zip" value={formData.zip} onChange={handleChange} className={inputStyles} placeholder="ZIP" />
                </div>
                <div>
                  <label className={labelStyles}>Country</label>
                  <input name="country" value={formData.country} onChange={handleChange} className={inputStyles} placeholder="Country" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-3 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50">
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
        onClose={() => setDeleteModal({ isOpen: false, clientId: "", companyName: "" })}
        onConfirm={executeDelete}
        title="Delete Client"
        message={`Are you sure you want to remove ${deleteModal.companyName} from your directory? Invoices attached to this client will remain in your history, but the link to this profile will be broken.`}
        confirmText="Delete Client"
        isDanger={true}
      />
    </div>
  );
}