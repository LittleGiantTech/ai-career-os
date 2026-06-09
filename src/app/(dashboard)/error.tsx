"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 gap-6">
      <div className="text-center max-w-sm">
        <p className="font-mono text-[10px] tracking-[0.3em] text-destructive uppercase mb-3">
          Error
        </p>
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Something went wrong
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          An unexpected error occurred. Your progress has not been lost.
        </p>
        {error.digest && (
          <p className="font-mono text-[10px] text-muted-foreground/40 mt-3">
            {error.digest}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 w-full max-w-[200px]">
        <button
          onClick={reset}
          className="w-full py-3 rounded-md text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-black transition-colors"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="block py-3.5 text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
