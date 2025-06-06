# CrewAI Studio API Documentation

This document summarizes the REST API endpoints for CrewAI Studio.

Base URL:
```
http://172.16.16.148:8088
```

## Endpoints

- **GET /**
  - Check API status and server info.

- **GET /tools**
  - List all available tools.

- **GET /agents**
  - List all agents.

- **POST /agents**
  - Create a new agent.
    - JSON body parameters: `name`, `role`, `goal`, `backstory`, `llm`, `verbose`, `allow_delegation`, `tools`

- **GET /crews**
  - List all crews.

- **POST /crews**
  - Create a new crew.
    - JSON body parameters: crew-specific fields (e.g., `name`, `agents`, `tools`).

- **POST /execute**
  - Execute a command.
    - JSON body example:
      ```json
      {
        "command": "run_crew",
        "args": { "crew_id": 1 }
      }
      ```

- **GET /status/{task_id}**
  - Get status of a task by ID.

- **Swagger UI**
  - Visit `/docs` for interactive API docs and examples.

---

_Last updated: $(date)_ 