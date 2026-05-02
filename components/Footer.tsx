"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-border pt-16 pb-4 sm:pb-0 bg-background">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-10 mb-14">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-auto sm:w-32 sm:h-8 rounded-xl grid place-items-center">
            <img 
            alt="logo"
            className="w-full h-full object-cover"
            src="/logo_transparent.png"
            />
              <span className="font-display font-normal text-sm">By Arinova Studio</span>
          </div>
            </div>
            <p className="text-muted-foreground max-w-sm leading-tight mt-8">
              The free invoice generator that helps you get paid faster — UPI QR, client CRM, free email delivery. Forever ₹0.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#use-cases" className="hover:text-primary transition-colors">Use Cases</Link></li>
              <li><Link href="#compare" className="hover:text-primary transition-colors">Compare</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Help & Support</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="mailto:support@arinvoice.studio" className="hover:text-primary transition-colors">support@arinvoice.studio</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              <li><Link href="/security" className="hover:text-primary transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between w-full items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Arinovoice.
          </p>

          <p className="text-sm text-muted-foreground">
             ™ Product by <a className="underline" href="https://arinova.studio">Arinova Studio</a>.
          </p>
        </div>
        <div className="mt-4 border-t border-border flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="font-display text-6xl md:text-[14rem] leading-none text-foreground/[0.06]">
            Arinvoice
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
