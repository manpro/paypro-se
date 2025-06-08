import React from 'react'
import Head from 'next/head'
import Header from '@/components/layout/Header'
import HomePage from '@/components/HomePage'
import { Locale, i18n } from '@/i18n.config'
import { getTranslation } from '@/lib/translations'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export default function HomePageWrapper({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = (key: string) => getTranslation(key as keyof import('@/lib/translations').Translations, locale)

  return (
    <>
      <Head>
        <title>PayPro.se - {locale === 'sv' ? 'Ekonomisk analys och makrodata' : 'Economic Analysis and Macro Data'}</title>
        <meta name="description" content={t('hero.description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header locale={locale} />
      <HomePage locale={locale} t={t} />
    </>
  )
} 