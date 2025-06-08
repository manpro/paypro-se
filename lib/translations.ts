import { Locale } from '@/i18n.config'

export interface Translations {
  // Navigation
  'nav.home': string
  'nav.dashboards': string
  'nav.blog': string
  'nav.macro': string
  'nav.navigation': string
  
  // Homepage Hero
  'hero.subtitle': string
  'hero.description': string
  'hero.cta_dashboard': string
  'hero.cta_blog': string
  
  // Features
  'features.live_data.title': string
  'features.live_data.description': string
  'features.analysis.title': string
  'features.analysis.description': string
  'features.tools.title': string
  'features.tools.description': string
  
  // Statistics
  'stats.title': string
  'stats.indicators': string
  'stats.frequency': string
  'stats.languages': string
  'stats.availability': string
  
  // CTA Section
  'cta.title': string
  'cta.description': string
  'cta.button': string
  
  // Dashboard - Swedish Macro
  'macro.title': string
  'macro.description': string
  'macro.updated': string
  'macro.refresh': string
  'macro.refreshing': string
  'macro.live': string
  'macro.error': string
  
  // Metrics
  'metric.gdp': string
  'metric.gdp.desc': string
  'metric.inflation': string
  'metric.inflation.desc': string
  'metric.unemployment': string
  'metric.unemployment.desc': string
  'metric.repo_rate': string
  'metric.repo_rate.desc': string
  'metric.sek_eur': string
  'metric.sek_eur.desc': string
  'metric.usd_sek': string
  'metric.usd_sek.desc': string
  'metric.usd_eur': string
  'metric.usd_eur.desc': string
  'metric.debt_ratio': string
  'metric.debt_ratio.desc': string
  
  // Charts
  'chart.gdp.title': string
  'chart.gdp.subtitle': string
  'chart.inflation.title': string
  'chart.inflation.subtitle': string
  'chart.rates.title': string
  'chart.rates.subtitle': string
  'chart.repo.title': string
  'chart.repo.subtitle': string
  
  // Data sources
  'sources.title': string
  'sources.live.title': string
  'sources.live.desc': string
  'sources.updated': string
}

const translations: Record<Locale, Translations> = {
  sv: {
    // Navigation
    'nav.home': 'Hem',
    'nav.dashboards': 'Dashboards',
    'nav.blog': 'Blogg',
    'nav.macro': 'Makroekonomi',
    'nav.navigation': 'Navigation',
    
    // Homepage Hero
    'hero.subtitle': 'Sveriges ekonomiska nav',
    'hero.description': 'Live ekonomisk data, djupgående analyser och professionell rådgivning för investerare och beslutsfattare.',
    'hero.cta_dashboard': '📊 Se Makro Dashboard',
    'hero.cta_blog': '📰 Läs Analyser',
    
    // Features
    'features.live_data.title': 'Live Makrodata',
    'features.live_data.description': 'Realtidsdata från SCB och Riksbank. BNP, inflation, arbetslöshet och valutakurser uppdateras kontinuerligt.',
    'features.analysis.title': 'Djupgående Analyser',
    'features.analysis.description': 'Professionella marknadsanalyser och investeringsinsikter från vårt expertteam och AI-assistenter.',
    'features.tools.title': 'Precisionsverktyg',
    'features.tools.description': 'Avancerade dashboard och visualiseringar för att förstå komplexa ekonomiska samband.',
    
    // Statistics
    'stats.title': 'PayPro i siffror',
    'stats.indicators': 'Ekonomiska Indikatorer',
    'stats.frequency': 'Uppdateringsfrekvens',
    'stats.languages': 'Språk Stödda',
    'stats.availability': 'Tillgänglighet',
    
    // CTA Section
    'cta.title': 'Börja utforska Sveriges ekonomi idag',
    'cta.description': 'Få tillgång till professionell ekonomisk analys och live-data.',
    'cta.button': 'Kom igång →',
    
    // Dashboard
    'macro.title': '🇸🇪 Sveriges Makroekonomi Dashboard',
    'macro.description': 'Kompletta ekonomiska nyckeltal och trender för den svenska ekonomin',
    'macro.updated': 'Senast uppdaterad:',
    'macro.refresh': 'Uppdatera',
    'macro.refreshing': 'Uppdaterar...',
    'macro.live': 'Live',
    'macro.error': 'Error',
    
    // Metrics
    'metric.gdp': 'BNP Tillväxt',
    'metric.gdp.desc': 'Kvartal över kvartal',
    'metric.inflation': 'Inflation (KPI)',
    'metric.inflation.desc': 'Årlig förändring',
    'metric.unemployment': 'Arbetslöshet',
    'metric.unemployment.desc': 'Senaste månaden',
    'metric.repo_rate': 'Reporänta',
    'metric.repo_rate.desc': 'Sveriges Riksbank',
    'metric.sek_eur': 'SEK/EUR',
    'metric.sek_eur.desc': 'Svenska kronor per euro',
    'metric.usd_sek': 'USD/SEK',
    'metric.usd_sek.desc': 'US-dollar per svensk krona',
    'metric.usd_eur': 'USD/EUR',
    'metric.usd_eur.desc': 'US-dollar per euro',
    'metric.debt_ratio': 'Skuldsättning',
    'metric.debt_ratio.desc': 'Hushållsskulder/inkomst',
    
    // Charts
    'chart.gdp.title': 'BNP-tillväxt - Senaste kvartalen',
    'chart.gdp.subtitle': 'Säsongrensad, kvartal över kvartal',
    'chart.inflation.title': 'Inflation (KPI) - Senaste månaderna',
    'chart.inflation.subtitle': 'Årlig procentuell förändring',
    'chart.rates.title': 'Växelkurser - Utveckling 2025',
    'chart.rates.subtitle': 'SEK/EUR och USD/SEK',
    'chart.repo.title': 'Reporänta - Utveckling 2025',
    'chart.repo.subtitle': 'Sveriges Riksbanks styrränta',
    
    // Data sources
    'sources.title': 'Datakällor och Notiser - Sveriges Ekonomi',
    'sources.live.title': 'Live data från officiella källor',
    'sources.live.desc': 'Data hämtas direkt från SCB och Sveriges Riksbank via deras officiella API:er.',
    'sources.updated': 'Senast uppdaterad:',
  },
  
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboards': 'Dashboards',
    'nav.blog': 'Blog',
    'nav.macro': 'Macroeconomics',
    'nav.navigation': 'Navigation',
    
    // Homepage Hero
    'hero.subtitle': 'Sweden\'s Economic Hub',
    'hero.description': 'Live economic data, in-depth analysis and professional advisory for investors and decision makers.',
    'hero.cta_dashboard': '📊 View Macro Dashboard',
    'hero.cta_blog': '📰 Read Analysis',
    
    // Features
    'features.live_data.title': 'Live Macro Data',
    'features.live_data.description': 'Real-time data from SCB and Riksbank. GDP, inflation, unemployment and exchange rates updated continuously.',
    'features.analysis.title': 'In-Depth Analysis',
    'features.analysis.description': 'Professional market analysis and investment insights from our expert team and AI assistants.',
    'features.tools.title': 'Precision Tools',
    'features.tools.description': 'Advanced dashboards and visualizations to understand complex economic relationships.',
    
    // Statistics
    'stats.title': 'PayPro in Numbers',
    'stats.indicators': 'Economic Indicators',
    'stats.frequency': 'Update Frequency',
    'stats.languages': 'Languages Supported',
    'stats.availability': 'Availability',
    
    // CTA Section
    'cta.title': 'Start exploring Sweden\'s economy today',
    'cta.description': 'Get access to professional economic analysis and live data.',
    'cta.button': 'Get Started →',
    
    // Dashboard
    'macro.title': '🇸🇪 Swedish Macroeconomic Dashboard',
    'macro.description': 'Comprehensive economic indicators and trends for the Swedish economy',
    'macro.updated': 'Last updated:',
    'macro.refresh': 'Refresh',
    'macro.refreshing': 'Refreshing...',
    'macro.live': 'Live',
    'macro.error': 'Error',
    
    // Metrics
    'metric.gdp': 'GDP Growth',
    'metric.gdp.desc': 'Quarter over quarter',
    'metric.inflation': 'Inflation (CPI)',
    'metric.inflation.desc': 'Annual change',
    'metric.unemployment': 'Unemployment',
    'metric.unemployment.desc': 'Latest month',
    'metric.repo_rate': 'Repo Rate',
    'metric.repo_rate.desc': 'Sweden\'s Central Bank',
    'metric.sek_eur': 'SEK/EUR',
    'metric.sek_eur.desc': 'Swedish kronor per euro',
    'metric.usd_sek': 'USD/SEK',
    'metric.usd_sek.desc': 'US dollars per Swedish krona',
    'metric.usd_eur': 'USD/EUR',
    'metric.usd_eur.desc': 'US dollars per euro',
    'metric.debt_ratio': 'Debt Ratio',
    'metric.debt_ratio.desc': 'Household debt/income',
    
    // Charts
    'chart.gdp.title': 'GDP Growth - Recent Quarters',
    'chart.gdp.subtitle': 'Seasonally adjusted, quarter over quarter',
    'chart.inflation.title': 'Inflation (CPI) - Recent Months',
    'chart.inflation.subtitle': 'Annual percentage change',
    'chart.rates.title': 'Exchange Rates - 2025 Development',
    'chart.rates.subtitle': 'SEK/EUR and USD/SEK',
    'chart.repo.title': 'Repo Rate - 2025 Development',
    'chart.repo.subtitle': 'Sweden\'s Central Bank policy rate',
    
    // Data sources
    'sources.title': 'Data Sources and Notes - Swedish Economy',
    'sources.live.title': 'Live data from official sources',
    'sources.live.desc': 'Data is fetched directly from SCB and Sweden\'s Central Bank via their official APIs.',
    'sources.updated': 'Last updated:',
  }
}

export function getTranslation(key: keyof Translations, locale: Locale): string {
  return translations[locale][key] || translations['sv'][key] || key
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale]
} 