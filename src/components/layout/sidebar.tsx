"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border bg-background h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
        <div className="h-6 w-6 rounded bg-amber-500 flex items-center justify-center">
          <span className="text-[10px] font-bold text-black font-mono">AI</span>
        </div>
        <span className="font-semibold text-sm tracking-tight text-foreground">
          Career OS
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-2 py-4 flex-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-amber-500/10 text-amber-500"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="flex items-center gap-3 px-5 py-4 border-t border-border">
        <UserButton
          appearance={{
            elements: { avatarBox: "h-7 w-7" },
          }}
        />
        <span className="text-xs text-muted-foreground truncate">Account</span>
      </div>
    </aside>
  );
}
