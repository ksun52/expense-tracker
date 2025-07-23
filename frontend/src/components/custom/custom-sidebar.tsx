import {
  Home,
  Layers,
  CreditCard,
  BarChart2,
  PieChart,
  Map,
  Calendar,
  Target,
  TrendingUp,
  ThumbsUp,
  Search,
  Bell,
  Settings,
  Menu,
  ChartLine,
  ChartPie,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard', icon: Home, to: '/' },
  { label: 'Accounts', icon: Layers, to: '/accounts' },
  { label: 'Transactions', icon: CreditCard, to: '/transactions' },
  { label: 'Cash Flow', icon: BarChart2, to: '/cashflow' },
  { label: 'Reports', icon: PieChart, to: '/reports' },
  { label: 'Budget', icon: Map, to: '/budget' },
  { label: 'Recurring', icon: Calendar, to: '/recurring' },
  { label: 'Goals', icon: Target, to: '/goals' },
  { label: 'Investments', icon: TrendingUp, to: '/investments' },
  { label: 'Advice', icon: ThumbsUp, to: '/advice' },
  { label: 'Charts', icon: ChartLine, to: '/charts' },
  { label: 'Graphs', icon: ChartPie, to: '/graphs' },
]

export function Sidebar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white border p-2 rounded-md shadow-sm"
        onClick={() => setOpen(!open)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-56 bg-white border-r flex flex-col p-4 z-40 transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-6 px-1">
          <img src="logo.png" alt="Logo" className="w-10 h-10" />
          <div className="hidden md:flex gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Bell className="w-5 h-5 text-muted-foreground" />
            <Settings className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map(({ label, icon: Icon, to }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={label}
                to={to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-muted text-primary'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
                onClick={() => setOpen(false)} // auto-close on mobile
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
