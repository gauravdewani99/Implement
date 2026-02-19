import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { clientsApi } from "@/api/endpoints/clients"
import { progressApi } from "@/api/endpoints/progress"
import type { ClientResponse } from "@/api/types"
import { AppLayout } from "@/components/layout/AppLayout"
import { CreateClientDialog } from "@/components/clients/CreateClientDialog"
import { EmptyState } from "@/components/common/EmptyState"
import { ProgressBar } from "@/components/onboarding/ProgressBar"
import { Plus, ArrowUpDown, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { fadeInUp } from "@/styles/animations"

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-status-draft text-status-draft-foreground" },
  in_progress: { label: "In Progress", className: "bg-status-in-progress text-status-in-progress-foreground" },
  completed: { label: "Completed", className: "bg-status-completed text-status-completed-foreground" },
}

type SortField = "name" | "updated_at"
type SortDir = "asc" | "desc"

export function DashboardPage() {
  const [clients, setClients] = useState<ClientResponse[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sortField, setSortField] = useState<SortField>("updated_at")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const navigate = useNavigate()

  useEffect(() => {
    loadClients()
  }, [])

  async function loadClients() {
    try {
      const data = await clientsApi.list()
      setClients(data)
      const progresses: Record<string, number> = {}
      for (const c of data) {
        try {
          const p = await progressApi.get(c.id)
          progresses[c.id] = p.overall.percentage
        } catch {
          progresses[c.id] = 0
        }
      }
      setProgressMap(progresses)
    } catch {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(name: string) {
    const client = await clientsApi.create(name)
    setDialogOpen(false)
    navigate(`/clients/${client.id}`)
  }

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir(field === "name" ? "asc" : "desc")
    }
  }

  const sortedClients = useMemo(() => {
    return [...clients].sort((a, b) => {
      let cmp = 0
      if (sortField === "name") {
        cmp = a.name.localeCompare(b.name)
      } else {
        cmp = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
      }
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [clients, sortField, sortDir])

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <motion.div {...fadeInUp} className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Clients</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage client onboarding configurations</p>
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            New Client
          </button>
        </div>

        {clients.length === 0 ? (
          <EmptyState
            title="No clients yet"
            description="Create your first client to start capturing onboarding configurations."
            action={
              <button
                onClick={() => setDialogOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create First Client
              </button>
            }
          />
        ) : (
          <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3">
                    <button
                      onClick={() => toggleSort("name")}
                      className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                      Client Name
                      <ArrowUpDown className={cn("w-3 h-3", sortField === "name" && "text-foreground")} />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
                  </th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress</span>
                  </th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">
                    <button
                      onClick={() => toggleSort("updated_at")}
                      className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                      Last Updated
                      <ArrowUpDown className={cn("w-3 h-3", sortField === "updated_at" && "text-foreground")} />
                    </button>
                  </th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {sortedClients.map((client) => {
                  const status = STATUS_LABELS[client.status] ?? STATUS_LABELS.draft
                  const progress = progressMap[client.id] ?? 0
                  return (
                    <tr
                      key={client.id}
                      onClick={() => navigate(`/clients/${client.id}`)}
                      className="border-b border-border last:border-b-0 hover:bg-muted/30 cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-foreground">{client.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap", status.className)}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="w-32">
                          <ProgressBar percentage={progress} size="sm" />
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {new Date(client.updated_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <CreateClientDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={handleCreate} />
    </AppLayout>
  )
}
