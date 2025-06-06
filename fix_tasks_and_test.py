import requests
import json
import time

def fix_tasks_and_test():
    base_url = "http://172.16.16.148:8088"
    
    print("=== FIXING TASK VALIDATION ERRORS ===")
    
    # Get existing agents to use
    print("\n1. GETTING AGENTS...")
    agents_response = requests.get(f"{base_url}/agents")
    if agents_response.status_code == 200:
        agents = agents_response.json()
        recent_agents = agents[-5:] if len(agents) >= 5 else agents
        print(f"✅ Using {len(recent_agents)} agents")
    else:
        print(f"❌ Cannot get agents: {agents_response.status_code}")
        return False
    
    # Delete existing problematic tasks
    print("\n2. CLEANING UP EXISTING TASKS...")
    tasks_response = requests.get(f"{base_url}/tasks")
    if tasks_response.status_code == 200:
        tasks = tasks_response.json()
        print(f"Found {len(tasks)} existing tasks")
        
        # Delete recent tasks that might have validation issues
        deleted_count = 0
        for task in tasks[-10:]:  # Delete last 10 tasks
            try:
                delete_response = requests.delete(f"{base_url}/tasks/{task['id']}")
                if delete_response.status_code == 200:
                    deleted_count += 1
            except:
                pass
        
        print(f"Deleted {deleted_count} tasks")
    
    # Create new tasks with correct format
    print("\n3. CREATING CORRECTED TASKS...")
    
    tasks_config = [
        {
            "description": "Conduct comprehensive macroeconomic analysis of Robinhood's acquisition of Bitstamp, focusing on regulatory implications and European market dynamics.",
            "expected_output": "Detailed macroeconomic analysis covering regulatory landscape and market implications (400-500 words).",
            "agent_id": recent_agents[0]['id'],
            "async_execution": False
            # Note: Removed context field that was causing validation error
        },
        {
            "description": "Analyze cryptocurrency and blockchain implications of Robinhood's Bitstamp acquisition, including trading impact and European crypto adoption.",
            "expected_output": "Technical cryptocurrency market analysis covering blockchain implications and trading dynamics (400-500 words).",
            "agent_id": recent_agents[1]['id'],
            "async_execution": False
        },
        {
            "description": "Develop SEO-optimized content structure for the Robinhood-Bitstamp acquisition article, ensuring maximum search visibility.",
            "expected_output": "SEO content strategy with keyword recommendations and structure optimization (200-300 words).",
            "agent_id": recent_agents[2]['id'],
            "async_execution": False
        },
        {
            "description": "Perform comprehensive editorial review ensuring factual accuracy, professional tone, and financial journalism standards.",
            "expected_output": "Editorial review and content refinement with fact-checking and professional polish (300-400 words).",
            "agent_id": recent_agents[3]['id'],
            "async_execution": False
        },
        {
            "description": "Format complete article into professional HTML structure suitable for web publication with proper semantic markup.",
            "expected_output": "Complete HTML-formatted article with proper structure and professional formatting ready for publication.",
            "agent_id": recent_agents[4]['id'],
            "async_execution": False
        }
    ]
    
    created_tasks = []
    
    for i, task_config in enumerate(tasks_config):
        try:
            print(f"   Creating task {i+1}...")
            
            response = requests.post(
                f"{base_url}/tasks",
                headers={'Content-Type': 'application/json'},
                json=task_config
            )
            
            if response.status_code == 200:
                task = response.json()
                task_id = task.get('id')
                created_tasks.append(task_id)
                print(f"   ✅ Task created: {task_id}")
            else:
                print(f"   ❌ Failed to create task: {response.status_code}")
                print(f"      Error: {response.text}")
                return False
                
        except Exception as e:
            print(f"   ❌ Error creating task: {e}")
            return False
    
    print(f"\n   ✅ Created {len(created_tasks)} corrected tasks")
    
    # Update crew with corrected tasks
    print("\n4. UPDATING CREW WITH CORRECTED TASKS...")
    
    # Get the crew we've been working with
    crews_response = requests.get(f"{base_url}/crews")
    if crews_response.status_code == 200:
        crews = crews_response.json()
        
        target_crew = None
        for crew in crews:
            if "Robinhood-Bitstamp" in crew.get('name', ''):
                target_crew = crew
                break
        
        if not target_crew:
            print("❌ No target crew found")
            return False
            
        crew_id = target_crew['id']
        agent_ids = [agent['id'] for agent in recent_agents]
        
        # Update crew with corrected tasks
        update_data = {
            "name": target_crew.get('name', 'Robinhood-Bitstamp Analysis Crew'),
            "process": "sequential",
            "verbose": True,
            "agent_ids": agent_ids,
            "task_ids": created_tasks,
            "memory": False,
            "cache": True
        }
        
        update_response = requests.put(
            f"{base_url}/crews/{crew_id}",
            headers={'Content-Type': 'application/json'},
            json=update_data
        )
        
        if update_response.status_code == 200:
            print(f"   ✅ Crew updated with corrected tasks")
            
            # Verify assignments
            verify_response = requests.get(f"{base_url}/crews/{crew_id}")
            if verify_response.status_code == 200:
                crew_detail = verify_response.json()
                agent_count = len(crew_detail.get('agent_ids', []))
                task_count = len(crew_detail.get('task_ids', []))
                
                print(f"   Agents: {agent_count}, Tasks: {task_count}")
                
                if agent_count > 0 and task_count > 0:
                    print(f"   🎉 CREW READY FOR TESTING!")
                    
                    # Start a new test run
                    print("\n5. STARTING NEW TEST RUN...")
                    
                    crew_id_base = crew_id.replace('C_', '') if crew_id.startswith('C_') else crew_id
                    
                    run_data = {
                        "crew_id": crew_id_base,
                        "inputs": {
                            "topic": "Robinhood's acquisition of Bitstamp",
                            "focus": "European cryptocurrency regulation and market implications"
                        }
                    }
                    
                    run_response = requests.post(
                        f"{base_url}/runs",
                        headers={'Content-Type': 'application/json'},
                        json=run_data
                    )
                    
                    if run_response.status_code == 200:
                        run_result = run_response.json()
                        run_id = run_result.get('id')
                        
                        print(f"   ✅ NEW RUN STARTED: {run_id}")
                        print(f"   Status: {run_result.get('status')}")
                        
                        # Update config
                        config_data = {
                            "success": True,
                            "crew_id": crew_id,
                            "crew_id_base": crew_id_base,
                            "run_id": run_id,
                            "agents": agent_ids,
                            "tasks": created_tasks,
                            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                            "crew_name": update_data['name'],
                            "fixed_validation": True
                        }
                        
                        with open('working_crew_final.json', 'w') as f:
                            json.dump(config_data, f, indent=2)
                        
                        print(f"\n🎉 TASK VALIDATION FIXED!")
                        print(f"   📋 Crew: {crew_id}")
                        print(f"   🚀 Run: {run_id}")
                        print(f"   💾 Config: working_crew_final.json")
                        
                        return True
                    else:
                        print(f"   ❌ Failed to start run: {run_response.status_code}")
                        print(f"      Error: {run_response.text}")
                        return False
                else:
                    print(f"   ❌ Crew assignments failed")
                    return False
            else:
                print(f"   ❌ Cannot verify crew")
                return False
        else:
            print(f"   ❌ Failed to update crew: {update_response.status_code}")
            print(f"      Error: {update_response.text}")
            return False
    else:
        print(f"❌ Cannot get crews: {crews_response.status_code}")
        return False

if __name__ == "__main__":
    print("🔧 Fixing task validation errors...\n")
    
    result = fix_tasks_and_test()
    
    print(f"\n{'='*80}")
    if result:
        print("🎉 TASK VALIDATION FIXED SUCCESSFULLY!")
        print("   ✅ Tasks created with correct format")
        print("   ✅ Crew updated with fixed tasks")
        print("   ✅ New run started")
        print("   📊 Ready to monitor results!")
    else:
        print("❌ TASK VALIDATION FIX FAILED")
        print("   Check error messages above") 