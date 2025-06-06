# CrewAI Studio API Documentation

## Overview
This document describes the CrewAI Studio API endpoints, their usage, and known issues/fixes.

## API Base URL
The API is accessible at: `http://localhost:8088`

## Authentication
Currently, the API does not require authentication.

## Endpoints

### Root
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /        | Root endpoint, returns API info |
| GET    | /settings | Get current API settings |
| POST   | /settings | Update API settings |

### Agents
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /agents | List all available agents |
| POST   | /agents | Create a new agent |
| GET    | /agents/{agent_id} | Get agent details by ID |

#### Agent Creation Example (API V2)
```json
POST /agents
{
  "role": "Researcher",
  "goal": "Find accurate information about any topic",
  "backstory": "An expert researcher with background in data analysis",
  "llm_provider_model": "openai:gpt-4",
  "tools": ["search", "file_search"],
  "verbose": true,
  "allow_delegation": false,
  "max_iter": 25,
  "max_execution_time": null,
  "step_callback": null,
  "system_template": null,
  "prompt_template": null,
  "response_template": null
}
```

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /tasks | List all available tasks |
| POST   | /tasks | Create a new task |
| GET    | /tasks/{task_id} | Get task details by ID |

#### Task Creation Example
```json
POST /tasks
{
  "description": "Research the latest AI developments",
  "agent_id": "agent_1234abcd",
  "expected_output": "A summary of recent AI advancements",
  "async_execution": false,
  "context": [{"text": "Focus on developments in the last 6 months"}],
  "tools": []
}
```

### Crews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /crews | List all available crews |
| POST   | /crews | Create a new crew |
| GET    | /crews/{crew_id} | Get crew details by ID |

#### Crew Creation Example
```json
POST /crews
{
  "name": "Research Team",
  "description": "A team focused on research tasks",
  "agents": ["agent_1234abcd", "agent_5678efgh"],
  "tasks": ["task_abcd1234", "task_efgh5678"],
  "process": "sequential",
  "verbose": true
}
```

### Tools
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /tools | List all available tools |
| GET    | /enabled-tools | List all enabled tools |
| POST   | /enabled-tools | Update enabled tools |

### Runs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /runs | List all runs |
| POST   | /runs | Start a new run (asynchronous) |
| GET    | /runs/{run_id} | Get run details and status by ID |
| GET    | /runs/raw/{run_id} | Get raw run data by ID (alternative endpoint) |

#### Run Creation Example
```json
POST /runs
{
  "crew_id": "b9beafec",
  "inputs": {
    "query": "Analyze the latest market trends"
  }
}
```

#### Run Response Format
```json
{
  "id": "R_abc123",
  "crew_id": "C_b9beafec", 
  "status": "pending",
  "result": null,
  "error": null,
  "created_at": "2024-03-19T10:30:00"
}
```

#### Run Status Monitoring
Runs are **asynchronous** - they return immediately with `status: "pending"` and execute in the background.

**Status Values:**
- `"pending"` - Run has started but not completed
- `"completed"` - Run finished successfully
- `"failed"` - Run encountered an error
- `"success"` - Alternative completed status
- `"error"` - Alternative failed status

**Polling Example:**
```bash
# Poll for status updates
GET /runs/R_abc123
# or 
GET /runs/abc123  # API normalizes ID automatically
```

**Note on crew_id**: When running a crew, use the base ID without the "C_" prefix, even though the database stores crew IDs with the "C_" prefix. The API will automatically handle the conversion.

#### Complete Run Workflow
1. **Start Run:** `POST /runs` with crew_id and inputs
2. **Get Run ID:** Extract `id` from response (format: `R_xxxxxx`)
3. **Poll Status:** Repeatedly call `GET /runs/{run_id}` until status changes
4. **Get Result:** When status is "completed", check `result` field in response

## Fixed Issues

### Tools Endpoint Fix (CRITICAL)
**Issue**: `/tools` endpoint returned error `name 'get_tools_dict' is not defined`
**Status**: ✅ FIXED

**Solution**: Added robust import handling in `api/simple_api_v2_enhanced.py`:
```python
try:
    from .api_tools import get_tools_dict  # Docker environment
except ImportError:
    try:
        from api.api_tools import get_tools_dict  # Project root
    except ImportError:
        from api_tools import get_tools_dict  # API directory
```

**Result**: All 4 tools now work correctly:
- `search` - Web search functionality
- `file_search` - File search capabilities  
- `calculator` - Mathematical calculations
- `code_interpreter` - Code execution

### Crew ID Handling
The API previously had issues with crew ID handling:
1. Database storage format: Uses "C_" prefix (e.g., "C_abcd1234")
2. API expected format: Was inconsistent across endpoints

#### Solution
The API has been updated to:
1. Store all crew IDs with a "C_" prefix consistently in the database
2. Return crew IDs with the "C_" prefix in all responses
3. Accept crew IDs with or without the "C_" prefix when running a crew
4. Better track original input IDs for more helpful error messages

When running a crew, we recommend using the base ID without any prefix for maximum compatibility.

### ID Format Consistency
We've standardized ID formats across the API:
- Agents use "agent_" prefix consistently
- Tasks use "task_" prefix consistently
- Crews use "C_" prefix consistently in the database and API responses

## Best Practices
1. **Creating Agents**: Specify the LLM model name to ensure consistent agent behavior
2. **Creating Tasks**: Always associate tasks with valid agent IDs
3. **Creating Crews**: Use a sequential process for simpler workflows, parallel for more complex ones
4. **Running Crews**: Use the base ID without prefixes when starting a run

## Error Handling
The API returns standard HTTP status codes:
- 200: Successful operation
- 400: Bad request (invalid input)
- 404: Resource not found
- 500: Server error

Error responses include a detail message explaining the error:
```json
{
  "detail": "Error message describing the issue"
}
```

## Database Integration
The API stores entities in a PostgreSQL database. Entity IDs are prefixed based on their type:
- Agents: "agent_" prefix
- Tasks: "task_" prefix
- Crews: "C_" prefix
- Runs: "run_" prefix

## Changelog
- 2025-03-19: **CRITICAL FIX** - Fixed tools endpoint `get_tools_dict` import error
- 2025-03-19: **MAJOR FIX** - Fixed agent name display bug in Streamlit frontend  
- 2025-03-19: Updated run documentation to include asynchronous behavior and status polling
- 2025-03-19: Fixed crew ID handling to ensure consistent storage and retrieval
- 2025-03-19: Updated crew creation endpoint to use consistent ID prefixing
- 2025-03-19: Enhanced error messages to show original input IDs for better debugging
- 2025-03-19: Verified all API endpoints are working correctly
- 2025-03-19: Established Git-based deployment workflow for production server 