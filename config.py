"""Configuration management for CrewAI CLI tool."""

import os
import yaml
from typing import Dict, Any, Optional
from dotenv import load_dotenv


class Config:
    """Enkel konfigurationsklass för CrewAI CLI-verktyget."""
    
    def __init__(self):
        self.crewai_base_url = "http://172.16.16.148:8088"
        self.crewai_timeout = 30
        self.max_retries = 3
    
    @property
    def api_url(self) -> str:
        """Get full API URL for compatibility."""
        return self.crewai_base_url
    
    @property 
    def timeout(self) -> int:
        """Get timeout for compatibility."""
        return self.crewai_timeout


# Läs in miljövariabler
load_dotenv()

# Skapa global config instans
config = Config()
config.crewai_base_url = os.getenv("CREWAI_BASE_URL", "http://172.16.16.148:8088")
config.crewai_timeout = int(os.getenv("CREWAI_TIMEOUT", "30"))
config.max_retries = int(os.getenv("MAX_RETRIES", "3")) 