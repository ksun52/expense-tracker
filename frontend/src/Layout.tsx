import type { ReactNode } from 'react'
import { Sidebar } from './components/custom/custom-sidebar'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto md:ml-56">
        {children}
      </main>
    </div>
  )
}
