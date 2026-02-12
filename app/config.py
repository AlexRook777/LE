from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr

class Settings(BaseSettings):
    google_api_key: SecretStr
    openrouter_api_key: SecretStr | None = None
    llm_provider: str = "google"  # "google" or "openrouter" - Using Google for now as OpenRouter free models are unavailable
    
    # Chrome Configuration
    chrome_path: str = "/opt/google/chrome/google-chrome"
    user_data_dir: str = "/home/worker/.config/google-chrome"
    profile_directory: str = "Profile 2"
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
