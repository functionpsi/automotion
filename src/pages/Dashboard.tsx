import { Link } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useProviderStore, useGenerationStore, useProjectStore } from '@/stores'
import {
  Video,
  FolderOpen,
  Bot,
  Cpu,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Film,
  Image as ImageIcon,
} from 'lucide-react'

const quickActions = [
  {
    name: 'Image to Video',
    description: 'Transform still images into motion',
    icon: Film,
    href: '/studio?type=image_to_video',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Text to Video',
    description: 'Generate videos from text descriptions',
    icon: ImageIcon,
    href: '/studio?type=text_to_video',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Image to Image',
    description: 'Transform and enhance your images',
    icon: Sparkles,
    href: '/studio?type=image_to_image',
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'New Project',
    description: 'Start a fresh creative project',
    icon: FolderOpen,
    href: '/projects?new=true',
    color: 'from-orange-500 to-amber-500',
  },
]

export function Dashboard() {
  const { getConnectedProviders, providers } = useProviderStore()
  const { jobs, activeJobs } = useGenerationStore()
  const { projects } = useProjectStore()

  const connectedProviders = getConnectedProviders()
  const completedJobs = Object.values(jobs).filter((j) => j.status === 'completed').length
  const processingJobs = activeJobs.length

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-purple-500/10 to-background p-8 border border-primary/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative">
          <h1 className="text-3xl font-bold">Welcome to Automotion</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your imagination. In motion. Transform static images into dynamic video experiences
            powered by autonomous AI agents.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/studio">
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90">
                <Video className="mr-2 h-5 w-5" />
                Open Creative Studio
              </Button>
            </Link>
            <Link to="/providers">
              <Button size="lg" variant="outline">
                <Cpu className="mr-2 h-5 w-5" />
                Connect Providers
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingJobs}</div>
            <p className="text-xs text-muted-foreground">Running now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{completedJobs}</div>
            <p className="text-xs text-muted-foreground">Total generations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">Total projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Providers</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedProviders.length}</div>
            <p className="text-xs text-muted-foreground">Connected</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}