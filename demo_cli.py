#!/usr/bin/env python3
"""Demo script for CrewAI CLI functionality."""

import sys
import api_client
from config import config
from preview import preview_content

def demo_status():
    """Demo API status check."""
    print("=== API Status ===")
    try:
        response = api_client.check_api_status()
        print("✓ API is running")
        print(f"Response: {response}")
    except Exception as e:
        print(f"✗ API Error: {e}")
    print()

def demo_list_agents():
    """Demo listing agents."""
    print("=== List Agents ===")
    try:
        agents = api_client.list_agents()
        print(f"Found {len(agents)} agents:")
        for agent in agents:
            print(f"  ID: {agent.get('id')}")
            print(f"  Name: {agent.get('name')}")
            print(f"  Role: {agent.get('role')}")
            print(f"  LLM: {agent.get('llm')}")
            print("  ---")
    except Exception as e:
        print(f"✗ Error: {e}")
    print()

def demo_list_crews():
    """Demo listing crews."""
    print("=== List Crews ===")
    try:
        crews = api_client.list_crews()
        print(f"Found {len(crews)} crews:")
        for crew in crews:
            print(f"  ID: {crew.get('id')}")
            print(f"  Name: {crew.get('name')}")
            print(f"  Description: {crew.get('description')}")
            print(f"  Agents: {crew.get('agents', [])}")
            print("  ---")
    except Exception as e:
        print(f"✗ Error: {e}")
    print()

def demo_create_agent_dry_run():
    """Demo creating agent with preset (dry run)."""
    print("=== Create Agent (Dry Run) ===")
    
    preset_name = "blog_writer"
    preset_data = config.get_agent_preset(preset_name)
    
    if not preset_data:
        print(f"✗ Preset '{preset_name}' not found")
        return
    
    print(f"Using preset: {preset_name}")
    print("Would create agent with:")
    print(f"  Name: {preset_data.get('name')}")
    print(f"  Role: {preset_data.get('role')}")
    print(f"  Goal: {preset_data.get('goal')}")
    print(f"  LLM: {preset_data.get('llm')}")
    print(f"  Tools: {preset_data.get('tools', [])}")
    print()

def demo_preview():
    """Demo preview functionality."""
    print("=== Preview Demo ===")
    
    sample_content = """# Svensk Bloggpost

Detta är en demonstration av preview-funktionaliteten.

## Innehåll

* **Första punkten** - viktig information
* *Andra punkten* - mer detaljer

### Kodexempel

```python
def hello_world():
    print("Hej världen!")
```

> Detta är ett citat för att visa blockquote-funktionalitet.

Slutsats: Preview-funktionen fungerar utmärkt!"""
    
    try:
        file_path = preview_content(
            sample_content, 
            "Demo Bloggpost", 
            "demo-blog", 
            auto_open=False
        )
        print(f"✓ Preview generated: {file_path}")
        print("  HTML saved in previews/")
        print("  Markdown saved in staging/")
    except Exception as e:
        print(f"✗ Preview failed: {e}")
    print()

def demo_config():
    """Demo configuration info."""
    print("=== Configuration ===")
    print(f"API URL: {config.api_url}")
    print(f"Timeout: {config.timeout}s")
    
    agent_presets = config.list_agent_presets()
    crew_presets = config.list_crew_presets()
    
    print(f"Agent presets: {agent_presets}")
    print(f"Crew presets: {crew_presets}")
    print()

if __name__ == "__main__":
    print("CrewAI CLI Demo")
    print("=" * 50)
    
    demo_config()
    demo_status()
    demo_list_agents()
    demo_list_crews()
    demo_create_agent_dry_run()
    demo_preview()
    
    print("Demo completed!")
    print("\nNext steps:")
    print("- Fix typer compatibility issues")
    print("- Test actual agent/crew creation")
    print("- Implement remaining CLI commands") 