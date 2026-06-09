"use client";

import { useTransition } from "react";
import { toggleTask } from "@/actions/sprint";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  title: string;
  isComplete: boolean;
};

export function SprintTaskItem({ id, title, isComplete }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(() => toggleTask(id, isComplete));
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "flex items-center gap-3 w-full text-left px-0 py-3 group transition-opacity",
        isPending && "opacity-50"
      )}
    >
      {/* Custom checkbox */}
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
          isComplete
            ? "bg-amber-500 border-amber-500"
            : "border-border group-hover:border-amber-500/50"
        )}
      >
        {isComplete && (
          <svg
            className="h-2.5 w-2.5 text-black"
            viewBox="0 0 10 10"
            fill="none"
          >
            <path
              d="M1.5 5L4 7.5L8.5 2.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span
        className={cn(
          "text-sm transition-colors",
          isComplete
            ? "line-through text-muted-foreground"
            : "text-foreground group-hover:text-foreground"
        )}
      >
        {title}
      </span>
    </button>
  );
}
