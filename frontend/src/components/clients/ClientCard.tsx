import type { ClientResponse } from "@/api/types"
import { ProgressBar } from "@/components/onboarding/ProgressBar"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { fadeInUp } from "@/styles/animations"

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-status-draft text-status-draft-foreground" },
  in_progress: { label: "In Progress", className: "bg-status-in-progress text-status-in-progress-foreground" },
  completed: { label: "Completed", className: "bg-status-completed text-status-completed-foreground" },
}

export function ClientCard({
  client,
  progress,
  onClick,
}: {
  client: ClientResponse
  progress?: number
  onClick: () => void
}) {
  const status = STATUS_LABELS[client.status] ?? STATUS_LABELS.draft

  return (
    <motion.div variants={fadeInUp}>
      <button
        onClick={onClick}
        className="w-full text-left border border-border rounded-xl p-5 shadow-sm hover:border-ring/40 hover:shadow-sm transition-all bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-semibold text-card-foreground truncate">{client.name}</h3>
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full shrink-0", status.className)}>
            {status.label}
          </span>
        </div>
        <ProgressBar percentage={progress ?? 0} size="sm" className="mb-2" />
        <p className="text-xs text-muted-foreground">
          Updated {new Date(client.updated_at).toLocaleDateString()}
        </p>
      </button>
    </motion.div>
  )
}
