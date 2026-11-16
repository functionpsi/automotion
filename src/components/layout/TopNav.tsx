import { Link } from 'react-router-dom'
import { useAppStore, useProviderStore } from '@/stores'
import { Button } from '../common/Button'
import { Avatar } from '../common/Avatar'
import { ThemeToggle } from '../common/ThemeToggle'
import { NotificationBell } from '../common/NotificationBell'
import { Menu, X } from 'lucide-react'

export function TopNav() {
  const { mobileMenuOpen, setMobileMenuOpen } = useAppStore()
  const { getConnectedProviders } = useProviderStore()
  const connectedCount = getConnectedProviders().length

  return (
    <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-500">
            <span className="text-lg font-bold text-white">A</span>
          </div>
          <span className="hidden text-xl font-bold sm:inline-block">Automotion</span>
        </Link>
      </div>

      <div className="hidden md:flex md:items-center md:gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-1.5">
          <div
            className={`h-2 w-2 rounded-full ${connectedCount > 0 ? 'bg-green-500' : 'bg-muted-foreground'}`}
          />
          <span className="text-sm text-muted-foreground">
            {connectedCount > 0 ? `${connectedCount} provider${connectedCount > 1 ? 's' : ''} connected` : 'No providers connected'}
          </span>
        </div>
        <ThemeToggle />
        <NotificationBell />
        <Avatar />
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  )
}