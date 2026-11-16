# Automotion

**Your imagination. In motion.**

An intelligent creative production studio powered by autonomous AI agents and connected generative models.

## Overview

Automotion is a BYOK (Bring Your Own Key) AI-powered image-to-motion and video creation studio. Transform static images, creative ideas, and written instructions into high-quality videos through connected generative AI models and autonomous AI agents.

## Features

- **Multi-Provider Support**: Connect to Replicate, fal.ai, and other AI providers
- **BYOK Architecture**: Your API keys stay local, never sent to our servers
- **Autonomous AI Agents**: 8 specialized agents handle the creative workflow
- **Image-to-Video**: Transform still images into dynamic video
- **Text-to-Video**: Generate videos from text descriptions
- **Project Management**: Organize your creative work
- **Generation History**: Track all your generations
- **Dark/Light Theme**: Beautiful, accessible UI

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Configuration

### Provider Setup

1. Navigate to **Provider Connections** in the sidebar
2. Select a provider (Replicate, fal.ai, etc.)
3. Enter your API key
4. Test the connection
5. Select a default model

### API Keys

- **Replicate**: Get your key from [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
- **fal.ai**: Get your key from [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys)

## Deployment

### GitHub Pages

This project is configured for deployment to GitHub Pages at `https://functionpsi.env.pm/automotion`.

1. Push to main branch
2. GitHub Actions will build and deploy automatically
3. Enable GitHub Pages in repository settings (Source: GitHub Actions)

### Vite Base Path

The base path is configured as `/automotion/` in `vite.config.ts` for GitHub Pages subdirectory deployment.

## Architecture

### Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Storage**: IndexedDB (local persistence)
- **Validation**: Zod
- **Testing**: Vitest, Playwright

### Project Structure

```
src/
├── components/       # React components
│   ├── common/       # Shared components
│   ├── layout/       # Layout components
│   └── ui/           # UI primitives
├── pages/            # Page components
├── services/         # Business logic
│   ├── providers/    # AI provider adapters
│   └── agents/       # AI agent implementations
├── stores/           # Zustand stores
├── types/            # TypeScript types
└── lib/              # Utilities
```

## AI Agents

1. **Creative Director** - Understands creative intent
2. **Vision Analysis** - Analyzes images for composition
3. **Motion Architect** - Designs camera/subject movement
4. **Prompt Engineer** - Optimizes prompts for models
5. **Model Selection** - Recommends best model
6. **Generation** - Executes and monitors jobs
7. **Quality Control** - Assesses output quality
8. **Workflow Orchestrator** - Coordinates all agents

## Security

- API keys stored locally (memory by default)
- Optional encrypted local storage
- No server-side credential storage
- CORS-aware provider communication
- No analytics by default

## Accessibility

- WCAG 2.2 AA compliant
- Keyboard navigation
- Screen reader support
- Reduced motion support
- High contrast mode

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## Support

- Documentation: `/docs`
- Issues: [GitHub Issues](https://github.com/functionpsi/automotion/issues)
- Email: support@automotion.example.com