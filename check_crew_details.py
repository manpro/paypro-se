import requests
import json

def check_crew_details():
    base_url = "http://172.16.16.148:8088"
    
    print("=== CHECKING CREW DETAILS ===")
    
    # 1. Get all crews
    print("\n1. GETTING ALL CREWS...")
    try:
        crews_response = requests.get(f"{base_url}/crews")
        if crews_response.status_code == 200:
            crews = crews_response.json()
            print(f"Found {len(crews)} crews")
            
            for crew in crews:
                crew_id = crew.get('id', 'N/A')
                name = crew.get('name', 'N/A')
                description = crew.get('description', 'N/A')
                agents = crew.get('agents', [])
                tasks = crew.get('tasks', [])
                
                print(f"\n  📋 CREW: {name}")
                print(f"     ID: {crew_id}")
                print(f"     Description: {description}")
                print(f"     Agents: {len(agents)} assigned")
                print(f"     Tasks: {len(tasks)} assigned")
                
                if agents:
                    print(f"     Agent IDs: {agents}")
                else:
                    print(f"     ❌ NO AGENTS ASSIGNED!")
                    
                if tasks:
                    print(f"     Task IDs: {tasks}")
                else:
                    print(f"     ❌ NO TASKS ASSIGNED!")
                    
        else:
            print(f"❌ Cannot get crews: {crews_response.status_code}")
            
    except Exception as e:
        print(f"❌ Error getting crews: {e}")
    
    # 2. Get all agents to see what exists
    print(f"\n2. GETTING ALL AGENTS...")
    try:
        agents_response = requests.get(f"{base_url}/agents")
        if agents_response.status_code == 200:
            agents = agents_response.json()
            print(f"Found {len(agents)} agents")
            
            for agent in agents:
                agent_id = agent.get('id', 'N/A')
                role = agent.get('role', 'N/A')
                name = agent.get('name', 'N/A')
                
                print(f"  🤖 {role}")
                print(f"     ID: {agent_id}")
                print(f"     Name: {name}")
                
        else:
            print(f"❌ Cannot get agents: {agents_response.status_code}")
            
    except Exception as e:
        print(f"❌ Error getting agents: {e}")
    
    # 3. Get all tasks
    print(f"\n3. GETTING ALL TASKS...")
    try:
        tasks_response = requests.get(f"{base_url}/tasks")
        if tasks_response.status_code == 200:
            tasks = tasks_response.json()
            print(f"Found {len(tasks)} tasks")
            
            for task in tasks:
                task_id = task.get('id', 'N/A')
                description = task.get('description', 'N/A')[:100] + "..."
                agent_id = task.get('agent_id', 'N/A')
                
                print(f"  📋 Task {task_id}")
                print(f"     Agent: {agent_id}")
                print(f"     Description: {description}")
                
        else:
            print(f"❌ Cannot get tasks: {tasks_response.status_code}")
            
    except Exception as e:
        print(f"❌ Error getting tasks: {e}")
    
    # 4. Get specific crew details
    print(f"\n4. DETAILED CHECK OF C_41af8f22...")
    try:
        crew_response = requests.get(f"{base_url}/crews/C_41af8f22")
        if crew_response.status_code == 200:
            crew_detail = crew_response.json()
            print(f"Crew Detail Response:")
            print(json.dumps(crew_detail, indent=2))
        else:
            print(f"❌ Cannot get crew details: {crew_response.status_code}")
            print(f"Response: {crew_response.text}")
            
    except Exception as e:
        print(f"❌ Error getting crew details: {e}")

if __name__ == "__main__":
    check_crew_details() 