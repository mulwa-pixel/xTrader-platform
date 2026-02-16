export const metadata = {
  title: 'ROSTOVA 3.0 - Ultimate Deriv Trading Platform',
  description: 'Better than dollarprinter.com',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
