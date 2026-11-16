export function GenerationHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Generation History</h1>
        <p className="mt-1 text-muted-foreground">View and manage your video generations</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No generations yet. Start creating in the Creative Studio.</p>
        </CardContent>
      </Card>
    </div>
  )
}