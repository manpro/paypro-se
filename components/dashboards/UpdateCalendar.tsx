'use client'

import React from 'react'
import dayjs from 'dayjs'
import { Locale } from '@/i18n.config'

interface UpdateEvent {
  id: string
  title: string
  date: string
  type: 'riksbank' | 'scb' | 'eurostat' | 'fed' | 'other'
  description: string
  importance: 'high' | 'medium' | 'low'
}

interface UpdateCalendarProps {
  locale: Locale
}

// Kommande ekonomiska händelser och datauppdateringar
const getUpcomingEvents = (): UpdateEvent[] => {
  const now = dayjs()
  const events: UpdateEvent[] = []

  // Riksbank - reporänta (vanligtvis 8 gånger per år)
  const riksbankDates = [
    '2025-06-19', '2025-08-21', '2025-09-25', '2025-11-06', '2025-12-18'
  ]
  riksbankDates.forEach(date => {
    if (dayjs(date).isAfter(now)) {
      events.push({
        id: `riksbank-${date}`,
        title: 'Riksbank räntebeslut',
        date,
        type: 'riksbank',
        description: 'Sveriges centralbank beslutar om reporäntan',
        importance: 'high'
      })
    }
  })

  // SCB - BNP-data (kvartalsvis)
  const gdpDates = [
    '2025-06-30', '2025-09-30', '2025-11-29'
  ]
  gdpDates.forEach(date => {
    if (dayjs(date).isAfter(now)) {
      events.push({
        id: `scb-gdp-${date}`,
        title: 'BNP Q-data (SCB)',
        date,
        type: 'scb',
        description: 'Kvartalsvis BNP-data från Statistiska centralbyrån',
        importance: 'high'
      })
    }
  })

  // SCB - Inflationsdata (månadsvis)
  const inflationDates = [
    '2025-06-13', '2025-07-11', '2025-08-12', '2025-09-11', '2025-10-10'
  ]
  inflationDates.forEach(date => {
    if (dayjs(date).isAfter(now)) {
      events.push({
        id: `scb-inflation-${date}`,
        title: 'KPI-data (SCB)',
        date,
        type: 'scb',
        description: 'Månadsvis konsumentprisindex från SCB',
        importance: 'medium'
      })
    }
  })

  // SCB - Arbetslöshetsdata (månadsvis)
  const unemploymentDates = [
    '2025-06-20', '2025-07-18', '2025-08-20', '2025-09-19', '2025-10-17'
  ]
  unemploymentDates.forEach(date => {
    if (dayjs(date).isAfter(now)) {
      events.push({
        id: `scb-unemployment-${date}`,
        title: 'Arbetslöshetsdata (SCB)',
        date,
        type: 'scb',
        description: 'Månadsvis arbetslöshetsstatistik från SCB',
        importance: 'medium'
      })
    }
  })

  // Fed - FOMC möten (påverkar USD och globala marknader)
  const fedDates = [
    '2025-06-18', '2025-07-30', '2025-09-17', '2025-11-05', '2025-12-17'
  ]
  fedDates.forEach(date => {
    if (dayjs(date).isAfter(now)) {
      events.push({
        id: `fed-${date}`,
        title: 'Fed FOMC-möte',
        date,
        type: 'fed',
        description: 'Federal Reserve räntebeslut (påverkar USD/SEK)',
        importance: 'medium'
      })
    }
  })

  // Riksbank - Valutakurser (daglig uppdatering)
  const today = now.format('YYYY-MM-DD')
  const nextWeekdays = []
  for (let i = 1; i <= 7; i++) {
    const nextDay = now.add(i, 'day')
    // Lägg bara till vardagar (måndag-fredag)
    if (nextDay.day() >= 1 && nextDay.day() <= 5) {
      nextWeekdays.push(nextDay.format('YYYY-MM-DD'))
    }
  }
  
  nextWeekdays.slice(0, 3).forEach(date => {
    events.push({
      id: `riksbank-fx-${date}`,
      title: 'Valutakurser (Riksbank)',
      date,
      type: 'riksbank',
      description: 'Daglig uppdatering av SEK/EUR, USD/SEK, USD/EUR',
      importance: 'medium'
    })
  })

  // SCB - Skuldsättningsdata (kvartalsvis)
  const debtDates = [
    '2025-06-15', '2025-09-15', '2025-12-15'
  ]
  debtDates.forEach(date => {
    if (dayjs(date).isAfter(now)) {
      events.push({
        id: `scb-debt-${date}`,
        title: 'Skuldsättningsdata (SCB)',
        date,
        type: 'scb',
        description: 'Kvartalsvis hushållens skuldsättningsgrad',
        importance: 'medium'
      })
    }
  })

  // Eurostat - Eurozone data (påverkar EUR/SEK)
  const eurostatDates = [
    '2025-06-30', '2025-07-31', '2025-08-29', '2025-09-30'
  ]
  eurostatDates.forEach(date => {
    if (dayjs(date).isAfter(now)) {
      events.push({
        id: `eurostat-${date}`,
        title: 'Eurozone BNP (Eurostat)',
        date,
        type: 'eurostat',
        description: 'Eurozonens BNP-data (påverkar EUR/SEK)',
        importance: 'low'
      })
    }
  })

  return events.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix())
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'riksbank': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'scb': return 'bg-green-100 text-green-800 border-green-200'
    case 'eurostat': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'fed': return 'bg-red-100 text-red-800 border-red-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getImportanceIcon = (importance: string) => {
  switch (importance) {
    case 'high': return '🔴'
    case 'medium': return '🟡'
    case 'low': return '🟢'
    default: return '⚪'
  }
}

export default function UpdateCalendar({ locale }: UpdateCalendarProps) {
  const events = getUpcomingEvents()
  const nextEvents = events.slice(0, 8) // Visa nästa 8 händelser

  const t = {
    title: locale === 'sv' ? 'Kommande uppdateringar' : 'Upcoming updates',
    description: locale === 'sv' 
      ? 'Nästa datum för ALL ekonomisk data som visas på denna sida' 
      : 'Next dates for ALL economic data shown on this page',
    daysAway: locale === 'sv' ? 'dagar kvar' : 'days away',
    today: locale === 'sv' ? 'Idag' : 'Today',
    tomorrow: locale === 'sv' ? 'Imorgon' : 'Tomorrow',
    thisWeek: locale === 'sv' ? 'Denna vecka' : 'This week',
    nextWeek: locale === 'sv' ? 'Nästa vecka' : 'Next week'
  }

  const getRelativeTime = (date: string) => {
    const eventDate = dayjs(date)
    const now = dayjs()
    const diffDays = eventDate.diff(now, 'day')

    if (diffDays === 0) return t.today
    if (diffDays === 1) return t.tomorrow
    if (diffDays <= 7) return t.thisWeek
    if (diffDays <= 14) return t.nextWeek
    return `${diffDays} ${t.daysAway}`
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            📅 {t.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {t.description}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {nextEvents.map((event) => (
          <div 
            key={event.id}
            className="flex items-start space-x-3 p-3 rounded-lg border 
                       hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 mt-1">
              <span className="text-lg">
                {getImportanceIcon(event.importance)}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {event.title}
                </h4>
                <span className={`px-2 py-1 text-xs rounded-full border ${getTypeColor(event.type)}`}>
                  {event.type.toUpperCase()}
                </span>
              </div>
              
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {event.description}
              </p>
              
              <div className="flex items-center justify-between mt-2">
                <time className="text-xs font-medium text-gray-900">
                  {dayjs(event.date).format(locale === 'sv' ? 'D MMM YYYY' : 'MMM D, YYYY')}
                </time>
                <span className="text-xs text-gray-500">
                  {getRelativeTime(event.date)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <span className="text-2xl mb-2 block">📅</span>
          <p className="text-sm">
            {locale === 'sv' 
              ? 'Inga kommande uppdateringar för närvarande' 
              : 'No upcoming updates at this time'
            }
          </p>
        </div>
      )}
    </div>
  )
} 