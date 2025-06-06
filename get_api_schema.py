import requests
import json

def get_api_schema():
    base_url = "http://172.16.16.148:8088"
    
    print("=== FETCHING API SCHEMA ===")
    
    try:
        # Get OpenAPI schema
        schema_response = requests.get(f"{base_url}/openapi.json")
        if schema_response.status_code == 200:
            schema = schema_response.json()
            
            # Save full schema
            with open('api_schema.json', 'w') as f:
                json.dump(schema, f, indent=2)
            print("✅ Full schema saved to api_schema.json")
            
            # Analyze crew endpoints
            print("\n=== CREW ENDPOINTS ANALYSIS ===")
            paths = schema.get('paths', {})
            
            for path, methods in paths.items():
                if 'crew' in path.lower():
                    print(f"\n📍 {path}")
                    for method, details in methods.items():
                        print(f"   {method.upper()}: {details.get('summary', 'No summary')}")
                        
                        # Check request body schema
                        if 'requestBody' in details:
                            req_body = details['requestBody']
                            content = req_body.get('content', {})
                            if 'application/json' in content:
                                json_schema = content['application/json'].get('schema', {})
                                if '$ref' in json_schema:
                                    ref = json_schema['$ref']
                                    print(f"      Request schema: {ref}")
                                elif 'properties' in json_schema:
                                    props = list(json_schema['properties'].keys())
                                    print(f"      Request properties: {props}")
                        
                        # Check response schema
                        responses = details.get('responses', {})
                        for status, response in responses.items():
                            if status == '200':
                                content = response.get('content', {})
                                if 'application/json' in content:
                                    json_schema = content['application/json'].get('schema', {})
                                    if '$ref' in json_schema:
                                        ref = json_schema['$ref']
                                        print(f"      Response schema: {ref}")
            
            # Look for crew creation schema
            print("\n=== CREW SCHEMAS ===")
            components = schema.get('components', {})
            schemas = components.get('schemas', {})
            
            for schema_name, schema_def in schemas.items():
                if 'crew' in schema_name.lower():
                    print(f"\n📋 {schema_name}")
                    properties = schema_def.get('properties', {})
                    for prop_name, prop_def in properties.items():
                        prop_type = prop_def.get('type', 'unknown')
                        description = prop_def.get('description', '')
                        print(f"   {prop_name}: {prop_type} - {description}")
                        
                        # Check if it's an array of what
                        if prop_type == 'array':
                            items = prop_def.get('items', {})
                            item_type = items.get('type', 'unknown')
                            item_ref = items.get('$ref', '')
                            print(f"      Array of: {item_type or item_ref}")
            
            return True
            
        else:
            print(f"❌ Cannot get schema: {schema_response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error getting schema: {e}")
        return False

if __name__ == "__main__":
    get_api_schema() 