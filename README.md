# Risk Checker 🛑

A simple infrastructure safety check tool designed to help developers avoid bad deployment decisions.

## Goal
Provide immediate, rule-based feedback on technical setups (Project Type, Hosting, Uptime, etc.) to highlight potential risks before they happen.

## Features
- **Instant Risk Analysis**: Get a verdict (Safe, Warning, Risky) based on your infrastructure choices.
- **Detailed Why-Checks**: Understand exactly why a specific combination might lead to failure.
- **Regional Context**: Specific checks for India-based projects and SMS/OTP requirements.

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in development mode:**
   ```bash
   npm run dev
   ```

3. **Open the browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Vanilla CSS with CSS Variables
- **Logic**: Pure TypeScript rules engine (no complex backend required)

---
*“Pre-decision guidance only. No guarantees.”*
