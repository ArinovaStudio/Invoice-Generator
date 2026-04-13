"use client";
import { useEffect, useState } from "react";
import InvoiceForm from "@/components/InvoiceEditor";
import { useParams } from "next/navigation";

export default function UpdateInvoicePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/user/invoices/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.invoice) {
          const raw = json.invoice;
          
          const formattedData = {
            ...raw,
            issueDate: raw.issueDate ? raw.issueDate.split("T")[0] : "",
            dueDate: raw.dueDate ? raw.dueDate.split("T")[0] : "",
            logoUrl: raw.senderLogoUrl || null,
          };
          
          setData(formattedData);
        }
      })
      .catch((err) => console.error("Error fetching invoice:", err));
  }, [id]);

  if (!data) return <div className="p-20 text-center font-medium text-slate-500">Loading Invoice Data...</div>;

  return <InvoiceForm mode="update" initialData={data} invoiceId={id as string} />;
}