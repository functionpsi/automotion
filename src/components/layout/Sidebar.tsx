import { Link, useLocation } from 'react-router-dom'
import { useAppStore, useProviderStore, useGenerationStore } from '@/stores'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import { ScrollArea } from '../common/ScrollArea'
import {
  LayoutDashboard,
  Video,
  FolderOpen,
  History,
  Bot,
  Cpu,
  Plug,
  BarChart3,
  Settings,
  BookOpen,
  ChevronLeft,
  Zap,
  Sparkles,
  Activity,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Creative Studio', href: '/studio', icon: Video },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Generation History', href: '/history', icon: History },
  { name: 'AI Agents', href: '/agents', icon: Bot },
  { name: 'Model Library', href: '/models', icon: Cpu },
  { name: 'Provider Connections', href: '/providers', icon: Plug },
  { name: 'Usage & Costs', href: '/usage', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Documentation', href: '/docs', icon: BookOpen },
]

const legalNavigation = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms', href: '/terms' },
  { name: 'Acceptable Use', href: '/acceptable-use' },
  { name: 'Disclaimer', href: '/disclaimer' },
]

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()
  const location = useLocation()
  const { getConnectedProviders } = useProviderStore()
  const { getActiveJobsCount } = useGenerationStore()
  const connectedCount = getConnectedProviders().length
  const activeJobs = getActiveJobsCount()

  return (
    <aside
      className={`
        fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] 
        bg-card border-r border-border
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              className={`h-5 w-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
            />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`
                    flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                    transition-colors hover:bg-accent/10
                    ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}
                    ${sidebarCollapsed && 'justify-center'}
                  `}
                  aria-current={isActive ? 'page' : undefined}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                  {item.name === 'Provider Connections' && connectedCount > 0 && !sidebarCollapsed && (
                    <Badge variant="secondary" className="ml-auto">
                      {connectedCount}
                    </Badge>
                  )}
                  {item.name === 'Generation History' && activeJobs > 0 && !sidebarCollapsed && (
                    <Badge variant="default" className="ml-auto">
                      {activeJobs}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-6 border-t border-border pt-4">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Legal
              </p>
              <div className="mt-2 space-y-1">
                {legalNavigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!sidebarCollapsed && (
            <div className="mt-6 border-t border-border p-3">
              <div className="rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/10 p-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Automotion</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your imagination, in motion.
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Activity className="h-3 w-3" />
                  <span>v1.0.0</span>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </aside>
  )
}