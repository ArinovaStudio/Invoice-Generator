"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Header({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { data: session } = useSession();

  const userName = session?.user?.name || "Not Valid";
  const firstLetter = userName.charAt(0).toUpperCase();

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
      ? "Good afternoon"
      : "Good evening";

  return (
    <header className="sticky top-0 z-30 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.92)] backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--background)/0.75)]">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="md:hidden h-10 w-10 shrink-0 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex items-center justify-center text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition"
          >
            <span className="material-symbols-outlined text-[18px]">
              menu
            </span>
          </button>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">
              {greeting}, {userName}
            </p>

            <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">
              Welcome back to your dashboard
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* <button className="hidden sm:flex h-10 w-10 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] transition">
            <span className="material-symbols-outlined text-[18px]">
              search
            </span>
          </button> */}

          {/* <button className="relative h-10 w-10 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] transition">
            <span className="material-symbols-outlined text-[18px]">
              notifications
            </span>

            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[hsl(var(--primary))]" />
          </button> */}

          <Link
            href="/user/invoices/new"
            className="hidden sm:flex h-10 px-4 rounded-2xl bg-gradient-to-r from-[hsl(var(--primary)/0.7)] via-[hsl(var(--primary))] to-[hsl(var(--primary)/0.7)] text-[hsl(var(--primary-foreground))] text-sm font-medium items-center gap-2 shadow-sm hover:opacity-95 transition"
          >
            <span className="material-symbols-outlined text-[18px]">
              add
            </span>
            Create
          </Link>

          <div className="h-10 w-10 rounded-2xl bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))] flex items-center justify-center text-sm font-semibold">
            {firstLetter}
          </div>
        </div>
      </div>
    </header>
  );
}