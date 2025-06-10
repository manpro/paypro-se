import '../globals.css'
import { Inter } from 'next/font/google'
import { Locale, i18n } from '@/i18n.config'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export const metadata = {
  title: 'PayPro.se - Ekonomisk analys och makrodata',
  description: 'Sveriges ledande plattform för ekonomisk analys, makrodata och finansiell rådgivning.',
  robots: 'index, follow',
  keywords: 'svensk ekonomi, BNP, inflation, arbetslöshet, reporänta, valutakurser, ekonomisk analys, finansiell rådgivning',
  authors: [{ name: 'PayPro.se' }],
  creator: 'PayPro.se',
  publisher: 'PayPro.se',
  openGraph: {
    title: 'PayPro.se - Ekonomisk analys och makrodata',
    description: 'Sveriges ledande plattform för ekonomisk analys, makrodata och finansiell rådgivning.',
    url: 'https://paypro.se',
    siteName: 'PayPro.se',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PayPro.se - Ekonomisk analys och makrodata',
    description: 'Sveriges ledande plattform för ekonomisk analys, makrodata och finansiell rådgivning.',
  },
}

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  return (
    <html lang={params.locale}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        {children}
        <Footer locale={params.locale} />
      </body>
    </html>
  )
} 