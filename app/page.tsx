import Image from "next/image";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import Hero from "./_components/Hero";
import Invoice from "./_components/Invoice";
import InvoiceFormat from "./_components/InvoiceFormat";
import Faq from "./_components/Faq";
import Elements from "./_components/Elements";
import HowItWorks from "./_components/HowItWorks";
import Templates from "./_components/Templates";

export default function Home() {
  return (
    <div className="grid">
      <Navbar/>
      <Hero/>
      <Invoice/>
      <Templates/>
      <HowItWorks/>
      <InvoiceFormat/>
      <Elements/>
      <Faq/>
      <Footer/>
    </div>
  );
}
