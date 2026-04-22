"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
  { label: "Features", href: "/#features" },
  { label: "How", href: "/#how" },
  { label: "Compare", href: "/#compare" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

const Navbar = () => {
  const { status } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const renderCtaButton = (isMobile = false) => {
    const baseClasses = isMobile
      ? "mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-primary transition-colors"
      : "hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-foreground text-background text-xs sm:text-sm font-semibold hover:bg-primary transition-colors";

    if (pathname === "/invoice") {
      if (status === "authenticated") {
        return (
          <Link href="/user" onClick={() => setOpen(false)} className={baseClasses}>
            Dashboard
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        );
      }
      return (
        <Link href="/login" onClick={() => setOpen(false)} className={baseClasses}>
          Login
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      );
    }

    return (
      <Link href="/invoice" onClick={() => setOpen(false)} className={baseClasses}>
        Get started
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    );
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "w-screen" : "py-3 sm:py-5"
      }`}
    >
      <div
        className={`container px-4 sm:px-6 flex items-center justify-between rounded-bl-sm rounded-br-sm transition-[max-width,padding] duration-500 ${
          scrolled || open
            ? " bg-background/80 max-w-screen backdrop-blur-xl border border-border shadow-card-soft py-2.5 sm:py-3"
            : "max-w-6xl mx-auto"
        }`}
      >
        <Link href="/" className="flex items-center justify-center gap-2 group min-w-0">
          <div className="w-24 sm:h-8 rounded-xl grid place-items-center">
            <img 
              alt="logo"
              className="w-full h-full object-cover"
              src="/logo_transparent.png"
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors story-link"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Desktop CTA Button */}
          {renderCtaButton(false)}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="md:hidden w-10 h-10 grid place-items-center rounded-full bg-foreground text-background hover:bg-primary transition-colors"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden container max-w-6xl mx-auto px-4 mt-2">
          <div className="rounded-2xl bg-background/95 backdrop-blur-xl border border-border shadow-card-soft p-4 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-lg text-base font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              {renderCtaButton(true)}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;