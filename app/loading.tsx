export default function Loading() {
  return (
    <div className="container-shell py-16">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-[2rem] bg-surface" />
        <div className="space-y-4">
          <div className="h-6 w-1/3 animate-pulse rounded-full bg-surface" />
          <div className="h-12 w-4/5 animate-pulse rounded-2xl bg-surface" />
          <div className="h-24 animate-pulse rounded-3xl bg-surface" />
        </div>
      </div>
    </div>
  );
}
