import { useState } from 'react'
import { Sidebar, Topbar } from '../components/dashboard'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#05070c] text-white">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0 w-full max-w-full">
        <Topbar onOpenMobileSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto px-3.5 py-5 sm:px-6 sm:py-6 lg:px-8 w-full max-w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
