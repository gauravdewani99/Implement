import { Check, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type Status = "idle" | "saving" | "saved" | "error"

export function SaveIndicator({ status }: { status: Status }) {
  if (status === "idle") return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-all",
        status === "saving" && "text-muted-foreground",
        status === "saved" && "text-green-600",
        status === "error" && "text-destructive",
      )}
    >
      {status === "saving" && <Loader2 className="w-3 h-3 animate-spin" />}
      {status === "saved" && <Check className="w-3 h-3" />}
      {status === "error" && <AlertCircle className="w-3 h-3" />}
      <span>
        {status === "saving" && "Saving..."}
        {status === "saved" && "Saved"}
        {status === "error" && "Save failed"}
      </span>
    </div>
  )
}
