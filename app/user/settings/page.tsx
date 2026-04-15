"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "payment" | "account">("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    isDanger: boolean;
    requireInput?: string;
    action: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    isDanger: false,
    action: () => {},
  });

  const [profile, setProfile] = useState({
    companyName: "",
    companyAddress: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [payment, setPayment] = useState({
    upiId: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, paymentRes] = await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/user/payment")
        ]);

        const profileData = await profileRes.json();
        const paymentData = await paymentRes.json();

        if (profileData.success && profileData.profile) {
          const p = profileData.profile;
          setProfile({
            companyName: p.companyName || "",
            companyAddress: p.companyAddress || "",
            city: p.city || "",
            state: p.state || "",
            zip: p.zip || "",
            country: p.country || "India",
          });
          if (p.logoUrl) setLogoPreview(p.logoUrl);
        }

        if (paymentData.success && paymentData.paymentDetails) {
          const pd = paymentData.paymentDetails;
          setPayment({
            upiId: pd.upiId || "",
            bankName: pd.bankName || "",
            accountNumber: pd.accountNumber || "",
            ifscCode: pd.ifscCode || "",
            accountHolderName: pd.accountHolderName || "",
          });
        }
      } catch (error) {
        console.error("Failed to load settings data", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Action Handlers
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (logoFile) formData.append("logo", logoFile);

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) alert("Profile saved successfully!");
      else alert("Failed to save profile: " + data.message);
    } catch {
      alert("An error occurred while saving.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePayment = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment),
      });
      const data = await res.json();
      
      if (res.ok) alert("Payment details saved successfully!");
      else alert("Failed to save payment details: " + data.message);
    } catch {
      alert("An error occurred while saving.");
    } finally {
      setIsLoading(false);
    }
  };

  const executeDeleteHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/invoices/history-clear", { method: "DELETE" });
      const data = await res.json();
      if (res.ok) alert("History cleared successfully.");
      else alert("Failed: " + data.message);
    } catch {
      alert("Error clearing history.");
    } finally {
      setIsLoading(false);
    }
  };

  const executeDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/profile", { method: "DELETE" });
      if (res.ok) {
        alert("Account permanently deleted.");
        router.push("/");
      } else {
        alert("Failed to delete account.");
      }
    } catch {
      alert("Error deleting account.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDeleteHistory = () => {
    setModalConfig({
      isOpen: true,
      title: "Clear Invoice History?",
      message: "This will delete all generated invoices. Your clients, profile, and payment settings will remain safe. This action cannot be undone.",
      confirmText: "Clear History",
      isDanger: true,
      action: executeDeleteHistory,
      requireInput: undefined,
    });
  };

  const triggerDeleteAccount = () => {
    setModalConfig({
      isOpen: true,
      title: "Delete Account",
      message: "Permanently remove your account, profile, logos, and all invoice data from our servers. This action is immediate and absolutely not reversible.",
      confirmText: "Permanently Delete",
      isDanger: true,
      action: executeDeleteAccount,
      requireInput: "DELETE",
    });
  };

  const inputStyles = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all outline-none font-medium text-slate-900";
  const labelStyles = "text-[12px] uppercase tracking-wider font-bold text-slate-500 mb-2 block";

  if (isFetching) return <div className="p-12 text-center text-slate-500 font-medium">Loading settings...</div>;

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-[#f8f9ff]">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Settings</h2>
          <p className="text-slate-500 font-medium">Manage your identity, financial details, and account data.</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-8 mb-10 border-b border-slate-200">
          <button onClick={() => setActiveTab("profile")} className={`text-sm font-bold uppercase tracking-wider pb-4 transition-colors relative ${activeTab === "profile" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}>
            Profile
            {activeTab === "profile" && <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-blue-600 rounded-t-full"></span>}
          </button>
          <button onClick={() => setActiveTab("payment")} className={`text-sm font-bold uppercase tracking-wider pb-4 transition-colors relative ${activeTab === "payment" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}>
            Payment Details
            {activeTab === "payment" && <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-blue-600 rounded-t-full"></span>}
          </button>
          <button onClick={() => setActiveTab("account")} className={`text-sm font-bold uppercase tracking-wider pb-4 transition-colors relative ${activeTab === "account" ? "text-red-600" : "text-slate-400 hover:text-red-400"}`}>
            Account Security
            {activeTab === "account" && <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-red-600 rounded-t-full"></span>}
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-12">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Company Identity</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">This information will appear on all issued invoices and official documents.</p>
                </div>
                
                <div className="md:col-span-2 space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <div className="space-y-3">
                    <label className={labelStyles}>Company Logo</label>
                    <label className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-8 flex flex-col items-center justify-center group hover:bg-blue-50 transition-colors cursor-pointer block">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-blue-500 overflow-hidden group-hover:scale-110 transition-transform">
                        {logoPreview ? (
                           <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                           <span className="material-symbols-outlined text-3xl">upload_file</span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-slate-700">Click to upload logo</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG or SVG</p>
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                  </div>

                  <div>
                    <label className={labelStyles}>Company Name</label>
                    <input name="companyName" value={profile.companyName} onChange={handleProfileChange} className={inputStyles} placeholder="e.g. Studio Vertex Architecture" type="text" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={labelStyles}>Office Address</label>
                      <input name="companyAddress" value={profile.companyAddress} onChange={handleProfileChange} className={inputStyles} placeholder="Street Name, Building No." type="text" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelStyles}>City</label>
                        <input name="city" value={profile.city} onChange={handleProfileChange} className={inputStyles} placeholder="City" type="text" />
                      </div>
                      <div>
                        <label className={labelStyles}>State / Province</label>
                        <input name="state" value={profile.state} onChange={handleProfileChange} className={inputStyles} placeholder="State" type="text" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelStyles}>ZIP / Postal Code</label>
                        <input name="zip" value={profile.zip} onChange={handleProfileChange} className={inputStyles} placeholder="Zip Code" type="text" />
                      </div>
                      <div>
                        <label className={labelStyles}>Country</label>
                        <select name="country" value={profile.country} onChange={handleProfileChange} className={inputStyles}>
                          <option>India</option>
                          <option>United States</option>
                          <option>United Kingdom</option>
                          <option>Germany</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button onClick={handleSaveProfile} disabled={isLoading} className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
                      {isLoading ? "Saving..." : "Save Identity"}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* PAYMENT TAB */}
          {activeTab === "payment" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Payment Details</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Configure how you receive your payments. These will be added to your invoices.</p>
                </div>

                <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-[0px_12px_32px_rgba(11,28,48,0.04)] border border-slate-100 space-y-6">
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                      <span className="material-symbols-outlined text-2xl">account_balance</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Primary Account</h4>
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Settlement Destination</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className={labelStyles}>UPI ID (For QR Code)</label>
                      <div className="relative">
                        <input name="upiId" value={payment.upiId} onChange={handlePaymentChange} className={`${inputStyles} pl-12`} placeholder="yourname@upi" type="text" />
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">qr_code_scanner</span>
                      </div>
                    </div>
                    <div>
                      <label className={labelStyles}>Account Holder Name</label>
                      <input name="accountHolderName" value={payment.accountHolderName} onChange={handlePaymentChange} className={inputStyles} placeholder="Full Name on Account" type="text" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelStyles}>Bank Name</label>
                        <input name="bankName" value={payment.bankName} onChange={handlePaymentChange} className={inputStyles} placeholder="e.g. HDFC Bank" type="text" />
                      </div>
                      <div>
                        <label className={labelStyles}>Account Number</label>
                        <input name="accountNumber" value={payment.accountNumber} onChange={handlePaymentChange} className={inputStyles} placeholder="Account Number" type="password" />
                      </div>
                    </div>
                    <div>
                      <label className={labelStyles}>IFSC / Routing Code</label>
                      <input name="ifscCode" value={payment.ifscCode} onChange={handlePaymentChange} className={inputStyles} placeholder="Code" type="text" />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button onClick={handleSavePayment} disabled={isLoading} className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
                      {isLoading ? "Saving..." : "Save Payment Info"}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ACCOUNT TAB (DANGER ZONE) */}
          {activeTab === "account" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-bold text-red-600 mb-1">Danger Zone</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Irreversible actions regarding your account and data.</p>
                </div>

                <div className="md:col-span-2 space-y-6">
                  
                  {/* Delete History */}
                  <div className="bg-red-50/50 rounded-2xl p-8 border border-red-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Clear Invoice History</h4>
                      <p className="text-sm text-slate-500">Delete all generated invoices from your account. This action is permanent and cannot be undone. Your profile and payment settings will remain.</p>
                    </div>
                    <button onClick={triggerDeleteHistory} disabled={isLoading} className="shrink-0 px-6 py-3 rounded-xl bg-white text-red-600 font-bold border border-red-200 hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all">
                      Clear History
                    </button>
                  </div>

                  {/* Delete Account */}
                  <div className="bg-red-50 rounded-2xl p-8 border border-red-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <h4 className="font-bold text-red-900 mb-1">Delete Account</h4>
                      <p className="text-sm text-red-700/80">Permanently remove your account, profile, and all data from our servers. This action is immediate and not reversible.</p>
                    </div>
                    <button onClick={triggerDeleteAccount} disabled={isLoading} className="shrink-0 px-6 py-3 rounded-xl bg-red-600 text-white font-bold shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95 transition-all">
                      Delete Account
                    </button>
                  </div>

                </div>
              </section>
            </div>
          )}

        </div>
      </div>

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.action}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        isDanger={modalConfig.isDanger}
        requireInput={modalConfig.requireInput}
      />
    </div>
  );
}
