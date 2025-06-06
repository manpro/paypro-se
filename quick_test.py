import requests
import json

def quick_test():
    base_url = "http://172.16.16.148:8088"
    
    print("=== QUICK CREWAI TEST ===")
    
    # 1. Check agents
    try:
        agents_response = requests.get(f"{base_url}/agents")
        print(f"Agents response: {agents_response.status_code}")
        
        if agents_response.status_code == 200:
            agents = agents_response.json()
            print(f"Found {len(agents)} agents")
            
            our_agents = []
            for agent in agents:
                name = agent.get('name', 'N/A')
                agent_id = agent.get('id', 'N/A')
                llm = agent.get('llm', 'N/A')
                
                if name in ['Makroekonom', 'Kryptoanalytiker', 'SEO-skribent', 'Bildkonstnär', 'Redaktör', 'HTML-Formatterar']:
                    our_agents.append(agent)
                    print(f"✅ {name} (ID: {agent_id}, LLM: {llm})")
                else:
                    print(f"⚪ {name} (ID: {agent_id}, LLM: {llm})")
            
            print(f"\nOur agents: {len(our_agents)}/6")
            
    except Exception as e:
        print(f"❌ Error getting agents: {e}")
        return False
    
    # 2. Check crews
    try:
        crews_response = requests.get(f"{base_url}/crews")
        print(f"\nCrews response: {crews_response.status_code}")
        
        if crews_response.status_code == 200:
            crews = crews_response.json()
            print(f"Found {len(crews)} crews")
            
            for crew in crews:
                crew_id = crew.get('id', 'N/A')
                name = crew.get('name', 'N/A')
                print(f"  - {name} (ID: {crew_id})")
            
            if crews:
                # Test run with first crew
                test_crew = crews[0]
                crew_id = test_crew.get('id')
                
                print(f"\n3. Testing run with crew {crew_id}")
                
                run_data = {
                    "crew_id": crew_id,
                    "inputs": {
                        "topic": "Test topic"
                    }
                }
                
                run_response = requests.post(
                    f"{base_url}/runs",
                    headers={'Content-Type': 'application/json'},
                    json=run_data
                )
                
                print(f"Run response: {run_response.status_code}")
                
                if run_response.status_code == 200:
                    run_result = run_response.json()
                    print(f"Run result: {run_result}")
                    
                    if 'run_id' in run_result:
                        run_id = run_result['run_id']
                        print(f"✅ Run started: {run_id}")
                        
                        # Quick status check
                        import time
                        time.sleep(2)
                        
                        status_response = requests.get(f"{base_url}/runs/{run_id}")
                        if status_response.status_code == 200:
                            status = status_response.json()
                            print(f"Status: {status.get('status', 'unknown')}")
                            
                            if status.get('status') == 'completed':
                                result = status.get('result', {})
                                results = result.get('results', {})
                                
                                if results:
                                    print(f"\n🎉 SUCCESS! Got results:")
                                    for task_name, content in results.items():
                                        content_len = len(str(content)) if content else 0
                                        print(f"  - {task_name}: {content_len} chars")
                                        if content_len > 50:
                                            print(f"    Preview: {str(content)[:100]}...")
                                    return True
                                else:
                                    print(f"❌ No results in response")
                                    return False
                            else:
                                print(f"⏳ Status: {status.get('status')}")
                                return None
                        else:
                            print(f"❌ Cannot check status: {status_response.status_code}")
                            return False
                    else:
                        print(f"❌ No run_id in response")
                        return False
                else:
                    print(f"❌ Run failed: {run_response.status_code}")
                    print(run_response.text)
                    return False
            else:
                print("❌ No crews found")
                return False
                
    except Exception as e:
        print(f"❌ Error with crews: {e}")
        return False

if __name__ == "__main__":
    result = quick_test()
    
    if result is True:
        print(f"\n🎉 CREWAI IS WORKING!")
    elif result is False:
        print(f"\n❌ CREWAI HAS ISSUES")
    else:
        print(f"\n⏳ CREWAI TEST INCOMPLETE") 