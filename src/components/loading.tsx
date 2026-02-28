import { cn } from "@/lib/utils";

export function Loading({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <div className="h-8 w-8 rounded-full border-4 border-blue-800 border-t-blue-600 animate-spin" />
    </div>
  );
}
