# PRD Assistant - Payment Integration Workflow System

A systematic approach to payment provider integrations using **Antigravity** with PRD-First methodology.

## Overview
This project handles 3-4 payment provider integrations daily using a standardized, phase-based workflow. Built for **Jupyter Notebook-style execution** where you can run individual steps, iterate until satisfied, or execute entire phases at once.
 
 ## Development Methodology: Spec-Integrated PRD (SIP)
 
 The PRD Assistant follows a **Spec-Integrated PRD (SIP)** methodology. This approach combines the "Human Truth" of Product Requirements Documents (PRD) with the "Machine Truth" of executable specifications.
 
 ### The Two-Layer Documentation System
 
 To handle high-frequency integrations (3-4 per day) without quality loss, we separate concerns into two distinct layers:
 
 #### Layer 1: Human-Readable PRD (Steps 1-6)
 *   **Purpose**: Discovery, Analysis, and Decision Making.
 *   **Audience**: Product Managers, Stakeholders, Developers.
 *   **Format**: Human-readable Markdown files.
 *   **Goal**: To answer "Why we are building this," "How the provider works," and "Is it compatible?"
 *   **Key Artifacts**:
     *   `1.epic_analysis.md` (Scope)
     *   `2.docs_analysis.md` (Discovery)
     *   `4.auto_test_page.md` (Validated JSON Schemas)
     *   `5.betterbro_compatibility.md` (Feasibility)
     *   `6.project_stories.md` (Requirements)
 
 #### Layer 2: Machine-Executable Contract (Step 7)
 *   **Purpose**: Code Generation, Validation, and Testing.
 *   **Audience**: Code Agents, Linters, Test Runners.
 *   **Format**: OpenAPI 3.1 YAML with strictly typed schemas.
 *   **Goal**: To answer "How exactly do we build this?" with mathematical certainty.
 *   **Key Artifacts**:
     *   `7.contract_spec.yaml` (The Source of Truth for Code)
 
 ---
 
 ### Core Principles
 
 #### 1. PRD as the Context, Spec as the Contract
 The PRD provides the *context* (nuance, edge cases, business logic) that allows the Spec to be generated correctly. The Spec provides the *contract* (types, fields, endpoints) that allows code to be generated correctly.
 
 #### 2. Architecture Before Implementation
 All technical components (endpoints, field mappings, state flows) must be architected in the PRD phase (Layer 1) and formalized in the Spec phase (Layer 2) *before* any backend code is written.
 
 #### 3. Validation-Driven
 *   **Human Validation**: Step 5 (`betterbro_compatibility.md`) ensures the business logic aligns with internal standards.
 *   **Machine Validation**: Step 7 uses `spectral` linting to ensure the contract is complete and valid.
 
 ---
 
 ### Workflow Overview
 
 1.  **Discovery (Steps 1-2)**: Analyze provider docs and capture raw API behavior.
 2.  **Validation (Steps 3-5)**: Create test pages, verify compatibility, and "Green Light" the architecture.
 3.  **Definition (Step 6)**: Write Gherkin user stories.
 4.  **Specification (Step 7)**: Synthesize all previous findings into an executable OpenAPI 3.1 contract.
 5.  **Handoff**: Package PRD and Spec into a ZIP file for the implementation agent.

## Quick Start

### 0. System Configuration (First Run Only)
Before running any workflows, you must configure your Atlassian credentials to allow the system to fetch Jira issues.

1.  **Generate an API Token**:
    *   Go to [https://id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens).
    *   Click "Create API token".
    *   Label it (e.g., "PRD Assistant") and copy the token.

2.  **Configure `.env`**:
    *   Create a file named `.env` in the root of the project.
    *   Add your Atlassian credentials:
        ```bash
        ATLASSIAN_EMAIL=your_email@domain.com
        ATLASSIAN_API_TOKEN=your_generated_token_here
        ATLASSIAN_DOMAIN=your_domain.atlassian.net
        ```

### 1. Create New Integration
Run the workflow command:
```
/create-new-integration
```
*   **Prompt**: The agent will ask for the integration name.
*   **Convention**: `Integration_<ProviderName> <Country> <Currency> <Flow>`
*   **Example**: `Integration_SmartFastPay Ecuador USD Payin HPP`

### 2. Prepare Integration Folder
```bash
cd integrations/Integration_ProviderName_...

# Add provider docs and Epic requirements to 0_initial_docs_and_config/
# Fill in the integration_config file with credentials and API URLs
```

### 3. Execute Research Phase
Open the integration folder in Antigravity and run:

**Option A: Step-by-step** (iterative, Jupyter-style)
```
/step1-epic-analysis
[Review output, re-run if needed]

/step2-docs-analysis
[Review output, re-run if needed]

/step3-create-test-page
[Review output, test manually, re-run if needed]

/step4-auto-test-page
[Automated verification]

... continue through step7
```

**Option B: Full phase** (automated)
```
/phase1-full
[Agent executes all Steps 1-7 (including 3a/3b), confirms between steps]
```

## Project Structure

```
prd_assistant/
├── .gemini.md                    # Global rules (auto-loaded by Antigravity)
├── .agent/
│   ├── skills/
│   │   └── test_page_generator/  # Auto-triggered for Step 3
│   └── workflows/
│       ├── phase1-full.md        # /phase1-full
│       ├── step1-epic-analysis.md
│       ├── step2-doc-and-api-analysis.md
│       ├── step3-create-test-page.md
│       ├── step4-auto-test-page.md
│       ├── step5-compatibility.md
│       ├── step6-project-stories.md
├── app/                      # Centralized helper apps
│   ├── serve.py              # Local testing server (CORS + Webhooks)
│   ├── webhook_viewer.html   # Webhook Visualization UI
│   └── serve.log             # Server logs
├── .master_prd/
│   └── master_prd.yaml           # PRD schema definition
├── integrations/
│   └── Integration_<Name>/       # Actual integration workspaces
│       ├── 0_initial_docs_and_config/       # Epic, provider docs (immutable) and Config
│       │   ├── integration_config           # API credentials, URLs
│       │   └── project_rules.md             # Optional: integration-specific overrides
│       └── 1_result/                        # Phase 1, 2, and 4 outputs (All project files)
└── _archive/                     # Deprecated: old instruction files
```

## Workflow Details & Commands

### Phase 1: Research
**Goal**: Complete deep analysis and fill all necessary stories before writing code.
**Command**: `/phase1-full` (Run all steps) or run individually below.
**Output Directory**: `1_result/`

#### Step 1: Epic Analysis
**Command**: `/step1-epic-analysis`
**File**: `1_result/1.epic_analysis.md`
*   **Action**: Evaluate the completeness of the Epic description (e.g., Jira link).
*   **Content**:
    *   Summary of requirements.
    *   Identification of unclear points.
    *   List of questions for the Product Owner (PO).

#### Step 2: Documentation & API Analysis
**Command**: `/step2-doc-and-api-analysis`
**File**: `1_result/2.docs_analysis.md`
*   **Action**: Deep dive into the provider's documentation.
*   **Content**:
    *   Links to official docs.
    *   Authentication method analysis.
    *   List of available payment methods and restrictions.

#### Step 3: Create Test Page
**Command**: `/step3-create-test-page`
**File**: `1_result/3.test_page.md`
*   **Action**: Create a functional HTML test page in file `1_result/3.test_page.html`.
*   **Content**:
    *   The generated HTML file (embedded or linked).
    *   Usage instructions.

#### Step 4: Auto Test Page
**Command**: `/step4-auto-test-page`
**File**: `1_result/4.auto_test_page.md`
*   **Action**: Automatically test the page using a browser agent and fix issues.
*   **Content**:
    *   Screenshots/Logs of a successful transaction.
    *   Test Results section.

#### Step 5: Compatibility Check
**Command**: `/step5-compatibility`
**File**: `1_result/5.compatibility.md`
*   **Action**: Check if the new method is compatible with the current system architecture.
*   **Content**:
    *   Flag any blocking architectural mismatches.
    *   Confirm if standard flow applies or if custom logic is needed.

#### Step 6: Fill Project Stories
**Command**: `/step6-project-stories`
**File**: `1_result/6.project_stories.md`
*   **Action**: Fill in the technical details for the standard set of stories.
*   **Content Sections**:
    1.  **Authorization**: How to authenticate (Headers, Token, Signature).
    2.  **Create Transaction Request**: Full payload example with mappings.
    3.  **Create Transaction Response**: Expected success/error response parsing.
    4.  **Callback (Webhook)**: Structure of the notification, validation logic (signature check), and response acknowledgment.
    5.  **Check Status**: Endpoint to poll status if callbacks fail.
    6.  **Final Statuses**: Mapping of Provider Statuses → Internal Statuses.
    7.  **Error Mapping**: Table of Provider Error Codes → Internal User Messages.

#### Step 7: Field Testing
**Command**: `/step7-field-testing`
**File**: `1_result/7.field_testing.md`
*   **Action**: Test edge cases and specific field handling.
*   **Content**:
    *   **International Format**: Phone number validation.
    *   **Transliteration**: Cyrillic/Special char acceptance.
    *   **Amount Handling**: Cents vs Integers.
    *   **Tester Specifics**: QA verification values.

### Phase 2: Development
**Goal**: Implement the logic defined in Phase 1.
**Output Directory**: `1_result/`

#### Step 8: Balance Retrieval
**File**: `1_result/8.balance_retrieval.md`
*   **Action**: Describe the method for obtaining account balances.
*   **Content**:
    *   Endpoint URL.
    *   Request/Response structure.
    *   Frequency limits.

### Phase 4: Testing
**Goal**: Integration Verification.
**Output Directory**: `1_result/`

*   Place all QA reports, automated test scripts (Python/Postman), and final sign-off documents here.
*   Follow the standard validation checklist (Happy Path, Error Cases, Timeout handling).

## Key Features

### 🎯 Jupyter Notebook Execution Style
- Execute individual steps and review results
- Re-run specific steps until results are satisfactory
- Full control over iteration speed

### 🤖 Antigravity Native Configuration
- **Rules**: `.gemini.md` loaded automatically (no manual prompting)
- **Skills**: Auto-triggered by context (e.g., test page generation)
- **Workflows**: Slash commands for step-by-step execution

### 📋 PRD-First Methodology
All integrations follow the **Hierarchy of Truth**:
1. Integration-specific `project_rules.md` (highest priority)
2. BetterBro standards
4. Provider documentation (validated via testing)

### 🔄 Template-Based Workflow
Create 3-4 integrations daily from standardized template:
- Consistent folder structure
- Pre-configured config file
- Ready-to-use workflows

## Global Rules

### BetterBro Standards
- H2H preferred over Redirects
- PIX = dynamic QR codes
- Webhooks must be authenticated
- Field mapping follows BetterBro schema

### Working Directory Isolation
- Research Agent → `1_result/` only
- Development Agent → `1_result/` only
- Test Agent → `1_result/` only

### Configuration Files
Every integration has:
- `integration_config`: API credentials, documentation URL.
- `project_rules.md` (optional): Integration-specific overrides (in `0_initial_docs_and_config`)

### Centralized App (`app/`)
Contains utility tools to support testing across all integrations:
- **`serve.py`**: A unified local server that handles:
    - **CORS Proxy**: `POST /proxy`
    - **Webhook Ingestion**: `POST /webhook`
    - **API**: `GET/DELETE /api/webhooks`
- **`webhook_viewer.html`**: A modern UI for viewing caught webhooks.

**Usage**:
The workflows (e.g., `/step3-create-test-page`) automatically manage this server.
To run manually:
```bash
# From repository root
nohup python3 app/serve.py > /dev/null 2>&1 &
```
- Webhook Viewer: [http://localhost:8000/webhook_viewer.html](http://localhost:8000/webhook_viewer.html)
- Webhook Ingest URL: `http://localhost:8000/webhook`

## Skills

### test_page_generator
Auto-triggered during Step 3 or when user mentions "create test page".

**Generates**:
- Functional HTML test page with credential input
- Token generation and transaction creation
- Webhook polling and display
- Request/response logging

**Output**:
- `3.test_page.html`
- `3.test_page.md` (with usage instructions)




## Tips

### Creating New Integrations
1. Use `/create-new-integration` to scaffold the folder structure automatically.
2. Fill the `integration_config` file with credentials and API documentation URLs.
3. Populate `0_initial_docs_and_config/` with the Epic (Jira) requirements and official provider PDF/Markdown docs.

### Iterative Refinement
```
You: /step2-docs-analysis
Agent: [Creates 2.docs_analysis.md]

You: The authentication section is incomplete, re-run step 2
Agent: [Re-runs step 2 with more detail]

You: Perfect! /step3-create-test-page
```

### Custom Rules
If an integration needs special handling:
1. Create `project_rules.md` in that integration's `0_initial_docs_and_config` folder
2. Document the override (e.g., "Skip webhook testing")
3. Rules apply only to that integration

### Parallel Agent Work (Advanced)
Use Antigravity's Agent Manager to:
- Set up multiple integrations in parallel
- Run different phases concurrently
- Batch process similar providers

## Support
For questions about:
- **BetterBro Standards**: See `.gemini.md` → BetterBro Standards section
- **Workflow Steps**: Read individual workflow files in `.agent/workflows/`
- **Skills**: Check `.agent/skills/<skill-name>/SKILL.md`
