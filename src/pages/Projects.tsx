export function Projects() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-1 text-muted-foreground">Manage your creative projects</p>
        </div>
        <Button><span className="mr-2">+</span> New Project</Button>
      </div>
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No projects yet. Create your first project to get started.</p>
        </CardContent>
      </Card>
    </div>
  )
}