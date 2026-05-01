"use client";

import InvoiceLayout from "@/components/invoice/InvoiceLayout";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateInvoicePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading,setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try{
        setLoading(true);
      const req = await fetch(`/api/user/invoices/${id}`);
      const res = await req.json();
      if(res.success){
        const raw = res.invoice;
          const formattedData = {
            ...raw,
            issueDate: raw.issueDate ? raw.issueDate.split("T")[0] : "",
            dueDate: raw.dueDate ? raw.dueDate.split("T")[0] : "",
            logoUrl: raw.senderLogoUrl || null,
          };
          setData(formattedData);
      }
    }catch(error: any){
      
    }finally{
      setLoading(false);
    }
    };
    fetchData();
  }, [id]);

  // if (!data) {
  //   return (
  //     <div className="min-h-screen w-full flex flex-col items-center justify-center text-slate-500 gap-4">
  //       <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
  //       <span className="font-medium">Loading Invoice Data...</span>
  //     </div>
  //   );
  // }

  return <InvoiceLayout loading={loading} mode="update" initialData={data} invoiceId={id as string} />;
}