"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme";

const primary = [
  { href: "/", label: "Home" },
  { href: "/research/", label: "Research" },
  { href: "/publications/", label: "Publications" },
  { href: "/people/", label: "People" },
];

const more = [
  { href: "/news/", label: "News" },
  { href: "/open-lab/", label: "Open Lab" },
  { href: "/contact/", label: "Contact" },
];

function Mark() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return <img src={`${base}/logo.png`} alt="" className="h-8 w-auto" />;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = [...primary, ...more];
  const active = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-zinc-200/80 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80">
        <Link href="/" className="flex items-center gap-2 px-2 text-zinc-900 dark:text-zinc-50" onClick={() => setOpen(false)}>
          <Mark />
          <span className="text-sm font-semibold tracking-[0.16em]">SIR</span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm lg:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active(item.href) ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 transition ${
                active(item.href)
                  ? "bg-blue-800 text-white dark:bg-blue-200 dark:text-blue-900"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border border-zinc-300 text-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen((value) => !value)}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-3xl border border-zinc-200 bg-white p-3 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 lg:hidden">
          {items.map((item) => (
            <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined} onClick={() => setOpen(false)} className={`block rounded-2xl px-3 py-3 text-sm ${active(item.href) ? "bg-blue-50 font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-200" : "text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900"}`}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
