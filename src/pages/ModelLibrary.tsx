import { useProviderStore } from '@/stores'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cpu } from 'lucide-react'

export function ModelLibrary() {
  const { models, getConnectedProviders } = useProviderStore()
  const connectedProviders = getConnectedProviders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Model Library</h1>
        <p className="mt-1 text-muted-foreground">Browse available models from connected providers</p>
      </div>
      {connectedProviders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Cpu className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No providers connected</h3>
            <p className="mt-1 text-muted-foreground">Connect a provider to see available models</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {connectedProviders.map((providerId) => {
            const providerModels = models[providerId] || []
            return providerModels.length > 0 ? (
              <Card key={providerId}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" /> {providerId} Models ({providerModels.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {providerModels.map((model: any) => (
                      <div key={model.id} className="rounded-lg border border-border p-4">
                        <h4 className="font-medium">{model.name}</h4>
                        <p className="text-sm text-muted-foreground">{model.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {model.capabilities.imageToVideo && <Badge variant="secondary" className="text-xs">Image→Video</Badge>}
                          {model.capabilities.textToVideo && <Badge variant="secondary" className="text-xs">Text→Video</Badge>}
                          {model.capabilities.imageToImage && <Badge variant="secondary" className="text-xs">Image→Image</Badge>}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Max: {model.capabilities.maxDuration}s, {model.capabilities.maxResolution}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}