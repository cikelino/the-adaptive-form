export function BudgetSkeleton() {
  return (
    <div className="w-full max-w-md animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
      <div className="mb-4 flex justify-between">
        <div className="h-4 w-24 rounded bg-neutral-800" />
        <div className="h-6 w-20 rounded bg-neutral-800" />
      </div>
      <div className="h-2 w-full rounded-full bg-neutral-800" />
      <div className="mt-4 h-4 w-3/4 rounded bg-neutral-800" />
    </div>
  );
}