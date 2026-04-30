"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/user", icon: "dashboard" },
    { name: "Invoices", href: "/user/invoices", icon: "description" },
    { name: "Clients", href: "/user/clients", icon: "people" },
    { name: "Settings", href: "/user/settings", icon: "business" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 max-w-[88vw] h-screen bg-white border-r border-slate-200 flex flex-col px-5 py-5 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            {/* <div className="h-10 w-10 rounded-2xl bg-[hsl(var(--primary))] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-[hsl(var(--primary-foreground))]">
                architecture
              </span>
            </div> */}

            <div className="mt-1">
              <h1 className="text-[15px] font-semibold leading-none text-[hsl(var(--foreground))]">
                Arinova
              </h1>
              <p className="text-[10px] mt-1 text-[hsl(var(--muted-foreground))]">
                Studio
              </p>
            </div>
          </div>

          {/* <button className="h-8 w-8 rounded-2xl flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] transition">
            <span className="material-symbols-outlined text-[18px]">
              more_vert
            </span>
          </button> */}
        </div>

        {/* Search */}
        {/* <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 text-sm outline-none focus:border-violet-400"
          />
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
            search
          </span>
        </div> */}

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-sm text-[13px] transition-all ${
                  active
                    ? "bg-gradient-to-r from-[hsl(var(--primary)/0.6)] via-[hsl(var(--primary))] to-[hsl(var(--primary)/0.6)] text-[hsl(var(--primary-foreground))] font-medium shadow-sm"
                    : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] font-medium"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {link.icon}
                </span>

                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="pt-5 border-t border-slate-100 space-y-1">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
