import Navbar from "@/components/Navbar";
import InvoiceLayout from "@/components/Invoice";
import Footer from "@/components/Footer";

export default function InvoicePage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <Navbar />
      <div className="pt-24 flex-1">
        <InvoiceLayout />
      </div>
      <Footer />
    </main>
  );
}