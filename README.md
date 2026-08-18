# NLQT — Natural Language Query Translator

An AI-powered web application that allows users to interact with a college database using **natural language instead of writing SQL queries manually**.

The NLQT frontend provides a modern, interactive interface for submitting natural-language queries, viewing results, and interacting with **Nelly**, the application's AI assistant.

---

## ✨ Features

- 🧠 Natural-language query interface
- 🤖 Interactive AI assistant — **Nelly**
- 💬 Conversational workspace
- 🎨 Modern dark-themed UI
- ✨ Animated Lottie-based AI character
- 🔌 REST API integration with the NLQT backend
- 📱 Responsive frontend
- ⚡ Fast development and production builds with Vite
- 🔐 Environment-based backend configuration

---

## 🏗️ Architecture

```text
                    ┌───────────────────┐
                    │       User        │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   NLQT Frontend   │
                    │                   │
                    │ React + TypeScript│
                    │      + Vite       │
                    └─────────┬─────────┘
                              │
                         REST API
                              │
                              ▼
                    ┌───────────────────┐
                    │   NLQT Backend    │
                    │      Render       │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   PostgreSQL DB   │
                    │       Neon        │
                    └───────────────────┘
```

The frontend and backend are deployed independently.

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** PostgreSQL / Neon

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS
- Lucide React
- Lottie / DotLottie

### Backend Integration

- REST API
- Environment-based API configuration

### Deployment

- GitHub
- Vercel
- Render

---

## 📂 Project Structure

```text
NLQT_FRONTEND/
│
├── public/
│   ├── favicon.svg
│   └── nelly.lottie
│
├── src/
│   │
│   ├── components/
│   │   ├── LandingPage.tsx
│   │   ├── NellyAnimation.tsx
│   │   └── WorkspacePage.tsx
│   │
│   ├── services/
│   │   └── api.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 🤖 Nelly

**Nelly** is the AI assistant integrated into the NLQT interface.

The frontend includes a custom animated representation of Nelly using a `.lottie` animation.

The animation is stored in:

```text
public/nelly.lottie
```

and rendered through the `NellyAnimation` component.

The component also includes:

- Holographic glow effects
- Animated rings
- Pulsing ambient effects
- Responsive sizing
- Continuous animation playback

---

## 🖥️ Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/Mehnaz2004/NLQT_FRONTEND.git
```

Navigate into the project:

```bash
cd NLQT_FRONTEND
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_API_URL=your_backend_url
```

For example:

```env
VITE_API_URL=https://your-backend.onrender.com
```

> Do not commit your `.env` file to GitHub.

---

### 4. Start the development server

```bash
npm run dev
```

The application will be available at the local URL provided by Vite, typically:

```text
http://localhost:5173
```

---

## 📦 Production Build

To create a production build:

```bash
npm run build
```

The generated production files will be placed inside:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🔌 API Integration

The frontend communicates with the NLQT backend through the API service located at:

```text
src/services/api.ts
```

## 📌 Project Status

**Status:** 🚀 Deployed

The NLQT frontend is connected to the NLQT backend and can be independently developed, built, and deployed through the GitHub → Vercel workflow.

---
