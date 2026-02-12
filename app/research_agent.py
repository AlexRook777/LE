from browser_use import Agent
from browser_use.browser.session import BrowserSession as Browser
from app.config import settings
import asyncio

async def main():
    # Read task from task.md file
    with open('task.md', 'r', encoding='utf-8') as f:
        task = f.read().strip()
    
    # Initialize Browser with correct arguments for BrowserSession
    # Using settings from app/config.py
    browser = Browser(
        executable_path=settings.chrome_path,
        headless=False,
        disable_security=True,
        user_data_dir=settings.user_data_dir,
        profile_directory=settings.profile_directory,
    )

    # Initialize LLM based on provider setting
    use_vision = True
    if settings.llm_provider == "openrouter":
        from browser_use.llm.openrouter.chat import ChatOpenRouter
        # Using Google Gemini Flash via OpenRouter (supports structured outputs)
        llm = ChatOpenRouter(
            model="google/gemini-2.0-flash-exp:free",
            api_key=settings.openrouter_api_key.get_secret_value() if settings.openrouter_api_key else None,
            _strict_response_validation=False
        )
        use_vision = False
    else:
        # Default to Google (Gemini)
        from browser_use.llm.google import ChatGoogle
        llm = ChatGoogle(
            model="gemini-2.5-flash",
            api_key=settings.google_api_key.get_secret_value()
        )

    # Create Agent
    agent = Agent(
        task=task,
        llm=llm,
        browser=browser,
        use_vision=use_vision,
    )

    await agent.run()
    
    # Ensure browser is closed properly using stop()
    await browser.stop()

if __name__ == "__main__":
    asyncio.run(main())
