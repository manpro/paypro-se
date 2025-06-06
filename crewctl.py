#!/usr/bin/env python3
"""
Paypro.se CrewAI Management CLI - Configuration-driven Multi-Agent System
Version 2.1 - JSON-konfigurationsdriven arkitektur

Ett command-line interface för att hantera CrewAI-baserade AI-teams
som genererar och förbättrar finansiellt innehåll för Paypro.se.

Systemet är nu helt konfigurerbart via crewai-config.json för enkel
uppdatering av prompts, roller och team-konfigurationer.
"""

import os
import sys
import json
import argparse
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

# CrewAI imports
from crewai import Agent, Task, Crew
from crewai_tools import SerperDevTool, DallETool

# API client för CrewAI
from api_client import CrewAIAPIClient

# Konfiguration
from config import Config

# Sätt upp logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ConfigurableCrewManager:
    """
    Hanterar konfigurationsdrivet AI team för Paypro.se.
    Läser alla definitioner från crewai-config.json
    """
    
    def __init__(self, config_file: str = "crewai-config.json"):
        """
        Initialisera med konfigurationsfil
        
        Args:
            config_file: Sökväg till JSON-konfigurationsfil
        """
        self.config_file = config_file
        self.config = self._load_config()
        self.api_client = CrewAIAPIClient(
            base_url=self.config["system"]["api_endpoint"]
        )
        
        # Initiera verktyg
        self.search_tool = SerperDevTool()
        self.dalle_tool = DallETool()
        
        logger.info(f"Konfigurationssystem laddat - v{self.config['system']['version']}")

    def _load_config(self) -> Dict[str, Any]:
        """Ladda konfiguration från JSON-fil"""
        try:
            with open(self.config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)
            logger.info(f"Konfiguration laddad från {self.config_file}")
            return config
        except FileNotFoundError:
            logger.error(f"Konfigurationsfil {self.config_file} hittades inte")
            sys.exit(1)
        except json.JSONDecodeError as e:
            logger.error(f"Felaktig JSON-syntax i {self.config_file}: {e}")
            sys.exit(1)

    def _get_tool(self, tool_name: str):
        """Hämta verktyg baserat på namn"""
        tool_map = {
            "search": self.search_tool,
            "DallETool": self.dalle_tool
        }
        return tool_map.get(tool_name)

    def _create_agent(self, agent_key: str) -> Agent:
        """
        Skapa agent från konfiguration
        
        Args:
            agent_key: Nyckel för agent i konfiguration
            
        Returns:
            CrewAI Agent objekt
        """
        agent_config = self.config["agents"][agent_key]
        
        # Hämta verktyg för agenten
        tools = []
        for tool_name in agent_config.get("tools", []):
            tool = self._get_tool(tool_name)
            if tool:
                tools.append(tool)
        
        # Kombinera backstory med prompt_instructions
        enhanced_backstory = f"{agent_config['backstory']}\n\nSpeciella instruktioner: {agent_config['prompt_instructions']}"
        
        return Agent(
            role=agent_config["role"],
            goal=agent_config["goal"],
            backstory=enhanced_backstory,
            verbose=agent_config.get("verbose", True),
            allow_delegation=agent_config.get("allow_delegation", False),
            tools=tools,
            llm=self.api_client.get_model(agent_config["llm"])
        )

    def _create_task(self, task_config: Dict[str, Any], agent: Agent) -> Task:
        """
        Skapa task från konfiguration
        
        Args:
            task_config: Task-konfiguration
            agent: Agent som ska utföra tasken
            
        Returns:
            CrewAI Task objekt
        """
        return Task(
            description=task_config["description"],
            expected_output=task_config["expected_output"],
            agent=agent
        )

    def create_team(self, team_key: str, theme: str = "default") -> Crew:
        """
        Skapa team från konfiguration
        
        Args:
            team_key: Nyckel för team i konfiguration
            theme: Tema för att anpassa prompts (default, crypto_focus, macro_economy)
            
        Returns:
            CrewAI Crew objekt
        """
        team_config = self.config["teams"][team_key]
        theme_config = self.config["topic_themes"][theme]
        
        logger.info(f"Skapar team: {team_config['name']}")
        logger.info(f"Tema: {theme} - {theme_config['focus']}")
        
        # Skapa agents
        agents = []
        for agent_key in team_config["agents"]:
            agent = self._create_agent(agent_key)
            agents.append(agent)
            logger.info(f"Agent skapad: {self.config['agents'][agent_key]['name']}")
        
        # Skapa tasks
        tasks = []
        for i, task_config in enumerate(team_config["tasks"]):
            # Hitta rätt agent för denna task
            agent_key = task_config["agent"]
            agent_index = team_config["agents"].index(agent_key)
            agent = agents[agent_index]
            
            # Anpassa task description med tema
            enhanced_description = f"{task_config['description']}\n\nTema-fokus: {theme_config['focus']}\nNyckelord: {', '.join(theme_config['keywords'])}\nTon: {theme_config['tone']}"
            
            enhanced_task_config = {
                **task_config,
                "description": enhanced_description
            }
            
            task = self._create_task(enhanced_task_config, agent)
            tasks.append(task)
        
        return Crew(
            agents=agents,
            tasks=tasks,
            verbose=True
        )

    def generate_article(self, topic: str = "aktuella finanstrender", 
                        theme: str = "default", dry_run: bool = False) -> str:
        """
        Generera artikel med konfigurerat team
        
        Args:
            topic: Ämne för artikeln
            theme: Tema för artikeln (default, crypto_focus, macro_economy)
            dry_run: Om True, kör endast simulering
            
        Returns:
            Genererad artikel som text
        """
        if dry_run:
            return self._dry_run_simulation(topic, theme)
        
        logger.info(f"Startar artikelgenerering - Ämne: {topic}, Tema: {theme}")
        
        crew = self.create_team("blog_generation", theme)
        
        # Kör crew
        try:
            result = crew.kickoff(inputs={"topic": topic})
            
            # Spara resultat
            self._save_article(result, topic, theme)
            self._create_preview(result, topic, theme)
            
            return str(result)
            
        except Exception as e:
            logger.error(f"Fel vid artikelgenerering: {e}")
            return f"Fel: {e}"

    def rewrite_article(self, article_content: str, theme: str = "default", 
                       dry_run: bool = False) -> str:
        """
        Förbättra befintlig artikel med konfigurerat team
        
        Args:
            article_content: Befintlig artikel att förbättra
            theme: Tema för förbättringen
            dry_run: Om True, kör endast simulering
            
        Returns:
            Förbättrad artikel som text
        """
        if dry_run:
            return self._dry_run_rewrite_simulation(article_content, theme)
        
        logger.info(f"Startar artikelförbättring - Tema: {theme}")
        
        crew = self.create_team("article_rewrite", theme)
        
        try:
            result = crew.kickoff(inputs={"article_content": article_content})
            
            # Spara resultat
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            self._save_article(result, f"rewritten_{timestamp}", theme)
            self._create_preview(result, f"rewritten_{timestamp}", theme)
            
            return str(result)
            
        except Exception as e:
            logger.error(f"Fel vid artikelförbättring: {e}")
            return f"Fel: {e}"

    def generate_html(self, article_content: str, title: str = "Finansartikel") -> str:
        """
        Generera produktionsklar HTML från artikel
        
        Args:
            article_content: Artikel i markdown
            title: Titel för HTML-sidan
            
        Returns:
            HTML-kod
        """
        logger.info("Startar HTML-generering")
        
        crew = self.create_team("html_production")
        
        try:
            result = crew.kickoff(inputs={
                "article_content": article_content,
                "title": title
            })
            
            # Spara HTML
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            html_path = f"previews/production_{timestamp}.html"
            
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(str(result))
            
            logger.info(f"HTML sparad: {html_path}")
            return str(result)
            
        except Exception as e:
            logger.error(f"Fel vid HTML-generering: {e}")
            return f"Fel: {e}"

    def _dry_run_simulation(self, topic: str, theme: str) -> str:
        """Simulera artikelgenerering utan att köra AI"""
        team_config = self.config["teams"]["blog_generation"]
        theme_config = self.config["topic_themes"][theme]
        
        simulation = f"""
=== DRY RUN - ARTIKELGENERERING ===
Ämne: {topic}
Tema: {theme} - {theme_config['focus']}
Team: {team_config['name']}

AGENT-WORKFLOW:
"""
        
        for i, task_config in enumerate(team_config["tasks"], 1):
            agent_key = task_config["agent"]
            agent_config = self.config["agents"][agent_key]
            
            simulation += f"""
{i}. {agent_config['name']} ({agent_config['llm']})
   Verktyg: {', '.join(agent_config.get('tools', []))}
   Uppgift: {task_config['description']}
   Förväntat resultat: {task_config['expected_output']}
"""
        
        simulation += f"""
TEMA-ANPASSNING:
- Fokus: {theme_config['focus']}
- Nyckelord: {', '.join(theme_config['keywords'])}
- Ton: {theme_config['tone']}

UTDATA:
- Markdown: {self.config['output_settings']['markdown']['location']}
- HTML Preview: {self.config['output_settings']['html_preview']['location']}
"""
        
        return simulation

    def _dry_run_rewrite_simulation(self, article_content: str, theme: str) -> str:
        """Simulera artikelförbättring utan att köra AI"""
        team_config = self.config["teams"]["article_rewrite"]
        theme_config = self.config["topic_themes"][theme]
        
        simulation = f"""
=== DRY RUN - ARTIKELFÖRBÄTTRING ===
Befintlig artikel: {len(article_content)} tecken
Tema: {theme} - {theme_config['focus']}
Team: {team_config['name']}

FÖRBÄTTRING-WORKFLOW:
"""
        
        for i, task_config in enumerate(team_config["tasks"], 1):
            agent_key = task_config["agent"]
            agent_config = self.config["agents"][agent_key]
            
            simulation += f"""
{i}. {agent_config['name']} ({agent_config['llm']})
   Verktyg: {', '.join(agent_config.get('tools', []))}
   Förbättring: {task_config['description']}
"""
        
        return simulation

    def _save_article(self, content: str, topic: str, theme: str):
        """Spara artikel till staging"""
        os.makedirs("staging", exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"staging/article_{topic.replace(' ', '_')}_{theme}_{timestamp}.md"
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"---\ntitle: \"{topic}\"\ntheme: {theme}\ncreated: {datetime.now().isoformat()}\n---\n\n")
            f.write(str(content))
        
        logger.info(f"Artikel sparad: {filename}")

    def _create_preview(self, content: str, topic: str, theme: str):
        """Skapa HTML-preview av artikel"""
        os.makedirs("previews", exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"previews/preview_{topic.replace(' ', '_')}_{theme}_{timestamp}.html"
        
        # Skapa preview med agent-information
        agent_info = ""
        for agent_key in self.config["teams"]["blog_generation"]["agents"]:
            agent_config = self.config["agents"][agent_key]
            agent_info += f"""
            <div class="agent-card">
                <h4>{agent_config['name']}</h4>
                <p><strong>Roll:</strong> {agent_config['role']}</p>
                <p><strong>Modell:</strong> {agent_config['llm']}</p>
                <p><strong>Verktyg:</strong> {', '.join(agent_config.get('tools', []))}</p>
            </div>
            """
        
        theme_config = self.config["topic_themes"][theme]
        
        html_content = f"""
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview: {topic}</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
               line-height: 1.6; margin: 0; padding: 20px; background: #f5f5f5; }}
        .container {{ max-width: 1200px; margin: 0 auto; background: white; 
                     border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        .header {{ border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }}
        .metadata {{ background: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px; }}
        .agents-section {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
                          gap: 15px; margin: 20px 0; }}
        .agent-card {{ background: #e0f2fe; padding: 15px; border-radius: 6px; border-left: 4px solid #0288d1; }}
        .content {{ max-width: 800px; margin: 30px auto; line-height: 1.8; }}
        .content h2 {{ color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }}
        .content h3 {{ color: #1e40af; }}
        .timestamp {{ color: #6b7280; font-size: 0.9em; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Paypro.se AI-Artikel Preview</h1>
            <div class="timestamp">Genererad: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</div>
        </div>
        
        <div class="metadata">
            <p><strong>Ämne:</strong> {topic}</p>
            <p><strong>Tema:</strong> {theme} - {theme_config['focus']}</p>
            <p><strong>Nyckelord:</strong> {', '.join(theme_config['keywords'])}</p>
            <p><strong>Konfiguration:</strong> {self.config['system']['description']} v{self.config['system']['version']}</p>
        </div>
        
        <h3>🤖 AI-Agents som arbetade med denna artikel:</h3>
        <div class="agents-section">
            {agent_info}
        </div>
        
        <div class="content">
            <h2>📄 Genererat Innehåll</h2>
            {self._markdown_to_html(str(content))}
        </div>
    </div>
</body>
</html>
        """
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        logger.info(f"Preview skapad: {filename}")

    def _markdown_to_html(self, markdown: str) -> str:
        """Enkel markdown till HTML-konvertering"""
        import re
        
        # Enkla markdown-regler
        html = markdown
        html = re.sub(r'^# (.*$)', r'<h1>\1</h1>', html, flags=re.MULTILINE)
        html = re.sub(r'^## (.*$)', r'<h2>\1</h2>', html, flags=re.MULTILINE)
        html = re.sub(r'^### (.*$)', r'<h3>\1</h3>', html, flags=re.MULTILINE)
        html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
        html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)
        html = re.sub(r'\n\n', '</p><p>', html)
        html = f'<p>{html}</p>'
        html = html.replace('<p></p>', '')
        
        return html

    def list_available_themes(self) -> List[str]:
        """Lista tillgängliga teman"""
        return list(self.config["topic_themes"].keys())

    def update_config(self, updates: Dict[str, Any]):
        """
        Uppdatera konfiguration programmatiskt
        
        Args:
            updates: Dictionary med uppdateringar
        """
        # Djup merge av konfiguration
        def deep_merge(target, source):
            for key, value in source.items():
                if key in target and isinstance(target[key], dict) and isinstance(value, dict):
                    deep_merge(target[key], value)
                else:
                    target[key] = value
        
        deep_merge(self.config, updates)
        
        # Spara uppdaterad konfiguration
        with open(self.config_file, 'w', encoding='utf-8') as f:
            json.dump(self.config, f, indent=2, ensure_ascii=False)
        
        logger.info("Konfiguration uppdaterad och sparad")

    def create_config_template(self):
        """Skapa en konfigurationsmall för nya ämnen och förbättringar"""
        template = {
            "system": {
                "version": "2.1",
                "description": "Paypro.se Multi-Agent Content Generation System",
                "api_endpoint": "http://172.16.16.148:8088"
            },
            "agents": {
                "agent_template": {
                    "name": "Agent Namn",
                    "role": "Agent Roll/Titel",
                    "llm": "qwen2.5-7b | gpt-4o-mini | gpt-image-1",
                    "goal": "Tydligt definierat mål för agenten - vad ska den uppnå?",
                    "backstory": "Detaljerad bakgrund som etablerar agentens expertis, erfarenhet och personlighet. Inkludera relevant utbildning, arbetslivserfarenhet och specialkompetenser.",
                    "verbose": True,
                    "allow_delegation": False,
                    "tools": ["search", "DallETool"],
                    "prompt_instructions": "Specifika instruktioner för hur agenten ska bete sig, vilka aspekter som ska prioriteras, vilken stil och ton som ska användas."
                }
            },
            "teams": {
                "team_template": {
                    "name": "Team Namn",
                    "description": "Beskrivning av teamets syfte och workflow",
                    "agents": ["agent1", "agent2", "agent3"],
                    "tasks": [
                        {
                            "agent": "agent1",
                            "description": "Detaljerad beskrivning av vad agenten ska göra i detta steg",
                            "expected_output": "Vad förväntas som resultat från denna task"
                        }
                    ]
                }
            },
            "topic_themes": {
                "custom_theme": {
                    "focus": "Beskrivning av vad detta tema fokuserar på",
                    "keywords": ["nyckelord1", "nyckelord2", "nyckelord3"],
                    "tone": "Beskrivning av önskad ton och stil"
                }
            },
            "examples": {
                "prompt_improvements": {
                    "specificity": "Gör prompts mer specifika genom att lägga till konkreta exempel och parametrar",
                    "context": "Tillhandahåll mer kontext om Paypro.se's målgrupp och brand",
                    "constraints": "Lägg till begränsningar för att styra outputen (längd, stil, format)",
                    "examples": "Inkludera exempel på önskad output för att förtydliga förväntningar"
                },
                "theme_customization": {
                    "seasonal": "Anpassa teman för olika säsonger (Q4 rapporter, sommarlunchor, etc.)",
                    "target_audience": "Olika teman för olika målgrupper (nybörjare vs erfarna investerare)",
                    "content_type": "Teman för olika innehållstyper (nyheter, analys, guider, intervjuer)"
                }
            }
        }
        
        filename = "crewai-config-template.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(template, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Konfigurationsmall skapad: {filename}")

    def backup_config(self):
        """Skapa backup av nuvarande konfiguration"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = f"crewai-config-backup-{timestamp}.json"
        
        with open(backup_file, 'w', encoding='utf-8') as f:
            json.dump(self.config, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Konfiguration backupad: {backup_file}")
        return backup_file

def main():
    """Huvudfunktion för CLI"""
    parser = argparse.ArgumentParser(
        description="Paypro.se Konfigurationsdrivet CrewAI Management System v2.1",
        epilog="Exempel: python crewctl.py generate-article --topic 'Bitcoin och inflation' --theme crypto_focus"
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Tillgängliga kommandon')
    
    # Generate article kommando
    generate_parser = subparsers.add_parser('generate-article', help='Generera ny artikel')
    generate_parser.add_argument('--topic', default='aktuella finanstrender', help='Ämne för artikeln')
    generate_parser.add_argument('--theme', default='default', help='Tema för artikeln')
    generate_parser.add_argument('--dry-run', action='store_true', help='Kör endast simulering')
    
    # Rewrite article kommando
    rewrite_parser = subparsers.add_parser('rewrite-article', help='Förbättra befintlig artikel')
    rewrite_parser.add_argument('--file', required=True, help='Fil med artikel att förbättra')
    rewrite_parser.add_argument('--theme', default='default', help='Tema för förbättringen')
    rewrite_parser.add_argument('--dry-run', action='store_true', help='Kör endast simulering')
    
    # Generate HTML kommando
    html_parser = subparsers.add_parser('generate-html', help='Generera produktionsklar HTML')
    html_parser.add_argument('--file', required=True, help='Markdown-fil att konvertera')
    html_parser.add_argument('--title', default='Finansartikel', help='Titel för HTML-sidan')
    
    # List themes kommando
    subparsers.add_parser('list-themes', help='Lista tillgängliga teman')
    
    # Config kommando
    config_parser = subparsers.add_parser('config', help='Visa aktuell konfiguration')
    config_parser.add_argument('--section', help='Visa specifik sektion')
    
    # Update prompt kommando
    update_parser = subparsers.add_parser('update-prompt', help='Uppdatera agent prompt')
    update_parser.add_argument('--agent', required=True, help='Agent att uppdatera (makroekonom, kryptoanalytiker, etc.)')
    update_parser.add_argument('--prompt', required=True, help='Ny prompt-instruktion')
    update_parser.add_argument('--preview', action='store_true', help='Visa förhandsvisning utan att spara')
    
    # Create template kommando  
    subparsers.add_parser('create-template', help='Skapa mall för ny konfiguration')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    try:
        manager = ConfigurableCrewManager()
        
        if args.command == 'generate-article':
            result = manager.generate_article(
                topic=args.topic,
                theme=args.theme,
                dry_run=args.dry_run
            )
            print("\n" + "="*80)
            print("RESULTAT:")
            print("="*80)
            print(result)
            
        elif args.command == 'rewrite-article':
            if not os.path.exists(args.file):
                print(f"Fel: Filen {args.file} hittades inte")
                return
            
            with open(args.file, 'r', encoding='utf-8') as f:
                article_content = f.read()
            
            result = manager.rewrite_article(
                article_content=article_content,
                theme=args.theme,
                dry_run=args.dry_run
            )
            print("\n" + "="*80)
            print("FÖRBÄTTRAD ARTIKEL:")
            print("="*80)
            print(result)
            
        elif args.command == 'generate-html':
            if not os.path.exists(args.file):
                print(f"Fel: Filen {args.file} hittades inte")
                return
            
            with open(args.file, 'r', encoding='utf-8') as f:
                article_content = f.read()
            
            result = manager.generate_html(
                article_content=article_content,
                title=args.title
            )
            print("HTML genererad och sparad i previews/")
            
        elif args.command == 'list-themes':
            themes = manager.list_available_themes()
            print("\nTillgängliga teman:")
            for theme in themes:
                theme_config = manager.config["topic_themes"][theme]
                print(f"  {theme}: {theme_config['focus']}")
            
        elif args.command == 'config':
            if args.section:
                if args.section in manager.config:
                    print(json.dumps(manager.config[args.section], indent=2, ensure_ascii=False))
                else:
                    print(f"Sektion '{args.section}' hittades inte")
            else:
                print(json.dumps(manager.config, indent=2, ensure_ascii=False))
                
        elif args.command == 'update-prompt':
            if args.agent not in manager.config["agents"]:
                print(f"Agent '{args.agent}' hittades inte. Tillgängliga agents:")
                for agent_key in manager.config["agents"].keys():
                    print(f"  - {agent_key}")
                return
            
            current_prompt = manager.config["agents"][args.agent]["prompt_instructions"]
            print(f"\nNuvarande prompt för {args.agent}:")
            print(f"'{current_prompt}'")
            print(f"\nNy prompt:")
            print(f"'{args.prompt}'")
            
            if args.preview:
                print("\n✅ Förhandsvisning - ingen ändring sparad")
            else:
                # Uppdatera konfigurationen
                updates = {
                    "agents": {
                        args.agent: {
                            "prompt_instructions": args.prompt
                        }
                    }
                }
                manager.update_config(updates)
                print(f"\n✅ Prompt uppdaterad för agent '{args.agent}'")
                
        elif args.command == 'create-template':
            manager.create_config_template()
            print("✅ Konfigurationsmall skapad som 'crewai-config-template.json'")
    
    except KeyboardInterrupt:
        print("\nAvbruten av användare")
    except Exception as e:
        logger.error(f"Fel: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 