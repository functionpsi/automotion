import { useAgentStore } from '@/stores'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, Play, Pause, CheckCircle, XCircle, Clock } from 'lucide-react'

export function AIAgents() {
  const { agents } = useAgentStore()
  const agentList = Object.values(agents)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Agents</h1>
        <p className="mt-1 text-muted-foreground">Monitor and manage autonomous AI agents</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agentList.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No agents initialized</h3>
            <p className="mt-1 text-muted-foreground">Agents will appear when a workflow runs</p>
          </div>
        ) : (
          agentList.map((agent) => (
            <Card key={agent.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">{agent.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={
                      agent.status === 'completed' ? 'success' :
                      agent.status === 'error' ? 'error' :
                      agent.status === 'executing' ? 'info' : 'secondary'
                    }>
                      {agent.status}
                    </Badge>
                  </div>
                  {agent.currentTask && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Task</span>
                      <span className="text-sm">{agent.currentTask}</span>
                    </div>
                  )}
                  {agent.lastExecution && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Run</span>
                      <span className="text-sm">{new Date(agent.lastExecution.completedAt || agent.lastExecution.startedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}