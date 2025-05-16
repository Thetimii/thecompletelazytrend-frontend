#!/bin/bash

# This script sets up separate GitHub repositories for the backend and frontend

# Create backend repository
echo "Setting up backend repository..."
mkdir -p temp/backend
cp -r backend/* temp/backend/
cp backend/.env.example temp/backend/
cp backend/.gitignore temp/backend/ 2>/dev/null || cp .gitignore temp/backend/
cat > temp/backend/README.md << EOL
# The Complete Lazy Trend - Backend

The backend API server for The Complete Lazy Trend TikTok analysis tool.

## Setup

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up environment variables:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Then fill in the required API keys and configuration values.

3. Start the server:
   \`\`\`bash
   npm start
   \`\`\`

## API Endpoints

- \`/api/test\` - Test endpoint
- \`/api/generate-queries\` - Generate TikTok search queries
- \`/api/scrape-tiktoks\` - Scrape TikTok videos
- \`/api/analyze-videos\` - Analyze videos
- \`/api/complete-workflow\` - Run the complete workflow

## Deployment

This backend is designed to be deployed on Render.com as a Web Service.
EOL

# Create frontend repository
echo "Setting up frontend repository..."
mkdir -p temp/frontend
cp -r frontend/* temp/frontend/
cp frontend/.env.example temp/frontend/
cp frontend/.gitignore temp/frontend/ 2>/dev/null || cp .gitignore temp/frontend/
cat > temp/frontend/README.md << EOL
# The Complete Lazy Trend - Frontend

The React frontend for The Complete Lazy Trend TikTok analysis tool.

## Setup

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up environment variables:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Then fill in the required configuration values.

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Building for Production

\`\`\`bash
npm run build
\`\`\`

The built files will be in the \`dist\` directory.

## Deployment

This frontend is designed to be deployed on Render.com as a Static Site.
EOL

echo "Repositories set up in the temp directory."
echo "Next steps:"
echo "1. Create two new GitHub repositories:"
echo "   - thecompletelazytrend-backend"
echo "   - thecompletelazytrend-frontend"
echo "2. Push the code from temp/backend and temp/frontend to the respective repositories."
echo "3. Set up the projects on Render.com using the render.yaml file or manually."
