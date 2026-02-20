import { useAuth } from "@/contexts/AuthContext"
import { LogOut, Menu, User } from "lucide-react"

export function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 border-b border-border/50 bg-background px-4 sm:px-6 flex items-center shrink-0">
      {/* Left zone: hamburger + logo */}
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
        <img src="/rebound-logo.png" alt="ReBound" className="h-10 w-auto" />
        <div className="hidden sm:block h-7 w-px bg-border/60" />
      </div>

      {/* Center zone: app name */}
      <div className="flex-1 flex justify-center">
        <span className="text-base font-semibold text-foreground tracking-tight">Implement</span>
      </div>

      {/* Right zone: user + logout */}
      {user ? (
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
      ) : (
        <div className="w-[72px]" /> /* Spacer to balance the left zone */
      )}
    </header>
  )
}
