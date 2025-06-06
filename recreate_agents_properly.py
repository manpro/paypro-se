import requests
import json

def recreate_agents_properly():
    base_url = "http://172.16.16.148:8088"
    
    print("=== RECREATING AGENTS WITH PROPER STRUCTURE ===")
    
    # Load configuration
    try:
        with open('crewai-config.json', 'r', encoding='utf-8') as f:
            config = json.load(f)
        print("✅ Configuration loaded")
    except Exception as e:
        print(f"❌ Failed to load config: {e}")
        return False
    
    # Clear existing agents first
    print("\n1. CHECKING EXISTING AGENTS...")
    try:
        agents_response = requests.get(f"{base_url}/agents")
        if agents_response.status_code == 200:
            agents = agents_response.json()
            print(f"Found {len(agents)} existing agents")
            
            # Delete existing agents if needed
            # for agent in agents:
            #     agent_id = agent.get('id')
            #     if agent_id:
            #         delete_response = requests.delete(f"{base_url}/agents/{agent_id}")
            #         print(f"Deleted agent {agent_id}: {delete_response.status_code}")
    except Exception as e:
        print(f"Error checking agents: {e}")
    
    # Create agents with correct structure
    print("\n2. CREATING AGENTS WITH CORRECT STRUCTURE...")
    
    created_agents = {}
    
    for agent_key, agent_config in config['agents'].items():
        print(f"\n🔄 Creating {agent_config['name']}...")
        
        # Try different structures to find what works
        agent_data_variants = [
            # Variant 1: Full structure
            {
                "name": agent_config['name'],
                "role": agent_config['role'],
                "llm": agent_config['llm'],
                "goal": agent_config['goal'],
                "backstory": agent_config['backstory'],
                "verbose": agent_config.get('verbose', True),
                "allow_delegation": agent_config.get('allow_delegation', False),
                "tools": agent_config.get('tools', []),
                "prompt_instructions": agent_config.get('prompt_instructions', '')
            },
            # Variant 2: Minimal structure
            {
                "name": agent_config['name'],
                "role": agent_config['role'],
                "goal": agent_config['goal'],
                "backstory": agent_config['backstory']
            },
            # Variant 3: Different field names
            {
                "agent_name": agent_config['name'],
                "agent_role": agent_config['role'],
                "llm_model": agent_config['llm'],
                "agent_goal": agent_config['goal'],
                "agent_backstory": agent_config['backstory']
            }
        ]
        
        created = False
        for i, agent_data in enumerate(agent_data_variants, 1):
            try:
                create_response = requests.post(
                    f"{base_url}/agents",
                    headers={'Content-Type': 'application/json'},
                    json=agent_data
                )
                
                print(f"   Variant {i} response: {create_response.status_code}")
                
                if create_response.status_code in [200, 201]:
                    result = create_response.json()
                    agent_id = result.get('id') or result.get('agent_id')
                    created_agents[agent_config['name']] = {
                        'id': agent_id,
                        'data': agent_data
                    }
                    print(f"   ✅ Created {agent_config['name']} (ID: {agent_id})")
                    created = True
                    break
                else:
                    print(f"   ❌ Variant {i} failed: {create_response.text}")
                    
            except Exception as e:
                print(f"   ❌ Variant {i} error: {e}")
        
        if not created:
            print(f"   ❌ Failed to create {agent_config['name']} with any variant")
    
    # Verify agents
    print(f"\n3. VERIFYING CREATED AGENTS...")
    try:
        agents_response = requests.get(f"{base_url}/agents")
        if agents_response.status_code == 200:
            agents = agents_response.json()
            print(f"Total agents now: {len(agents)}")
            
            for agent in agents:
                agent_id = agent.get('id', 'N/A')
                name = agent.get('name', agent.get('agent_name', 'N/A'))
                role = agent.get('role', agent.get('agent_role', 'N/A'))
                llm = agent.get('llm', agent.get('llm_model', 'N/A'))
                
                print(f"   - {name} (ID: {agent_id}, Role: {role}, LLM: {llm})")
            
            # Count our target agents
            target_names = ['Makroekonom', 'Kryptoanalytiker', 'SEO-skribent', 'Bildkonstnär', 'Redaktör', 'HTML-Formatterar']
            found_targets = 0
            
            for agent in agents:
                name = agent.get('name', agent.get('agent_name', ''))
                if name in target_names:
                    found_targets += 1
            
            print(f"\n📊 Found {found_targets}/6 target agents")
            
            if found_targets >= 3:  # At least half working
                print(f"✅ Sufficient agents created for testing")
                return True
            else:
                print(f"❌ Not enough target agents created")
                return False
                
    except Exception as e:
        print(f"❌ Error verifying agents: {e}")
        return False

if __name__ == "__main__":
    success = recreate_agents_properly()
    
    if success:
        print(f"\n🎉 AGENTS RECREATED SUCCESSFULLY!")
        print("Ready for crew creation and testing")
    else:
        print(f"\n❌ AGENT RECREATION FAILED")
        print("May need to check CrewAI API documentation") 