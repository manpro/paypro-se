# PayPro.se - Betalningar & Ekonomi Analysplattform

Ett komplett Next.js 14-projekt för analys av betalningar, ekonomi och finansiella trender i Sverige och globalt.

## 🚀 Funktioner

- **Startsida** med senaste artiklar och nyckeltal
- **Interaktiva Dashboards** för makroekonomi, svenska betalningar och globala trender
- **Blogg** med SEO-optimerade artiklar
- **Responsiv design** med Tailwind CSS
- **Datavisualisering** med Recharts
- **SEO-optimerat** med sitemap, robots.txt och schema.org

## 📊 Dashboards

### Makroekonomi (`/dashboards/makro`)
- BNP-utveckling
- Inflation (KPI)
- Reporänta och ekonomiska nyckeltal

### Svenska Betalningar (`/dashboards/swish`)
- Swish-statistik och tillväxt
- Betalningsmetoder marknadsandel
- Transaktionsvolymer

### Globala Trender (`/dashboards/global`)
- Digital betalningsadoption
- CBDC-utveckling
- Kryptovaluta handelsvolymer

## 🛠 Teknisk Stack

- **Framework:** Next.js 14 med TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Content:** MDX för bloggartiklar
- **SEO:** Built-in optimering

## 🏃‍♂️ Kom igång

### Installation
```bash
npm install
```

### Utveckling
```bash
npm run dev
```
Öppna [http://localhost:6388](http://localhost:6388) i din webbläsare.

### Bygg för produktion
```bash
npm run build
npm start
```

## 📁 Projektstruktur

```
paypro-se/
├── pages/
│   ├── index.tsx                    # Startsida
│   ├── _app.tsx                     # App wrapper
│   ├── blog/
│   │   ├── index.tsx                # Blogg lista
│   │   └── [slug].tsx               # Individuell artikel
│   └── dashboards/
│       ├── makro.tsx                # Makroekonomi dashboard
│       ├── swish.tsx                # Svenska betalningar
│       └── global.tsx               # Globala trender
├── components/
│   ├── layout/
│   │   ├── Header.tsx               # Huvudnavigation
│   │   └── Footer.tsx               # Footer
│   ├── blog/
│   │   └── BlogCard.tsx             # Bloggkort
│   └── dashboards/
│       ├── ChartCard.tsx            # Chart wrapper
│       └── MetricBox.tsx            # Nyckeltal display
├── lib/
│   └── dataFetcher.ts               # Data management
├── styles/
│   └── globals.css                  # Global styles
├── public/
│   ├── robots.txt                   # SEO
│   └── sitemap.xml                  # Sitemap
└── content/
    └── blog/                        # MDX artiklar (framtida)
```

## 📝 Innehåll

### Bloggartiklar
Projektet inkluderar mock-data för tre huvudartiklar:
- Sveriges betalningslandskap 2024
- Riksbankens räntebeslut analys
- Globala betaltrender

### Data
Mock-data inkluderar:
- BNP och inflationsstatistik
- Swish transaktionsdata
- Globala betalningsnummer
- CBDC utvecklingsstatus

## 🌐 Deployment

Projektet är redo för deployment på Vercel:

1. Pusha till GitHub
2. Anslut repository till Vercel
3. Sätt domän till `paypro.se`

### Miljövariabler
Inga speciella miljövariabler krävs för grundfunktionaliteten.

## 🔧 Konfiguration

### Tailwind CSS
Anpassad färgpalett för PayPro-branding i `tailwind.config.js`.

### TypeScript
Strikta inställningar med alias för enklare imports (`@/`).

### SEO
- Automatisk sitemap generering
- Open Graph metadata
- Schema.org strukturerad data
- Robots.txt konfiguration

## 📱 Responsive Design

Fullständigt responsiv design för:
- Mobil (320px+)
- Tablet (768px+)
- Desktop (1024px+)

## 🎨 Design System

- **Färger:** PayPro blå som primärfärg
- **Typografi:** System fonts för prestanda
- **Komponenter:** Återanvändbara UI-element
- **Layout:** CSS Grid och Flexbox

## 🚀 Framtida Utveckling

- [ ] Äkta API-integration
- [ ] MDX-innehållshantering
- [ ] Användarkonton
- [ ] Dashboard-filter
- [ ] Newsletterintegrationer
- [ ] A/B-testning

## 📄 Licens

Detta projekt är skapat för PayPro.se.

---

**Kontakt:** För frågor om projektet, kontakta utvecklingsteamet.

## CrewAI CLI Tool

A Python CLI tool for interacting with CrewAI Studio API.

### Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Copy environment configuration:
```bash
cp env.example .env
```

3. Edit `.env` to match your CrewAI API setup:
```
CREWAI_BASE_URL=http://127.0.0.1
CREWAI_PORT=8088
CREWAI_TIMEOUT=30
```

### Usage

#### Basic Commands

```bash
# Check API status
python crewctl.py status

# List resources
python crewctl.py list agents
python crewctl.py list crews
python crewctl.py list tools

# Show configuration
python crewctl.py config-info
```

#### Creating Agents

```bash
# Create agent manually
python crewctl.py create agent \
  --name "Blog Writer" \
  --role "Content Creator" \
  --goal "Write engaging blog posts" \
  --backstory "Expert content writer"

# Create agent from preset
python crewctl.py create agent --preset blog_writer

# Dry run (show what would be created)
python crewctl.py create agent --preset blog_writer --dry-run
```

#### Creating Crews

```bash
# Create crew
python crewctl.py create crew \
  --name "Blog Team" \
  --description "Complete blog workflow" \
  --agent-ids 1 --agent-ids 2

# Create from preset
python crewctl.py create crew --preset blog_production
```

#### Running Crews

```bash
# Run crew and wait for results
python crewctl.py run 1
```

#### Content Preview

```bash
# Generate preview
python crewctl.py preview \
  --content "# My Blog Post\n\nContent here..." \
  --title "My Blog Post"

# Preview without opening browser
python crewctl.py preview \
  --content "# Test\n\nTest content" \
  --no-open
```

### Configuration

The tool uses `config.yaml` for agent and crew presets. Example:

```yaml
agents:
  blog_writer:
    name: "Blog Writer"
    role: "Content Creator"
    goal: "Create engaging blog posts"
    # ... more fields
```

### Directory Structure

- `crewctl.py` - Main CLI entry point
- `api_client.py` - API interaction functions  
- `config.py` - Configuration management
- `preview.py` - HTML preview generation
- `config.yaml` - Agent/crew presets
- `previews/` - Generated HTML previews (gitignored)
- `staging/` - Markdown staging files (gitignored)

---

## Next.js Application

The main PayPro SE web application built with Next.js, TailwindCSS, and TypeScript.

### Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to view the application. 