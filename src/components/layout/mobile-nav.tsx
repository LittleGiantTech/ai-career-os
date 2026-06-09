"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-background">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-colors",
              active ? "text-amber-500" : "text-muted-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5", active && "text-amber-500")} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
