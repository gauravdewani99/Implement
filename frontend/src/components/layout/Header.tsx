import { useAuth } from "@/contexts/AuthContext"
import { LogOut, Menu, User } from "lucide-react"

export function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 border-b border-border/50 bg-background px-4 sm:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
        )}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
          <span className="text-primary-foreground font-semibold text-sm">R</span>
        </div>
        <span className="font-semibold text-foreground tracking-tight">Implement</span>
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{user.full_name || user.email}</span>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}
    </header>
  )
}
