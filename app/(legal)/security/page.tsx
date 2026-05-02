import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Policy",
  description:
    "Security practices followed by Arinvoice to protect user data.",
  alternates: { canonical: "/security" },
};

export default function SecurityPage() {
  return (
    <>
    <Navbar />
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Security Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: May 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <p>
          We prioritize security and continuously improve our systems.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-2">1. Data Protection</h2>
          <p>
            Data is processed securely and not stored unnecessarily.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Encryption</h2>
          <p>
            All communication is secured using HTTPS encryption.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Infrastructure</h2>
          <p>
            We use secure hosting and follow best practices to mitigate vulnerabilities.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. User Responsibility</h2>
          <p>
            Users should verify invoice details and avoid sharing sensitive data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Vulnerability Reporting</h2>
          <p>
            Report issues to: security@arinvoice.studio
          </p>
        </section>
      </div>
    </main>
    <Footer />
    </>
  );
}