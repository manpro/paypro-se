import requests
import json
import time

def fix_crew_assignments():
    base_url = "http://172.16.16.148:8088"
    
    print("=== FIXING CREW ASSIGNMENTS USING PUT ===")
    
    # Get existing crew to update
    print("\n1. GETTING EXISTING CREW...")
    crews_response = requests.get(f"{base_url}/crews")
    if crews_response.status_code == 200:
        crews = crews_response.json()
        
        # Find a crew to update (prefer the one we created)
        target_crew = None
        for crew in crews:
            if "Robinhood-Bitstamp" in crew.get('name', ''):
                target_crew = crew
                break
        
        if not target_crew and crews:
            target_crew = crews[-1]  # Use last created crew
        
        if not target_crew:
            print("❌ No crews found to update")
            return False
            
        crew_id = target_crew['id']
        print(f"✅ Using crew: {target_crew['name']} ({crew_id})")
        
    else:
        print(f"❌ Cannot get crews: {crews_response.status_code}")
        return False
    
    # Get available agents (use most recent ones)
    print("\n2. GETTING AVAILABLE AGENTS...")
    agents_response = requests.get(f"{base_url}/agents")
    if agents_response.status_code == 200:
        agents = agents_response.json()
        
        # Take the 5 most recent agents
        recent_agents = agents[-5:] if len(agents) >= 5 else agents
        agent_ids = [agent['id'] for agent in recent_agents]
        
        print(f"✅ Selected {len(agent_ids)} agents:")
        for agent in recent_agents:
            print(f"   - {agent.get('role', 'Unknown Role')} ({agent['id']})")
            
    else:
        print(f"❌ Cannot get agents: {agents_response.status_code}")
        return False
    
    # Get available tasks (use most recent ones)
    print("\n3. GETTING AVAILABLE TASKS...")
    tasks_response = requests.get(f"{base_url}/tasks")
    if tasks_response.status_code == 200:
        tasks = tasks_response.json()
        
        # Take the 5 most recent tasks
        recent_tasks = tasks[-5:] if len(tasks) >= 5 else tasks
        task_ids = [task['id'] for task in recent_tasks]
        
        print(f"✅ Selected {len(task_ids)} tasks:")
        for task in recent_tasks:
            desc = task.get('description', 'No description')[:60] + "..."
            print(f"   - {desc} ({task['id']})")
            
    else:
        print(f"❌ Cannot get tasks: {tasks_response.status_code}")
        return False
    
    # Update crew using PUT with correct schema
    print(f"\n4. UPDATING CREW WITH ASSIGNMENTS...")
    
    # Create update payload with all required fields
    update_data = {
        "name": target_crew.get('name', 'Updated Crew'),
        "process": target_crew.get('process', 'sequential'),
        "verbose": target_crew.get('verbose', True),
        "agent_ids": agent_ids,
        "task_ids": task_ids,
        "memory": target_crew.get('memory', False),
        "cache": target_crew.get('cache', True)
    }
    
    # Add optional fields if they exist
    if target_crew.get('manager_agent_id'):
        update_data['manager_agent_id'] = target_crew['manager_agent_id']
    
    try:
        print(f"   Updating crew {crew_id}...")
        print(f"   Assigning {len(agent_ids)} agents and {len(task_ids)} tasks")
        
        update_response = requests.put(
            f"{base_url}/crews/{crew_id}",
            headers={'Content-Type': 'application/json'},
            json=update_data
        )
        
        print(f"   Response: {update_response.status_code}")
        
        if update_response.status_code == 200:
            updated_crew = update_response.json()
            print(f"   ✅ Crew updated successfully!")
            
            # Verify assignments
            print(f"\n5. VERIFYING ASSIGNMENTS...")
            verify_response = requests.get(f"{base_url}/crews/{crew_id}")
            if verify_response.status_code == 200:
                crew_detail = verify_response.json()
                assigned_agents = crew_detail.get('agent_ids', [])
                assigned_tasks = crew_detail.get('task_ids', [])
                
                print(f"   Agents assigned: {len(assigned_agents)}")
                print(f"   Tasks assigned: {len(assigned_tasks)}")
                
                if len(assigned_agents) > 0 and len(assigned_tasks) > 0:
                    print(f"   🎉 CREW PROPERLY CONFIGURED!")
                    
                    # Test run the crew
                    print(f"\n6. TESTING CREW EXECUTION...")
                    
                    crew_id_base = crew_id.replace('C_', '') if crew_id.startswith('C_') else crew_id
                    
                    run_data = {
                        "crew_id": crew_id_base,
                        "inputs": {
                            "topic": "Robinhood's strategic acquisition of Bitstamp",
                            "analysis_focus": "Impact on European cryptocurrency regulation and market dynamics",
                            "target_length": "1500+ words comprehensive analysis"
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
                        
                        print(f"   ✅ RUN STARTED SUCCESSFULLY!")
                        print(f"   Run ID: {run_id}")
                        print(f"   Status: {run_result.get('status')}")
                        
                        # Save configuration for monitoring
                        config_data = {
                            "success": True,
                            "crew_id": crew_id,
                            "crew_id_base": crew_id_base, 
                            "run_id": run_id,
                            "agents": agent_ids,
                            "tasks": task_ids,
                            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                            "crew_name": update_data['name']
                        }
                        
                        with open('working_crew_final.json', 'w') as f:
                            json.dump(config_data, f, indent=2)
                        
                        print(f"\n🎉 COMPLETE SUCCESS!")
                        print(f"   📋 Crew: {update_data['name']}")
                        print(f"   🤖 Agents: {len(assigned_agents)}")
                        print(f"   📝 Tasks: {len(assigned_tasks)}")
                        print(f"   🚀 Run: {run_id}")
                        print(f"   💾 Config saved: working_crew_final.json")
                        
                        print(f"\n   Monitor the run with:")
                        print(f"   GET {base_url}/runs/{run_id}")
                        
                        return True
                    else:
                        print(f"   ❌ Failed to start run: {run_response.status_code}")
                        print(f"      Error: {run_response.text}")
                        return False
                else:
                    print(f"   ❌ Assignments not working properly")
                    print(f"      Assigned agents: {assigned_agents}")
                    print(f"      Assigned tasks: {assigned_tasks}")
                    return False
            else:
                print(f"   ❌ Cannot verify crew: {verify_response.status_code}")
                return False
        else:
            print(f"   ❌ Failed to update crew: {update_response.status_code}")
            print(f"      Error: {update_response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error updating crew: {e}")
        return False

if __name__ == "__main__":
    print("🔧 Fixing crew assignments using correct API schema...\n")
    
    result = fix_crew_assignments()
    
    print(f"\n{'='*80}")
    if result:
        print("🎉 CREW ASSIGNMENT FIX SUCCESSFUL!")
        print("   ✅ Crew properly configured with agents and tasks")
        print("   ✅ Test run initiated successfully")
        print("   🚀 Ready for production article generation!")
    else:
        print("❌ CREW ASSIGNMENT FIX FAILED")
        print("   Check error messages above for details") 