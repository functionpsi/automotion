import * as React from 'react'
import { cn } from '@/lib/utils'

export function ScrollArea({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('relative h-full overflow-y-auto no-scrollbar', className)}
      {...props}
    >
      {children}
    </div>
  )
}