# helppai

A full-featured ChatGPT clone built with React, Node.js, and Firebase.

## Features

- 🔑 Authentication System
  - Google OAuth
  - Email/Password
  - OTP via Email/Phone
- 🧠 AI Chat Interface
  - Real-time chat with AI
  - Chat history
  - Dark/Light mode
- 📱 Responsive Design
- 🔒 Secure Authentication
- 💾 Chat History Storage

## Tech Stack

- Frontend:
  - React with TypeScript
  - Tailwind CSS
  - Firebase Authentication
- Backend:
  - Node.js + Express
  - Firebase Admin SDK
  - OpenRouter API

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd client
   npm install

   # Install backend dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both client and server directories
   - Fill in the required environment variables

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # In another terminal, start frontend
   cd client
   npm start
   ```

## Deployment

### Frontend Deployment (Netlify)

1. Create a new site on [Netlify](https://www.netlify.com/)
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `cd client && npm install && npm run build`
   - Publish directory: `client/build`
4. Add environment variables:
   - `REACT_APP_API_URL`: Your backend URL (from Render)

### Backend Deployment (Render)

1. Create a new Web Service on [Render](https://render.com/)
2. Connect your GitHub repository
3. Configure the service:
   - Name: `chatgpt-backend`
   - Environment: `Node`
   - Build Command: `cd server && npm install && npm run build`
   - Start Command: `cd server && npm start`
4. Add environment variables:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `CLIENT_URL`: Your Netlify frontend URL

### Post-Deployment

1. Update `.env.production` in the client directory with your Render backend URL
2. Update `render.yaml` with your Netlify frontend URL
3. Push changes to GitHub
4. Your application will be automatically deployed!
   npm run dev

   # Start frontend server (in another terminal)
   cd client
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app

## Environment Variables

### Backend (.env)
```
PORT=5000
CLIENT_URL=http://localhost:3000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
OPENROUTER_API_KEY=your-api-key
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_CONFIG=your-firebase-config
```

## Deployment

- Frontend: Deploy to Vercel or Netlify
- Backend: Deploy to Render or Railway

## License

ISC
