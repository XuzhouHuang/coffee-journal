export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-4">
      <div className="h-4 w-20 bg-[#F0ECE6] rounded animate-pulse" />
      <div className="space-y-3">
        <div className="h-4 w-32 bg-[#F0ECE6] rounded animate-pulse" />
        <div className="h-8 w-full bg-[#F0ECE6] rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-[#F0ECE6] rounded animate-pulse" />
      </div>
      <div className="h-px bg-[#E8E2DA]" />
      <div className="space-y-3">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="h-4 w-full bg-[#F0ECE6] rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}
