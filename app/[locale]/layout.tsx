import './globals.css'
import { Inter } from 'next/font/google'
import { Locale, i18n } from '@/i18n.config'

const inter = Inter({ subsets: ['latin'] })

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export const metadata = {
  title: 'PayPro.se - Ekonomisk analys och makrodata',
  description: 'Sveriges ledande plattform för ekonomisk analys, makrodata och finansiell rådgivning.',
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  return (
    <html lang={params.locale}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 