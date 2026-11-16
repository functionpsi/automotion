export function TermsAndConditions() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Terms and Conditions</h1>
        <p className="mt-1 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Acceptable Use</h2>
          <p>You agree to use Automotion responsibly and in compliance with all applicable laws and the terms of your connected AI providers.</p>
          <h2 className="text-xl font-semibold">Your Responsibilities</h2>
          <p>You are responsible for your API keys, generated content, and compliance with provider terms of service.</p>
          <h2 className="text-xl font-semibold">Third-Party AI Providers</h2>
          <p>Automotion is not affiliated with or endorsed by any AI provider. You must comply with each provider's terms.</p>
          <h2 className="text-xl font-semibold">Intellectual Property</h2>
          <p>You retain rights to your inputs and generated outputs subject to provider terms.</p>
          <h2 className="text-xl font-semibold">Disclaimer</h2>
          <p>Automotion is provided "as is" without warranties. We are not liable for any damages from use.</p>
        </CardContent>
      </Card>
    </div>
  )
}