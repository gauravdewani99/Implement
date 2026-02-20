import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function ProgressBar({
  percentage,
  size = "md",
  showLabel = true,
  variant = "default",
  className,
}: {
  percentage: number
  size?: "sm" | "md"
  showLabel?: boolean
  variant?: "default" | "sidebar"
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2", className)} role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={cn(
          "flex-1 rounded-full overflow-hidden",
          size === "sm" ? "h-1.5" : "h-2",
          variant === "sidebar" ? "bg-white/10" : "bg-muted",
        )}
      >
        <motion.div
          className={cn(
            "h-full rounded-full",
            variant === "sidebar"
              ? "bg-gradient-to-r from-brand-teal to-brand-green"
              : "bg-gradient-to-r from-primary to-primary/80",
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      </div>
      {showLabel && (
        <span className={cn(
          "font-medium tabular-nums text-xs",
          variant === "sidebar" ? "text-sidebar-foreground/60" : "text-muted-foreground",
        )}>
          {percentage}%
        </span>
      )}
    </div>
  )
}
