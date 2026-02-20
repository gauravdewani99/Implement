import { useState, type ReactNode } from "react"
import { Header } from "./Header"
import { Footer } from "./Footer"

export function AppLayout({ children, sidebar }: { children: ReactNode; sidebar?: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <Header onToggleSidebar={sidebar ? () => setSidebarOpen(!sidebarOpen) : undefined} />
      <div className="flex-1 flex overflow-hidden">
        {sidebar && (
          <>
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            <aside
              className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-sidebar-border bg-sidebar-background overflow-y-auto transform transition-transform duration-200 ease-out md:relative md:translate-x-0 md:shrink-0 md:z-auto ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="pt-16 md:pt-0">
                {sidebar}
              </div>
            </aside>
          </>
        )}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
