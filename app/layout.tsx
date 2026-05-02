import type { Metadata } from "next";
import Script from "next/script";
import {
  Geist,
  Bricolage_Grotesque,
  Inter,
  JetBrains_Mono
} from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arinvoice.studio"),

  title: {
    default: "Invoice Generator India | Free Online Invoice Maker",
    template: "%s | Arinvoice",
  },

  description:
    "Free invoice generator for India. Create invoices instantly with UPI payment support and PDF export. No signup required.",

  keywords: [
    "invoice generator india",
    "free invoice generator india",
    "online invoice generator india",
    "upi invoice generator",
    "create invoice online india",
  ],

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "Invoice Generator for India | Free & Instant",
    description:
      "Create invoices instantly with UPI payments and PDF export. No signup required.",
    url: "https://arinvoice.studio",
    siteName: "Arinvoice",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Arinvoice - Invoice Generator India",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Invoice Generator for India",
    description:
      "Create invoices instantly with UPI & PDF export.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Arinvoice",
      url: "https://arinvoice.studio",
      logo: "https://arinvoice.studio/logo.png",
    },
    {
      "@type": "WebSite",
      name: "Arinvoice",
      url: "https://arinvoice.studio",
    },
    {
      "@type": "SoftwareApplication",
      name: "Arinvoice",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://arinvoice.studio",
      description:
        "Free invoice generator for India with UPI payments and PDF export. No signup required.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
      areaServed: {
        "@type": "Country",
        name: "India",
      },
    },

    // ✅ FAQ SCHEMA ADDED
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is this invoice generator free in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, Arinvoice is completely free to use in India. You can create unlimited invoices, download PDFs, and share them without any signup or hidden charges.",
          },
        },
        {
          "@type": "Question",
          name: "How do I create an invoice online in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Enter your business details, add items, taxes, and client information, then generate your invoice instantly. You can download it as a PDF or share it directly.",
          },
        },
        {
          "@type": "Question",
          name: "Does this invoice generator support UPI payments?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, you can add your UPI ID and generate invoices with a UPI QR code. Clients can pay using Google Pay, PhonePe, or Paytm.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need to sign up to use Arinvoice?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No, you can create invoices instantly without signup.",
          },
        },
        {
          "@type": "Question",
          name: "Can I download invoices as PDF?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, every invoice can be downloaded as a professional PDF ready to share or print.",
          },
        },
        {
          "@type": "Question",
          name: "Is this invoice generator suitable for freelancers in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, freelancers, agencies, and small businesses in India can easily create and send invoices.",
          },
        },
      ],
    },
  ],
};

  return (
    <html
      lang="en-IN"
      className={cn(
        "h-full",
        "antialiased",
        bricolage.className,
        bricolage.variable,
        inter.variable,
        jetbrainsMono.variable,
        geist.variable
      )}
    >
      <head>
        {/* Structured Data */}
        <Script
          id="schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      </head>

      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}