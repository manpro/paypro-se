import requests
import json

def investigate_crew_api():
    base_url = "http://172.16.16.148:8088"
    
    print("=== INVESTIGATING CREW API ===")
    
    # Test different crew creation formats
    print("\n1. TESTING DIFFERENT CREW CREATION FORMATS...")
    
    # Get existing agents to use
    agents_response = requests.get(f"{base_url}/agents")
    if agents_response.status_code == 200:
        agents = agents_response.json()
        if len(agents) >= 2:
            agent_ids = [agents[0]['id'], agents[1]['id']]
            print(f"   Using agents: {agent_ids}")
        else:
            print("   ❌ Not enough agents available")
            return
    else:
        print("   ❌ Cannot get agents")
        return
    
    # Get existing tasks to use
    tasks_response = requests.get(f"{base_url}/tasks")
    if tasks_response.status_code == 200:
        tasks = tasks_response.json()
        if len(tasks) >= 2:
            task_ids = [tasks[0]['id'], tasks[1]['id']]
            print(f"   Using tasks: {task_ids}")
        else:
            print("   ❌ Not enough tasks available")
            return
    else:
        print("   ❌ Cannot get tasks")
        return
    
    # Try different crew creation formats
    test_configs = [
        {
            "name": "Test Crew 1",
            "description": "Testing with agents and tasks arrays",
            "agents": agent_ids,
            "tasks": task_ids,
            "process": "sequential",
            "verbose": True
        },
        {
            "name": "Test Crew 2", 
            "description": "Testing with agent_ids and task_ids",
            "agent_ids": agent_ids,
            "task_ids": task_ids,
            "process": "sequential",
            "verbose": True
        },
        {
            "name": "Test Crew 3",
            "description": "Testing minimal format then update",
            "process": "sequential",
            "verbose": True
        }
    ]
    
    created_crews = []
    
    for i, config in enumerate(test_configs):
        try:
            print(f"\n   Test {i+1}: {config['name']}")
            print(f"   Config: {json.dumps(config, indent=2)}")
            
            response = requests.post(
                f"{base_url}/crews",
                headers={'Content-Type': 'application/json'},
                json=config
            )
            
            print(f"   Response: {response.status_code}")
            
            if response.status_code == 200:
                crew = response.json()
                crew_id = crew.get('id')
                created_crews.append(crew_id)
                print(f"   ✅ Created: {crew_id}")
                
                # Check assignments
                verify_response = requests.get(f"{base_url}/crews/{crew_id}")
                if verify_response.status_code == 200:
                    crew_detail = verify_response.json()
                    agent_count = len(crew_detail.get('agent_ids', []))
                    task_count = len(crew_detail.get('task_ids', []))
                    print(f"   Agents assigned: {agent_count}")
                    print(f"   Tasks assigned: {task_count}")
                    
                    if agent_count > 0 or task_count > 0:
                        print(f"   🎉 THIS FORMAT WORKS!")
                else:
                    print(f"   ❌ Cannot verify crew")
            else:
                print(f"   ❌ Failed: {response.text}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    # Test if there are update endpoints
    print(f"\n2. TESTING UPDATE/ASSIGNMENT ENDPOINTS...")
    
    if created_crews:
        test_crew_id = created_crews[0]
        
        # Try different update endpoints
        update_endpoints = [
            f"/crews/{test_crew_id}/agents",
            f"/crews/{test_crew_id}/tasks", 
            f"/crews/{test_crew_id}/assign",
            f"/crews/{test_crew_id}"
        ]
        
        for endpoint in update_endpoints:
            try:
                # Test OPTIONS to see what methods are allowed
                options_response = requests.options(f"{base_url}{endpoint}")
                print(f"   OPTIONS {endpoint}: {options_response.status_code}")
                
                if options_response.status_code == 200:
                    allowed_methods = options_response.headers.get('Allow', 'Unknown')
                    print(f"      Allowed methods: {allowed_methods}")
                
                # Test PUT to update
                if endpoint.endswith(test_crew_id):
                    update_data = {
                        "agent_ids": agent_ids,
                        "task_ids": task_ids
                    }
                else:
                    update_data = agent_ids if 'agents' in endpoint else task_ids
                
                put_response = requests.put(
                    f"{base_url}{endpoint}",
                    headers={'Content-Type': 'application/json'},
                    json=update_data
                )
                
                print(f"   PUT {endpoint}: {put_response.status_code}")
                if put_response.status_code != 404:
                    print(f"      Response: {put_response.text[:200]}")
                
            except Exception as e:
                print(f"   Error testing {endpoint}: {e}")
    
    # Test API root for documentation
    print(f"\n3. CHECKING API ROOT...")
    try:
        root_response = requests.get(f"{base_url}/")
        print(f"   Status: {root_response.status_code}")
        if root_response.status_code == 200:
            root_data = root_response.json()
            print(f"   Root data: {json.dumps(root_data, indent=2)}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Check if there's an OpenAPI/Swagger endpoint
    print(f"\n4. CHECKING FOR API DOCUMENTATION ENDPOINTS...")
    doc_endpoints = [
        "/docs",
        "/swagger", 
        "/openapi.json",
        "/redoc",
        "/api/docs"
    ]
    
    for endpoint in doc_endpoints:
        try:
            doc_response = requests.get(f"{base_url}{endpoint}")
            print(f"   {endpoint}: {doc_response.status_code}")
            if doc_response.status_code == 200:
                print(f"      📖 Documentation found!")
                content_type = doc_response.headers.get('Content-Type', '')
                print(f"      Content-Type: {content_type}")
        except:
            pass

if __name__ == "__main__":
    investigate_crew_api() 