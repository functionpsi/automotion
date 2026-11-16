export function AcceptableUse() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Acceptable Use Policy</h1>
      </div>
      <Card>
        <CardContent className="space-y-4">
          <p>Automotion must not be used for:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Generating illegal content</li>
            <li>Creating deepfakes or misleading media</li>
            <li>Violating intellectual property rights</li>
            <li>Generating harmful or abusive content</li>
            <li>Spam or automated abuse</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}