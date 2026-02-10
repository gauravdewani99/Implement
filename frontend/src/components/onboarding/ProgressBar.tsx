import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function ProgressBar({
  percentage,
  size = "md",
  showLabel = true,
  className,
}: {
  percentage: number
  size?: "sm" | "md"
  showLabel?: boolean
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2", className)} role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={cn(
          "flex-1 bg-muted rounded-full overflow-hidden",
          size === "sm" ? "h-1.5" : "h-2",
        )}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      </div>
      {showLabel && (
        <span className={cn("text-muted-foreground font-medium tabular-nums text-xs")}>
          {percentage}%
        </span>
      )}
    </div>
  )
}
