import { cn } from "@/lib/utils";

export function Loading({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <div className="h-8 w-8 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin" />
    </div>
  );
}
