import React from 'react'
import Head from 'next/head'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getTranslation } from '@/lib/translations'
import { Locale, i18n } from '@/i18n.config'
import MacroDashboardClient from '@/components/dashboards/MacroDashboardClient'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export default function SverigeMakroDashboard({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = (key: keyof import('@/lib/translations').Translations) => getTranslation(key, locale)

  return (
    <>
      <Head>
        <title>{t('macro.title')} - PayPro.se</title>
        <meta name="description" content={t('macro.description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header locale={locale} />
      <MacroDashboardClient locale={locale} />
      <Footer />
    </>
  )
} 