import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'xTrader Pro - AI-Powered Trading Platform',
  description: 'Professional Deriv trading platform with AI signals, copy trading, and strategy marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
