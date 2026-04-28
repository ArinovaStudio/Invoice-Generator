"use client";
import { themes } from "@/lib/InvoiceConfig";
import { currencies } from "@/lib/currencies";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import InvoiceForm from "./InvoiceForm";
import InvoiceSettings from "./InvoiceSettings";
export interface InvoiceLayoutProps {
  initialData?: any;
  mode?: "create" | "update";
  invoiceId?: string;
}

export default function page({
  initialData,
  mode = "create",
  invoiceId,
}: InvoiceLayoutProps) {
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
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData?.senderLogoUrl || null
  );
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
        items: initialData.items?.length
          ? initialData.items
          : [{ description: "", quantity: 1, rate: 0, taxRate: 0 }],
      };
    }

    return {
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
      paymentMethod: "upi",
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
      termsTitle: "",
      terms: "",
      paymentUpiId: "",
      includeQrCode: false,
    };
  });
  const [pdfMode, setPdfMode] = useState(false);
  const tapToPayRef = useRef(null);
  useEffect(() => {
    const fetchDefaults = async () => {
      try {
        const [profileRes, paymentRes, clientsRes] = await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/user/payment"),
          fetch("/api/user/clients"),
        ]);
        console.log("testee");

        if (profileRes.ok) {
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
              senderCountry: "IN",
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
      setPdfMode(true);

      // wait for UI update
      await new Promise((resolve) => setTimeout(resolve, 300));

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

      const imgProps = pdf.getImageProperties(dataUrl);

      // image scaled to page width
      const imgHeight = (imgProps.height * usableWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = margin;

      // first page
      pdf.addImage(dataUrl, "JPEG", margin, position, usableWidth, imgHeight);

      heightLeft -= usableHeight;

      const minRemainingHeight = 20;

      while (heightLeft > minRemainingHeight) {
        position = heightLeft - imgHeight + margin;

        pdf.addPage();
        pdf.addImage(dataUrl, "JPEG", margin, position, usableWidth, imgHeight);

        heightLeft -= usableHeight;
      }

      /* -----------------------------------------
       MAKE EXISTING PAY BUTTON CLICKABLE
       Add id="upi-pay-btn" on your button
    ----------------------------------------- */


      if (tapToPayRef && invoice.paymentMethod === "upi" && invoice.paymentUpiId) {
        const btn = tapToPayRef.current! as HTMLButtonElement;
        const btnRect = btn.getBoundingClientRect();
        const parentRect = element.getBoundingClientRect();

        // relative button position inside invoice
        const relativeX = btnRect.left - parentRect.left;
        const relativeY = btnRect.top - parentRect.top;

        // px -> mm scale
        const scale = usableWidth / element.scrollWidth;

        const pdfX = margin + relativeX * scale;
        const pdfYGlobal = margin + relativeY * scale;
        const pdfW = btnRect.width * scale;
        const pdfH = btnRect.height * scale;

        // detect page number
        const pageIndex = Math.floor((pdfYGlobal - margin) / usableHeight) + 1;

        // y inside selected page
        const pdfY = margin + ((pdfYGlobal - margin - 10) % usableHeight);

        const totalPages = pdf.getNumberOfPages();

        if (pageIndex <= totalPages) {
          pdf.setPage(pageIndex);

          const upiLink = `upi://pay?pa=${encodeURIComponent(
            invoice.paymentUpiId
          )}&pn=${encodeURIComponent(
            invoice.senderCompany || invoice.senderName
          )}&am=${totals.total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
            `Payment of ${invoice.senderCompany || invoice.senderName}`
          )}`;

          pdf.link(pdfX, pdfY, pdfW, pdfH, {
            url: upiLink,
          });
        }
      }

      pdf.save(`${invoice.invoiceNumber}.pdf`);
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
        clientCountry: "India",
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
        clientCountry: client.country || "India",
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

      const url =
        mode === "create"
          ? "/api/user/invoices"
          : `/api/user/invoices/${invoiceId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, { method, body: formData });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save");
      }

      return true;
    } catch (error) {
      console.error(error);
      alert(
        "Failed to save invoice. Check the console for exact backend errors."
      );
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
  return (
    <div className="w-full py-10 px-6 bg-slate-50 min-h-screen overflow-y-auto">
      <div className="mx-auto max-w-6xl py-12 justify-center flex flex-wrap lg:flex-nowrap gap-6">
        <InvoiceForm
          currentColor={currentColor}
          handleChange={handleChange}
          handleItemChange={handleItemChange}
          handleLogoUpload={handleLogoUpload}
          invoice={invoice}
          invoiceRef={invoiceRef}
          logoPreview={logoPreview}
          selectedCurrency={selectedCurrency}
          setInvoice={setInvoice}
          totals={totals}
          pdfMode={pdfMode}
          tapToPayRef={tapToPayRef}
        />
        <InvoiceSettings
          clients={clients}
          currentColor={currentColor}
          handleClientSelect={handleClientSelect}
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
