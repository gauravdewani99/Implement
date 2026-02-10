import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { clientsApi } from "@/api/endpoints/clients"
import { progressApi } from "@/api/endpoints/progress"
import type { ClientResponse } from "@/api/types"
import { AppLayout } from "@/components/layout/AppLayout"
import { ClientCard } from "@/components/clients/ClientCard"
import { CreateClientDialog } from "@/components/clients/CreateClientDialog"
import { EmptyState } from "@/components/common/EmptyState"
import { Plus } from "lucide-react"
import { SkeletonCard } from "@/components/common/SkeletonCard"
import { motion } from "framer-motion"
import { staggerContainer, fadeInUp } from "@/styles/animations"

export function DashboardPage() {
  const [clients, setClients] = useState<ClientResponse[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
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

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <motion.div {...fadeInUp} className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
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
          <motion.div initial="initial" animate="animate" variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                progress={progressMap[client.id]}
                onClick={() => navigate(`/clients/${client.id}`)}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      <CreateClientDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={handleCreate} />
    </AppLayout>
  )
}
