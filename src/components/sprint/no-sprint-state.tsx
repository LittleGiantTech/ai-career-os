import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

export function NoSprintState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-border rounded-lg bg-card">
      <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center mb-4">
        <Zap className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">
        No active sprint
      </h3>
      <p className="text-xs text-muted-foreground max-w-xs mb-6">
        You don&apos;t have an active sprint. Start one to get your daily focus
        and track your progress.
      </p>
      <Link
        href="/roadmap"
        className={cn(
          buttonVariants({ size: "sm" }),
          "bg-amber-500 hover:bg-amber-400 text-black font-semibold border-transparent"
        )}
      >
        Go to Roadmap
      </Link>
    </div>
  );
}
