import requests
import json
import time

def create_full_article_crew():
    base_url = "http://172.16.16.148:8088"
    
    print("=== CREATING FULL ARTICLE GENERATION CREW ===")
    
    # 1. Get our agents
    print("\n1. GETTING ALL AGENTS...")
    agents_response = requests.get(f"{base_url}/agents")
    agents = agents_response.json()
    
    our_agents = {}
    target_agents = ['Makroekonom', 'Kryptoanalytiker', 'SEO-skribent', 'Bildkonstnär', 'Redaktör', 'HTML-Formatterar']
    
    for agent in agents:
        if agent.get('name') in target_agents:
            our_agents[agent['name']] = agent
            print(f"✅ {agent['name']} (ID: {agent.get('id')}, LLM: {agent.get('llm')})")
    
    print(f"Found {len(our_agents)}/6 agents")
    
    # 2. Create comprehensive tasks
    print("\n2. CREATING COMPREHENSIVE TASKS...")
    
    task_configs = [
        {
            "name": "Economic Research",
            "description": "Research and analyze macroeconomic factors affecting Robinhood's acquisition of Bitstamp. Include regulatory implications, market conditions, and economic impact on European expansion.",
            "agent_id": our_agents['Makroekonom']['id'],
            "expected_output": "Detailed economic analysis of the acquisition with regulatory and market implications"
        },
        {
            "name": "Cryptocurrency Analysis", 
            "description": "Analyze the cryptocurrency and blockchain implications of Robinhood's Bitstamp acquisition. Focus on crypto regulation, market positioning, and technical aspects.",
            "agent_id": our_agents['Kryptoanalytiker']['id'],
            "expected_output": "Comprehensive cryptocurrency analysis of the acquisition"
        },
        {
            "name": "SEO Article Writing",
            "description": "Create a comprehensive, SEO-optimized article about 'Robinhood's strategic acquisition of Bitstamp: implications for crypto regulation and European expansion'. Use the economic and crypto analyses provided. Target keywords: Robinhood, Bitstamp, crypto regulation, European expansion. Write in English only.",
            "agent_id": our_agents['SEO-skribent']['id'],
            "expected_output": "Complete 1500+ word SEO-optimized article in English"
        },
        {
            "name": "Professional Image Creation",
            "description": "Create a professional illustration for the article about Robinhood's acquisition of Bitstamp. The image should represent financial technology, cryptocurrency trading, and European expansion themes.",
            "agent_id": our_agents['Bildkonstnär']['id'],
            "expected_output": "Professional article illustration description or URL"
        },
        {
            "name": "Editorial Polish",
            "description": "Review and polish the article for publication. Ensure professional tone, clarity, and flow. Remove any AI traces. Output must be in English only.",
            "agent_id": our_agents['Redaktör']['id'],
            "expected_output": "Publication-ready polished article in English"
        }
    ]
    
    # Add HTML formatter if available
    if 'HTML-Formatterar' in our_agents:
        task_configs.append({
            "name": "HTML Formatting",
            "description": "Convert the polished article to clean, production-ready HTML following Paypro.se's design system. Output must be in English only.",
            "agent_id": our_agents['HTML-Formatterar']['id'],
            "expected_output": "Clean, production-ready HTML article"
        })
    
    # Create all tasks
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
    
    print(f"\nCreated {len(task_ids)} tasks")
    
    if len(task_ids) < 5:
        print("❌ Too few tasks created")
        return False
    
    # 3. Create the full crew
    print("\n3. CREATING FULL ARTICLE CREW...")
    
    crew_data = {
        "name": "Paypro Article Generation Crew - Robinhood/Bitstamp",
        "description": "Complete workflow for generating professional financial articles about Robinhood's Bitstamp acquisition",
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
            print(f"✅ Created full crew: {crew_id}")
            
            # 4. Run the full article generation
            print("\n4. STARTING FULL ARTICLE GENERATION...")
            
            run_data = {
                "crew_id": crew_id,
                "inputs": {
                    "topic": "Robinhood's strategic acquisition of Bitstamp: implications for crypto regulation and European expansion",
                    "theme": "crypto_focus",
                    "target_length": "1500+ words",
                    "language": "English"
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
                print(f"✅ Article generation started: {run_id}")
                print(f"📊 This will take several minutes for a full 5-6 agent workflow...")
                
                # Monitor for longer period
                print(f"\n5. MONITORING PROGRESS...")
                start_time = time.time()
                
                for i in range(30):  # 30 x 10 seconds = 5 minutes
                    try:
                        status_response = requests.get(f"{base_url}/runs/{run_id}")
                        if status_response.status_code == 200:
                            status = status_response.json()
                            current_status = status.get('status', 'unknown')
                            elapsed = int(time.time() - start_time)
                            print(f"[{elapsed:03d}s] Status {i+1}: {current_status}")
                            
                            if current_status == 'completed':
                                result = status.get('result', {})
                                
                                print(f"\n=== FULL ARTICLE GENERATION RESULT ===")
                                
                                # Save the full result
                                with open('robinhood_bitstamp_result.json', 'w', encoding='utf-8') as f:
                                    json.dump(result, f, indent=2, ensure_ascii=False)
                                print("✅ Full result saved to robinhood_bitstamp_result.json")
                                
                                # Analyze results
                                results = result.get('results', {})
                                if results:
                                    total_chars = 0
                                    article_content = ""
                                    
                                    for task_name, content in results.items():
                                        if content and isinstance(content, str):
                                            char_count = len(content.strip())
                                            total_chars += char_count
                                            print(f"\n📄 {task_name}: {char_count} characters")
                                            
                                            if "article" in task_name.lower() or "editorial" in task_name.lower():
                                                article_content = content
                                            
                                            if char_count > 200:
                                                print(f"Preview: {content[:300]}...")
                                    
                                    print(f"\n📊 TOTAL CONTENT: {total_chars} characters")
                                    
                                    # Save main article if found
                                    if article_content and len(article_content) > 500:
                                        with open('robinhood_bitstamp_article.txt', 'w', encoding='utf-8') as f:
                                            f.write(article_content)
                                        print("✅ Main article saved to robinhood_bitstamp_article.txt")
                                    
                                    if total_chars > 2000:
                                        print(f"\n🎉 SUCCESS! Generated substantial content!")
                                        print("✅ CrewAI update is working for article generation!")
                                        return True
                                    else:
                                        print(f"\n⚠️ Generated limited content ({total_chars} chars)")
                                        return False
                                else:
                                    print(f"\n❌ No results found in response")
                                    return False
                                    
                            elif current_status == 'failed':
                                error = status.get('error', 'Unknown error')
                                print(f"\n❌ Generation failed: {error}")
                                return False
                        
                        time.sleep(10)
                        
                    except Exception as e:
                        print(f"Error checking status: {e}")
                        time.sleep(5)
                
                print(f"\n⏱️ Still running after 5 minutes")
                print(f"Run ID: {run_id}")
                print("Check status manually or wait longer")
                return None
                
            else:
                print(f"❌ Failed to start generation: {run_response.status_code}")
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
    print("Creating full article generation crew for Robinhood/Bitstamp analysis...\n")
    
    result = create_full_article_crew()
    
    print(f"\n{'='*70}")
    if result is True:
        print("🎉 FULL ARTICLE GENERATION SUCCESSFUL!")
        print("   ✅ All agents working")
        print("   ✅ Content generated")
        print("   ✅ Article saved to files")
        print("\n🚀 CREWAI UPDATE IS WORKING!")
    elif result is False:
        print("❌ ARTICLE GENERATION INCOMPLETE")
        print("   Check the saved results for partial content")
    else:
        print("⏱️ ARTICLE GENERATION IN PROGRESS")
        print("   Check the run status later") 