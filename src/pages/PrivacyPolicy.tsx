export function PrivacyPolicy() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-1 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Information We Collect</h2>
          <p>Automotion is a client-side application. We do not collect, store, or transmit your personal data, API keys, or generated content to our servers.</p>
          <h2 className="text-xl font-semibold">Local Storage</h2>
          <p>All data including projects, settings, and generation history is stored locally in your browser using IndexedDB.</p>
          <h2 className="text-xl font-semibold">API Credentials</h2>
          <p>Your API keys are stored in browser memory by default and never leave your device. Optional encrypted local storage is available with explicit consent.</p>
          <h2 className="text-xl font-semibold">Third-Party Providers</h2>
          <p>When you generate content, your prompts and images are sent directly to the AI provider you selected. We do not proxy or log these requests.</p>
          <h2 className="text-xl font-semibold">Data Retention</h2>
          <p>Local data persists until you clear it. You can delete all data from Settings > Advanced.</p>
          <h2 className="text-xl font-semibold">Contact</h2>
          <p>For privacy questions, contact: privacy@automotion.example.com</p>
        </CardContent>
      </Card>
    </div>
  )
}