import { Sun, Moon, Monitor } from 'lucide-react'
import { useSettingsStore } from '@/stores'
import type { Theme } from '@/types/settings'

const themes: { value: Theme; label: string; icon: any }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export function ThemeToggle() {
  const { settings, updateSettings } = useSettingsStore()
  const current = settings.theme
  const currentIndex = themes.findIndex((t) => t.value === current)
  const nextIndex = (currentIndex + 1) % themes.length

  const handleClick = () => {
    updateSettings({ theme: themes[nextIndex].value })
  }

  const CurrentIcon = themes[currentIndex]?.icon || Moon

  return (
    <button
      onClick={handleClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Switch to ${themes[nextIndex].label} theme`}
      title={`Theme: ${current} (click for ${themes[nextIndex].label})`}
    >
      <CurrentIcon className="h-4 w-4" />
    </button>
  )
}