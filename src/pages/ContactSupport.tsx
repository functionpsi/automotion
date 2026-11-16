export function ContactSupport() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Contact & Support</h1>
      </div>
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Get Help</h2>
          <p>For support, feature requests, or bug reports:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Email: support@automotion.example.com</li>
            <li>GitHub Issues: <a href="https://github.com/functionpsi/automotion/issues" className="text-primary hover:underline" target="_blank" rel="noopener">github.com/functionpsi/automotion/issues</a></li>
          </ul>
          <h2 className="text-xl font-semibold">Community</h2>
          <p>Join our community discussions on GitHub Discussions.</p>
        </CardContent>
      </Card>
    </div>
  )
}