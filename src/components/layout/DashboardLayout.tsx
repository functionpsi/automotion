import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { NotificationContainer } from '../common/NotificationContainer'
import { useAppStore } from '@/stores'
import { useSettingsStore } from '@/stores'
import { useEffect } from 'react'

export function DashboardLayout() {
  const { sidebarCollapsed } = useAppStore()
  const { settings } = useSettingsStore()

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.add(prefersDark ? 'dark' : 'light')
    } else {
      root.classList.add(settings.theme)
    }
    if (settings.accessibility.reducedMotion) {
      root.classList.add('reduce-motion')
    }
    if (settings.accessibility.highContrast) {
      root.classList.add('high-contrast')
    }
    if (settings.accessibility.largeText) {
      root.classList.add('text-lg')
    }
  }, [settings])

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <Sidebar />
        <main
          className={`
            flex-1 transition-all duration-300
            ${sidebarCollapsed ? 'ml-16' : 'ml-64'}
          `}
        >
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
      <NotificationContainer />
    </div>
  )
}