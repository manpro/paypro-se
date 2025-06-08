import React from 'react'
import Header from '@/components/layout/Header'
import MacroDashboardClient from '@/components/dashboards/MacroDashboardClient'
import { Locale, i18n } from '@/i18n.config'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export default function MacroPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params

  return (
    <>
      <Header locale={locale} />
      <MacroDashboardClient locale={locale} />
    </>
  )
}