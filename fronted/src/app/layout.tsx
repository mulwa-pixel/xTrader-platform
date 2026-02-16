import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ROSTOVA 3.0 - Ultimate Deriv Trading Platform',
  description: 'Better than dollarprinter.com - Multi-chart, AI signals, bots, copy trading',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
