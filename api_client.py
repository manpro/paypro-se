"""API client for CrewAI Studio."""

import time
import requests
from typing import Dict, Any, List, Optional
from rich.console import Console
from crewai.llm import LLM

console = Console()


class CrewAIAPIError(Exception):
    """Custom exception for API errors."""
    pass


class CrewAIAPIClient:
    """
    CrewAI API Client för konfigurationsdrivet system
    """
    
    def __init__(self, base_url: str = "http://172.16.16.148:8088"):
        """
        Initialisera API-klient
        
        Args:
            base_url: Bas-URL för CrewAI API
        """
        self.base_url = base_url
        self.timeout = 30
        
    def get_model(self, model_name: str) -> LLM:
        """
        Hämta LLM-modell för CrewAI
        
        Args:
            model_name: Namn på modellen (qwen2.5-7b, gpt-4o-mini, gpt-image-1)
            
        Returns:
            LLM objekt för CrewAI
        """
        return LLM(
            model=model_name,
            base_url=self.base_url,
            api_key="dummy"  # Använd dummy för lokal API
        )

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict:
        """Make HTTP request to CrewAI API."""
        url = f"{self.base_url}{endpoint}"
        
        try:
            if method.upper() == "GET":
                response = requests.get(url, timeout=self.timeout)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, timeout=self.timeout)
            elif method.upper() == "DELETE":
                response = requests.delete(url, timeout=self.timeout)
            else:
                raise CrewAIAPIError(f"Unsupported HTTP method: {method}")
            
            response.raise_for_status()
            return response.json()
        
        except requests.exceptions.RequestException as e:
            raise CrewAIAPIError(f"API request failed: {e}")

    def check_api_status(self) -> Dict:
        """Check if API is running."""
        return self.make_request("GET", "/")

    def list_agents(self) -> List[Dict]:
        """List all agents."""
        response = self.make_request("GET", "/agents")
        return response if isinstance(response, list) else response.get("agents", [])

    def list_crews(self) -> List[Dict]:
        """List all crews."""
        response = self.make_request("GET", "/crews")
        return response if isinstance(response, list) else response.get("crews", [])

    def list_tools(self) -> List[Dict]:
        """List all available tools."""
        response = self.make_request("GET", "/tools")
        return response if isinstance(response, list) else response.get("tools", [])

    def create_agent(self, name: str, role: str, goal: str, backstory: str, 
                    llm: str = "gpt-4", verbose: bool = True, 
                    allow_delegation: bool = False, tools: List[str] = None) -> Dict:
        """Create a new agent."""
        data = {
            "name": name,
            "role": role,
            "goal": goal,
            "backstory": backstory,
            "llm": llm,
            "verbose": verbose,
            "allow_delegation": allow_delegation,
            "tools": tools or []
        }
        return self.make_request("POST", "/agents", data)

    def create_crew(self, name: str, description: str, agent_ids: List[int]) -> Dict:
        """Create a new crew."""
        data = {
            "name": name,
            "description": description,
            "agent_ids": agent_ids
        }
        return self.make_request("POST", "/crews", data)

    def run_crew_and_wait(self, crew_id: int, max_wait: int = 300) -> Dict:
        """Run a crew and poll for results."""
        console.print(f"[blue]Starting crew {crew_id}...[/blue]")
        
        # Execute the crew with correct API format
        data = {
            "command": "run_crew",
            "crew_id": crew_id
        }
        response = self.make_request("POST", "/execute", data)
        
        task_id = response.get("task_id")
        
        if not task_id:
            raise CrewAIAPIError("No task_id returned from execute command")
        
        console.print(f"[yellow]Task ID: {task_id}[/yellow]")
        console.print("[yellow]Polling for results...[/yellow]")
        
        # Poll for results
        start_time = time.time()
        while time.time() - start_time < max_wait:
            status = self.get_task_status(task_id)
            
            if status.get("status") == "completed":
                console.print("[green]✓ Crew execution completed![/green]")
                return status
            elif status.get("status") == "failed":
                console.print(f"[red]✗ Crew execution failed: {status.get('error')}[/red]")
                return status
            
            console.print(".", end="")
            time.sleep(2)
        
        raise CrewAIAPIError(f"Crew execution timed out after {max_wait} seconds")

    def get_task_status(self, task_id: str) -> Dict:
        """Get status of a task."""
        return self.make_request("GET", f"/status/{task_id}")


# Bakåtkompatibilitet för befintlig kod
def make_request(method: str, endpoint: str, data: Optional[Dict] = None) -> Dict:
    """Make HTTP request to CrewAI API."""
    # Skapa en default klient för bakåtkompatibilitet
    client = CrewAIAPIClient()
    return client.make_request(method, endpoint, data)


def check_api_status() -> Dict:
    """Check if API is running."""
    client = CrewAIAPIClient()
    return client.check_api_status()


def list_agents() -> List[Dict]:
    """List all agents."""
    client = CrewAIAPIClient()
    return client.list_agents()


def list_crews() -> List[Dict]:
    """List all crews."""
    client = CrewAIAPIClient()
    return client.list_crews()


def list_tools() -> List[Dict]:
    """List all available tools."""
    client = CrewAIAPIClient()
    return client.list_tools()


def create_agent(name: str, role: str, goal: str, backstory: str, 
                llm: str = "gpt-4", verbose: bool = True, 
                allow_delegation: bool = False, tools: List[str] = None) -> Dict:
    """Create a new agent."""
    client = CrewAIAPIClient()
    return client.create_agent(name, role, goal, backstory, llm, verbose, allow_delegation, tools)


def create_crew(name: str, description: str, agent_ids: List[int]) -> Dict:
    """Create a new crew."""
    client = CrewAIAPIClient()
    return client.create_crew(name, description, agent_ids)


def delete_agent(agent_id: int) -> Dict:
    """Delete an agent."""
    client = CrewAIAPIClient()
    return client.make_request("DELETE", f"/agents/{agent_id}")


def delete_crew(crew_id: int) -> Dict:
    """Delete a crew."""
    client = CrewAIAPIClient()
    return client.make_request("DELETE", f"/crews/{crew_id}")


def execute_command(command: str, args: Dict[str, Any]) -> Dict:
    """Execute a command via API."""
    data = {
        "command": command,
        "args": args
    }
    client = CrewAIAPIClient()
    return client.make_request("POST", "/execute", data)


def get_task_status(task_id: str) -> Dict:
    """Get status of a task."""
    client = CrewAIAPIClient()
    return client.get_task_status(task_id)


def run_crew_and_wait(crew_id: int, max_wait: int = 300) -> Dict:
    """Run a crew and poll for results."""
    client = CrewAIAPIClient()
    return client.run_crew_and_wait(crew_id, max_wait)


def install_tool(tool_name: str) -> Dict:
    """Install a tool (placeholder for future API support)."""
    # This is a placeholder - implement when API supports tool installation
    return {
        "message": f"Tool installation for '{tool_name}' not yet supported by API",
        "status": "placeholder"
    }


def create_task(description: str, expected_output: str, agent_id: int, crew_id: int) -> Dict:
    """Create a new task for a crew."""
    data = {
        "description": description,
        "expected_output": expected_output,
        "agent_id": agent_id,
        "crew_id": crew_id
    }
    client = CrewAIAPIClient()
    return client.make_request("POST", "/tasks", data)


def list_tasks() -> List[Dict]:
    """List all tasks."""
    client = CrewAIAPIClient()
    response = client.make_request("GET", "/tasks")
    return response if isinstance(response, list) else response.get("tasks", []) 