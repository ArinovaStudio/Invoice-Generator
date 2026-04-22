import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import HorizontalShowcase from "@/components/HorizontalShowcase";
import Features from "@/components/Features";
import Comparison from "@/components/Comparison";
import Stats from "@/components/Stats";
import Integrations from "@/components/Integrations";
import UseCasesHorizontal from "@/components/UseCasesHorizontal";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import DonationBanner from "@/components/DonationBanner";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <CustomCursor />
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <HorizontalShowcase />
      <Comparison />
      <Stats />
      <Integrations />
      <UseCasesHorizontal />
      <Testimonials />
      <Pricing />
      <DonationBanner />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
