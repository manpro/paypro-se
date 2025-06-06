import requests
import json
import time

def simple_test():
    base_url = "http://172.16.16.148:8088"
    
    print("=== SIMPLE TEST TO AVOID CONTEXT ERROR ===")
    
    # Get one agent and create a minimal task and crew
    print("\n1. GETTING ONE AGENT...")
    agents_response = requests.get(f"{base_url}/agents")
    if agents_response.status_code != 200:
        print("❌ Cannot get agents")
        return False
        
    agents = agents_response.json()
    if not agents:
        print("❌ No agents available")
        return False
        
    test_agent = agents[-1]
    agent_id = test_agent['id']
    print(f"✅ Using agent: {test_agent.get('role', 'Unknown')} ({agent_id})")
    
    # Create a single minimal task
    print("\n2. CREATING MINIMAL TASK...")
    task_data = {
        "description": "Write a brief summary about cryptocurrency regulation.",
        "expected_output": "A short paragraph about cryptocurrency regulation trends.",
        "agent_id": agent_id,
        "async_execution": False
    }
    
    task_response = requests.post(
        f"{base_url}/tasks",
        headers={'Content-Type': 'application/json'},
        json=task_data
    )
    
    if task_response.status_code != 200:
        print(f"❌ Task creation failed: {task_response.status_code}")
        print(f"Error: {task_response.text}")
        return False
        
    task = task_response.json()
    task_id = task['id']
    print(f"✅ Task created: {task_id}")
    
    # Create minimal crew
    print("\n3. CREATING MINIMAL CREW...")
    crew_data = {
        "name": "Simple Test Crew",
        "process": "sequential", 
        "verbose": True,
        "agent_ids": [agent_id],
        "task_ids": [task_id],
        "memory": False,
        "cache": True
    }
    
    crew_response = requests.post(
        f"{base_url}/crews",
        headers={'Content-Type': 'application/json'},
        json=crew_data
    )
    
    if crew_response.status_code != 200:
        print(f"❌ Crew creation failed: {crew_response.status_code}")
        print(f"Error: {crew_response.text}")
        return False
        
    crew = crew_response.json()
    crew_id = crew['id']
    print(f"✅ Crew created: {crew_id}")
    
    # Verify crew assignments
    verify_response = requests.get(f"{base_url}/crews/{crew_id}")
    if verify_response.status_code == 200:
        crew_detail = verify_response.json()
        agents_assigned = len(crew_detail.get('agent_ids', []))
        tasks_assigned = len(crew_detail.get('task_ids', []))
        print(f"   Agents: {agents_assigned}, Tasks: {tasks_assigned}")
        
        if agents_assigned == 0 or tasks_assigned == 0:
            print("❌ Crew not properly assigned")
            return False
    else:
        print("❌ Cannot verify crew")
        return False
    
    # Run with minimal inputs
    print("\n4. STARTING MINIMAL RUN...")
    
    crew_id_base = crew_id.replace('C_', '') if crew_id.startswith('C_') else crew_id
    
    # Use very simple inputs
    run_data = {
        "crew_id": crew_id_base,
        "inputs": {}  # Empty inputs to avoid context issues
    }
    
    run_response = requests.post(
        f"{base_url}/runs",
        headers={'Content-Type': 'application/json'},
        json=run_data
    )
    
    if run_response.status_code != 200:
        print(f"❌ Run failed: {run_response.status_code}")
        print(f"Error: {run_response.text}")
        return False
        
    run_result = run_response.json()
    run_id = run_result.get('id')
    print(f"✅ Run started: {run_id}")
    print(f"Status: {run_result.get('status')}")
    
    # Monitor briefly
    print("\n5. MONITORING...")
    
    for attempt in range(20):
        try:
            status_response = requests.get(f"{base_url}/runs/{run_id}")
            
            if status_response.status_code == 200:
                status_data = status_response.json()
                current_status = status_data.get('status', 'unknown')
                
                print(f"[{attempt*3:03d}s] Status: {current_status}")
                
                if current_status in ['completed', 'success']:
                    print(f"\n🎉 SUCCESS!")
                    
                    result = status_data.get('result', {})
                    if result:
                        print(f"Result type: {type(result)}")
                        
                        # Save result
                        with open('simple_test_result.json', 'w', encoding='utf-8') as f:
                            json.dump(status_data, f, indent=2, ensure_ascii=False)
                        
                        print(f"💾 Result saved: simple_test_result.json")
                        
                        # Quick analysis
                        result_str = str(result)
                        char_count = len(result_str.strip())
                        print(f"📊 Content: {char_count} characters")
                        
                        if char_count > 100:
                            preview = result_str[:200] + "..." if len(result_str) > 200 else result_str
                            print(f"Preview: {preview}")
                        elif char_count > 0:
                            print(f"Content: {result_str}")
                        
                        return True
                    else:
                        print("⚠️ No content but run succeeded")
                        return True
                        
                elif current_status in ['failed', 'error']:
                    error = status_data.get('error', 'Unknown error')
                    print(f"\n❌ FAILED: {error}")
                    
                    # Save error
                    with open('simple_test_error.json', 'w') as f:
                        json.dump(status_data, f, indent=2)
                    
                    return False
                    
                elif current_status == 'pending':
                    time.sleep(3)
                    continue
                else:
                    time.sleep(3)
                    continue
                    
            else:
                print(f"❌ Status check failed: {status_response.status_code}")
                time.sleep(3)
                continue
                
        except Exception as e:
            print(f"❌ Error: {e}")
            time.sleep(3)
            continue
    
    print(f"\n⏰ TIMEOUT")
    return None

if __name__ == "__main__":
    print("🧪 Simple CrewAI Test...\n")
    
    result = simple_test()
    
    print(f"\n{'='*60}")
    if result is True:
        print("🎉 SIMPLE TEST SUCCESS!")
        print("   CrewAI system is working")
    elif result is False:
        print("❌ SIMPLE TEST FAILED")
    else:
        print("⏰ SIMPLE TEST TIMEOUT") 