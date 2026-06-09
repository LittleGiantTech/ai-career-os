import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background overflow-hidden px-6">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,158,11,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Amber glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-amber-500/5 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl gap-6">
        <p className="font-mono text-xs tracking-[0.35em] text-amber-500 uppercase">
          AI Career OS
        </p>

        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
          Stop learning everything.
          <br />
          <span className="text-amber-500">Start mastering one thing.</span>
        </h1>

        <p className="max-w-md text-base text-muted-foreground leading-relaxed">
          A personal operating system for becoming an AI Engineer. One sprint.
          One focus. One project at a time.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-amber-500 hover:bg-amber-400 text-black font-semibold px-8 border-transparent"
            )}
          >
            Get started free
          </Link>
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "text-muted-foreground hover:text-foreground"
            )}
          >
            Sign in
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-8 text-xs text-muted-foreground font-mono">
          <span>Stage 1 → Web</span>
          <span className="text-border">|</span>
          <span>Stage 2 → Python</span>
          <span className="text-border">|</span>
          <span>Stage 3 → AI APIs</span>
          <span className="text-border">|</span>
          <span className="text-amber-500/60">→ Architect</span>
        </div>
      </div>
    </div>
  );
}
