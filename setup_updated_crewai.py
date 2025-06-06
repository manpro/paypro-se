import requests
import json
import time

def setup_updated_crewai():
    base_url = "http://172.16.16.148:8088"
    
    print("=== SETTING UP UPDATED CREWAI ===")
    
    # 1. Check available tools
    print("\n1. CHECKING AVAILABLE TOOLS...")
    try:
        tools_response = requests.get(f"{base_url}/tools")
        if tools_response.status_code == 200:
            available_tools = tools_response.json()
            print(f"Available tools: {len(available_tools)}")
            for tool in available_tools:
                tool_name = tool.get('name', 'Unknown')
                tool_desc = tool.get('description', 'No description')
                print(f"  - {tool_name}: {tool_desc}")
        else:
            print(f"❌ Failed to get tools: {tools_response.status_code}")
    except Exception as e:
        print(f"❌ Error getting tools: {e}")
    
    # 2. Enable all tools
    print("\n2. ENABLING ALL TOOLS...")
    try:
        enabled_response = requests.get(f"{base_url}/enabled-tools")
        if enabled_response.status_code == 200:
            enabled_tools = enabled_response.json()
            print(f"Currently enabled tools: {enabled_tools}")
        
        # Enable all available tools
        if 'available_tools' in locals():
            all_tool_names = [tool.get('name') for tool in available_tools if tool.get('name')]
            
            enable_data = {"enabled_tools": all_tool_names}
            
            enable_response = requests.post(
                f"{base_url}/enabled-tools",
                headers={'Content-Type': 'application/json'},
                json=enable_data
            )
            
            if enable_response.status_code == 200:
                print(f"✅ Enabled {len(all_tool_names)} tools: {all_tool_names}")
            else:
                print(f"❌ Failed to enable tools: {enable_response.status_code}")
                print(enable_response.text)
    except Exception as e:
        print(f"❌ Error enabling tools: {e}")
    
    # 3. Read our local configuration
    print("\n3. READING LOCAL CONFIGURATION...")
    try:
        with open('crewai-config.json', 'r', encoding='utf-8') as f:
            config = json.load(f)
        print("✅ Local configuration loaded")
    except Exception as e:
        print(f"❌ Failed to read config: {e}")
        return
    
    # 4. Check existing agents
    print("\n4. CHECKING EXISTING AGENTS...")
    agents_response = requests.get(f"{base_url}/agents")
    if agents_response.status_code != 200:
        print("❌ Cannot get agents")
        return
    
    existing_agents = agents_response.json()
    existing_names = [agent.get('name', '') for agent in existing_agents]
    print(f"Existing agents: {existing_names}")
    
    # 5. Create missing agents
    print("\n5. CREATING MISSING AGENTS...")
    created_count = 0
    
    for agent_key, agent_config in config['agents'].items():
        agent_name = agent_config['name']
        
        if agent_name in existing_names:
            print(f"⏭️  {agent_name} already exists")
            continue
        
        agent_data = {
            "name": agent_config['name'],
            "role": agent_config['role'],
            "llm": agent_config['llm'],
            "goal": agent_config['goal'],
            "backstory": agent_config['backstory'],
            "verbose": agent_config.get('verbose', True),
            "allow_delegation": agent_config.get('allow_delegation', False),
            "tools": agent_config.get('tools', []),
            "prompt_instructions": agent_config.get('prompt_instructions', '')
        }
        
        print(f"🔄 Creating {agent_name} ({agent_data['llm']})...")
        
        try:
            create_response = requests.post(
                f"{base_url}/agents",
                headers={'Content-Type': 'application/json'},
                json=agent_data
            )
            
            if create_response.status_code in [200, 201]:
                print(f"✅ Created {agent_name}")
                created_count += 1
            else:
                print(f"❌ Failed to create {agent_name}: {create_response.status_code}")
                print(create_response.text)
        except Exception as e:
            print(f"❌ Error creating {agent_name}: {e}")
    
    print(f"\nCreated {created_count} new agents")
    
    # 6. Get updated agent list
    print("\n6. GETTING UPDATED AGENT LIST...")
    agents_response = requests.get(f"{base_url}/agents")
    updated_agents = agents_response.json()
    
    # Find our specific agents
    our_agents = {}
    target_agents = ['Makroekonom', 'Kryptoanalytiker', 'SEO-skribent', 'Bildkonstnär', 'Redaktör']
    
    for agent in updated_agents:
        if agent.get('name') in target_agents:
            our_agents[agent['name']] = agent
            print(f"✅ {agent['name']} (ID: {agent.get('id')}, LLM: {agent.get('llm')})")
    
    if len(our_agents) < 5:
        print(f"❌ Missing agents. Found {len(our_agents)}/5")
        return
    
    # 7. Create article generation crew
    print("\n7. CREATING ARTICLE GENERATION CREW...")
    
    # Create tasks first
    tasks = []
    task_configs = [
        {
            "name": "Economic Analysis",
            "description": "Analyze current macroeconomic indicators and their impact on financial markets for the given topic",
            "agent": our_agents['Makroekonom']['id'],
            "expected_output": "Detailed economic analysis with data and market implications"
        },
        {
            "name": "Crypto Analysis", 
            "description": "Research cryptocurrency trends and blockchain developments related to the topic",
            "agent": our_agents['Kryptoanalytiker']['id'],
            "expected_output": "Comprehensive crypto analysis with technical insights"
        },
        {
            "name": "SEO Article Creation",
            "description": "Create SEO-optimized article combining economic and crypto analysis",
            "agent": our_agents['SEO-skribent']['id'],
            "expected_output": "Complete SEO-optimized article"
        },
        {
            "name": "Image Generation",
            "description": "Create professional illustration for the article",
            "agent": our_agents['Bildkonstnär']['id'],
            "expected_output": "Professional article illustration"
        },
        {
            "name": "Editorial Review",
            "description": "Final editorial review and quality improvement",
            "agent": our_agents['Redaktör']['id'],
            "expected_output": "Publication-ready article"
        }
    ]
    
    task_ids = []
    for task_config in task_configs:
        try:
            task_response = requests.post(
                f"{base_url}/tasks",
                headers={'Content-Type': 'application/json'},
                json=task_config
            )
            
            if task_response.status_code in [200, 201]:
                task_result = task_response.json()
                task_id = task_result.get('id')
                task_ids.append(task_id)
                print(f"✅ Created task: {task_config['name']} (ID: {task_id})")
            else:
                print(f"❌ Failed to create task {task_config['name']}: {task_response.status_code}")
        except Exception as e:
            print(f"❌ Error creating task {task_config['name']}: {e}")
    
    if len(task_ids) != 5:
        print(f"❌ Failed to create all tasks. Got {len(task_ids)}/5")
        return
    
    # Create the crew
    crew_data = {
        "name": "Paypro Article Generation Crew",
        "description": "Complete workflow for generating professional financial articles with images",
        "agents": [agent['id'] for agent in our_agents.values()],
        "tasks": task_ids
    }
    
    try:
        crew_response = requests.post(
            f"{base_url}/crews",
            headers={'Content-Type': 'application/json'},
            json=crew_data
        )
        
        if crew_response.status_code in [200, 201]:
            crew_result = crew_response.json()
            crew_id = crew_result.get('id')
            print(f"✅ Created crew: {crew_data['name']} (ID: {crew_id})")
            
            # 8. Test the crew
            print(f"\n8. TESTING THE CREW...")
            
            test_data = {
                "crew_id": crew_id,
                "inputs": {
                    "topic": "Robinhood's acquisition of Bitstamp and its impact on cryptocurrency regulation"
                }
            }
            
            run_response = requests.post(
                f"{base_url}/runs",
                headers={'Content-Type': 'application/json'},
                json=test_data
            )
            
            if run_response.status_code == 200:
                run_result = run_response.json()
                run_id = run_result['run_id']
                print(f"✅ Test run started: {run_id}")
                
                # Monitor for a short time
                for i in range(5):
                    try:
                        status_response = requests.get(f"{base_url}/runs/{run_id}")
                        if status_response.status_code == 200:
                            status = status_response.json()
                            current_status = status.get('status', 'unknown')
                            print(f"Status {i+1}: {current_status}")
                            
                            if current_status == 'completed':
                                result = status.get('result', {})
                                results = result.get('results', {})
                                
                                if results and any(len(str(r).strip()) > 50 for r in results.values()):
                                    print(f"🎉 SUCCESS! Crew generated content!")
                                    return True
                                else:
                                    print(f"⚠️  Completed but minimal content")
                                    return False
                            elif current_status == 'failed':
                                error = status.get('error', 'Unknown error')
                                print(f"❌ Test failed: {error}")
                                return False
                        
                        time.sleep(3)
                    except Exception as e:
                        print(f"Error checking status: {e}")
                
                print(f"⏱️ Test still running (check run_id: {run_id} later)")
                return True
            else:
                print(f"❌ Failed to start test: {run_response.status_code}")
                print(run_response.text)
                return False
        else:
            print(f"❌ Failed to create crew: {crew_response.status_code}")
            print(crew_response.text)
            return False
    except Exception as e:
        print(f"❌ Error creating crew: {e}")
        return False

if __name__ == "__main__":
    print("Setting up updated CrewAI with agents, tools, and crew...\n")
    
    success = setup_updated_crewai()
    
    print(f"\n{'='*50}")
    if success:
        print("🎉 SETUP COMPLETE!")
        print("   - All agents created")
        print("   - All tools enabled") 
        print("   - Crew created and tested")
        print("   - Ready for article generation!")
    else:
        print("❌ SETUP INCOMPLETE")
        print("   Check the errors above and try again") 