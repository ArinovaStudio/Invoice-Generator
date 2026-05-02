import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy of Arinvoice. Learn how we collect, use, and protect your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
    <Navbar />
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: May 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <p>
          Arinvoice ("we", "our", or "us") operates a web-based invoice generator.
          This Privacy Policy explains how we collect, use, and protect your information.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Invoice data you enter (name, items, amounts, UPI ID, etc.)</li>
            <li>Basic analytics (browser type, device, usage patterns)</li>
            <li>Cookies and performance data</li>
          </ul>
          <p className="mt-2">
            We do not require account creation to use the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. How We Use Data</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Generate invoices and PDFs</li>
            <li>Improve product performance and usability</li>
            <li>Understand usage trends</li>
          </ul>
          <p className="mt-2 font-medium">
            We do not sell, rent, or trade your personal data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Invoice Data Handling</h2>
          <p>
            Invoice data is typically processed in real-time and is not stored permanently
            unless explicitly stated (e.g., saved drafts in future features).
          </p>
          <p className="mt-2">
            You are responsible for the data you enter and share via generated invoices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Cookies & Analytics</h2>
          <p>
            We may use cookies and analytics tools to understand usage patterns and improve the service.
          </p>
          <p className="mt-2">
            You can disable cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Third-Party Services</h2>
          <p>
            We may use third-party services such as:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Analytics providers</li>
            <li>Hosting platforms</li>
            <li>UPI/payment integrations (via generated links)</li>
          </ul>
          <p className="mt-2">
            These providers operate under their own privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Data Retention</h2>
          <p>
            We minimize data storage. Temporary processing data is automatically discarded
            after use unless required for system functionality.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">7. Security</h2>
          <p>
            We implement HTTPS encryption and industry-standard practices to protect data.
            However, no system is completely secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">8. Children’s Privacy</h2>
          <p>
            This service is not intended for users under 13 years of age.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">9. Changes to Policy</h2>
          <p>
            We may update this Privacy Policy. Changes will be reflected on this page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">10. Contact</h2>
          <p>support@arinvoice.studio</p>
        </section>
      </div>
    </main>
    <Footer />
    </>
  );
}