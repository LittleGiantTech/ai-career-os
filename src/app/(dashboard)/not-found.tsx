import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 gap-6">
      <div className="text-center max-w-sm">
        <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-3">
          404
        </p>
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Page not found
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This page does not exist or you do not have access to it.
        </p>
      </div>

      <Link
        href="/dashboard"
        className="py-3 px-6 rounded-md text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-black transition-colors"
      >
        Return to dashboard
      </Link>
    </div>
  );
}
