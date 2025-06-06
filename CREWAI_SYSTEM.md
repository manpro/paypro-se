# CrewAI System Dokumentation

Detta dokument beskriver det avancerade multi-agent systemet för innehållsgenerering på Paypro.se.

## 📋 Systemöversikt

**Fil:** `crewai-system.json`  
**Version:** 2.0  
**API Endpoint:** `http://172.16.16.148:8088`

## 🤖 Agenter (6 st)

### 1. **Makroekonom** 
- **LLM:** qwen2.5-7b
- **Verktyg:** search
- **Fokus:** Centralbankspolitik, inflationsanalys, BNP-trender

### 2. **Kryptoanalytiker**
- **LLM:** qwen2.5-7b  
- **Verktyg:** search
- **Fokus:** Blockchain-teknologi, DeFi-protokoll, prisanalys

### 3. **SEO-skribent**
- **LLM:** qwen2.5-7b
- **Verktyg:** search  
- **Fokus:** SEO-optimering, innehållsstrukturering, keyword-analys

### 4. **Bildkonstnär** 
- **LLM:** gpt-image-1
- **Verktyg:** DallETool
- **Fokus:** DALL-E prompt engineering, visuell kommunikation

### 5. **Redaktör**
- **LLM:** gpt-4o-mini
- **Verktyg:** search
- **Fokus:** Redaktionell granskning, språklig kvalitet

### 6. **HTML-Formatterar**
- **LLM:** gpt-4o-mini  
- **Verktyg:** search
- **Fokus:** HTML/CSS utveckling, responsiv design, Vercel deployment

## 👥 Teams (3 st)

### Blog Generation Team (5 agenter)
**Workflow:**
1. Makroekonom → Ekonomisk analys
2. Kryptoanalytiker → Kryptotrends  
3. SEO-skribent → SEO-optimerad artikel
4. Bildkonstnär → DALL-E bildgenerering
5. Redaktör → Slutgiltig granskning

### HTML Formatting Team (1 agent)
**Workflow:**
1. HTML-Formatterar → Produktionsklar HTML

### Article Rewrite Team (5 agenter)  
**Workflow:**
1. Makroekonom → Omanalysera ekonomiska aspekter
2. Kryptoanalytiker → Fördjupa kryptoanalys
3. SEO-skribent → Optimera struktur
4. Bildkonstnär → Ny illustration  
5. Redaktör → Språklig förfining

## 🛠️ Verktyg

- **Search Tool:** Sök uppdaterad marknadsdata
- **DallETool:** AI-bildgenerering via gpt-image-1

## 💻 Kommandon

```bash
# Generera ny bloggartikel med alla 5 agenter
python crewctl.py generate-blog-article

# Generera anpassad artikel med prompt
python crewctl.py generate-custom-article --prompt "Din prompt här"

# Skriv om befintlig artikel med förbättrad kvalitet  
python crewctl.py rewrite-article "Artikel titel"

# Konvertera till produktionsklar HTML
python crewctl.py format-to-html "Artikel titel"

# Visa systemstatus
python crewctl.py status
```

## 📁 Output-format

- **Markdown:** `staging/*.md` - Råformat från agenter
- **HTML Preview:** `previews/*.html` - Interaktiva previews  
- **Production HTML:** `previews/paypro_production_*.html` - Redo för deployment

## 🚀 Deployment

**Target:** Paypro.se via Vercel

**Krav:**
- Responsiv HTML med inline CSS
- SEO meta-tags (Open Graph, Twitter Cards)
- Semantiskt korrekt HTML struktur  
- CTA-sektion för konvertering
- Bildreferenceringar till `/assets/`
- Inga externa beroenden

## 🔄 Workflow-exempel

```
1. generate-blog-article
   └── Skapar artikel med 5-agent team
   
2. format-to-html  
   └── Konverterar till produktions-HTML
   
3. Deploy till Vercel
   └── Publicering på Paypro.se
```

## 📊 Agent-specialiseringar

| Agent | LLM | Specialitet | Output |
|-------|-----|-------------|---------|
| Makroekonom | qwen2.5-7b | Ekonomisk analys | Marknadsdata & trender |
| Kryptoanalytiker | qwen2.5-7b | Krypto-insight | Blockchain-analys |  
| SEO-skribent | qwen2.5-7b | Innehållsoptimering | SEO-artikel |
| Bildkonstnär | gpt-image-1 | DALL-E bilder | Professionella illustrationer |
| Redaktör | gpt-4o-mini | Kvalitetsgranskning | Publikationsklar text |
| HTML-Formatterar | gpt-4o-mini | Web-utveckling | Produktions-HTML |

Detta system levererar publikationsklart innehåll från research till deployment på Paypro.se. 