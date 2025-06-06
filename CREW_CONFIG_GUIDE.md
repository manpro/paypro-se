# CrewAI Konfigurationsguide - Paypro.se

## Översikt

Systemet är nu helt konfigurationsdrivet via `crewai-config.json`. Detta gör det enkelt att:
- Uppdatera agent-prompts för olika ämnen
- Skapa nya teman för specifika innehållstyper  
- Förbättra kvaliteten genom bättre prompts
- Experimentera med olika AI-modeller

## Kommandoreferens

### Grundläggande kommandon

```bash
# Generera artikel med standardtema
python crewctl.py generate-article --topic "Bitcoin och inflation"

# Generera med specifikt tema
python crewctl.py generate-article --topic "DeFi trends 2024" --theme crypto_focus

# Visa tillgängliga teman
python crewctl.py list-themes

# Visa konfiguration
python crewctl.py config
python crewctl.py config --section agents
```

### Prompthantering

```bash
# Uppdatera prompt för en agent (förhandsvisning)
python crewctl.py update-prompt --agent makroekonom --prompt "Fokusera mer på svenska ekonomiska data och Riksbankens beslut" --preview

# Uppdatera och spara
python crewctl.py update-prompt --agent makroekonom --prompt "Fokusera mer på svenska ekonomiska data och Riksbankens beslut"

# Skapa konfigurationsmall
python crewctl.py create-template
```

## Konfigurationsstruktur

### Agents-sektion
Varje agent har följande komponenter:

```json
{
  "name": "Visuellt namn",
  "role": "Professionell titel",
  "llm": "AI-modell (qwen2.5-7b, gpt-4o-mini, gpt-image-1)",
  "goal": "Vad agenten ska uppnå",
  "backstory": "Expertis och bakgrund",
  "tools": ["search", "DallETool"],
  "prompt_instructions": "Specifika beteendeinstruktioner"
}
```

### Teams-sektion
Definierar workflows och task-sekvenser:

```json
{
  "name": "Team namn",
  "description": "Syfte och funktion",
  "agents": ["agent1", "agent2"],
  "tasks": [
    {
      "agent": "agent1",
      "description": "Vad ska göras",
      "expected_output": "Förväntat resultat"
    }
  ]
}
```

### Teman
Anpassar innehåll för olika fokusområden:

```json
{
  "focus": "Beskrivning av fokus",
  "keywords": ["relevant", "keywords"],
  "tone": "Önskad stil och ton"
}
```

## Tips för prompt-förbättringar

### 1. Specificitet
❌ **Dåligt:** "Skriv om ekonomi"  
✅ **Bra:** "Analysera Q3 2024 inflation från SCB och Riksbankens räntebeslut"

### 2. Kontext
❌ **Dåligt:** "Gör det professionellt"  
✅ **Bra:** "Skriv för Paypro.se's målgrupp: svenska investerare och företagare"

### 3. Format
❌ **Dåligt:** "Skriv en artikel"  
✅ **Bra:** "Skapa 800-1200 ord med H2/H3-struktur, bullet points för viktiga insights"

### 4. Exempel
❌ **Dåligt:** "Använd data"  
✅ **Bra:** "Inkludera konkreta siffror: 'Inflationen nådde 7.2% i oktober enligt SCB'"

## Arbetssätt för olika ämnen

### Krypto-fokuserade artiklar
```bash
python crewctl.py generate-article --topic "Ethereum 2024 outlook" --theme crypto_focus
```

Uppdatera prompts för:
- `kryptoanalytiker`: Mer teknisk djupanalys
- `seo_skribent`: Crypto-specifika söktermer

### Makroekonomiska analyser
```bash
python crewctl.py generate-article --topic "Riksbankens politik 2024" --theme macro_economy
```

Uppdatera prompts för:
- `makroekonom`: Fokus på svenska förhållanden
- `redaktor`: Ekonomjournalistisk standard

## Kvalitetsförbättringar

### Steg 1: Analysera nuvarande output
```bash
python crewctl.py generate-article --topic "test ämne" --dry-run
```

### Steg 2: Identifiera förbättringsområden
- Är prompts tillräckligt specifika?
- Saknas viktig kontext?
- Är tonaliteten rätt för målgruppen?

### Steg 3: Iterera prompts
```bash
# Testa ändring
python crewctl.py update-prompt --agent makroekonom --prompt "ny prompt" --preview

# Spara när nöjd
python crewctl.py update-prompt --agent makroekonom --prompt "ny prompt"
```

### Steg 4: Skapa backup innan stora ändringar
```python
# Programmatiskt via Python
manager = ConfigurableCrewManager()
backup_file = manager.backup_config()
```

## Exempel på temanpassningar

### Säsongsanpassning (Q4-rapporter)
```json
{
  "q4_reports": {
    "focus": "Q4-rapporter och årsbokslut för svenska företag",
    "keywords": ["q4", "årsbokslut", "prognoser", "utdelning"],
    "tone": "Analytisk och framåtblickande"
  }
}
```

### Nybörjarvänligt innehåll
```json
{
  "beginner_friendly": {
    "focus": "Finansiella grundkoncept förklarade enkelt",
    "keywords": ["grundläggande", "förklaring", "guide", "tips"],
    "tone": "Pedagogisk och icke-teknisk"
  }
}
```

## Felsökning

### Konfigurationsproblem
```bash
# Validera JSON-syntax
python -m json.tool crewai-config.json

# Kontrollera konfiguration
python crewctl.py config
```

### Agent-problem
```bash
# Lista tillgängliga agents
python crewctl.py config --section agents

# Kontrollera specifik agent
python crewctl.py config --section agents | grep -A 10 "makroekonom"
```

## Bästa praxis

1. **Backup före stora ändringar**
2. **Testa med dry-run först**
3. **Iterativa förbättringar** - små ändringar åt gången
4. **Dokumentera framgångsrika prompts** för framtida användning
5. **Versionshantera konfigurationsfiler** med git

Detta system ger dig full kontroll över AI-teamets beteende utan att behöva ändra kod! 