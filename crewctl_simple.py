#!/usr/bin/env python3
"""CrewAI CLI Tool - Simple version without rich formatting."""

import sys
from typing import List, Optional
import typer

import api_client
from api_client import CrewAIAPIError
from config import config
from preview import preview_content

app = typer.Typer(help="CrewAI CLI Tool for managing agents, crews, and content")


def handle_api_error(func):
    """Decorator to handle API errors gracefully."""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except CrewAIAPIError as e:
            print(f"API Error: {e}")
            sys.exit(1)
        except Exception as e:
            print(f"Unexpected error: {e}")
            sys.exit(1)
    return wrapper


@app.command()
@handle_api_error
def status():
    """Check API status and connection."""
    response = api_client.check_api_status()
    print("✓ API is running")
    print(response)


@app.command()
@handle_api_error
def list_agents():
    """List all agents."""
    agents = api_client.list_agents()
    
    if not agents:
        print("No agents found")
        return
    
    print("Agents:")
    for agent in agents:
        print(f"  ID: {agent.get('id', 'N/A')}")
        print(f"  Name: {agent.get('name', 'N/A')}")
        print(f"  Role: {agent.get('role', 'N/A')}")
        print(f"  LLM: {agent.get('llm', 'N/A')}")
        print("  ---")


@app.command()
@handle_api_error
def list_crews():
    """List all crews."""
    crews = api_client.list_crews()
    
    if not crews:
        print("No crews found")
        return
    
    print("Crews:")
    for crew in crews:
        print(f"  ID: {crew.get('id', 'N/A')}")
        print(f"  Name: {crew.get('name', 'N/A')}")
        print(f"  Description: {crew.get('description', 'N/A')}")
        print("  ---")


@app.command()
@handle_api_error
def list_tools():
    """List all available tools."""
    tools = api_client.list_tools()
    
    if not tools:
        print("No tools found")
        return
    
    print("Available Tools:")
    for tool in tools:
        print(f"  Name: {tool.get('name', 'N/A')}")
        print(f"  Description: {tool.get('description', 'N/A')}")
        print("  ---")


@app.command()
@handle_api_error
def create_agent(
    preset: Optional[str] = typer.Option(None, help="Use agent preset"),
    name: Optional[str] = typer.Option(None, help="Agent name"),
    role: Optional[str] = typer.Option(None, help="Agent role"),
    goal: Optional[str] = typer.Option(None, help="Agent goal"),
    backstory: Optional[str] = typer.Option(None, help="Agent backstory"),
    llm: str = typer.Option("gpt-4", help="LLM model"),
    verbose: bool = typer.Option(True, help="Verbose mode"),
    allow_delegation: bool = typer.Option(False, help="Allow delegation"),
    dry_run: bool = typer.Option(False, "--dry-run", help="Show what would be created")
):
    """Create a new agent."""
    
    if preset:
        preset_data = config.get_agent_preset(preset)
        if not preset_data:
            print(f"Preset '{preset}' not found")
            sys.exit(1)
        
        # Use preset values as defaults
        name = name or preset_data.get("name", "")
        role = role or preset_data.get("role", "")
        goal = goal or preset_data.get("goal", "")
        backstory = backstory or preset_data.get("backstory", "")
        llm = preset_data.get("llm", llm)
        tools = preset_data.get("tools", [])
    else:
        tools = []
    
    # Validate required fields
    if not name or not role or not goal or not backstory:
        print("Error: name, role, goal, and backstory are required")
        print("Use --preset to load from config.yaml or provide all required options")
        sys.exit(1)
    
    if dry_run:
        print("DRY RUN - Would create agent:")
        print(f"Name: {name}")
        print(f"Role: {role}")
        print(f"Goal: {goal}")
        print(f"Backstory: {backstory}")
        print(f"LLM: {llm}")
        print(f"Tools: {', '.join(tools)}")
        return
    
    result = api_client.create_agent(
        name=name, role=role, goal=goal, backstory=backstory,
        llm=llm, tools=tools, verbose=verbose, allow_delegation=allow_delegation
    )
    
    print(f"✓ Agent '{name}' created successfully")
    print(result)


@app.command()
def test_preview():
    """Test preview functionality with sample content."""
    sample_content = """# Test Blog Post

Detta är en testblogg för att visa preview-funktionaliteten.

## Innehåll

* Första punkten
* Andra punkten

**Viktigt:** Detta är bara ett test.

```python
print("Hello, world!")
```

Slut på test."""
    
    file_path = preview_content(sample_content, "Test Blog Post", "test-blog", auto_open=False)
    print(f"✓ Preview generated: {file_path}")


@app.command()
def config_info():
    """Show configuration information."""
    print(f"CrewAI API URL: {config.api_url}")
    print(f"Timeout: {config.timeout}s")
    
    agent_presets = config.list_agent_presets()
    crew_presets = config.list_crew_presets()
    
    if agent_presets:
        print(f"Agent presets: {', '.join(agent_presets)}")
    if crew_presets:
        print(f"Crew presets: {', '.join(crew_presets)}")


if __name__ == "__main__":
    app() 