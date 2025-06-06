import requests
import json
import time

def final_test():
    base_url = "http://172.16.16.148:8088"
    
    print("=== FINAL TEST WITH CORRECT API STRUCTURE ===")
    
    # 1. Enable more tools
    print("\n1. ENABLING ALL TOOLS...")
    try:
        # Enable all available tools
        enable_data = {"enabled_tools": ["search", "file_search", "calculator", "code_interpreter"]}
        
        enable_response = requests.post(
            f"{base_url}/enabled-tools",
            headers={'Content-Type': 'application/json'},
            json=enable_data
        )
        
        if enable_response.status_code == 200:
            print(f"✅ Enabled all tools")
        else:
            print(f"⚠️ Tool enabling response: {enable_response.status_code}")
    except Exception as e:
        print(f"❌ Error enabling tools: {e}")
    
    # 2. Get our agents
    print("\n2. GETTING OUR AGENTS...")
    agents_response = requests.get(f"{base_url}/agents")
    agents = agents_response.json()
    
    our_agents = {}
    for agent in agents:
        if agent.get('name') in ['Redaktör', 'Bildkonstnär']:
            our_agents[agent['name']] = agent
            print(f"✅ {agent['name']} (ID: {agent.get('id')}, LLM: {agent.get('llm')})")
    
    # 3. Create tasks with correct structure
    print("\n3. CREATING TASKS WITH CORRECT STRUCTURE...")
    
    # Test with Redaktör (gpt-4o-mini)
    task_data = {
        "name": "Content Generation Test",
        "description": "Write a short paragraph about Robinhood's impact on democratizing trading. Be specific and informative.",
        "agent_id": our_agents['Redaktör']['id'],  # Use agent_id instead of agent
        "expected_output": "One informative paragraph about Robinhood"
    }
    
    task_response = requests.post(
        f"{base_url}/tasks",
        headers={'Content-Type': 'application/json'},
        json=task_data
    )
    
    print(f"Task creation response: {task_response.status_code}")
    
    if task_response.status_code in [200, 201]:
        task_result = task_response.json()
        task_id = task_result.get('id')
        print(f"✅ Created task: {task_id}")
        
        # 4. Create crew
        print("\n4. CREATING CREW...")
        crew_data = {
            "name": "Content Test Crew",
            "description": "Test crew for content generation",
            "agents": [our_agents['Redaktör']['id']],
            "tasks": [task_id]
        }
        
        crew_response = requests.post(
            f"{base_url}/crews",
            headers={'Content-Type': 'application/json'},
            json=crew_data
        )
        
        if crew_response.status_code in [200, 201]:
            crew_result = crew_response.json()
            crew_id = crew_result.get('id')
            print(f"✅ Created crew: {crew_id}")
            
            # 5. Run the crew
            print("\n5. RUNNING CONTENT TEST...")
            
            run_data = {
                "crew_id": crew_id,
                "inputs": {
                    "topic": "Robinhood trading platform analysis"
                }
            }
            
            run_response = requests.post(
                f"{base_url}/runs",
                headers={'Content-Type': 'application/json'},
                json=run_data
            )
            
            if run_response.status_code == 200:
                run_result = run_response.json()
                run_id = run_result['run_id']
                print(f"✅ Test run started: {run_id}")
                
                # Monitor with longer timeout
                print(f"\n6. MONITORING EXECUTION...")
                for i in range(15):  # 15 x 3 seconds = 45 seconds
                    try:
                        status_response = requests.get(f"{base_url}/runs/{run_id}")
                        if status_response.status_code == 200:
                            status = status_response.json()
                            current_status = status.get('status', 'unknown')
                            print(f"Status {i+1}: {current_status}")
                            
                            if current_status == 'completed':
                                result = status.get('result', {})
                                
                                print(f"\n=== FINAL RESULT ===")
                                print(json.dumps(result, indent=2, ensure_ascii=False))
                                
                                # Analyze the content
                                results = result.get('results', {})
                                if results:
                                    total_content = 0
                                    for task_name, content in results.items():
                                        if content and isinstance(content, str):
                                            content_length = len(content.strip())
                                            total_content += content_length
                                            print(f"\nTask '{task_name}': {content_length} characters")
                                            
                                            if content_length > 100:  # Substantial content
                                                print(f"Preview: {content[:200]}...")
                                    
                                    if total_content > 100:
                                        print(f"\n🎉 SUCCESS! Generated {total_content} characters of content")
                                        print("✅ Updated CrewAI is working with LLMs!")
                                        return True
                                    else:
                                        print(f"\n⚠️ Generated only {total_content} characters")
                                        print("❌ Content generation still limited")
                                        return False
                                else:
                                    print(f"\n❌ No content results found")
                                    return False
                                    
                            elif current_status == 'failed':
                                error = status.get('error', 'Unknown error')
                                print(f"\n❌ Execution failed: {error}")
                                return False
                        
                        time.sleep(3)
                        
                    except Exception as e:
                        print(f"Error checking status: {e}")
                        time.sleep(2)
                
                print(f"\n⏱️ Timeout after 45 seconds - check run {run_id} manually")
                return None
                
            else:
                print(f"❌ Failed to start run: {run_response.status_code}")
                print(run_response.text)
                return False
        else:
            print(f"❌ Failed to create crew: {crew_response.status_code}")
            print(crew_response.text)
            return False
    else:
        print(f"❌ Failed to create task: {task_response.status_code}")
        print(task_response.text)
        return False

if __name__ == "__main__":
    print("Final test of updated CrewAI with correct API structure...\n")
    
    result = final_test()
    
    print(f"\n{'='*60}")
    if result is True:
        print("🎉 CREWAI UPDATE SUCCESSFUL!")
        print("   ✅ LLM connections working")
        print("   ✅ Content generation working") 
        print("   ✅ Ready for full article generation!")
        print("\nNow you can run the Robinhood article generation!")
    elif result is False:
        print("❌ CREWAI STILL HAS ISSUES")
        print("   Content generation not working properly")
    else:
        print("⏱️ TEST INCOMPLETE")
        print("   Check the run status manually") 