"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";
import { City, State } from "country-state-city";
import { toast } from "sonner";
import { handleKeyDown } from "@/lib/InputKeyDown";
import LoadingComponent from "@/components/LoadingComponent";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "payment" | "account">(
    "profile"
  );
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
    name: "",
    companyName: "",
    companyAddress: "",
    city: "",
    state: "",
    zip: "",
    country: "IN",
    companyGstin: "",
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
          fetch("/api/user/payment"),
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
            country: p.country || "IN",
            companyGstin: p.companyGstin || "",
            name: p.name || "",
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

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

      if (res.ok) toast.success("Profile saved successfully!");
      else toast.error("Failed to save profile: " + data.message);
    } catch {
      toast.error("An error occurred while saving.");
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

      if (res.ok) toast.success("Payment details saved successfully!");
      else toast.error("Failed to save payment details: " + data.message);
    } catch {
      toast.error("An error occurred while saving.");
    } finally {
      setIsLoading(false);
    }
  };

  const executeDeleteHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/invoices/history-clear", {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) toast.success("History cleared successfully.");
      else toast.error("Failed: " + data.message);
    } catch {
      toast.error("Error clearing history.");
    } finally {
      setIsLoading(false);
    }
  };

  const executeDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/profile", { method: "DELETE" });
      if (res.ok) {
        toast.success("Account permanently deleted.");
        router.push("/");
      } else {
        toast.error("Failed to delete account.");
      }
    } catch {
      toast.error("Error deleting account.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDeleteHistory = () => {
    setModalConfig({
      isOpen: true,
      title: "Clear Invoice History?",
      message:
        "This will delete all generated invoices. Your clients, profile, and payment settings will remain safe. This action cannot be undone.",
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
      message:
        "Permanently remove your account, profile, logos, and all invoice data from our servers. This action is immediate and absolutely not reversible.",
      confirmText: "Permanently Delete",
      isDanger: true,
      action: executeDeleteAccount,
      requireInput: "DELETE",
    });
  };

  const inputStyles =
    "w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-2xl px-4 py-3 text-sm font-medium text-[hsl(var(--foreground))] outline-none transition-colors placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.18)]";

  const labelStyles =
    "mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]";
  if (isFetching) return <LoadingComponent text={"Loading Settings..."} />;

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[hsl(var(--background))]">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-1 text-[hsl(var(--foreground))]">
            Settings
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Manage your identity, payment details, and account preferences.
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-6 mb-8 border-b border-[hsl(var(--border))]">
          <button
            onClick={() => setActiveTab("profile")}
            className={`text-sm font-semibold pb-4 transition-colors relative ${
              activeTab === "profile"
                ? "text-[hsl(var(--primary))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            Profile
            {activeTab === "profile" && (
              <span className="absolute bottom-[-1px] left-0 w-full h-[2px] rounded-full bg-[hsl(var(--primary))]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("payment")}
            className={`text-sm font-semibold pb-4 transition-colors relative ${
              activeTab === "payment"
                ? "text-[hsl(var(--primary))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            Payment Details
            {activeTab === "payment" && (
              <span className="absolute bottom-[-1px] left-0 w-full h-[2px] rounded-full bg-[hsl(var(--primary))]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("account")}
            className={`text-sm font-semibold pb-4 transition-colors relative ${
              activeTab === "account"
                ? "text-[hsl(var(--destructive))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))]"
            }`}
          >
            Account Security
            {activeTab === "account" && (
              <span className="absolute bottom-[-1px] left-0 w-full h-[2px] rounded-full bg-[hsl(var(--destructive))]" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="space-y-10">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Info Panel */}
                <div className="lg:col-span-1">
                  <div className="lg:sticky lg:top-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                      Company Identity
                    </h3>

                    <p className="text-sm text-slate-500 leading-relaxed">
                      Information shown on invoices, receipts and documents.
                    </p>
                  </div>
                </div>

                {/* Form Card */}
                <div className="lg:col-span-2 bg-[hsl(var(--card))] p-5 sm:p-6 rounded-2xl border border-[hsl(var(--border))] shadow-sm space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <label className={labelStyles}>Company Logo</label>

                    <label className="mt-2 border border-dashed border-[hsl(var(--border))] rounded-2xl bg-[hsl(var(--muted)/0.45)] px-6 py-8 flex flex-col items-center justify-center hover:bg-[hsl(var(--accent))] hover:border-[hsl(var(--primary)/0.35)] transition cursor-pointer">
                      <div className="w-16 h-16 bg-[hsl(var(--card))] rounded-full flex items-center justify-center shadow-sm mb-3 overflow-hidden text-[hsl(var(--primary))]">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-2xl">
                            upload_file
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                        Upload company logo
                      </p>

                      <p className="text-xs mt-1 text-[hsl(var(--muted-foreground))]">
                        PNG, JPG or SVG
                      </p>

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                    </label>
                  </div>

                  {/* Company + Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyles}>Full Name</label>
                      <input
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        className={inputStyles}
                        placeholder="Your Name"
                      />
                    </div>

                    <div>
                      <label className={labelStyles}>Company Name</label>
                      <input
                        name="companyName"
                        value={profile.companyName}
                        onChange={handleProfileChange}
                        className={inputStyles}
                        placeholder="Company Name"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className={labelStyles}>Address</label>
                    <input
                      name="companyAddress"
                      value={profile.companyAddress}
                      onChange={handleProfileChange}
                      className={inputStyles}
                      placeholder="Street / Building"
                    />
                  </div>

                  {/* GSTIN + ZIP */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyles}>GSTIN</label>
                      <input
                        name="companyGstin"
                        value={profile.companyGstin}
                        onChange={handleProfileChange}
                        className={inputStyles}
                        placeholder="GSTIN Number"
                      />
                    </div>

                    <div>
                      <label className={labelStyles}>ZIP Code</label>
                      <input
                        name="zip"
                        value={profile.zip?.slice(0, 6)}
                        onKeyDownCapture={handleKeyDown}
                        onChange={handleProfileChange}
                        className={inputStyles}
                        placeholder="ZIP Code"
                      />
                    </div>
                  </div>

                  {/* Country + State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyles}>Country</label>

                      <select
                        name="country"
                        value={profile.country}
                        onChange={handleProfileChange}
                        className={inputStyles}
                      >
                        <option value="IN">India</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelStyles}>State</label>

                      <select
                        name="state"
                        value={profile.state}
                        onChange={handleProfileChange}
                        className={inputStyles}
                      >
                        <option value="">Select State</option>

                        {State.getStatesOfCountry(profile.country || "IN").map(
                          (state) => (
                            <option key={state.isoCode} value={state.isoCode}>
                              {state.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className={labelStyles}>City</label>

                    <select
                      name="city"
                      value={profile.city}
                      onChange={handleProfileChange}
                      disabled={!profile.state}
                      className={inputStyles}
                    >
                      <option value="">Select City</option>

                      {City.getCitiesOfState(
                        profile.country || "IN",
                        profile.state
                      ).map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Save */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                    >
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
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-base font-semibold text-slate-900 mb-1">
                    Payment Details
                  </h3>
                  <p className="text-sm text-slate-500">
                    Add payment methods shown on invoices.
                  </p>
                </div>

                <div className="md:col-span-2 bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))] space-y-5">
                  <div className="flex items-center gap-3 pb-4 border-b border-[hsl(var(--border))]">
                    <div className="px-3 py-2 rounded-lg bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]">
                      <span className="material-symbols-outlined">
                        account_balance
                      </span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-[hsl(var(--foreground))]">
                        Primary Account
                      </h4>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        Settlement destination
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className={labelStyles}>UPI ID</label>
                    <input
                      name="upiId"
                      value={payment.upiId}
                      onChange={handlePaymentChange}
                      className={inputStyles}
                      placeholder="yourname@upi"
                    />
                  </div>

                  <div>
                    <label className={labelStyles}>Account Holder Name</label>
                    <input
                      name="accountHolderName"
                      value={payment.accountHolderName}
                      onChange={handlePaymentChange}
                      className={inputStyles}
                      placeholder="Full Name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyles}>Bank Name</label>
                      <input
                        name="bankName"
                        value={payment.bankName}
                        onChange={handlePaymentChange}
                        className={inputStyles}
                        placeholder="Bank Name"
                      />
                    </div>

                    <div>
                      <label className={labelStyles}>Account Number</label>
                      <input
                        name="accountNumber"
                        value={payment.accountNumber}
                        onChange={handlePaymentChange}
                        className={inputStyles}
                        type="password"
                        placeholder="Account Number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelStyles}>IFSC / Routing Code</label>
                    <input
                      name="ifscCode"
                      value={payment.ifscCode}
                      onChange={handlePaymentChange}
                      className={inputStyles}
                      placeholder="IFSC Code"
                    />
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      onClick={handleSavePayment}
                      disabled={isLoading}
                      className="px-6 py-2.5 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium hover:opacity-90 active:scale-95 transition disabled:opacity-50"
                    >
                      {isLoading ? "Saving..." : "Save Payment Info"}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ACCOUNT TAB */}
          {activeTab === "account" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-base font-semibold text-red-600 mb-1">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-slate-500">
                    Permanent account actions.
                  </p>
                </div>

                <div className="md:col-span-2 space-y-5">
                  <div className="bg-white border border-red-200 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">
                        Clear Invoice History
                      </h4>
                      <p className="text-sm text-slate-500">
                        Remove all invoices permanently.
                      </p>
                    </div>

                    <button
                      onClick={triggerDeleteHistory}
                      disabled={isLoading}
                      className="px-5 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                    >
                      Clear History
                    </button>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-red-900 mb-1">
                        Delete Account
                      </h4>
                      <p className="text-sm text-red-700/80">
                        Permanently remove your account and data.
                      </p>
                    </div>

                    <button
                      onClick={triggerDeleteAccount}
                      disabled={isLoading}
                      className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                    >
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
        onClose={() =>
          setModalConfig((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
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
