import { cn } from '@/lib/utils'
import { User } from 'lucide-react'

export function Avatar() {
  return (
    <button
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="User account"
      title="Automotion User"
    >
      <User className="h-5 w-5 text-muted-foreground" />
    </button>
  )
}