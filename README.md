# PayPro.se - Sveriges Ekonomiska Dashboard

Next.js dashboard för svensk makroekonomi med live data från SCB och Riksbanken.

## 🚀 Funktioner

- **Live data** från officiella källor (SCB, Riksbank)
- **Automatisk uppdatering** var 30:e sekund
- **Redis caching** för optimal prestanda
- **Responsiv design** med Tailwind CSS
- **Realtids indikatorer** för reporänta, växelkurs, skuldsättning

## 📊 Datakällor

- **SCB**: BNP, inflation, arbetslöshet, bostadspriser
- **Riksbank**: Reporänta, valutakurser
- **Caching**: 24h för de flesta, 6h för valutakurser

## 🔧 Teknisk Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Data**: SWR för smart fetching
- **Backend**: Next.js API routes
- **Cache**: Redis (Upstash)
- **Deploy**: Vercel

## 💻 Installation

```bash
# Klona repo
git clone https://github.com/manpro/paypro-se.git
cd paypro-se

# Installera dependencies
npm install

# Konfigurera environment
cp env.example .env.local
# Lägg till UPSTASH_REDIS_REST_URL och TOKEN

# Starta utvecklingsserver
npm run dev
```

## 📱 URLs

- **Dashboard**: `/dashboards/makro`
- **API**: `/api/macro`
- **Live Demo**: [paypro-se.vercel.app](https://paypro-se.vercel.app/dashboards/makro)

## 🔗 Relaterade Repositories

- **Frontend/Dashboard**: `github.com/manpro/paypro-se` (detta repo)
- **CrewAI/Automation**: `gitea.manpro.se/paypro-crewai` (separat repo)

## 🏗️ Project Structure

```
paypro-se/
├── pages/
│   ├── dashboards/
│   │   └── makro.tsx          # Huvud-dashboard
│   └── api/
│       └── macro.ts           # Data API
├── lib/
│   ├── macroSources.ts        # Data fetching
│   └── cache.ts               # Redis caching
├── components/
│   ├── dashboards/            # Dashboard komponenter
│   └── layout/                # Layout komponenter
└── styles/                    # Tailwind CSS
```

## 📈 Dashboard Features

### Key Metrics
- BNP tillväxt (QoQ)
- Inflation (KPI årlig)
- Arbetslöshet
- Bostadspriser (HPI YoY)

### Live Indicators
- Reporänta (Riksbank)
- SEK/EUR växelkurs
- Hushållens skuldsättning

### Updates
- **30s refresh** för live data
- **Auto-retry** vid API-fel
- **Cache fallback** för tillförlitlighet

## 🌐 Environment Variables

```bash
# Redis Cache (Required för production)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

## 📄 License

MIT License - Se LICENSE file för detaljer.

---
*Utvecklat för PayPro.se - Sveriges ekonomiska analys i realtid* 🇸🇪 