# Groq App Generator

An interactive web application that generates and modifies web applications using Groq's LLM API. Built with Next.js and TypeScript.

## Features

- Real-time app generation based on natural language queries
- Content safety checking using LlamaGuard
- Interactive feedback system for iterative improvements
- Version control and history tracking
- Share and export functionality

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Groq SDK
- React Syntax Highlighter
- UUID for session management

## Environment Variables

Required environment variables:
- `GROQ_API_KEY`: Your Groq API key
- `UPSTASH_REDIS_URL`: Your Upstash Redis URL
- `BLOCK_SECRET`: Your block secret
- `HTML_SIGNING_SECRET`: Your HTML signing secret

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up your environment variables
4. Run the development server: `pnpm run dev`

The application will be available at `http://localhost:3000`.
