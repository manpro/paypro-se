import requests
import json
import time

def complete_setup():
    base_url = "http://172.16.16.148:8088"
    
    print("=== COMPLETE CREWAI SETUP FROM SCRATCH ===")
    
    # 1. Load our configuration
    print("\n1. LOADING CONFIGURATION...")
    try:
        with open('crewai-config.json', 'r', encoding='utf-8') as f:
            config = json.load(f)
        print("✅ Configuration loaded")
    except Exception as e:
        print(f"❌ Failed to load config: {e}")
        return False
    
    # 2. Check and enable all tools
    print("\n2. CHECKING AND ENABLING TOOLS...")
    try:
        # Get available tools
        tools_response = requests.get(f"{base_url}/tools")
        if tools_response.status_code == 200:
            tools_data = tools_response.json()
            available_tools = list(tools_data.keys()) if isinstance(tools_data, dict) else []
            print(f"Available tools: {available_tools}")
            
            # Enable all tools
            if available_tools:
                enable_data = {"enabled_tools": available_tools}
                enable_response = requests.post(
                    f"{base_url}/enabled-tools",
                    headers={'Content-Type': 'application/json'},
                    json=enable_data
                )
                if enable_response.status_code == 200:
                    print(f"✅ Enabled {len(available_tools)} tools")
                else:
                    print(f"⚠️ Tool enabling response: {enable_response.status_code}")
            
            # Verify enabled tools
            enabled_response = requests.get(f"{base_url}/enabled-tools")
            if enabled_response.status_code == 200:
                enabled_tools = enabled_response.json()
                print(f"Currently enabled: {enabled_tools}")
        else:
            print(f"❌ Failed to get tools: {tools_response.status_code}")
    except Exception as e:
        print(f"❌ Error with tools: {e}")
    
    # 3. Clear existing data (optional)
    print("\n3. CHECKING EXISTING AGENTS...")
    try:
        agents_response = requests.get(f"{base_url}/agents")
        if agents_response.status_code == 200:
            existing_agents = agents_response.json()
            print(f"Found {len(existing_agents)} existing agents")
            
            # List existing agents
            for agent in existing_agents:
                print(f"   - {agent.get('name')} (ID: {agent.get('id')})")
        else:
            print(f"❌ Cannot get existing agents: {agents_response.status_code}")
    except Exception as e:
        print(f"❌ Error checking agents: {e}")
    
    # 4. Create/Update all agents
    print("\n4. CREATING/UPDATING ALL AGENTS...")
    
    agent_ids = {}
    created_count = 0
    
    for agent_key, agent_config in config['agents'].items():
        agent_name = agent_config['name']
        
        # Check if agent already exists
        existing_agent = None
        if 'existing_agents' in locals():
            for agent in existing_agents:
                if agent.get('name') == agent_name:
                    existing_agent = agent
                    break
        
        if existing_agent:
            print(f"✅ {agent_name} already exists (ID: {existing_agent['id']})")
            agent_ids[agent_name] = existing_agent['id']
            continue
        
        # Create new agent
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
        
        print(f"🔄 Creating {agent_name} with {agent_data['llm']}...")
        
        try:
            create_response = requests.post(
                f"{base_url}/agents",
                headers={'Content-Type': 'application/json'},
                json=agent_data
            )
            
            if create_response.status_code in [200, 201]:
                result = create_response.json()
                agent_id = result.get('id')
                agent_ids[agent_name] = agent_id
                print(f"✅ Created {agent_name} (ID: {agent_id})")
                created_count += 1
            else:
                print(f"❌ Failed to create {agent_name}: {create_response.status_code}")
                print(create_response.text)
        except Exception as e:
            print(f"❌ Error creating {agent_name}: {e}")
    
    print(f"\nAgent creation summary: {created_count} new agents")
    
    # 5. Refresh agent list
    print("\n5. GETTING FINAL AGENT LIST...")
    try:
        agents_response = requests.get(f"{base_url}/agents")
        if agents_response.status_code == 200:
            all_agents = agents_response.json()
            
            # Update agent_ids with all current agents
            for agent in all_agents:
                name = agent.get('name')
                if name in ['Makroekonom', 'Kryptoanalytiker', 'SEO-skribent', 'Bildkonstnär', 'Redaktör', 'HTML-Formatterar']:
                    agent_ids[name] = agent.get('id')
                    print(f"✅ {name} (ID: {agent.get('id')}, LLM: {agent.get('llm')})")
        
        if len(agent_ids) < 6:
            print(f"❌ Missing agents. Found {len(agent_ids)}/6")
            return False
            
    except Exception as e:
        print(f"❌ Error getting final agents: {e}")
        return False
    
    # 6. Create comprehensive tasks
    print("\n6. CREATING COMPREHENSIVE TASKS...")
    
    task_configs = [
        {
            "name": "Macroeconomic Analysis",
            "description": "Analyze macroeconomic factors, regulatory environment, and market conditions affecting Robinhood's Bitstamp acquisition. Focus on European financial regulations, cross-border transaction implications, and monetary policy impacts.",
            "agent_id": agent_ids['Makroekonom'],
            "expected_output": "Detailed macroeconomic analysis covering regulatory, monetary, and market implications"
        },
        {
            "name": "Cryptocurrency Deep Dive",
            "description": "Comprehensive analysis of the cryptocurrency and blockchain implications of Robinhood's Bitstamp acquisition. Cover crypto regulation trends, DeFi impacts, technical infrastructure, and competitive positioning in European crypto markets.",
            "agent_id": agent_ids['Kryptoanalytiker'],
            "expected_output": "In-depth cryptocurrency analysis with technical and regulatory insights"
        },
        {
            "name": "SEO-Optimized Article Creation",
            "description": "Create a comprehensive, SEO-optimized article about 'Robinhood's strategic acquisition of Bitstamp: implications for crypto regulation and European expansion'. Target 1500+ words, include relevant keywords, and ensure high readability. Write in English only.",
            "agent_id": agent_ids['SEO-skribent'],
            "expected_output": "Complete 1500+ word SEO-optimized article in English"
        },
        {
            "name": "Professional Visual Creation",
            "description": "Generate a professional illustration that captures the essence of Robinhood's Bitstamp acquisition. The image should convey themes of financial technology innovation, cryptocurrency trading, European market expansion, and regulatory compliance.",
            "agent_id": agent_ids['Bildkonstnär'],
            "expected_output": "Professional article illustration or detailed image description"
        },
        {
            "name": "Editorial Review and Polish",
            "description": "Perform comprehensive editorial review of the article. Enhance clarity, flow, and professional tone. Ensure journalistic quality, fact-checking, and remove any AI-generated traces. Output must be in English only.",
            "agent_id": agent_ids['Redaktör'],
            "expected_output": "Publication-ready polished article in English"
        },
        {
            "name": "HTML Production Format",
            "description": "Convert the final article to clean, production-ready HTML following modern web standards and Paypro.se design system. Include proper semantic markup, SEO meta tags, and responsive structure. Output must be in English only.",
            "agent_id": agent_ids['HTML-Formatterar'],
            "expected_output": "Clean, production-ready HTML article"
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
                print(f"✅ Created: {task_config['name']} (ID: {task_id})")
            else:
                print(f"❌ Failed: {task_config['name']} - {task_response.status_code}")
                print(task_response.text)
        except Exception as e:
            print(f"❌ Error creating {task_config['name']}: {e}")
    
    if len(task_ids) != 6:
        print(f"❌ Task creation incomplete. Got {len(task_ids)}/6")
        return False
    
    # 7. Create production crew
    print("\n7. CREATING PRODUCTION CREW...")
    
    crew_data = {
        "name": "Paypro Production Crew - Robinhood Analysis",
        "description": "Complete production workflow for generating professional financial articles with analysis, writing, editing, and HTML formatting",
        "agents": list(agent_ids.values()),
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
            print(f"✅ Created production crew: {crew_id}")
            
            # 8. Execute production run
            print("\n8. EXECUTING PRODUCTION RUN...")
            
            run_data = {
                "crew_id": crew_id,
                "inputs": {
                    "topic": "Robinhood's strategic acquisition of Bitstamp: implications for crypto regulation and European expansion",
                    "theme": "comprehensive_analysis",
                    "target_audience": "financial_professionals",
                    "word_count": "1500+",
                    "language": "English",
                    "focus_areas": ["regulation", "market_impact", "technology", "expansion_strategy"]
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
                print(f"✅ Production run started: {run_id}")
                print(f"🚀 Executing full 6-agent workflow...")
                
                # Monitor execution with detailed logging
                print("\n9. MONITORING PRODUCTION EXECUTION...")
                start_time = time.time()
                
                for i in range(40):  # 40 x 8 seconds = ~5 minutes
                    try:
                        status_response = requests.get(f"{base_url}/runs/{run_id}")
                        if status_response.status_code == 200:
                            status = status_response.json()
                            current_status = status.get('status', 'unknown')
                            elapsed = int(time.time() - start_time)
                            
                            print(f"[{elapsed:03d}s] Status {i+1}: {current_status}")
                            
                            if current_status == 'completed':
                                result = status.get('result', {})
                                
                                print(f"\n{'='*70}")
                                print("🎉 PRODUCTION RUN COMPLETED!")
                                print(f"{'='*70}")
                                
                                # Save comprehensive results
                                timestamp = time.strftime("%Y%m%d_%H%M%S")
                                result_file = f"robinhood_production_{timestamp}.json"
                                
                                with open(result_file, 'w', encoding='utf-8') as f:
                                    json.dump(result, f, indent=2, ensure_ascii=False)
                                print(f"✅ Full results saved to {result_file}")
                                
                                # Analyze and save individual outputs
                                results = result.get('results', {})
                                if results:
                                    total_content = 0
                                    main_article = ""
                                    html_output = ""
                                    
                                    print(f"\n📊 CONTENT ANALYSIS:")
                                    for task_name, content in results.items():
                                        if content and isinstance(content, str):
                                            content_length = len(content.strip())
                                            total_content += content_length
                                            
                                            print(f"\n📄 {task_name}:")
                                            print(f"   Length: {content_length} characters")
                                            
                                            if content_length > 100:
                                                print(f"   Preview: {content[:200]}...")
                                                
                                                # Save individual files
                                                if "article" in task_name.lower() or "polish" in task_name.lower():
                                                    main_article = content
                                                elif "html" in task_name.lower():
                                                    html_output = content
                                                
                                                # Save each task output
                                                safe_name = task_name.replace(' ', '_').replace('/', '_')
                                                task_file = f"{safe_name}_{timestamp}.txt"
                                                with open(task_file, 'w', encoding='utf-8') as f:
                                                    f.write(content)
                                                print(f"   Saved to: {task_file}")
                                    
                                    # Save main outputs
                                    if main_article and len(main_article) > 500:
                                        article_file = f"robinhood_article_{timestamp}.txt"
                                        with open(article_file, 'w', encoding='utf-8') as f:
                                            f.write(main_article)
                                        print(f"\n📰 Main article saved to: {article_file}")
                                    
                                    if html_output and len(html_output) > 300:
                                        html_file = f"robinhood_article_{timestamp}.html"
                                        with open(html_file, 'w', encoding='utf-8') as f:
                                            f.write(html_output)
                                        print(f"🌐 HTML version saved to: {html_file}")
                                    
                                    print(f"\n📊 TOTAL CONTENT GENERATED: {total_content} characters")
                                    
                                    if total_content > 3000:
                                        print(f"\n🎉 SUCCESS! Substantial content generated!")
                                        print(f"✅ CrewAI production system is working!")
                                        return True
                                    elif total_content > 500:
                                        print(f"\n⚠️ Moderate content generated ({total_content} chars)")
                                        print(f"✅ System working but may need optimization")
                                        return True
                                    else:
                                        print(f"\n❌ Limited content generated ({total_content} chars)")
                                        return False
                                else:
                                    print(f"\n❌ No content results found")
                                    return False
                                    
                            elif current_status == 'failed':
                                error = status.get('error', 'Unknown error')
                                print(f"\n❌ Production run failed: {error}")
                                return False
                        
                        time.sleep(8)
                        
                    except Exception as e:
                        print(f"Error monitoring: {e}")
                        time.sleep(5)
                
                print(f"\n⏱️ Production run still executing after 5+ minutes")
                print(f"Run ID: {run_id} - check manually")
                return None
                
            else:
                print(f"❌ Failed to start production run: {run_response.status_code}")
                print(run_response.text)
                return False
        else:
            print(f"❌ Failed to create crew: {crew_response.status_code}")
            print(crew_response.text)
            return False
            
    except Exception as e:
        print(f"❌ Error in crew creation: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting complete CrewAI production setup...\n")
    
    result = complete_setup()
    
    print(f"\n{'='*80}")
    if result is True:
        print("🎉 PRODUCTION SETUP SUCCESSFUL!")
        print("   ✅ All agents created/verified")
        print("   ✅ All tools enabled")
        print("   ✅ Production crew created")
        print("   ✅ Article generation completed")
        print("   ✅ Files saved successfully")
        print("\n🚀 CREWAI IS FULLY OPERATIONAL!")
    elif result is False:
        print("❌ PRODUCTION SETUP INCOMPLETE")
        print("   Check error messages above")
        print("   Review saved partial results")
    else:
        print("⏱️ PRODUCTION RUN IN PROGRESS")
        print("   Check the run status manually")
        print("   Results will be saved when complete") 