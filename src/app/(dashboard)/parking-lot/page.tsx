import { getOrCreateUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import { addParkingLotItem, deleteParkingLotItem } from "@/actions/parking-lot";
import type { ParkingLotCategory } from "@/generated/prisma/client";

const CATEGORY_LABEL: Record<ParkingLotCategory, string> = {
  TOOL:        "Tool",
  FRAMEWORK:   "Framework",
  CONCEPT:     "Concept",
  TECHNOLOGY:  "Technology",
  OTHER:       "Other",
};

export default async function ParkingLotPage() {
  const user = await getOrCreateUser();

  const items = await prisma.parkingLotItem.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-4 py-6 sm:px-6 max-w-2xl w-full mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] text-amber-500 uppercase mb-1">
          Deferred Ideas
        </p>
        <h1 className="text-xl font-semibold text-foreground">Parking Lot</h1>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Capture what you want to explore later. Return when the current mission is complete.
        </p>
      </div>

      {/* Add form */}
      <div>
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-3">
          Add item
        </p>
        <form action={addParkingLotItem} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
          <input
            type="text"
            name="title"
            placeholder="What are you parking?"
            required
            maxLength={200}
            className="w-full rounded-md border border-border bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors"
          />
          <textarea
            name="description"
            placeholder="Why it matters (optional)"
            rows={2}
            maxLength={500}
            className="w-full rounded-md border border-border bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors resize-none"
          />
          <div className="flex items-center gap-3">
            <select
              name="category"
              defaultValue="OTHER"
              className="flex-1 rounded-md border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-amber-500/50 transition-colors"
            >
              <option value="TOOL">Tool</option>
              <option value="FRAMEWORK">Framework</option>
              <option value="CONCEPT">Concept</option>
              <option value="TECHNOLOGY">Technology</option>
              <option value="OTHER">Other</option>
            </select>
            <button
              type="submit"
              className="px-4 py-3 rounded-md text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-black transition-colors whitespace-nowrap"
            >
              Add to Lot
            </button>
          </div>
        </form>
      </div>

      {/* Item list */}
      <div>
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-3">
          Parked — {items.length}
        </p>

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card px-4 py-8 text-center">
            <p className="font-mono text-[11px] text-muted-foreground">
              Nothing parked. Stay focused on the current mission.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            {items.map((item, idx) => {
              const deleteAction = deleteParkingLotItem.bind(null, item.id);
              return (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 px-4 py-3 bg-card ${
                    idx < items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-sm font-medium text-foreground">
                        {item.title}
                      </p>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/50 border border-border rounded px-1.5 py-0.5 shrink-0">
                        {CATEGORY_LABEL[item.category]}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <form action={deleteAction} className="shrink-0">
                    <button
                      type="submit"
                      aria-label={`Remove ${item.title}`}
                      className="font-mono text-[10px] text-muted-foreground/40 hover:text-destructive transition-colors py-2 px-2 min-h-[44px] flex items-center"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
