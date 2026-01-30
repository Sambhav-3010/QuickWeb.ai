# 🚀 QuickWeb.ai - AI Website Generator

Generate complete, production-ready websites from natural language descriptions using advanced AI models.

![QuickWeb.ai](https://img.shields.io/badge/QuickWeb.ai-AI%20Powered-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)

## ✨ What is QuickWeb.ai?

QuickWeb.ai is an AI-powered website generator that transforms natural language descriptions into fully functional websites. Simply describe what you want, and watch as the AI generates complete code with live preview.

### Key Features

- 🎨 **Natural Language to Code** - Describe your website idea and get working code
- ⚡ **Live Preview** - See your website come to life in real-time with WebContainers
- 🔄 **Iterative Refinement** - Keep chatting to refine and improve your design
- 📥 **One-Click Download** - Download your complete project as a ZIP file
- 🎯 **Multiple AI Models** - Choose from GPT-4, Claude, Gemini, and more
- 🛡️ **Smart Fallback** - Automatic fallback to alternative AI providers if primary fails

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks and concurrent features |
| **TypeScript** | Type-safe development |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **Monaco Editor** | VS Code-like code editor |
| **WebContainers** | In-browser Node.js runtime for live preview |
| **shadcn/ui** | Accessible UI components |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express** | Web server framework |
| **TypeScript** | Type-safe server code |
| **Google Gemini API** | AI code generation (fallback) |
| **Anthropic Claude API** | AI code generation (fallback) |

### AI Integration
| Service | Role |
|---------|------|
| **Puter.js** | Primary AI provider (free, browser-based) |
| **Google Gemini** | Fallback AI provider |
| **Anthropic Claude** | Fallback AI provider |

## 🔄 How It Works

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   User Prompt   │────▶│   Template   │────▶│   AI Generation │
│  "Create a..."  │     │   Selection  │     │   (Streaming)   │
└─────────────────┘     └──────────────┘     └────────┬────────┘
                                                      │
                                                      ▼
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Download ZIP  │◀────│ WebContainer │◀────│   Code Parser   │
│                 │     │ Live Preview │     │   (XML → Files) │
└─────────────────┘     └──────────────┘     └─────────────────┘
```

### Step-by-Step Flow

1. **User Input**: Enter a natural language description of your desired website
2. **Template Detection**: Backend analyzes the prompt to determine if it's a React or Node.js project
3. **AI Generation**: Puter.js sends the prompt to AI models (Claude, GPT-4, Gemini, etc.)
4. **Streaming Response**: Code is streamed back in real-time, parsed from XML format
5. **Live Preview**: WebContainers boot up, install dependencies, and run the dev server
6. **Iterate**: Continue chatting to refine the design
7. **Download**: Export the complete project as a ZIP file

## 🛡️ Smart AI Fallback System

If Puter.js doesn't respond within **60 seconds**, the system automatically:

1. ⏰ Detects timeout (no streaming data received)
2. 🔔 Shows a fallback modal with alternative options
3. 🔄 User selects: **Google Gemini** or **Anthropic Claude**
4. 📡 Request is routed to your backend with your own API keys
5. ⚡ Generation continues seamlessly

This ensures your website generation never gets stuck!

## 🚀 Getting Started

### 🐳 Quick Start with Docker (Recommended)

The fastest way to run QuickWeb.ai:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sambhav-3010/website-generator.git
   cd website-generator
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   NVIDIA_API_KEY=your_nvidia_api_key_here
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Open in browser**
   
   Navigate to `http://localhost:5173`

That's it! 🎉

### 📦 Manual Installation

If you prefer to run without Docker:

#### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- API keys for fallback providers (optional but recommended)

#### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sambhav-3010/website-generator.git
   cd website-generator
   ```

2. **Install Frontend dependencies**
   ```bash
   cd Frontend
   npm install
   ```

3. **Install Backend dependencies**
   ```bash
   cd ../Backend
   npm install
   ```

4. **Configure environment variables**

   Create `Backend/.env`:
   ```env
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   GEMINI_API_KEY=your_gemini_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   NVIDIA_API_KEY=your_nvidia_api_key
   ```

   Create `Frontend/.env`:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

5. **Start the development servers**

   Backend:
   ```bash
   cd Backend
   npm run dev
   ```

   Frontend (new terminal):
   ```bash
   cd Frontend
   npm run dev
   ```

6. **Open in browser**
   
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
website-generator/
├── Frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks (WebContainers)
│   │   ├── lib/             # Utilities and parsers
│   │   ├── pages/           # Main page components
│   │   │   ├── PromptPage.tsx    # Initial prompt input
│   │   │   └── GeneratePage.tsx  # Code generation & preview
│   │   └── types/           # TypeScript type definitions
│   ├── Dockerfile           # Frontend Docker config
│   ├── vite.config.ts       # Vite configuration
│   └── vercel.json          # Vercel deployment config
│
├── Backend/
│   ├── src/
│   │   ├── defaults/        # Prompt templates
│   │   ├── models/          # AI model integrations
│   │   │   ├── gemini.ts    # Google Gemini integration
│   │   │   └── claude.ts    # Anthropic Claude integration
│   │   └── index.ts         # Express server & routes
│   ├── Dockerfile           # Backend Docker config
│   └── .env                 # Environment variables
│
├── docker-compose.yml       # Docker orchestration
├── .env.example             # Example environment file
└── README.md
```

## 🌐 Deployment

### Vercel (Frontend)

The frontend is configured for Vercel deployment with the necessary COEP/COOP headers for WebContainers.

### Render (Backend)

Deployed the backend to Render. Make sure to set the environment variables.

## 🔧 API Endpoints

### `GET /`
Health check endpoint.

### `POST /template`
Analyzes the user prompt and returns the appropriate template.

**Request:**
```json
{
  "prompt": "Create a modern portfolio website"
}
```

**Response:**
```json
{
  "prompts": ["...system prompts..."],
  "uiPrompts": ["...initial file structure..."]
}
```

### `POST /chat`
Streaming chat endpoint for AI fallback.

**Request:**
```json
{
  "messages": [{ "role": "user", "content": "..." }],
  "model": "gemini" | "anthropic"
}
```

**Response:** Streamed text content

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- [Puter.js](https://puter.com) - Free AI API access
- [WebContainers](https://webcontainers.io) - In-browser Node.js
- [shadcn/ui](https://ui.shadcn.com) - Beautiful UI components

<p align="center">
  Made with ❤️ by <a href="https://github.com/Sambhav-3010">Sambhav</a>
</p>
