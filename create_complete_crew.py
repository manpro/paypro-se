import requests
import json
import time

def create_complete_crew():
    base_url = "http://172.16.16.148:8088"
    
    print("=== CREATING COMPLETE CREW WITH AGENTS AND TASKS ===")
    
    # Step 1: Create 5 agents with different models
    print("\n1. CREATING AGENTS...")
    
    agents_config = [
        {
            "role": "Makroekonomisk Analytiker",
            "goal": "Analyze macroeconomic trends and their impact on financial markets, particularly focusing on cryptocurrency regulation and institutional adoption",
            "backstory": "Expert economist with 15 years of experience in macroeconomic analysis, regulatory frameworks, and institutional finance. Specialized in cryptocurrency market dynamics and regulatory impact analysis.",
            "llm_provider_model": "openai:gpt-4",
            "tools": ["search", "file_search"],
            "verbose": True,
            "allow_delegation": False,
            "max_iter": 25
        },
        {
            "role": "Kryptovaluta och Blockchain Analytiker", 
            "goal": "Provide deep technical analysis of cryptocurrency markets, blockchain technology developments, and crypto industry trends",
            "backstory": "Senior blockchain analyst with extensive experience in cryptocurrency markets, DeFi protocols, and institutional crypto adoption. Expert in technical analysis and market sentiment evaluation.",
            "llm_provider_model": "openai:gpt-4",
            "tools": ["search", "calculator"],
            "verbose": True,
            "allow_delegation": False,
            "max_iter": 25
        },
        {
            "role": "SEO-specialist och Innehållsstrateg",
            "goal": "Create SEO-optimized content structure and ensure maximum search engine visibility while maintaining editorial quality",
            "backstory": "Senior content strategist with expertise in financial content marketing, SEO optimization, and audience engagement for fintech and cryptocurrency publications.",
            "llm_provider_model": "openai:gpt-4",
            "tools": ["search"],
            "verbose": True,
            "allow_delegation": False,
            "max_iter": 20
        },
        {
            "role": "Senior Redaktör och Publikationsspecialist",
            "goal": "Ensure highest editorial standards, fact-checking, and professional publication quality for financial content",
            "backstory": "Experienced financial editor with 12 years in financial journalism, specializing in cryptocurrency and fintech coverage for professional publications.",
            "llm_provider_model": "openai:gpt-4o-mini",
            "tools": ["file_search"],
            "verbose": True,
            "allow_delegation": False,
            "max_iter": 20
        },
        {
            "role": "HTML-formatterare och Produktionsspecialist",
            "goal": "Format content into professional HTML structure suitable for web publication with proper styling and structure",
            "backstory": "Technical content specialist with expertise in HTML formatting, web publishing, and content management systems for financial publications.",
            "llm_provider_model": "openai:gpt-4o-mini", 
            "tools": ["code_interpreter"],
            "verbose": True,
            "allow_delegation": False,
            "max_iter": 15
        }
    ]
    
    created_agents = []
    
    for i, agent_config in enumerate(agents_config):
        try:
            print(f"   Creating agent {i+1}: {agent_config['role']}")
            
            response = requests.post(
                f"{base_url}/agents",
                headers={'Content-Type': 'application/json'},
                json=agent_config
            )
            
            if response.status_code == 200:
                agent = response.json()
                agent_id = agent.get('id')
                created_agents.append(agent_id)
                print(f"   ✅ Agent created: {agent_id}")
            else:
                print(f"   ❌ Failed to create agent: {response.status_code}")
                print(f"      Error: {response.text}")
                return False
                
        except Exception as e:
            print(f"   ❌ Error creating agent: {e}")
            return False
    
    print(f"\n   ✅ Created {len(created_agents)} agents")
    
    # Step 2: Create tasks for each agent
    print("\n2. CREATING TASKS...")
    
    tasks_config = [
        {
            "description": "Conduct comprehensive macroeconomic analysis of Robinhood's acquisition of Bitstamp, focusing on regulatory implications, market dynamics, and institutional adoption trends in the European cryptocurrency market.",
            "expected_output": "Detailed macroeconomic analysis (400-500 words) covering regulatory landscape, institutional impact, and market implications of the acquisition.",
            "agent_id": created_agents[0],
            "async_execution": False
        },
        {
            "description": "Analyze the technical and market implications of Robinhood's Bitstamp acquisition from a cryptocurrency and blockchain perspective, including impact on trading volumes, DeFi integration, and European crypto adoption.",
            "expected_output": "Technical cryptocurrency market analysis (400-500 words) covering blockchain implications, trading impact, and crypto market dynamics.",
            "agent_id": created_agents[1], 
            "async_execution": False
        },
        {
            "description": "Develop SEO-optimized content structure and strategic recommendations for the article about Robinhood's Bitstamp acquisition, ensuring maximum search visibility and reader engagement.",
            "expected_output": "SEO content strategy (200-300 words) with keyword recommendations, content structure, and engagement optimization suggestions.",
            "agent_id": created_agents[2],
            "async_execution": False
        },
        {
            "description": "Perform comprehensive editorial review of the analysis content, ensuring factual accuracy, professional tone, clarity, and adherence to financial journalism standards.",
            "expected_output": "Editorial review and refinement (300-400 words) with fact-checking, tone enhancement, and professional polish of all content sections.",
            "agent_id": created_agents[3],
            "async_execution": False
        },
        {
            "description": "Format the complete article content into professional HTML structure suitable for web publication, including proper headings, paragraphs, and semantic markup.",
            "expected_output": "Complete HTML-formatted article with proper structure, headings, and professional formatting ready for web publication.",
            "agent_id": created_agents[4],
            "async_execution": False
        }
    ]
    
    created_tasks = []
    
    for i, task_config in enumerate(tasks_config):
        try:
            print(f"   Creating task {i+1}: {task_config['description'][:60]}...")
            
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
    
    print(f"\n   ✅ Created {len(created_tasks)} tasks")
    
    # Step 3: Create crew with agents and tasks
    print("\n3. CREATING CREW WITH ASSIGNMENTS...")
    
    crew_config = {
        "name": "Robinhood-Bitstamp Analysis Crew",
        "description": "Complete analysis crew for Robinhood's acquisition of Bitstamp with macroeconomic, crypto, and editorial expertise",
        "agents": created_agents,  # Use agent IDs
        "tasks": created_tasks,    # Use task IDs  
        "process": "sequential",
        "verbose": True
    }
    
    try:
        print(f"   Creating crew with {len(created_agents)} agents and {len(created_tasks)} tasks")
        
        response = requests.post(
            f"{base_url}/crews",
            headers={'Content-Type': 'application/json'},
            json=crew_config
        )
        
        if response.status_code == 200:
            crew = response.json()
            crew_id = crew.get('id')
            print(f"   ✅ Crew created: {crew_id}")
            print(f"   Name: {crew.get('name')}")
            
            # Verify crew has assignments
            print(f"\n4. VERIFYING CREW ASSIGNMENTS...")
            verify_response = requests.get(f"{base_url}/crews/{crew_id}")
            if verify_response.status_code == 200:
                crew_detail = verify_response.json()
                agent_ids = crew_detail.get('agent_ids', [])
                task_ids = crew_detail.get('task_ids', [])
                
                print(f"   Agent IDs assigned: {len(agent_ids)}")
                print(f"   Task IDs assigned: {len(task_ids)}")
                
                if len(agent_ids) > 0 and len(task_ids) > 0:
                    print(f"   ✅ Crew properly configured!")
                    
                    # Test the crew
                    print(f"\n5. TESTING CREW EXECUTION...")
                    
                    # Remove C_ prefix for run
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
                        print(f"   ✅ Run started: {run_id}")
                        print(f"   Status: {run_result.get('status')}")
                        
                        print(f"\n🎉 COMPLETE CREW SETUP SUCCESSFUL!")
                        print(f"   Crew ID: {crew_id}")
                        print(f"   Run ID: {run_id}")
                        print(f"   Agents: {len(agent_ids)}")
                        print(f"   Tasks: {len(task_ids)}")
                        
                        # Save configuration
                        config_data = {
                            "crew_id": crew_id,
                            "crew_id_base": crew_id_base,
                            "run_id": run_id,
                            "agents": created_agents,
                            "tasks": created_tasks,
                            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
                        }
                        
                        with open('working_crew_config.json', 'w') as f:
                            json.dump(config_data, f, indent=2)
                        
                        print(f"   💾 Configuration saved to: working_crew_config.json")
                        print(f"\n   🚀 You can now monitor the run with:")
                        print(f"   GET {base_url}/runs/{run_id}")
                        
                        return True
                    else:
                        print(f"   ❌ Failed to start run: {run_response.status_code}")
                        print(f"      Error: {run_response.text}")
                        return False
                else:
                    print(f"   ❌ Crew not properly configured!")
                    return False
            else:
                print(f"   ❌ Cannot verify crew: {verify_response.status_code}")
                return False
        else:
            print(f"   ❌ Failed to create crew: {response.status_code}")
            print(f"      Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error creating crew: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Creating complete CrewAI setup...\n")
    
    result = create_complete_crew()
    
    print(f"\n{'='*80}")
    if result:
        print("🎉 COMPLETE CREW SETUP SUCCESSFUL!")
        print("   ✅ Agents created and configured")
        print("   ✅ Tasks created and assigned")
        print("   ✅ Crew created with proper assignments")
        print("   ✅ Test run initiated")
        print("   📝 Ready for production article generation!")
    else:
        print("❌ CREW SETUP FAILED")
        print("   Check error messages above for details") 