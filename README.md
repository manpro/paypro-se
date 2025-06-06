# PayPro.se Content Generation System

Ett avancerat AI-drivet system för automatisk generering av högkvalitativt finansiellt innehåll för PayPro.se.

## 🏗 Arkitektur

Detta är **content generation-delen** av PayPro.se's dubbla repository-struktur:

- **Denna repository (Gitea)**: AI-baserad innehållsgenerering och utvecklingsverktyg
- **Production repository (GitHub)**: Publicerad blogg som byggs automatiskt i Vercel

### Systemdesign
```
Content Creation (Gitea)           Production Blog (GitHub)
    ↓ AI Generation                     ↓ Auto-deploy
    ↓ Preview System              →     ↓ Vercel Build
    ↓ Quality Check                     ↓ paypro.se
```

## 🎯 Funktioner

### Innehållsgenerering
- **Multi-agent AI-system** för komplex innehållsskapande
- **6 specialiserade agenter**: Makroekonom, Kryptoanalytiker, SEO-skribent, Bildkonstnär, Redaktör, HTML-formatterar
- **API V2-integration** mot extern CrewAI-server
- **Produktionskvalitet** artiklar på svenska

### Preview-system
- **Standardiserad preview** som matchar produktionsmiljön
- **Automatisk HTML-generering** för artikelförhandsgranskning
- **Responsiv design** med PayPro.se-branding
- **SEO-optimerat** innehåll redo för publicering

### Utvecklingsverktyg
- **CLI-verktyg** för systemhantering
- **API-klient** för kommunikation med CrewAI-servern
- **Konfigurationsmallar** för enkel uppsättning
- **Dokumentation** för hela systemet

## 📊 Genererat Innehåll

Systemet kan generera:
- **Finansiella analyser** (makroekonomi, kryptovalutor)
- **Marknadstrender** och prognoser
- **Regulatoriska analyser** (EU MiCA, svenska regler)
- **Tekniska analyser** av fintech-utveckling
- **SEO-optimerade** artiklar för PayPro.se

## 🛠 Teknisk Stack

### AI & Integration
- **CrewAI API V2** för multi-agent orchestration
- **OpenAI GPT-4/GPT-4o-mini** som språkmodeller
- **RESTful API-klient** för systemkommunikation
- **JSON-konfiguration** för flexibel systemuppsättning

### Development Tools
- **Python 3.11+** huvudspråk
- **Requests** för API-kommunikation
- **JSON Schema** för datavalidering
- **CLI-interface** för utvecklarproduktivitet

### Output Format
- **Semantic HTML5** för artikelstruktur
- **CSS3** för responsiv styling
- **Meta-data** för SEO-optimering
- **PayPro.se-branding** för konsistent design

## 🚀 Kom igång

### Förutsättningar
- Python 3.11 eller senare
- Tillgång till CrewAI-servern (172.16.16.148:8088)
- API-nycklar för OpenAI

### Installation
```bash
# Installera dependencies
pip install -r requirements.txt

# Kopiera konfiguration
cp env.example .env
cp crewai-config-template.json crewai-config.json

# Konfigurera API-inställningar
# Redigera .env och crewai-config.json
```

### Grundläggande användning
```bash
# Skapa agenter
python create_agents_v2.py

# Generera innehåll
python final_production_run.py

# Förhandsgranska resultat
python open_preview.py
```

## 📁 Projektstruktur

```
paypro-se-content/
├── scripts/
│   ├── create_agents_v2.py      # Skapa AI-agenter
│   ├── final_production_run.py  # Huvudproduktionsscript
│   └── open_preview.py          # Öppna preview
├── previews/
│   └── *.html                   # Förhandsgranskningar
├── config/
│   ├── crewai-config.json       # AI-systemkonfiguration
│   └── env.example              # Miljövariabel-mall
├── docs/
│   ├── crewai-api-dokumentatio.md  # API-dokumentation
│   └── CREW_CONFIG_GUIDE.md     # Konfigurationsguide
├── output/
│   ├── *.html                   # Genererade artiklar
│   └── *.json                   # Strukturerad data
└── lib/
    ├── api_client.py            # API-kommunikation
    └── config.py                # Systemkonfiguration
```

## 🔧 Konfiguration

### AI-agenter
Systemet använder 6 specialiserade agenter:
- **Makroekonom**: Ekonomisk analys och prognoser
- **Kryptoanalytiker**: Blockchain och kryptovaluta-expertis
- **SEO-skribent**: Sökoptimerat innehåll
- **Bildkonstnär**: Visuell gestaltning och layout
- **Redaktör**: Kvalitetskontroll och korrekturläsning
- **HTML-formatterar**: Teknisk implementation

### API-konfiguration
```json
{
  "base_url": "http://172.16.16.148:8088",
  "timeout": 30,
  "models": {
    "primary": "openai:gpt-4",
    "secondary": "openai:gpt-4o-mini"
  }
}
```

## 📝 Innehållsprocess

### 1. Innehållsplanering
- Ämnesidentifiering baserat på PayPro.se-fokus
- Nyckelordsresearch för SEO-optimering
- Målgruppsanalys för svenska finansmarknaden

### 2. AI-generering
- Multi-agent koordination för innehållsskapande
- Kvalitetskontroll genom specialiserade agenter
- Automatisk SEO-optimering och formattering

### 3. Preview & kvalitetskontroll
- Standardiserad preview som matchar produktionsdesign
- Responsivitetstestning för olika enheter
- Innehållsvalidering innan publicering

### 4. Publiceringsförbereding
- HTML-export redo för GitHub-repository
- Meta-data och SEO-taggar inkluderade
- PayPro.se-branding och styling applicerad

## 🌐 Integration med produktionssystemet

### Workflow
1. **Generera innehåll** i denna miljö (Gitea)
2. **Förhandsgranska** med standardiserat preview-system
3. **Exportera** färdigt innehåll till GitHub-repository
4. **Auto-deploy** via Vercel till paypro.se

### Säkerhet
- API-nycklar och känslig konfiguration stannar i Gitea
- Enbart färdigt innehåll flyttas till public GitHub
- Separation mellan utveckling och produktion

## 📈 Systemstatistik

### Innehållskvalitet
- **10,000+** tecken per genererad artikel
- **2,400+** ord genomsnittlig artikellängd
- **6** strukturerade sektioner per artikel
- **SEO-optimerat** för svenska söktermer

### Teknisk prestanda
- **API V2** med förbättrad stabilitet
- **Multi-agent** koordination för kvalitet
- **Responsiv design** för alla enheter
- **Automatiserad pipeline** för effektivitet

## 🔒 Säkerhet & Compliance

- **Privat repository** för känslig utvecklingskod
- **API-nyckelhantering** via miljövariabler
- **Separerad arkitektur** för säker produktion
- **Dokumenterad process** för revision och compliance

## 📞 Support & Utveckling

För frågor om systemet:
- Kontakta utvecklingsteamet
- Se dokumentation i `/docs`
- Använd CLI-verktyg för felsökning

---

**Detta är content generation-systemet för PayPro.se** | Privat utvecklingsmiljö | Gitea-hosted 