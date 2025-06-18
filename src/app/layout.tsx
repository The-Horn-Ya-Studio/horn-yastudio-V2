import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Toaster } from 'shadcn-ui'

export const metadata = {
  title: 'Horn-Ya Studio',
  description: 'Komunitas Kreatif Pecinta Anime & Game',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-mocha-base text-mocha-text min-h-screen">
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
