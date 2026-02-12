from google import genai
import os
from app.config import settings

def list_models():
    try:
        client = genai.Client(api_key=settings.google_api_key.get_secret_value())
        # The SDK usage might be client.models.list() or similar
        # Based on browser-use implementation it uses client.aio.models.generate_content
        # Let's try to list models.
        # Documentation for google-genai is sparse but standard pattern:
        for m in client.models.list():
            try:
                print(f"Model: {m.name}")
                # print(f"Supported methods: {m.supported_generation_methods}") # This might not exist on all objects
            except Exception as e:
                print(f"Error printing model: {e}")
    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    list_models()
