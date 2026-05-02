import type { Metadata } from "next";
import {
  Geist,
  Bricolage_Grotesque,
  Inter,
  JetBrains_Mono
} from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

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


export const metadata = {
  metadataBase: new URL("https://arinvoice.studio"),
  title: {
    default: "Arinvoice | Free Invoice Genrator",
    template: "%s | arinvoice"
  },
  alternates: {
  canonical: "/",
},
  description:
    "Create, send, and track professional invoices in seconds." +
    "Free invoice generator with PDF export, tax support, and payment gateway!" +
    "recurring billing. No sign-up required for creation." +
    "Integrate your own payment methods in Free!"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
