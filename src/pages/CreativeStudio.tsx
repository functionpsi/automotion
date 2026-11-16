export function CreativeStudio() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Creative Studio</h1>
        <p className="mt-1 text-muted-foreground">
          Transform images and text into video using AI
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle>Canvas</CardTitle></CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Upload an image or describe a scene to begin</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Controls</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Generation controls will appear here</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>AI Agents</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Agent activity will appear here</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}