# The Complete Lazy Trend

A TikTok trend analysis tool that helps businesses identify and leverage trending content on TikTok.

## Project Structure

This project is split into two main parts:

- **Backend**: Node.js/Express API server
- **Frontend**: React application built with Vite

## Local Development

### Prerequisites

- Node.js (v16+)
- npm (v8+)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/thetimii/thecompletelazytrend.git
   cd thecompletelazytrend
   ```

2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both the `backend` and `frontend` directories
   - Fill in the required API keys and configuration values

4. Start the development servers:
   ```bash
   npm run dev
   ```

## Deployment

### Backend Deployment (Render.com)

1. Create a new Web Service on Render.com
2. Connect to your GitHub repository
3. Configure the service:
   - **Name**: thecompletelazytrend-backend
   - **Root Directory**: backend
   - **Build Command**: npm install
   - **Start Command**: npm start
   - **Environment Variables**: Add all variables from `.env.example`

### Frontend Deployment (Render.com)

1. Create a new Static Site on Render.com
2. Connect to your GitHub repository
3. Configure the service:
   - **Name**: thecompletelazytrend
   - **Root Directory**: frontend
   - **Build Command**: npm install && npm run build
   - **Publish Directory**: dist
   - **Environment Variables**: Add all variables from `.env.example`, including `VITE_BACKEND_URL` pointing to your backend service URL

## Features

- Generate TikTok search queries based on business description
- Scrape trending TikTok videos
- Analyze video content and engagement metrics
- Provide content recommendations based on analysis

## Technologies

- **Backend**: Node.js, Express, Supabase
- **Frontend**: React, Vite, Tailwind CSS
- **APIs**: OpenRouter, RapidAPI, DashScope

## License

MIT
