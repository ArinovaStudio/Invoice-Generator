import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and Conditions for using Arinvoice invoice generator.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
    <Navbar />
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: May 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <p>
          By accessing or using Arinvoice, you agree to these Terms.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-2">1. Service Description</h2>
          <p>
            Arinvoice provides a free online invoice generator for individuals and businesses in India.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. User Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide accurate invoice information</li>
            <li>Ensure compliance with local laws (GST, taxation, etc.)</li>
            <li>Use the service legally</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Payments & UPI</h2>
          <p>
            Arinvoice does not process or store payments. UPI links generated are handled by external systems.
          </p>
          <p className="mt-2">
            We are not responsible for payment failures, disputes, or fraud.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. No Warranty</h2>
          <p>
            The service is provided "as is" without warranties of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
          <p>
            We are not liable for:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Invoice errors created by users</li>
            <li>Financial losses</li>
            <li>Service downtime</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Intellectual Property</h2>
          <p>
            All content, branding, and software belong to Arinvoice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">7. Termination</h2>
          <p>
            We may restrict access if misuse is detected.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">8. Changes</h2>
          <p>
            Terms may be updated without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">9. Contact</h2>
          <p>support@arinvoice.studio</p>
        </section>
      </div>
    </main>
    <Footer />
    </>
  );
}