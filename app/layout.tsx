import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EOY Review - Vue Radar Level V3',
  description: 'Auto-évaluation basée sur le framework Level V3',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
