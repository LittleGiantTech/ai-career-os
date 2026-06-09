import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <p className="font-mono text-xs tracking-[0.3em] text-amber-500 uppercase mb-2">
            AI Career OS
          </p>
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick up exactly where you left off.
          </p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
