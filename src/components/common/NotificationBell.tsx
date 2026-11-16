import { Bell } from 'lucide-react'
import { useAppStore } from '@/stores'

export function NotificationBell() {
  const { notifications } = useAppStore()
  const unread = notifications.length

  return (
    <button
      className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Notifications (${unread} unread)`}
      title="Notifications"
    >
      <Bell className="h-4 w-4" />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </button>
  )
}