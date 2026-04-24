"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Info, ExternalLink, Plus, Trash2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import { useReactToPrint } from "react-to-print";
import { currencies } from "@/lib/currencies";
import { Country, State, City } from "country-state-city";
import validator from "validator";

export interface InvoiceLayoutProps {
  initialData?: any;
  mode?: "create" | "update";
  invoiceId?: string;
}

const themes = [
  { name: "black", color: "bg-black" },
  { name: "orange", color: "bg-orange-500" },
  { name: "blue", color: "bg-blue-600" },
  { name: "green", color: "bg-green-500" },
  { name: "red", color: "bg-red-600" },
];

const templates = [
  { name: "Standard", active: true },
  { name: "Spreadsheet" },
  { name: "Compact" },
  { name: "+80 more templates" },
];

const InlineInput = ({ className, emptyHidePrint, ...props }: any) => (
  <input
    className={cn(
      "bg-transparent hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded transition-colors px-1 -mx-1 w-full placeholder-gray-400 print:placeholder-transparent",
      emptyHidePrint && !props.value ? "print:hidden" : "",
      className
    )}
    {...props}
  />
);

const InlineTextarea = ({ className, emptyHidePrint, ...props }: any) => (
  <textarea
    className={cn(
      "bg-transparent hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded transition-colors px-1 -mx-1 w-full resize-none placeholder-gray-400 print:placeholder-transparent",
      emptyHidePrint && !props.value ? "print:hidden" : "",
      className
    )}
    {...props}
  />
);

export default function InvoiceLayout({ initialData, mode = "create", invoiceId }: InvoiceLayoutProps) {
  const router = useRouter();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [currentColor, setCurrentColor] = useState(themes[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSavedUpi, setHasSavedUpi] = useState(false);

  // Specific Loading States
  const [isSaving, setIsSaving] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [clients, setClients] = useState<any[]>([]);
  const [zipError, setZipError] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.senderLogoUrl || null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [invoice, setInvoice] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        clientId: initialData.clientId || "",
        tableDescLabel: initialData.tableDescLabel || "Item Description",
        tableQtyLabel: initialData.tableQtyLabel || "Qty",
        tableRateLabel: initialData.tableRateLabel || "Rate",
        tableTaxLabel: initialData.tableTaxLabel || "Tax %",
        tableHsnLabel: initialData.tableHsnLabel || "HSN",
        tableAmountLabel: initialData.tableAmountLabel || "Amount",
        items: initialData.items?.length ? initialData.items : [{ description: "", quantity: 1, rate: 0, taxRate: 0 }],
      };
    }

    return {
      title: "INVOICE",
      senderCompany: "",
      senderName: "",
      senderAddress: "",
      senderCityZip: "",
      senderCountry: "",
      clientId: "",
      clientCompany: "",
      clientName: "",
      clientAddress: "",
      clientCity: "",
      clientState: "",
      clientZip: "",
      clientCountry: "IN",
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],

      tableDescLabel: "Item Description",
      tableHsnLabel: "HSN",
      tableQtyLabel: "Qty",
      tableRateLabel: "Rate",
      tableTaxLabel: "Tax %",
      tableAmountLabel: "Amount",

      items: [{ description: "", quantity: 1, rate: 0, taxRate: 0 }],

      notesTitle: "Notes",
      notes: "It was great doing business with you.",
      termsTitle: "Terms & Conditions",
      terms: "Please make the payment by the due date.",
      paymentUpiId: "",
      includeQrCode: false,
    };
  });

  useEffect(() => {
    const fetchDefaults = async () => {
      try {
        const [profileRes, paymentRes, clientsRes] = await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/user/payment"),
          fetch("/api/user/clients")
        ]);
        console.log("testee");

        if (profileRes.ok) {
          console.log(profileRes, "profileecaw");

          setIsLoggedIn(true);
          const profileData = await profileRes.json();
          const user = profileData.profile || {};

          if (mode === "create") {
            if (user.logoUrl) setLogoPreview(user.logoUrl);
            setInvoice((prev: any) => ({
              ...prev,
              senderCompany: user.companyName || "",
              senderName: user.name || "",
              senderAddress: user.companyAddress || "",
              senderCityZip: `${user.city || ""} ${user.zip || ""}`.trim(),
              senderCountry: user.country || "India",
            }));
          }
        }

        if (paymentRes.ok) {
          const paymentData = await paymentRes.json();
          if (paymentData.paymentDetails?.upiId) {
            setHasSavedUpi(true);
            if (mode === "create") {
              setInvoice((prev: any) => ({
                ...prev,
                paymentUpiId: paymentData.paymentDetails.upiId,
                includeQrCode: true,
              }));
            }
          }
        }

        if (clientsRes.ok) {
          const clientsData = await clientsRes.json();
          setClients(clientsData.clients || []);
        }
      } catch (error) {
        console.error("Failed to load user defaults", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDefaults();
  }, [mode]);

  // const handleDownloadPDF = useReactToPrint({
  //   contentRef: invoiceRef,
  //   documentTitle: invoice.invoiceNumber,
  //   pageStyle: `@page { size: A4 portrait; margin: 10mm; } @media print { body { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`,
  // });

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const { domToJpeg } = await import("modern-screenshot");
      const { jsPDF } = await import("jspdf");

      const element = invoiceRef.current;

      const originalShadow = element.style.boxShadow;
      const originalBorder = element.style.border;
      const originalRadius = element.style.borderRadius;

      element.style.boxShadow = "none";
      element.style.border = "none";
      element.style.borderRadius = "0";

      const dataUrl = await domToJpeg(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        width: element.scrollWidth,
        height: element.scrollHeight,
        filter: (node) =>
          !(
            node instanceof HTMLElement &&
            node.classList.contains("print:hidden")
          ),
      });

      element.style.boxShadow = originalShadow;
      element.style.border = originalBorder;
      element.style.borderRadius = originalRadius;

      const pdf = new jsPDF("p", "mm", "a4");

      const margin = 10;
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const printWidth = pdfPageWidth - margin * 2;

      const imgProps = pdf.getImageProperties(dataUrl);
      const printHeight =
        (imgProps.height * printWidth) / imgProps.width;

      pdf.addImage(
        dataUrl,
        "JPEG",
        margin,
        margin,
        printWidth,
        printHeight,
        undefined,
        "FAST"
      );

      pdf.save(`${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("Failed to download PDF");
    }
  };

  const handleChange = (e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >) => {
    const { name, value } = e.target;
    if (name.startsWith("client")) {
      // If user types manually, unlink the saved clientId
      setInvoice((prev: any) => ({ ...prev, [name]: value, clientId: "" }));
    } else {
      setInvoice((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setInvoice((prev: any) => ({
        ...prev,
        clientId: "",
        clientCompany: "",
        clientName: "",
        clientAddress: "",
        clientCityZip: "",
        clientCountry: "India"
      }));
      return;
    }
    const client = clients.find(c => c.id === selectedId);
    if (client) {
      setInvoice((prev: any) => ({
        ...prev,
        clientId: client.id,
        clientCompany: client.companyName || "",
        clientName: client.contactName || client.name || "",
        clientAddress: client.address || "",
        clientCityZip: `${client.city || ""} ${client.state || ""} ${client.zip || ""}`.trim(),
        clientCountry: client.country || "India",
      }));
    }
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoice((prev: any) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoice((prev: any) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, rate: 0, taxRate: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    if (invoice.items.length === 1) return;
    setInvoice((prev: any) => ({
      ...prev,
      items: prev.items.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const totals = invoice.items.reduce(
    (acc: any, item: any) => {
      const itemBase = item.quantity * item.rate;
      const itemTax = itemBase * ((item.taxRate || 0) / 100);
      return {
        subTotal: acc.subTotal + itemBase,
        taxTotal: acc.taxTotal + itemTax,
        total: acc.total + itemBase + itemTax,
      };
    },
    { subTotal: 0, taxTotal: 0, total: 0 }
  );

  const handleSave = async (): Promise<boolean> => {
    try {
      const formData = new FormData();

      const dataToSave = { ...invoice };

      if (!dataToSave.clientId || dataToSave.clientId === "") {
        delete dataToSave.clientId;
      }

      formData.append("data", JSON.stringify(dataToSave));
      if (logoFile) formData.append("logo", logoFile);

      const url = mode === "create" ? "/api/user/invoices" : `/api/user/invoices/${invoiceId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, { method, body: formData });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save");
      }

      return true;
    } catch (error) {
      console.error(error);
      alert("Failed to save invoice. Check the console for exact backend errors.");
      return false;
    }
  };

  const handleSendEmail = async () => {
    if (!invoiceRef.current) return;

    const defaultEmail = invoice.clientName
      ? invoice.clientName.toLowerCase().replace(/\s/g, '') + "@gmail.com"
      : "";
    const actualEmail = prompt(`Confirm recipient's email address:`, defaultEmail);
    if (!actualEmail) return;

    try {
      const { domToJpeg } = await import("modern-screenshot");
      const { jsPDF } = await import("jspdf");

      const element = invoiceRef.current;

      const originalShadow = element.style.boxShadow;
      const originalBorder = element.style.border;
      const originalRadius = element.style.borderRadius;

      element.style.boxShadow = 'none';
      element.style.border = 'none';
      element.style.borderRadius = '0';

      const dataUrl = await domToJpeg(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        filter: (node) => !(node instanceof HTMLElement && node.classList.contains('print:hidden'))
      });

      element.style.boxShadow = originalShadow;
      element.style.border = originalBorder;
      element.style.borderRadius = originalRadius;

      const pdf = new jsPDF("p", "mm", "a4");

      const margin = 10;
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const printWidth = pdfPageWidth - (margin * 2);

      const imgProps = pdf.getImageProperties(dataUrl);
      const printHeight = (imgProps.height * printWidth) / imgProps.width;

      pdf.addImage(dataUrl, "JPEG", margin, margin, printWidth, printHeight, undefined, 'FAST');
      const pdfBlob = pdf.output("blob");

      const formData = new FormData();
      formData.append("pdf", pdfBlob, `${invoice.invoiceNumber}.pdf`);
      formData.append("toEmail", actualEmail);
      formData.append("clientName", invoice.clientName || invoice.clientCompany || "Client");
      formData.append("invoiceNumber", invoice.invoiceNumber);

      const senderName = invoice.senderCompany || invoice.senderName || "Invoice Generator";
      formData.append("senderName", senderName);

      if (invoiceId || invoice.id) formData.append("invoiceId", invoiceId || invoice.id);

      const res = await fetch("/api/user/invoices/send", { method: "POST", body: formData });
      const result = await res.json();

      if (result.success) alert("Email sent successfully!");
      else alert("Failed to send email: " + result.message);

    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Error processing PDF for email.");
    }
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    const success = await handleSave();
    if (success) {
      alert(mode === "create" ? "Invoice Saved!" : "Invoice Updated!");
    }
    setIsSaving(false);
  };

  const handleEmailClick = async () => {
    setIsEmailing(true);
    await handleSendEmail();
    setIsEmailing(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/user/invoices/${invoiceId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/user/invoices");
      } else {
        alert("Failed to delete invoice");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    console.log("log", isLoggedIn);

  }, [isLoggedIn]);

  const isAnyActionProcessing = isSaving || isEmailing || isDeleting;

  return (
    <div className="w-full py-10 px-6 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-6xl justify-center flex flex-wrap lg:flex-nowrap gap-6">

        {/* LEFT - Invoice Section */}
        <div className="flex-2 w-full lg:max-w-3xl">
          <Card className="p-10 shadow-lg border bg-white rounded-xl">
            <CardContent className="space-y-8 p-0" ref={invoiceRef}>

              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="space-y-1 text-sm text-gray-800 w-1/2">
                  <label className="cursor-pointer mb-4 w-32 h-20 border border-dashed border-gray-300 rounded flex items-center justify-center overflow-hidden hover:bg-gray-50 transition-colors">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs text-gray-400">Upload Logo</span>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>

                  <div className="font-medium">
                    <InlineInput name="senderCompany" placeholder="Your Company" value={invoice.senderCompany} onChange={handleChange} className="font-semibold text-base" />
                  </div>
                  <InlineInput name="senderName" placeholder="Your Name" value={invoice.senderName} onChange={handleChange} />
                  <InlineInput name="senderAddress" placeholder="Company's Address" value={invoice.senderAddress} onChange={handleChange} />
                  <InlineInput name="senderGSTIN" placeholder="Company's GSTIN" value={invoice.senderGSTIN} onChange={handleChange} />
                  {/* Country Dropdown */}
                  <select
                    name="clientCountry"
                    value={invoice.clientCountry || "IN"}
                    onChange={handleChange}
                    className="w-full bg-transparent hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded px-1 text-gray-700"
                  >
                    <option value="">Select Country</option>

                    {Country.getAllCountries().map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>

                  {/* State Dropdown */}
                  <select
                    name="clientState"
                    value={invoice.clientState}
                    onChange={handleChange}
                    disabled={!invoice.clientCountry}
                    className="w-full bg-transparent hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded px-1 text-gray-700 disabled:opacity-50"
                  >
                    <option value="">Select State</option>

                    {State.getStatesOfCountry(invoice.clientCountry).map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>

                  {/* City Dropdown */}
                  <select
                    name="clientCity"
                    value={invoice.clientCity}
                    onChange={handleChange}
                    disabled={!invoice.clientState}
                    className="w-full bg-transparent hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded px-1 text-gray-700 disabled:opacity-50"
                  >
                    <option value="">Select City</option>

                    {City.getCitiesOfState(
                      invoice.clientCountry,
                      invoice.clientState
                    ).map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>

                  {/* ZIP / Postal Code */}
                  <div>
                    <InlineInput
                      name="clientZip"
                      placeholder="Client ZIP / Postal Code"
                      value={invoice.clientZip}
                      onChange={handleChange}
                      onBlur={() => {
                        if (!invoice.clientZip || !invoice.clientCountry) {
                          setZipError("");
                          return;
                        }

                        try {
                          const isValid = validator.isPostalCode(
                            invoice.clientZip,
                            invoice.clientCountry as any
                          );

                          if (!isValid) {
                            setZipError("Invalid ZIP / Postal Code");
                          } else {
                            setZipError("");
                          }
                        } catch {
                          setZipError("");
                        }
                      }}
                      className={cn(
                        zipError
                          ? "border border-red-400 focus:ring-red-500"
                          : ""
                      )}
                    />
                    {zipError && (
                      <p className="text-xs text-red-500 mt-1">
                        {zipError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right w-1/2">
                  <InlineInput
                    name="title"
                    value={invoice.title}
                    onChange={handleChange}
                    className="text-4xl font-light tracking-wide text-right uppercase mb-4 text-gray-800"
                    placeholder="INVOICE"
                  />
                </div>
              </div>

              {/* Billing */}
              <div className="flex justify-between text-sm mt-8">
                {/* <div className="w-1/2 pr-4 space-y-1">
                  <p className="font-semibold text-gray-800 mb-1">Bill To:</p>
                  <InlineInput name="clientCompany" placeholder="Your Client's Company" value={invoice.clientCompany} onChange={handleChange} className="font-medium" />
                  <InlineInput name="clientName" placeholder="Client Name" value={invoice.clientName} onChange={handleChange} />
                  <InlineInput name="clientAddress" placeholder="Client's Address" value={invoice.clientAddress} onChange={handleChange} />
                  <InlineInput name="clientGSTIN" placeholder="Client's GSTIN" value={invoice.clientGSTIN} onChange={handleChange} />
                  <InlineInput name="clientCountry" placeholder="Client's Country" value={invoice.clientCountry} onChange={handleChange} />
                  <InlineInput name="clientState" placeholder="Client's State" value={invoice.clientState} onChange={handleChange} />
                  <InlineInput name="clientCity" placeholder="Client's City" value={invoice.clientCity} onChange={handleChange} />
                  <InlineInput name="clientZip" placeholder="Client's Zip" value={invoice.clientZip} onChange={handleChange} />

                </div> */}

                <div className="w-1/2 pr-4 space-y-1">
                  <p className="font-semibold text-gray-800 mb-1">Bill To:</p>

                  <InlineInput
                    name="clientCompany"
                    placeholder="Your Client's Company"
                    value={invoice.clientCompany}
                    onChange={handleChange}
                    className="font-medium"
                  />

                  <InlineInput
                    name="clientName"
                    placeholder="Client Name"
                    value={invoice.clientName}
                    onChange={handleChange}
                  />

                  <InlineInput
                    name="clientAddress"
                    placeholder="Client's Address"
                    value={invoice.clientAddress}
                    onChange={handleChange}
                  />

                  <InlineInput
                    name="clientGSTIN"
                    placeholder="Client's GSTIN"
                    value={invoice.clientGSTIN}
                    onChange={handleChange}
                  />

                  {/* Country Dropdown */}
                  <select
                    name="clientCountry"
                    value={invoice.clientCountry || "IN"}
                    onChange={handleChange}
                    className="w-full bg-transparent hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded px-1 text-gray-700"
                  >
                    <option value="">Select Country</option>

                    {Country.getAllCountries().map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>

                  {/* State Dropdown */}
                  <select
                    name="clientState"
                    value={invoice.clientState}
                    onChange={handleChange}
                    disabled={!invoice.clientCountry}
                    className="w-full bg-transparent hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded px-1 text-gray-700 disabled:opacity-50"
                  >
                    <option value="">Select State</option>

                    {State.getStatesOfCountry(invoice.clientCountry).map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>

                  {/* City Dropdown */}
                  <select
                    name="clientCity"
                    value={invoice.clientCity}
                    onChange={handleChange}
                    disabled={!invoice.clientState}
                    className="w-full bg-transparent hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded px-1 text-gray-700 disabled:opacity-50"
                  >
                    <option value="">Select City</option>

                    {City.getCitiesOfState(
                      invoice.clientCountry,
                      invoice.clientState
                    ).map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>

                  {/* ZIP / Postal Code */}
                  <div>
                    <InlineInput
                      name="clientZip"
                      placeholder="Client ZIP / Postal Code"
                      value={invoice.clientZip}
                      onChange={handleChange}
                      onBlur={() => {
                        if (!invoice.clientZip || !invoice.clientCountry) {
                          setZipError("");
                          return;
                        }

                        try {
                          const isValid = validator.isPostalCode(
                            invoice.clientZip,
                            invoice.clientCountry as any
                          );

                          if (!isValid) {
                            setZipError("Invalid ZIP / Postal Code");
                          } else {
                            setZipError("");
                          }
                        } catch {
                          setZipError("");
                        }
                      }}
                      className={cn(
                        zipError
                          ? "border border-red-400 focus:ring-red-500"
                          : ""
                      )}
                    />
                    {zipError && (
                      <p className="text-xs text-red-500 mt-1">
                        {zipError}
                      </p>
                    )}
                  </div>
                </div>


                <div className="text-right space-y-2 w-[200px]">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Invoice#</span>
                    <InlineInput name="invoiceNumber" value={invoice.invoiceNumber} onChange={handleChange} className="text-right w-24 font-medium" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Date</span>
                    <InlineInput type="date" name="issueDate" value={invoice.issueDate} onChange={handleChange} className="text-right w-32" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Due Date</span>
                    <InlineInput type="date" name="dueDate" value={invoice.dueDate} onChange={handleChange} className="text-right w-32" />
                  </div>
                </div>
              </div>

              {/* Table */}

              {/* <div className="border rounded-md overflow-hidden mt-8">
                <div className={`grid grid-cols-12 ${currentColor.color} text-white text-sm font-medium p-1 items-center`}>
                  <div className="col-span-5 pl-1">
                    <input name="tableDescLabel" value={invoice.tableDescLabel} onChange={handleChange} className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 -mx-1 w-full placeholder-white/70" />
                  </div>
                  <div className="col-span-2 px-1">
                    <input name="tableQtyLabel" value={invoice.tableQtyLabel} onChange={handleChange} className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 -mx-1 w-full text-center placeholder-white/70" />
                  </div>
                  <div className="col-span-2 px-1">
                    <input name="tableRateLabel" value={invoice.tableRateLabel} onChange={handleChange} className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 -mx-1 w-full text-right placeholder-white/70" />
                  </div>
                  <div className="col-span-1 px-1">
                    <input name="tableTaxLabel" value={invoice.tableTaxLabel} onChange={handleChange} className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 -mx-1 w-full text-center placeholder-white/70" />
                  </div>
                  <div className="col-span-2 pr-1 text-right">
                    <input name="tableAmountLabel" value={invoice.tableAmountLabel} onChange={handleChange} className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 -mx-1 w-full text-right placeholder-white/70" />
                  </div>
                </div>

                {invoice.items.map((item: any, i: number) => (
                  <div key={i} className="grid grid-cols-12 text-sm p-2 border-t items-start group">
                    <div className="col-span-5 pr-2">
                      <InlineTextarea
                        rows={1}
                        value={item.description}
                        onChange={(e: any) => handleItemChange(i, "description", e.target.value)}
                        placeholder="Enter item name/description"
                        className="text-gray-700 min-h-[32px]"
                      />
                    </div>
                    <div className="col-span-2 px-1">
                      <InlineInput
                        type="number"
                        value={item.quantity || ""}
                        onChange={(e: any) => handleItemChange(i, "quantity", Number(e.target.value))}
                        className="text-center"
                      />
                    </div>
                    <div className="col-span-2 px-1 relative">
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 print:hidden pointer-events-none">{selectedCurrency.symbol}</div>
                      <InlineInput
                        type="number"
                        value={item.rate || ""}
                        onChange={(e: any) => handleItemChange(i, "rate", Number(e.target.value))}
                        className="text-right pl-6"
                      />
                    </div>
                    <div className="col-span-1 px-1">
                      <InlineInput
                        type="number"
                        value={item.taxRate || ""}
                        onChange={(e: any) => handleItemChange(i, "taxRate", Number(e.target.value))}
                        className="text-center"
                      />
                    </div>
                    <div className="col-span-2 text-right py-1 flex justify-end items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {((item.quantity * item.rate) * (1 + (item.taxRate || 0) / 100)).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(i)}
                        className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity print:hidden w-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div> */}

              <div className="border rounded-sm overflow-hidden mt-8">
                {/* Table Header */}
                <div
                  className={`grid grid-cols-14 ${currentColor.color} text-white text-sm font-medium py-2 px-4 items-center`}
                >
                  {/* Description */}
                  <div className="col-span-5 pr-2">
                    <input
                      name="tableDescLabel"
                      value={invoice.tableDescLabel}
                      onChange={handleChange}
                      placeholder="Item Description"
                      className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full placeholder-white/70"
                    />
                  </div>

                  {/* Qty */}
                  <div className="col-span-1 text-center">
                    <input
                      name="tableQtyLabel"
                      value={invoice.tableQtyLabel}
                      onChange={handleChange}
                      placeholder="Qty"
                      className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full text-center placeholder-white/70"
                    />
                  </div>

                  {/* Rate */}
                  <div className="col-span-2 text-right px-1">
                    <input
                      name="tableRateLabel"
                      value={invoice.tableRateLabel}
                      onChange={handleChange}
                      placeholder="Rate"
                      className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full text-right placeholder-white/70"
                    />
                  </div>

                  {/* Tax */}
                  <div className="col-span-2 text-center">
                    <input
                      name="tableTaxLabel"
                      value={invoice.tableTaxLabel}
                      onChange={handleChange}
                      placeholder="Tax %"
                      className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full text-center placeholder-white/70"
                    />
                  </div>

                  {/* HSN */}
                  <div className="col-span-1 text-center px-1">
                    <input
                      name="tableHsnLabel"
                      value={invoice.tableHsnLabel}
                      onChange={handleChange}
                      placeholder="HSN"
                      className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full text-center placeholder-white/70"
                    />
                  </div>

                  {/* Amount */}
                  <div className="col-span-2 text-right pl-2">
                    <input
                      name="tableAmountLabel"
                      value={invoice.tableAmountLabel}
                      onChange={handleChange}
                      placeholder="Amount"
                      className="bg-transparent hover:bg-white/20 focus:bg-white/20 focus:outline-none rounded px-1 w-full text-right placeholder-white/70"
                    />
                  </div>
                </div>

                {/* Table Rows */}
                {invoice.items.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="grid grid-cols-13 text-sm py-2 px-4 border-t items-start group"
                  >
                    {/* Description */}
                    <div className="col-span-5 pr-2">
                      <InlineTextarea
                        rows={1}
                        value={item.description}
                        onChange={(e: any) =>
                          handleItemChange(i, "description", e.target.value)
                        }
                        placeholder="Enter item name/description"
                        className="text-gray-700 min-h-[32px]"
                      />
                    </div>

                    {/* Qty */}
                    <div className="col-span-1 px-1">
                      <InlineInput
                        type="number"
                        value={item.quantity || ""}
                        onChange={(e: any) =>
                          handleItemChange(i, "quantity", Number(e.target.value))
                        }
                        className="text-center"
                      />
                    </div>

                    {/* Rate */}
                    <div className="col-span-2 px-1 relative">
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 print:hidden pointer-events-none">
                        {selectedCurrency.symbol}
                      </div>

                      <InlineInput
                        type="number"
                        value={item.rate || ""}
                        onChange={(e: any) =>
                          handleItemChange(i, "rate", Number(e.target.value))
                        }
                        className="text-right pl-6"
                      />
                    </div>

                    {/* Tax */}
                    <div className="col-span-2 px-1">
                      <InlineInput
                        type="number"
                        value={item.taxRate || ""}
                        onChange={(e: any) =>
                          handleItemChange(i, "taxRate", Number(e.target.value))
                        }
                        className="text-center"
                      />
                    </div>

                    {/* HSN */}
                    <div className="col-span-1 px-1">
                      <InlineInput
                        value={item.hsn || ""}
                        onChange={(e: any) =>
                          handleItemChange(i, "hsn", e.target.value)
                        }
                        placeholder="HSN"
                        className="text-center"
                      />
                    </div>

                    {/* Amount */}
                    <div className="col-span-2 text-right py-1 flex justify-end items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {(
                          item.quantity *
                          item.rate *
                          (1 + (item.taxRate || 0) / 100)
                        ).toFixed(2)}
                      </span>

                      <button
                        onClick={() => removeItem(i)}
                        className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity print:hidden w-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addItem}
                className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:text-blue-800 transition-colors print:hidden"
              >
                <Plus className="w-4 h-4" /> Add Line Item
              </button>

              {/* Totals & Extra Info Container */}
              <div className="flex justify-between items-end mt-8">

                {/* Notes & Terms */}
                <div className="w-[50%] space-y-6">
                  {/* <div>
                    <InlineInput
                      name="notesTitle"
                      value={invoice.notesTitle}
                      onChange={handleChange}
                      className="font-medium text-gray-800 mb-1"
                      placeholder="Notes"
                      emptyHidePrint
                    />
                    <InlineTextarea
                      name="notes"
                      value={invoice.notes}
                      onChange={handleChange}
                      className="text-sm text-gray-600 h-10"
                      placeholder="Add any notes here..."
                      emptyHidePrint
                    />
                  </div>

                  <div>
                    <InlineInput
                      name="termsTitle"
                      value={invoice.termsTitle}
                      onChange={handleChange}
                      className="font-medium text-gray-800 mb-1"
                      placeholder="Terms & Conditions"
                      emptyHidePrint
                    />
                    <InlineTextarea
                      name="terms"
                      value={invoice.terms}
                      onChange={handleChange}
                      className="text-sm text-gray-600 h-10"
                      placeholder="Add terms and conditions..."
                      emptyHidePrint
                    />
                  </div> */}

                  {/* QR Code display on Invoice */}
                  {/* {invoice.includeQrCode && invoice.paymentUpiId && (
                    <div className="mt-4 flex items-center gap-4 p-3 border rounded-lg bg-gray-50/50 w-max">
                      <div className="bg-white p-1.5 rounded border shadow-sm">
                        <QRCodeSVG value={`upi://pay?pa=${invoice.paymentUpiId}&pn=${encodeURIComponent(invoice.senderCompany || invoice.senderName)}&am=${totals.total.toFixed(2)}&cu=${selectedCurrency.code}`} size={64} level="H" />
                      </div>
                      <div className="text-sm">
                        <p className="font-bold text-gray-800">Scan to Pay</p>
                        <p className="text-gray-500 font-mono text-xs mt-0.5">{invoice.paymentUpiId}</p>
                      </div>
                    </div>
                  )} */}
                </div>

                {/* Calculation Totals */}
                {/* <div className="w-64 space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sub Total</span>
                    <span className="font-medium text-gray-800">{selectedCurrency.symbol}{totals.subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">Tax Total</span>
                    <span className="font-medium text-gray-800">{selectedCurrency.symbol}{totals.taxTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-3 text-gray-900">
                    <span>Total</span>
                    <span>{selectedCurrency.symbol}{totals.total.toFixed(2)}</span>
                  </div>
                </div> */}
              </div>

              <div className="flex justify-between items-start mt-8 gap-8">
                {/* Left Section */}
                <div className="flex-1 max-w-[50%]">
                  <div>
                    <InlineInput
                      name="termsTitle"
                      value={invoice.termsTitle}
                      onChange={handleChange}
                      className="font-medium text-gray-800 mb-1"
                      placeholder="Terms & Conditions"
                      emptyHidePrint
                    />

                    <InlineTextarea
                      name="terms"
                      value={invoice.terms}
                      onChange={handleChange}
                      className="text-sm text-gray-600 min-h-[60px]"
                      placeholder="Add terms and conditions..."
                      emptyHidePrint
                    />
                  </div>
                </div>

                {/* Right Section */}
                <div className="shrink-0 space-y-5 -mt-6 ">
                  {/* QR Card */}
                  <div className="flex-col justify-end">
                    <div>
                      {invoice.includeQrCode && invoice.paymentUpiId && (
                        <div className=" rounded-2xl p-4 bg-white">
                          {/* Top Row */}
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-gray-400 font-normal text-sm uppercase w-full text-center">
                              Scan to Pay
                            </p>

                            {/* <p className="text-gray-500 font-mono text-xs truncate max-w-[130px]">
                          {invoice.paymentUpiId}
                        </p> */}
                          </div>

                          {/* QR + Button */}
                          <div className="flex-col items-center justify-between">
                            <div className="bg-white rounded-lg mb-3">
                              <QRCodeSVG
                                value={`upi://pay?pa=${invoice.paymentUpiId}&pn=${encodeURIComponent(
                                  invoice.senderCompany || invoice.senderName
                                )}&am=${totals.total.toFixed(2)}&cu=${selectedCurrency.code}`}
                                size={162}
                                level="H"
                              />
                            </div>
                            <p className="text-gray-500 font-mono text-xs truncate text-center mb-3">
                              {invoice.paymentUpiId}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                const upiLink = `upi://pay?pa=${invoice.paymentUpiId}&am=${totals.total.toFixed(
                                  2
                                )}&cu=INR&tn=${encodeURIComponent(
                                  `Payment of ${invoice.senderCompany || invoice.senderName}`
                                )}`;

                                window.location.href = upiLink;
                              }}
                              className="
                          bg-orange-500
                          hover:bg-orange-600
                          text-white
                          text-sm
                          font-medium
                          px-13
                          py-2.5
                          rounded-md
                          cursor-pointer
                          border
                          border-orange-400
                          transition-all
                          duration-300
                          whitespace-nowrap
                          shadow-[6px_6px_12px_rgba(180,120,40,0.25),-6px_-6px_12px_rgba(255,255,255,0.9)]
                          active:shadow-[inset_4px_4px_12px_rgba(180,120,40,0.25),inset_-4px_-4px_12px_rgba(255,255,255,0.8)]
                          active:text-orange-100
  "
                            >
                              Tap to Pay
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      {/* Totals */}
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center  w-[290px]">
                          <span className="text-gray-600">
                            Sub Total
                          </span>
                          <span className="font-medium text-gray-800">
                            {selectedCurrency.symbol}
                            {totals.subTotal.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            Tax Total
                          </span>
                          <span className="font-medium text-gray-800">
                            {selectedCurrency.symbol}
                            {totals.taxTotal.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between font-bold text-base border-t pt-3 text-gray-900">
                          <span>Total</span>
                          <span>
                            {selectedCurrency.symbol}
                            {totals.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-gray-300">
                <div className="flex items-center justify-center gap-5 mt-6">
                  {/* Created By Text */}
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold tracking-[0.18em] text-gray-700 uppercase">
                      Created By
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-8 w-px bg-gray-400 " />

                  {/* Logo */}
                  <div className="flex items-center">
                    <img
                      src="/logo_transparent.png"
                      alt="Logo"
                      width={160}
                      height={50}
                      className="h-8  w-auto object-contain"
                    />
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* RIGHT - Sticky Panel */}
        <div className="relative w-full lg:w-80">
          <div className="sticky top-10">
            <Card className="p-6 border shadow-sm bg-white rounded-xl">
              <CardContent className="p-0 space-y-6">

                {/* Header */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Invoice Settings
                  </h3>
                  <div className="h-px bg-gray-100 mt-4" />
                </div>

                {/* Load Client Dropdown (Only for Logged-In Users) */}
                {isLoggedIn && clients.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">Load Client</p>
                    <select
                      value={invoice.clientId || ""}
                      onChange={handleClientSelect}
                      className="w-full text-sm border-gray-200 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 border outline-none cursor-pointer"
                    >
                      <option value="">-- Select saved client --</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.companyName}</option>
                      ))}
                    </select>
                    <div className="h-px bg-gray-100 pt-2" />
                  </div>
                )}

                {/* Theme */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Theme Color</p>
                  <div className="flex items-center gap-3">
                    {themes.map((t) => (
                      <div key={t.name} onClick={() => setCurrentColor(t)} className="relative">
                        <div className={cn("w-6 h-6 rounded-full cursor-pointer shadow-sm hover:scale-110 transition-transform", t.color)} />
                        {t.name === currentColor.name && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="h-px bg-gray-100 pt-2" />
                </div>

                {/* Currency Selector */}
                {/* <div className="space-y-3 pt-2">
                  <p className="text-sm font-medium text-gray-700">Currency</p>
                  <select
                    value={selectedCurrency.code}
                    onChange={(e) => setSelectedCurrency(currencies.find(c => c.code === e.target.value) || currencies[0])}
                    className="w-full text-sm border-gray-200 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 border outline-none cursor-pointer"
                  >
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>{c.name} ({c.symbol})</option>
                    ))}
                  </select>
                  <div className="h-px bg-gray-100 pt-2" />
                </div> */}

                {/* Templates */}
                {/* <div className="grid grid-cols-2 gap-3 pt-2">
                  {templates.map((t) => (
                    <div key={t.name} className="text-center space-y-2">
                      <div
                        className={cn(
                          "rounded-lg border p-2 h-24 flex items-center justify-center bg-gray-50 cursor-pointer transition-all",
                          t.active ? "border-blue-500 ring-1 ring-blue-500 shadow-sm" : "border-gray-200 hover:border-blue-300"
                        )}
                      >
                        <div className="w-full h-full flex flex-col gap-1.5 opacity-70">
                          <div className="h-1.5 bg-gray-300 w-1/3 rounded-full" />
                          <div className="h-1.5 bg-gray-300 w-1/4 rounded-full" />
                          <div className="flex-1 border border-gray-200 rounded bg-white mt-1" />
                        </div>
                      </div>
                      <p className={cn("text-xs font-medium", t.active ? "text-blue-600" : "text-gray-600")}>
                        {t.name}
                        {t.name.includes("more") && <ExternalLink className="inline w-3 h-3 ml-1" />}
                      </p>
                    </div>
                  ))}
                </div> */}

                <div className="relative pt-2">
                  {/* Original Templates Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {templates.map((t) => (
                      <div key={t.name} className="text-center space-y-2">
                        <div
                          className={cn(
                            "rounded-lg border p-2 h-24 flex items-center justify-center bg-gray-50 cursor-pointer transition-all",
                            t.active
                              ? "border-blue-500 ring-1 ring-blue-500 shadow-sm"
                              : "border-gray-200 hover:border-blue-300"
                          )}
                        >
                          <div className="w-full h-full flex flex-col gap-1.5 opacity-70">
                            <div className="h-1.5 bg-gray-300 w-1/3 rounded-full" />
                            <div className="h-1.5 bg-gray-300 w-1/4 rounded-full" />
                            <div className="flex-1 border border-gray-200 rounded bg-white mt-1" />
                          </div>
                        </div>

                        <p
                          className={cn(
                            "text-xs font-medium",
                            t.active ? "text-blue-600" : "text-gray-600"
                          )}
                        >
                          {t.name}
                          {t.name.includes("more") && (
                            <ExternalLink className="inline w-3 h-3 ml-1" />
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Transparent Glass Overlay */}
                  <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-full rounded-2xl bg-white/10 backdrop-blur-[1.5px] border border-white/20 flex items-center justify-center">
                      <div className="px-8 py-3 rounded-full bg-white/40 backdrop-blur-sm border border-white/30 shadow-sm">
                        <p className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
                          Coming Soon
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* UPI / QR Code Section */}
                <div className="space-y-3 pt-2">
                  <p className="text-sm font-medium text-gray-700">Payment Options</p>
                  {/* {isLoggedIn && hasSavedUpi ? (
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={invoice.includeQrCode}
                        onChange={e => setInvoice((p: any) => ({ ...p, includeQrCode: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Include UPI QR Code
                    </label>
                  ) : (
                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <label className="text-xs font-medium text-gray-600 block">UPI ID for Payment QR</label>
                      <input
                        type="text"
                        placeholder="e.g. yourname@upi"
                        className="w-full text-sm border-gray-200 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        value={invoice.paymentUpiId}
                        onChange={e => setInvoice((p: any) => ({
                          ...p,
                          paymentUpiId: e.target.value,
                          includeQrCode: !!e.target.value
                        }))}
                      />
                    </div>
                  )} */}

                  {isLoggedIn ? (
                    hasSavedUpi ? (
                      <label
                        className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={invoice.includeQrCode}
                          onChange={(e) =>
                            setInvoice((p: any) => ({
                              ...p,
                              includeQrCode: e.target.checked,
                            }))
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Include UPI QR Code
                      </label>
                    ) : (
                      <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <label className="text-xs font-medium text-gray-600 block">
                          UPI ID for Payment QR
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. yourname@upi"
                          className="w-full text-sm border-gray-200 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          value={invoice.paymentUpiId}
                          onChange={(e) =>
                            setInvoice((p: any) => ({
                              ...p,
                              paymentUpiId: e.target.value,
                              includeQrCode: !!e.target.value,
                            }))
                          }
                        />
                      </div>
                    )
                  ) : (
                    <div className="space-y-3">
                      {/* Disabled Checkbox */}
                      <label
                        className="flex items-center gap-2 text-sm text-gray-400 cursor-not-allowed p-3 bg-gray-50 rounded-lg border border-gray-100 opacity-70"
                        title="Please login to enable payment options"
                      >
                        <Lock className="w-4 h-4" />

                        <input
                          type="checkbox"
                          disabled
                          className="rounded border-gray-300 cursor-not-allowed"
                        />

                        Include UPI QR Code
                      </label>

                      {/* Disabled Input */}
                      <div
                        className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100 opacity-70"
                        title="Please login to enable payment options"
                      >
                        <label className="text-xs font-medium text-gray-400 flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          UPI ID for Payment QR
                        </label>

                        <input
                          type="text"
                          disabled
                          placeholder="Login required"
                          className="w-full text-sm border-gray-200 rounded-md p-2 bg-white cursor-not-allowed"
                        />
                      </div>

                      <p className="text-xs text-center text-gray-500">
                        Please Login to enable Payment QR and UPI features.
                      </p>
                    </div>
                  )}
                </div>

                <div className="h-px bg-gray-100" />

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">

                  {/* {isLoggedIn ? (
                    <>
                      <Button
                        onClick={handleSaveClick}
                        disabled={isAnyActionProcessing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all"
                      >
                        {isSaving ? "Saving..." : (mode === "update" ? "Update Invoice" : "Save Invoice")}
                      </Button>

                      <Button
                        onClick={handleEmailClick}
                        disabled={isAnyActionProcessing}
                        variant="outline"
                        className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 bg-white"
                      >
                        {isEmailing ? "Sending..." : "Send Email"}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleEmailClick}
                      disabled={isAnyActionProcessing}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all"
                    >
                      {isEmailing ? "Sending..." : "Send Email"}
                    </Button>
                  )} */}

                  <>
                    <div
                      className={!isLoggedIn ? "cursor-not-allowed relative" : "relative"}
                      title={!isLoggedIn ? "Please login to use this feature" : ""}
                    >
                      <Button
                        onClick={handleSaveClick}
                        disabled={!isLoggedIn || isAnyActionProcessing}
                        className={`
                          w-full
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        font-medium
                        shadow-sm
                        transition-all
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        disabled:hover:bg-blue-600
                        flex items-center justify-center gap-2
      `}
                      >
                        {!isLoggedIn && <Lock className="w-4 h-4" />}

                        {isSaving
                          ? "Saving..."
                          : mode === "update"
                            ? "Update Invoice"
                            : "Save Invoice"}
                      </Button>
                    </div>

                    <div
                      className={!isLoggedIn ? "cursor-not-allowed relative" : "relative"}
                      title={!isLoggedIn ? "Please login to use this feature" : ""}
                    >
                      <Button
                        onClick={handleEmailClick}
                        disabled={!isLoggedIn || isAnyActionProcessing}
                        variant="outline"
                        className={`
        w-full
        border-blue-200
        text-blue-700
        hover:bg-blue-50
        bg-white
        transition-all
        disabled:cursor-not-allowed
        disabled:opacity-60
        disabled:hover:bg-white
        flex items-center justify-center gap-2
      `}
                      >
                        {!isLoggedIn && <Lock className="w-4 h-4" />}

                        {isEmailing ? "Sending..." : "Send Email"}
                      </Button>
                    </div>

                    {!isLoggedIn && (
                      <p className="text-xs text-center text-gray-500 mt-2">
                        Please Login to enable Payments option and Send Email feature.
                      </p>
                    )}
                  </>

                  <Button
                    variant="outline"
                    onClick={() => handleDownloadPDF()}
                    disabled={isAnyActionProcessing}
                    className="w-full cursor-pointer border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
                  >
                    Download PDF
                  </Button>

                  {mode === "update" && (
                    <Button
                      variant="outline"
                      onClick={handleDelete}
                      disabled={isAnyActionProcessing}
                      className="w-full mt-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-white"
                    >
                      {isDeleting ? "Deleting..." : "Delete Invoice"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}