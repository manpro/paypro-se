import requests
import json
import time

def monitor_run():
    base_url = "http://172.16.16.148:8088"
    
    # Load configuration
    try:
        with open('working_crew_final.json', 'r') as f:
            config = json.load(f)
        
        run_id = config['run_id']
        crew_name = config['crew_name']
        print(f"🔍 MONITORING RUN: {run_id}")
        print(f"📋 Crew: {crew_name}")
        
    except FileNotFoundError:
        print("❌ Configuration file not found. Run fix_crew_assignments.py first.")
        return False
    except Exception as e:
        print(f"❌ Error loading config: {e}")
        return False
    
    print(f"\n🚀 MONITORING...")
    
    max_attempts = 30
    poll_interval = 3
    
    for attempt in range(max_attempts):
        try:
            status_response = requests.get(f"{base_url}/runs/{run_id}")
            
            if status_response.status_code == 200:
                status_data = status_response.json()
                current_status = status_data.get('status', 'unknown')
                
                elapsed_time = attempt * poll_interval
                print(f"[{elapsed_time:03d}s] Status: {current_status}")
                
                if current_status in ['completed', 'success']:
                    print(f"\n🎉 COMPLETED!")
                    
                    result = status_data.get('result', {})
                    
                    if result:
                        # Save results
                        timestamp = time.strftime("%Y%m%d_%H%M%S")
                        result_file = f"robinhood_result_{timestamp}.json"
                        
                        with open(result_file, 'w', encoding='utf-8') as f:
                            json.dump(status_data, f, indent=2, ensure_ascii=False)
                        
                        print(f"💾 Results saved: {result_file}")
                        
                        # Analyze content
                        total_chars = 0
                        
                        if isinstance(result, dict):
                            if 'results' in result:
                                results = result['results']
                                for key, content in results.items():
                                    if content:
                                        content_str = str(content).strip()
                                        char_count = len(content_str)
                                        total_chars += char_count
                                        
                                        print(f"📄 {key}: {char_count:,} chars")
                                        
                                        if char_count > 100:
                                            preview = content_str[:200] + "..." if len(content_str) > 200 else content_str
                                            print(f"   Preview: {preview}")
                            
                            elif 'output' in result:
                                output = str(result['output']).strip()
                                total_chars = len(output)
                                print(f"📄 Output: {total_chars:,} chars")
                                if total_chars > 100:
                                    preview = output[:200] + "..." if len(output) > 200 else output
                                    print(f"   Preview: {preview}")
                            
                            else:
                                result_str = str(result).strip()
                                total_chars = len(result_str)
                                print(f"📄 Result: {total_chars:,} chars")
                                if total_chars > 100:
                                    preview = result_str[:200] + "..." if len(result_str) > 200 else result_str
                                    print(f"   Preview: {preview}")
                        
                        print(f"\n📈 TOTAL: {total_chars:,} characters")
                        
                        if total_chars >= 1000:
                            print(f"🎉 EXCELLENT! Article-quality content!")
                        elif total_chars >= 500:
                            print(f"✅ GOOD! Substantial content!")
                        elif total_chars >= 200:
                            print(f"⚠️ MODERATE content")
                        else:
                            print(f"❌ LIMITED content")
                        
                        return True
                        
                    else:
                        print(f"⚠️ No content generated")
                        return True
                    
                elif current_status in ['failed', 'error']:
                    error = status_data.get('error', 'Unknown error')
                    print(f"\n❌ FAILED: {error}")
                    return False
                
                elif current_status == 'pending':
                    time.sleep(poll_interval)
                    continue
                else:
                    time.sleep(poll_interval)
                    continue
                    
            else:
                print(f"❌ Status check failed: {status_response.status_code}")
                time.sleep(poll_interval)
                continue
                
        except Exception as e:
            print(f"❌ Error: {e}")
            time.sleep(poll_interval)
            continue
    
    print(f"\n⏰ TIMEOUT after {max_attempts * poll_interval} seconds")
    return None

if __name__ == "__main__":
    print("📡 CrewAI Run Monitor\n")
    result = monitor_run()
    
    if result is True:
        print("\n🎉 SUCCESS!")
    elif result is False:
        print("\n❌ FAILED")
    else:
        print("\n⏰ TIMEOUT") 