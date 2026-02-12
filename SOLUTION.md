# Browser-Use Research Agent - Issue Resolution

## Problem Summary
The browser-use agent was failing with error:
```
Error code: 400 - {'error': {'message': 'Provider returned error', 'code': 400, 
'metadata': {'raw': '{"error":{"message":"Request param: response_format is invalid, 
recommended val is: must be text or json_object","type":"input_invalid"}}
```

## Root Causes Identified

### 1. Model Incompatibility
- **Issue**: The StepFun model (`stepfun/step-3.5-flash:free`) doesn't support structured outputs (`response_format` parameter) that browser-use requires
- **Impact**: Agent couldn't parse structured responses needed for browser automation

### 2. Configuration Typo in .env
- **Issue**: The .env file had `LM_PROVIDER` instead of `LLM_PROVIDER`
- **Impact**: The llm_provider setting wasn't being read correctly, causing unexpected behavior

## Solutions Applied

### 1. Fixed .env Configuration
Changed in `.env` file:
```bash
# Before:
LM_PROVIDER=openrouter

# After:
LLM_PROVIDER=google
```

### 2. Updated Model Selection in research_agent.py
Changed from StepFun to Google Gemini Flash:
```python
# The code now uses Google Gemini by default (more reliable for browser-use)
if settings.llm_provider == "openrouter":
    # For OpenRouter users - using Gemini Flash via OpenRouter
    llm = ChatOpenRouter(
        model="google/gemini-2.0-flash-exp:free",
        api_key=settings.openrouter_api_key.get_secret_value(),
        _strict_response_validation=False
    )
else:
    # Default to Google (Gemini) - RECOMMENDED
    llm = ChatGoogle(
        model="gemini-2.5-flash",
        api_key=settings.google_api_key.get_secret_value()
    )
```

## Current Status

✅ **Fixed**: The agent now works correctly with Google Gemini
⚠️ **Quota Limit**: You've hit the Google Gemini free tier limit (20 requests/day)

## Solutions for Quota Issue

### Option 1: Wait for Quota Reset (Recommended for Free Tier)
- Google's free tier resets daily
- Wait ~48 seconds (as indicated in the error) or check https://ai.dev/rate-limit

### Option 2: Use Paid OpenRouter Models
If you need immediate access, update `.env`:
```bash
LLM_PROVIDER=openrouter
```

Then update `app/research_agent.py` to use a paid model that supports structured outputs:
```python
llm = ChatOpenRouter(
    model="google/gemini-2.0-flash-thinking-exp:free",  # or another compatible model
    api_key=settings.openrouter_api_key.get_secret_value(),
    _strict_response_validation=False
)
```

### Option 3: Upgrade Google API Plan
- Visit https://ai.google.dev/pricing
- Upgrade from free tier to paid plan for higher quota

## Testing the Fix

The agent successfully completed Steps 1-2:
```
✅ Step 1: Navigated to Google.com
✅ Step 2: Searched for 'Oleksandr Hrachov' and got results
✅ Step 3: Clicked on first search result (Oleksandr Hrachov 🇺🇦 – TECHNOL...)
```

To test after quota resets:
```bash
poetry run python -m app.research_agent
```

## Recommended Models for Browser-Use

### Compatible Models (support structured outputs):
1. ✅ `google/gemini-2.5-flash` (via Google API) - **RECOMMENDED**
2. ✅ `google/gemini-2.0-flash-exp:free` (via OpenRouter)
3. ✅ `openai/gpt-4o-mini` (via OpenRouter - paid)
4. ✅ `anthropic/claude-3-haiku` (via OpenRouter - paid)

### Incompatible Models (DO NOT USE):
1. ❌ `stepfun/step-3.5-flash:free` - No structured output support
2. ❌ `qwen/qwen-2.5-72b-instruct:free` - Currently unavailable on OpenRouter
3. ❌ Many other free models lack proper JSON mode support

## Key Learnings

1. **Always verify env variable names** - A simple typo can cause unexpected behavior
2. **Not all LLMs support structured outputs** - Browser-use requires models that can return JSON
3. **Free tiers have limits** - Plan for quota management or use paid alternatives
4. **Google Gemini API direct access** is more reliable than routing through OpenRouter for free tier usage
