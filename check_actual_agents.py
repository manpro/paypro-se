import requests
import json

def check_actual_agents():
    base_url = "http://172.16.16.148:8088"
    
    print("=== CHECKING ACTUAL AGENTS IN CREWAI ===")
    
    try:
        # Get all agents from the API
        response = requests.get(f"{base_url}/agents")
        
        print(f"API Response Status: {response.status_code}")
        
        if response.status_code == 200:
            agents = response.json()
            
            print(f"\nTotal agents found: {len(agents)}")
            print("=" * 60)
            
            if agents:
                for i, agent in enumerate(agents, 1):
                    print(f"\n{i}. AGENT DETAILS:")
                    print(f"   ID: {agent.get('id', 'N/A')}")
                    print(f"   Name: {agent.get('name', 'N/A')}")
                    print(f"   Role: {agent.get('role', 'N/A')}")
                    print(f"   LLM: {agent.get('llm', 'N/A')}")
                    print(f"   Goal: {agent.get('goal', 'N/A')[:100]}{'...' if len(str(agent.get('goal', ''))) > 100 else ''}")
                    print(f"   Tools: {agent.get('tools', [])}")
                    print(f"   Verbose: {agent.get('verbose', 'N/A')}")
                    print(f"   Allow Delegation: {agent.get('allow_delegation', 'N/A')}")
                    
                    if agent.get('backstory'):
                        backstory = str(agent.get('backstory', ''))
                        print(f"   Backstory: {backstory[:100]}{'...' if len(backstory) > 100 else ''}")
                    
                    if agent.get('prompt_instructions'):
                        instructions = str(agent.get('prompt_instructions', ''))
                        print(f"   Instructions: {instructions[:100]}{'...' if len(instructions) > 100 else ''}")
                
                # Check specifically for our expected agents
                our_target_agents = ['Makroekonom', 'Kryptoanalytiker', 'SEO-skribent', 'Bildkonstnär', 'Redaktör', 'HTML-Formatterar']
                found_agents = [agent.get('name') for agent in agents]
                
                print(f"\n" + "=" * 60)
                print("CHECKING FOR OUR TARGET AGENTS:")
                
                for target in our_target_agents:
                    if target in found_agents:
                        print(f"✅ {target} - FOUND")
                    else:
                        print(f"❌ {target} - MISSING")
                
                missing_count = len([t for t in our_target_agents if t not in found_agents])
                print(f"\nSummary: {len(our_target_agents) - missing_count}/{len(our_target_agents)} target agents found")
                
            else:
                print("❌ No agents found in the system!")
                
        else:
            print(f"❌ Failed to get agents. Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error checking agents: {e}")
    
    # Also check crews and tasks
    print(f"\n" + "=" * 60)
    print("CHECKING CREWS AND TASKS:")
    
    try:
        crews_response = requests.get(f"{base_url}/crews")
        if crews_response.status_code == 200:
            crews = crews_response.json()
            print(f"✅ Total crews: {len(crews)}")
            for crew in crews:
                print(f"   - {crew.get('name', 'Unnamed')} (ID: {crew.get('id')})")
        else:
            print(f"❌ Cannot get crews: {crews_response.status_code}")
    except Exception as e:
        print(f"❌ Error checking crews: {e}")
    
    try:
        tasks_response = requests.get(f"{base_url}/tasks")
        if tasks_response.status_code == 200:
            tasks = tasks_response.json()
            print(f"✅ Total tasks: {len(tasks)}")
            for task in tasks:
                print(f"   - {task.get('name', 'Unnamed')} (ID: {task.get('id')})")
        else:
            print(f"❌ Cannot get tasks: {tasks_response.status_code}")
    except Exception as e:
        print(f"❌ Error checking tasks: {e}")

if __name__ == "__main__":
    check_actual_agents() 