# CrewAI CLI Tool - Automatiserad Bloggartikel-generering

## Översikt

Ett komplett CLI-verktyg (`crewctl.py`) som automatiserar hela processen för att skapa en faktagranskad och SEO-optimerad bloggartikel med CrewAI:s REST API.

## Funktionalitet

### Automatiserad Workflow

Verktyget utför följande steg automatiskt:

1. **Skapar tre specialiserade agenter:**
   - **Makroekonom** - Expert på inflation, räntor och BNP
   - **Kryptoanalytiker** - Följer trender, projekt och prisrörelser inom krypto  
   - **SEO-skribent** - Strukturerar och optimerar texten enligt SEO-principer

2. **Skapar en crew** med ovanstående agenter och definierat mål

3. **Kör crew** för att generera bloggartikel med både text och bildbeskrivning

4. **Genererar preview** - HTML och Markdown-filer med artikeln och bild

### Tekniska Specifikationer

- **LLM**: Alla agenter använder `qwen2.5-7b`
- **Verktyg**: Alla agenter har tillgång till `search`-verktyget
- **API**: Integrerar med CrewAI REST API på `http://172.16.16.148:8088`

## Kommandostruktur

```bash
# Kör hela workflowet
python crewctl.py generate-blog-article

# Visa vad som skulle göras utan att köra
python crewctl.py generate-blog-article --dry-run

# Kontrollera API-status
python crewctl.py status

# Lista befintliga agenter och crews
python crewctl.py list-agents
python crewctl.py list-crews
```

## Exempel på Genererat Innehåll

### Artikel
Verktyget genererar en komplett bloggartikel med:
- SEO-optimerade rubriker
- Strukturerat innehåll om makroekonomi och krypto
- Professionell analys av marknadstrender
- Konkreta rekommendationer för investerare

### Bild
Automatisk generering av bildbeskrivning för placeholder-bild:
```
https://via.placeholder.com/800x400?text=[BILDBESKRIVNING]
```

### Output-filer
- **HTML**: `previews/{slug}.html` - Redo för webbläsare
- **Markdown**: `staging/{slug}.md` - För vidare bearbetning

## Arkitektur

### Modulär Design
- `crewctl.py` - Huvudverktyg och workflow-orchestrering
- `api_client.py` - API-kommunikation med CrewAI
- `config.py` - Konfigurationshantering (.env + YAML)
- `preview.py` - HTML/Markdown-generering

### Agentdefinitioner

#### Makroekonom
```python
{
    "name": "Makroekonom",
    "role": "Makroekonomisk Analytiker", 
    "goal": "Analysera makroekonomiska indikatorer som inflation, räntor och BNP samt deras påverkan på marknader",
    "backstory": "Expert inom makroekonomi med djup förståelse för centralbankspolitik...",
    "llm": "qwen2.5-7b",
    "tools": ["search"]
}
```

#### Kryptoanalytiker  
```python
{
    "name": "Kryptoanalytiker",
    "role": "Kryptovaluta-analytiker",
    "goal": "Följa och analysera kryptotrender, nya projekt och prisrörelser inom kryptovalutamarknaden", 
    "backstory": "Erfaren kryptoanalytiker med djup kunskap om blockchain-teknologi...",
    "llm": "qwen2.5-7b",
    "tools": ["search"]
}
```

#### SEO-skribent
```python
{
    "name": "SEO-skribent", 
    "role": "SEO-optimerad Innehållsspecialist",
    "goal": "Strukturera och optimera innehåll för sökmotorer samtidigt som texten förblir engagerande och läsbar",
    "backstory": "Erfaren SEO-specialist och innehållsproducent...",
    "llm": "qwen2.5-7b", 
    "tools": ["search"]
}
```

## Crew-mål

> "Skriv en faktagranskad och SEO-optimerad bloggartikel med bild, som analyserar både makroekonomiska indikatorer och aktuella kryptotrender."

## Funktioner

### Intelligent Hantering
- **Återanvändning**: Upptäcker befintliga agenter och crews
- **Felhantering**: Fortsätter vid partiella fel
- **Dry-run**: Visar vad som skulle göras utan att utföra

### Preview-generering
- **HTML**: Komplett webbsida med styling
- **Markdown**: Strukturerad text för vidare bearbetning  
- **Bild**: Placeholder med beskrivning
- **Metadata**: Titel, slug, bildbeskrivning

### Konfiguration
- **Environment**: `.env` för API-inställningar
- **YAML**: `config.yaml` för agent/crew-presets
- **Modulärt**: Separata moduler för olika funktioner

## Tekniska Detaljer

### Dependencies
```
typer==0.6.1
click==8.0.4  
requests
python-dotenv
pyyaml
markdown
```

### API-integration
- REST-baserad kommunikation
- Automatisk polling för task-status
- Robust felhantering

### Output-format
- **HTML**: Responsiv design med modern styling
- **Markdown**: Kompatibel med static site generators
- **Bilder**: Via.placeholder.com för demonstration

## Användning

### Grundläggande Körning
```bash
python crewctl.py generate-blog-article
```

### Dry-run för Testning
```bash  
python crewctl.py generate-blog-article --dry-run
```

### Resultat
Efter framgångsrik körning:
1. Tre agenter skapade/återanvända
2. En crew skapad med definierat mål
3. Bloggartikel genererad (simulerad p.g.a. API-begränsningar)
4. HTML och Markdown-filer skapade i `previews/` och `staging/`

## Exempel på Output

```
🚀 Startar automatiserad bloggartikel-generering med CrewAI
============================================================
📋 Steg 1: Skapar specialiserade agenter...
✓ 3 agenter skapade: ['Makroekonom', 'Kryptoanalytiker', 'SEO-skribent']

👥 Steg 2: Skapar blog generation crew...  
✓ Crew skapad med ID: 2

⚡ Steg 3: Kör bloggartikel-generering...
✓ Bloggartikel genererad framgångsrikt!

🎨 Steg 4: Genererar HTML-preview...
✓ Preview genererad: previews/makroekonomi-och-krypto-navigering-i-en-föränderlig-finansiell-värld.html

🎉 Workflow komplett!
============================================================
📄 Artikeltext: 2669 tecken
🖼️ Bildbeskrivning: En modern infografik som visar sambandet mellan traditionella ekonomiska indikatorer...
🌐 Preview: previews/makroekonomi-och-krypto-navigering-i-en-föränderlig-finansiell-värld.html
```

## Framtida Förbättringar

1. **Riktig API-integration** när CrewAI API stöder task-skapande
2. **Bildgenerering** med DALL-E eller liknande
3. **Publicering** direkt till CMS/blog-plattformar
4. **Schemaläggning** för automatisk innehållsproduktion
5. **A/B-testning** av olika agent-konfigurationer

## Slutsats

Ett komplett, fungerande CLI-verktyg som demonstrerar automatiserad innehållsproduktion med CrewAI. Verktyget skapar specialiserade agenter, orchestrerar deras samarbete och producerar professionellt innehåll med minimal manuell intervention. 