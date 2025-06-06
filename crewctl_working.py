#!/usr/bin/env python3
"""CrewAI CLI Tool - Working version without rich integration."""

import sys
from typing import List, Optional
import typer

import api_client
from api_client import CrewAIAPIError
from config import config
from preview import preview_content

# Disable rich integration
app = typer.Typer(help="CrewAI CLI Tool for managing agents, crews, and content", 
                  rich_markup_mode=None, pretty_exceptions_enable=False)


def handle_api_error(func):
    """Decorator to handle API errors gracefully."""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except CrewAIAPIError as e:
            typer.echo(f"API Error: {e}", err=True)
            raise typer.Exit(1)
        except Exception as e:
            typer.echo(f"Unexpected error: {e}", err=True)
            raise typer.Exit(1)
    return wrapper


@app.command()
@handle_api_error
def status():
    """Check API status and connection."""
    response = api_client.check_api_status()
    typer.echo("✓ API is running")
    typer.echo(f"Response: {response}")


@app.command()
@handle_api_error
def list_agents():
    """List all agents."""
    agents = api_client.list_agents()
    
    if not agents:
        typer.echo("No agents found")
        return
    
    typer.echo("Agents:")
    for agent in agents:
        typer.echo(f"  ID: {agent.get('id', 'N/A')}")
        typer.echo(f"  Name: {agent.get('name', 'N/A')}")
        typer.echo(f"  Role: {agent.get('role', 'N/A')}")
        typer.echo(f"  LLM: {agent.get('llm', 'N/A')}")
        typer.echo("  ---")


@app.command()
@handle_api_error
def list_crews():
    """List all crews."""
    crews = api_client.list_crews()
    
    if not crews:
        typer.echo("No crews found")
        return
    
    typer.echo("Crews:")
    for crew in crews:
        typer.echo(f"  ID: {crew.get('id', 'N/A')}")
        typer.echo(f"  Name: {crew.get('name', 'N/A')}")
        typer.echo(f"  Description: {crew.get('description', 'N/A')}")
        agents_count = len(crew.get('agents', []))
        typer.echo(f"  Agents: {agents_count}")
        typer.echo("  ---")


@app.command()
@handle_api_error
def list_tools():
    """List all available tools."""
    tools = api_client.list_tools()
    
    if not tools:
        typer.echo("No tools found")
        return
    
    typer.echo("Available Tools:")
    for tool in tools:
        typer.echo(f"  Name: {tool.get('name', 'N/A')}")
        typer.echo(f"  Description: {tool.get('description', 'N/A')}")
        typer.echo("  ---")


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
            typer.echo(f"Preset '{preset}' not found", err=True)
            raise typer.Exit(1)
        
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
        typer.echo("Error: name, role, goal, and backstory are required", err=True)
        typer.echo("Use --preset to load from config.yaml or provide all required options")
        raise typer.Exit(1)
    
    if dry_run:
        typer.echo("DRY RUN - Would create agent:")
        typer.echo(f"Name: {name}")
        typer.echo(f"Role: {role}")
        typer.echo(f"Goal: {goal}")
        typer.echo(f"Backstory: {backstory}")
        typer.echo(f"LLM: {llm}")
        typer.echo(f"Tools: {', '.join(tools)}")
        return
    
    result = api_client.create_agent(
        name=name, role=role, goal=goal, backstory=backstory,
        llm=llm, tools=tools, verbose=verbose, allow_delegation=allow_delegation
    )
    
    typer.echo(f"✓ Agent '{name}' created successfully")
    typer.echo(f"Result: {result}")


@app.command()
@handle_api_error  
def create_crew(
    name: Optional[str] = typer.Option(None, help="Crew name"),
    description: Optional[str] = typer.Option(None, help="Crew description"),
    agent_ids: Optional[List[int]] = typer.Option(None, help="Agent IDs (can be repeated)"),
    dry_run: bool = typer.Option(False, "--dry-run", help="Show what would be created"),
    preset: Optional[str] = typer.Option(None, help="Use crew preset")
):
    """Create a new crew."""
    
    if preset:
        preset_data = config.get_crew_preset(preset)
        if not preset_data:
            typer.echo(f"Preset '{preset}' not found", err=True)
            raise typer.Exit(1)
        
        name = name or preset_data.get("name", "")
        description = description or preset_data.get("description", "")
    
    # Validate required fields
    if not name or not description or not agent_ids:
        typer.echo("Error: name, description, and agent_ids are required", err=True)
        typer.echo("Use --preset to load from config.yaml or provide all required options")
        raise typer.Exit(1)
    
    if dry_run:
        typer.echo("DRY RUN - Would create crew:")
        typer.echo(f"Name: {name}")
        typer.echo(f"Description: {description}")
        typer.echo(f"Agent IDs: {agent_ids}")
        return
    
    result = api_client.create_crew(name=name, description=description, agent_ids=agent_ids)
    
    typer.echo(f"✓ Crew '{name}' created successfully")
    typer.echo(f"Result: {result}")


@app.command()
@handle_api_error
def delete_agent(agent_id: int = typer.Argument(..., help="Agent ID to delete")):
    """Delete an agent."""
    if typer.confirm(f"Are you sure you want to delete agent {agent_id}?"):
        result = api_client.delete_agent(agent_id)
        typer.echo(f"✓ Agent {agent_id} deleted")
        typer.echo(f"Result: {result}")


@app.command()
@handle_api_error
def delete_crew(crew_id: int = typer.Argument(..., help="Crew ID to delete")):
    """Delete a crew."""
    if typer.confirm(f"Are you sure you want to delete crew {crew_id}?"):
        result = api_client.delete_crew(crew_id)
        typer.echo(f"✓ Crew {crew_id} deleted")
        typer.echo(f"Result: {result}")


@app.command()
@handle_api_error
def run_crew(crew_id: int = typer.Argument(..., help="Crew ID to run")):
    """Run a crew and wait for results."""
    result = api_client.run_crew_and_wait(crew_id)
    typer.echo("Crew execution result:")
    typer.echo(f"{result}")


@app.command()
@handle_api_error
def install_tool(tool_name: str = typer.Argument(..., help="Tool name to install")):
    """Install a tool (placeholder)."""
    result = api_client.install_tool(tool_name)
    typer.echo(f"Tool installation result: {result}")


@app.command()
def preview(
    content: Optional[str] = typer.Option(None, help="Content to preview"),
    title: Optional[str] = typer.Option(None, help="Preview title"),
    slug: Optional[str] = typer.Option(None, help="URL slug"),
    no_open: bool = typer.Option(False, "--no-open", help="Don't open browser")
):
    """Generate HTML preview of content."""
    if not content:
        typer.echo("Error: content is required", err=True)
        raise typer.Exit(1)
    
    file_path = preview_content(content, title, slug, auto_open=not no_open)
    typer.echo(f"✓ Preview generated: {file_path}")


@app.command()
def config_info():
    """Show configuration information."""
    typer.echo(f"CrewAI API URL: {config.api_url}")
    typer.echo(f"Timeout: {config.timeout}s")
    
    agent_presets = config.list_agent_presets()
    crew_presets = config.list_crew_presets()
    
    if agent_presets:
        typer.echo(f"Agent presets: {', '.join(agent_presets)}")
    if crew_presets:
        typer.echo(f"Crew presets: {', '.join(crew_presets)}")


if __name__ == "__main__":
    app() 