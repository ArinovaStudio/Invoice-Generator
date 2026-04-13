"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (o: boolean) => void }) {
  const pathname = usePathname();
  const navLinks = [
    { name: "Dashboard", href: "/user", icon: "dashboard" },
    { name: "Invoices", href: "/user/invoices", icon: "description" },
    { name: "Settings", href: "/user/settings", icon: "business" },
    { name: "Payments", href: "/user/payment", icon: "payments" },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-slate-900/20 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#F4F7FE] border-r border-slate-200/60 flex flex-col h-screen p-6 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <span className="material-symbols-outlined text-white">architecture</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight">Arinova Studio</h1>
            <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Finance Portal</p>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === link.href ? "bg-white text-blue-600 font-bold shadow-sm" : "text-slate-500 hover:text-blue-600 hover:bg-white/60 font-medium"}`}>
              <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
              <span className="text-sm">{link.name}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-6 space-y-4">
          <Link href="/user/invoices/new" onClick={() => setIsOpen(false)} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 text-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>Create New Invoice
          </Link>
          <div className="pt-2 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-slate-800 transition-all rounded-xl text-sm font-medium"><span className="material-symbols-outlined text-[20px]">help</span>Help Center</button>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all rounded-xl text-sm font-medium"><span className="material-symbols-outlined text-[20px]">logout</span>Logout</button>
          </div>
        </div>
      </aside>
    </>
  );
}