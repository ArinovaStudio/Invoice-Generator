"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header className="flex justify-between items-center px-6 lg:px-10 h-[88px] w-full bg-white border-b border-slate-200/60 z-30 sticky top-0">
      <div className="flex items-center gap-6 h-full">
        <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg"><span className="material-symbols-outlined text-2xl">menu</span></button>
        <div className="hidden md:flex items-center gap-8 h-full pt-1">
          <Link href="/user" className={`text-[11px] font-bold tracking-[0.1em] uppercase h-full flex items-center border-b-[3px] ${pathname === '/user' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-700'}`}>Dashboard</Link>
          <Link href="/user/invoices" className={`text-[11px] font-bold tracking-[0.1em] uppercase h-full flex items-center border-b-[3px] ${pathname.startsWith('/user/invoices') ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-700'}`}>History</Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 bg-[#F4F7FE] px-4 py-2 rounded-full cursor-pointer hover:bg-blue-50 transition-colors">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-tight">{session?.user?.name || "User"}</p>
          </div>
          <img alt="User Profile" src={session?.user?.image || "https://ui-avatars.com/api/?name=User"} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
        </div>
      </div>
    </header>
  );
}