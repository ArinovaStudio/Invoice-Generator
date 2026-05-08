"use client";
import { themes } from "@/lib/InvoiceConfig";
import { currencies } from "@/lib/currencies";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import InvoiceForm from "./InvoiceForm";
import InvoiceSettings from "./InvoiceSettings";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import LoadingComponent from "../LoadingComponent";
import type { Invoice } from "./invoice";
export interface InvoiceLayoutProps {
  loading?: boolean;
  initialData?: any;
  mode?: "create" | "update";
  invoiceId?: string;
}
const defaultInvoice = {
  title: "INVOICE",
  senderCompany: "",
  senderName: "",
  senderAddress: "",
  senderCityZip: "",
  senderCountry: "IN",
  clientId: "",
  clientCompany: "",
  clientName: "",
  clientAddress: "",
  clientCity: "",
  clientState: "",
  clientZip: "",
  clientCountry: "IN",
  paymentMethod: "upi",
  invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],

  tableDescLabel: "Item Description",
  tableHsnLabel: "HSN",
  tableQtyLabel: "Qty",
  tableRateLabel: "Rate",
  tableTaxLabel: "Tax %",
  tableAmountLabel: "Amount",

  items: [{ description: "", quantity: 1, rate: 0, taxRate: 0, hsn: "" }],

  notesTitle: "Notes",
  notes: "It was great doing business with you.",
  termsTitle: "Terms And Conditions",
  terms: "Terms Content Will Go Here...",
  paymentUpiId: "",
  includeQrCode: false,
};

export default function page({
  loading: initialLoading = false,
  initialData,
  mode = "create",
  invoiceId,
}: InvoiceLayoutProps) {
  const router = useRouter();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [currentColor, setCurrentColor] = useState(themes[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSavedUpi, setHasSavedUpi] = useState(false);

  // Specific Loading States
  const [isSaving, setIsSaving] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [clients, setClients] = useState<any[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData?.logoUrl || null
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [invoice, setInvoice] = useState<any>(defaultInvoice);

  const [pdfMode, setPdfMode] = useState(false);
  const tapToPayRef = useRef(null);

  useEffect(() => {
    if (!initialData) return;
    setInvoice({
      ...defaultInvoice,
      ...initialData,
      clientId: initialData.clientId || "",
      senderCompany: initialData.senderCompany || "",
      tableDescLabel: initialData.tableDescLabel || "Item Description",
      tableQtyLabel: initialData.tableQtyLabel || "Qty",
      tableRateLabel: initialData.tableRateLabel || "Rate",
      tableTaxLabel: initialData.tableTaxLabel || "Tax %",
      tableHsnLabel: initialData.tableHsnLabel || "HSN",
      tableAmountLabel: initialData.tableAmountLabel || "Amount",
      items: initialData.items?.length
        ? initialData.items
        : defaultInvoice.items,
    });
    setLogoPreview(initialData?.logoUrl || null);
  }, [initialData]);
  const { data: session, status } = useSession();

  const fetchDefaults = async () => {
    try {
      setLoading(true);
      const [profileRes, paymentRes, clientsRes] = await Promise.all([
        fetch("/api/user/profile"),
        fetch("/api/user/payment"),
        fetch("/api/user/clients"),
      ]);
      if (profileRes.ok) {
        setIsLoggedIn(true);
        const profileData = await profileRes.json();
        const user = profileData.profile || {};

        if (mode === "create") {
          if (user.logoUrl) setLogoPreview(user.logoUrl);

          console.log(user);
          
          setInvoice((prev: any) => ({
            ...prev,
            senderCompany: user.companyName || "",
            senderName: user.name || "",
            senderAddress: user.companyAddress || "",
            senderCountry: user.country || "IN",
            senderState: user.state || "",
            senderCity: user.city || "",
            senderGSTIN: user.companyGstin || "",
            senderZip: user.zip || "",
            // senderCityZip: `${user.city || ""} ${user.zip || ""}`.trim(),
          }));
        }
      }

      if (paymentRes.ok) {
        const paymentData = await paymentRes.json();
        if (paymentData.paymentDetails?.upiId) {
          setHasSavedUpi(true);
        }
        if (mode === "create") {
          setInvoice((prev: any) => ({
            ...prev,
            paymentUpiId: paymentData.paymentDetails.upiId,
            bankName: paymentData.paymentDetails.bankName,
            accountNumber: paymentData.paymentDetails.accountNumber,
            ifscCode: paymentData.paymentDetails.ifscCode,
            accountHolderName: paymentData.paymentDetails.accountHolderName,
          }));
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

  useEffect(() => {
    if (session) {
      fetchDefaults();
    }
  }, [mode, status]);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      setPdfMode(true);
      await new Promise((resolve) => setTimeout(resolve, 400));

      const { domToJpeg } = await import("modern-screenshot");
      const { jsPDF } = await import("jspdf");

      const element = invoiceRef.current;

      const dataUrl = await domToJpeg(element, {
        scale: 3,
        backgroundColor: "#ffffff",
        width: element.scrollWidth,
        height: element.scrollHeight,
        filter: (node) =>
          !(
            node instanceof HTMLElement &&
            node.classList.contains("print:hidden")
          ),
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;

      const img = new Image();
      img.src = dataUrl;
      await new Promise((res) => (img.onload = res));

      const imgProps = pdf.getImageProperties(dataUrl);
      const imgWidth = usableWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // FIX 1: if it fits on one page, just add it directly — no slicing needed
      if (imgHeight <= usableHeight) {
        const clampedHeight = Math.min(imgHeight, usableHeight);
        pdf.addImage(
          dataUrl,
          "JPEG",
          margin,
          margin,
          imgWidth,
          clampedHeight,
          undefined,
          "FAST"
        );
      } else {
        // FIX 2: no SAFE_GAP, exact math
        // FIX 5: use Math.ceil to avoid fractional mm overflow
        const pxPerMm = Math.ceil(imgProps.width / imgWidth);
        const pageHeightPx = Math.floor(usableHeight * pxPerMm);

        let y = 0;
        let pageIndex = 0;

        while (y < imgProps.height) {
          if (pageIndex > 0) pdf.addPage();

          // FIX 2: exact slice — no arbitrary gap
          const sliceHeight = Math.min(pageHeightPx, imgProps.height - y);

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;
          canvas.width = imgProps.width;
          canvas.height = sliceHeight;

          ctx.drawImage(
            img,
            0,
            y,
            imgProps.width,
            sliceHeight,
            0,
            0,
            canvas.width,
            canvas.height
          );

          const cropped = canvas.toDataURL("image/jpeg", 1.0);

          // FIX 3: render height relative to this slice, not total image height
          const renderHeight = (sliceHeight / pageHeightPx) * usableHeight;

          pdf.addImage(
            cropped,
            "JPEG",
            margin,
            margin,
            imgWidth,
            renderHeight,
            undefined,
            "FAST"
          );

          y += sliceHeight;
          pageIndex++;
        }
      }

      // UPI link placement
      if (
        tapToPayRef.current &&
        invoice.paymentMethod === "upi" &&
        invoice.paymentUpiId
      ) {
        const btn = tapToPayRef.current as HTMLButtonElement;
        const btnRect = btn.getBoundingClientRect();
        const parentRect = element.getBoundingClientRect();

        const relativeX = btnRect.left - parentRect.left;
        const relativeY = btnRect.top - parentRect.top;

        const scale = usableWidth / element.scrollWidth;

        const pdfX = margin + relativeX * scale;
        const pdfYGlobal = margin + relativeY * scale;
        const pdfW = btnRect.width * scale;
        const pdfH = btnRect.height * scale;

        // FIX 4: use usableHeight (not pageHeight) for page boundary math
        const targetPage = Math.floor((pdfYGlobal - margin) / usableHeight) + 1;
        const pdfY = margin + ((pdfYGlobal - margin) % usableHeight);

        const totalPages = pdf.getNumberOfPages();
        if (targetPage <= totalPages) {
          pdf.setPage(targetPage);

          // const upiLink = `upi://pay?pa=${invoice.paymentUpiId}&pn=${invoice.senderCompany}&am=${totals.total}&cu=INR&tn=${`Payment of ${invoice.senderCompany}`}`;
          const location = process.env.NEXT_PUBLIC_URL;
          const upiLink = `${location}/pay?pa=${invoice.paymentUpiId}&pn=${invoice.senderCompany}&am=${totals.total}&tn=Payment%20of%20${invoice.senderCompany}`;

          pdf.link(pdfX, pdfY, pdfW, pdfH, { url: upiLink });
        }
      }

      pdf.save(`${invoice.invoiceNumber || "invoice"}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setPdfMode(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    // if (name.startsWith("client")) {
    //   // If user types manually, unlink the saved clientId
    //   setInvoice((prev: any) => ({ ...prev, [name]: value }));
    // } else {
    setInvoice((prev: any) => ({ ...prev, [name]: value }));
    // }
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
        clientCountry: "IN",
        clientState: "",
        clientCity: "",
        clientZip: "",
        clientGSTIN: "",
      }));
      return;
    }
    const client = clients.find((c) => c.id === selectedId);
    if (client) {
      setInvoice((prev: any) => ({
        ...prev,
        clientId: client.id,
        clientCompany: client.companyName || "",
        clientName: client.contactName || client.name || "",
        clientAddress: client.address || "",
        clientCityZip: `${client.city || ""} ${client.state || ""} ${
          client.zip || ""
        }`.trim(),
        clientCountry: client.country || "IN",
        clientGSTIN: client.companyGstin || "",
        clientState: client.state || "",
        clientCity: client.city || "",
        clientZip: client.zip || "",
      }));
    }
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoice((prev: any) => ({ ...prev, items: newItems }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const totals = invoice?.items?.reduce(
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

      const url =
        mode === "create"
          ? "/api/user/invoices"
          : `/api/user/invoices/${invoiceId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, { method, body: formData });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message);
        throw new Error(errorData.message || "Failed to save");
      }

      return true;
    } catch (error: any) {
      console.error(error);
      toast.error(error.message as any);
      return false;
    }
  };

  const handleSendEmail = async () => {
    if (!invoiceRef.current) return;

    const defaultEmail = invoice.clientName
      ? invoice.clientName.toLowerCase().replace(/\s/g, "") + "@gmail.com"
      : "";
    const actualEmail = prompt(
      `Confirm recipient's email address:`,
      defaultEmail
    );
    if (!actualEmail) return;

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
      const printHeight = (imgProps.height * printWidth) / imgProps.width;

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
      const pdfBlob = pdf.output("blob");

      const formData = new FormData();
      formData.append("pdf", pdfBlob, `${invoice.invoiceNumber}.pdf`);
      formData.append("toEmail", actualEmail);
      formData.append(
        "clientName",
        invoice.clientName || invoice.clientCompany || "Client"
      );
      formData.append("invoiceNumber", invoice.invoiceNumber);

      const senderName =
        invoice.senderCompany || invoice.senderName || "Invoice Generator";
      formData.append("senderName", senderName);

      if (invoiceId || invoice.id)
        formData.append("invoiceId", invoiceId || invoice.id);

      const res = await fetch("/api/user/invoices/send", {
        method: "POST",
        body: formData,
      });
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
      toast.success(mode === "create" ? "Invoice Saved!" : "Invoice Updated!");
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
      const res = await fetch(`/api/user/invoices/${invoiceId}`, {
        method: "DELETE",
      });
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
  const isAnyActionProcessing = isSaving || isEmailing || isDeleting;
  if (loading || initialLoading) {
    return (
      <LoadingComponent
        text={
          mode === "create"
            ? "Preparing your invoice workspace..."
            : "Loading invoice details..."
        }
      />
    );
  }
  return (
    <div className="w-full py-10 px-6 bg-[var(--background)] min-h-screen overflow-y-auto">
      <div className="mx-auto max-w-6xl py-12 justify-center flex flex-wrap lg:flex-nowrap gap-6">
        <InvoiceForm
          currentColor={currentColor}
          handleChange={handleChange}
          handleItemChange={handleItemChange}
          handleLogoUpload={handleLogoUpload}
          invoice={invoice}
          isLoggedIn={isLoggedIn}
          invoiceRef={invoiceRef}
          logoPreview={logoPreview}
          clients={clients}
          handleClientSelect={handleClientSelect}
          selectedCurrency={selectedCurrency}
          setInvoice={setInvoice}
          totals={totals}
          pdfMode={pdfMode}
          tapToPayRef={tapToPayRef}
        />
        <InvoiceSettings
          // clients={clients}
          // handleClientSelect={handleClientSelect}
          currentColor={currentColor}
          handleDelete={handleDelete}
          handleDownloadPDF={handleDownloadPDF}
          handleEmailClick={handleEmailClick}
          handleSaveClick={handleSaveClick}
          hasSavedUpi={hasSavedUpi}
          invoice={invoice}
          isAnyActionProcessing={isAnyActionProcessing}
          isDeleting={isDeleting}
          isEmailing={isEmailing}
          isLoggedIn={isLoggedIn}
          isSaving={isSaving}
          mode={mode}
          setCurrentColor={setCurrentColor}
          setInvoice={setInvoice}
        />
      </div>
    </div>
  );
}
