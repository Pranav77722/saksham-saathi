# Saksham Saathi

Saksham Saathi is a multilingual, voice-first livelihood and skilling assistant for PM-AJAY GIA use cases. It helps beneficiaries describe their experience in their preferred language, identify skills, discover local opportunities, and follow a structured livelihood action plan.

## Features

- Language-first onboarding with English, Hindi, Marathi, Tamil, Telugu, and Bengali
- Responsive government-service inspired interface for desktop and mobile
- Real browser microphone recording and Sarvam AI speech-to-text
- Pollinations AI conversational intake with structured profile extraction
- Sarvam AI text-to-speech with volume and mute controls
- Skill DNA, skill-gap, training, opportunity, map, and 90-day action-plan flows
- Beneficiary, field-worker, and authority dashboard views
- Offline-mode simulation and responsive mobile navigation

## Requirements

- Node.js 18 or newer
- npm
- Sarvam AI API access for voice transcription and speech
- Pollinations API access for conversational responses

## Getting started

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

Open the local URL printed by Vite.

## Environment variables

Create a `.env` file from `.env.example`:

```env
VITE_SARVAM_API_KEY=your_sarvam_api_key
VITE_POLLINATIONS_API_KEY=your_pollinations_api_key
VITE_POLLINATIONS_MODEL=openai/gpt-5.4-nano
```

Do not commit `.env` or API keys. `VITE_*` variables are exposed in a browser build; production deployments should place third-party API calls behind a server-side proxy.

## Scripts

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build locally
```

## Project structure

```text
src/
  pages/       Application screens and role dashboards
  services/    Sarvam and Pollinations integrations
  context/     Shared application state
  i18n.ts      i18next resources and language setup
public/        Branding assets
```

## Branding

The unified Saksham Saathi logo is stored at `public/saksham-saathi-logo.png` and is used across the splash screen, welcome screen, navigation, and favicon.
