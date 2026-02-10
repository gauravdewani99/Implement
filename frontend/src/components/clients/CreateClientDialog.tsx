import { useState, type FormEvent } from "react"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import { scaleIn } from "@/styles/animations"

export function CreateClientDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (name: string) => void
}) {
  const [name, setName] = useState("")

  if (!open) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
      setName("")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div {...scaleIn} className="relative bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-lg" role="dialog" aria-modal="true" aria-labelledby="create-client-title">
        <div className="flex items-center justify-between mb-4">
          <h2 id="create-client-title" className="text-lg font-semibold text-card-foreground">Create New Client</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-foreground mb-1.5">Client Name</label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Nike EMEA"
            className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground hover:border-ring/40 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 mb-4"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border border-input hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
            >
              Create Client
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
