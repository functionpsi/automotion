import { X } from 'lucide-react'
import { useAppStore } from '@/stores'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export function NotificationContainer() {
  const { notifications, removeNotification } = useAppStore()

  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            'flex items-center gap-3 rounded-lg border bg-card p-4 shadow-lg min-w-[300px] max-w-md animate-slide-in',
            notification.type === 'success' && 'border-green-500/50',
            notification.type === 'error' && 'border-red-500/50',
            notification.type === 'warning' && 'border-yellow-500/50',
            notification.type === 'info' && 'border-blue-500/50'
          )}
        >
          <Badge
            variant={
              notification.type === 'success'
                ? 'success'
                : notification.type === 'error'
                ? 'error'
                : notification.type === 'warning'
                ? 'warning'
                : 'info'
            }
          >
            {notification.type}
          </Badge>
          <div className="flex-1">
            <p className="font-medium">{notification.title}</p>
            {notification.message && (
              <p className="text-sm text-muted-foreground">{notification.message}</p>
            )}
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}