"use client";

import { useTransition } from "react";
import { startStage } from "@/actions/stage";
import { cn } from "@/lib/utils";

type Props = {
  stageNumber: number;
  className?: string;
};

export function StartStageButton({ stageNumber, className }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => startStage(stageNumber));
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-colors",
        "bg-amber-500 hover:bg-amber-400 text-black",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {isPending ? "Starting…" : "Start stage"}
    </button>
  );
}
