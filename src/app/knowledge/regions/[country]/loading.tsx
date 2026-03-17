export default function Loading() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pt-4">
      <div className="h-6 w-24 bg-[#F0ECE6] rounded animate-pulse" />
      <div className="h-8 w-48 bg-[#F0ECE6] rounded animate-pulse" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card border-0 p-6 space-y-3">
            <div className="h-6 w-40 bg-[#F0ECE6] rounded animate-pulse" />
            <div className="h-4 w-full bg-[#F0ECE6] rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-[#F0ECE6] rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
