import InvoiceForm from "@/components/InvoiceEditor";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function NewInvoicePage() {
  return <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin"/></div>}><InvoiceForm mode="create" /></Suspense>
}