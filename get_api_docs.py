import requests

def get_api_docs():
    doc_url = "http://172.16.16.138:8181/micke/crewai-studio/src/branch/main/api_documentation_final.md"
    
    print("=== FETCHING API DOCUMENTATION ===")
    print(f"URL: {doc_url}")
    
    try:
        response = requests.get(doc_url, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            content = response.text
            print(f"Content length: {len(content)}")
            
            # Save to file
            with open('api_documentation.md', 'w', encoding='utf-8') as f:
                f.write(content)
            print("✅ Documentation saved to api_documentation.md")
            
            # Show first part
            lines = content.split('\n')
            print(f"\n=== FIRST 30 LINES ===")
            for i, line in enumerate(lines[:30], 1):
                print(f"{i:2}: {line}")
            
            if len(lines) > 30:
                print(f"\n... and {len(lines) - 30} more lines")
            
            return content
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return None
            
    except requests.exceptions.ConnectionError as e:
        print(f"❌ Connection Error: {e}")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    get_api_docs() 