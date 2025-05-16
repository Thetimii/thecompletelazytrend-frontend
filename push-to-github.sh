#!/bin/bash

# This script pushes the backend and frontend code to separate GitHub repositories

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is not installed. Please install it first."
    exit 1
fi

# Check if user is logged in to GitHub
if ! gh auth status &> /dev/null; then
    echo "You are not logged in to GitHub. Please run 'gh auth login' first."
    exit 1
fi

# Create and push backend repository
echo "Creating and pushing backend repository..."
cd temp/backend
git init
git add .
git commit -m "Initial commit for backend"
gh repo create thetimii/thecompletelazytrend-backend --public --source=. --push

# Create and push frontend repository
echo "Creating and pushing frontend repository..."
cd ../frontend
git init
git add .
git commit -m "Initial commit for frontend"
gh repo create thetimii/thecompletelazytrend-frontend --public --source=. --push

echo "Repositories created and code pushed to GitHub."
echo "Backend: https://github.com/thetimii/thecompletelazytrend-backend"
echo "Frontend: https://github.com/thetimii/thecompletelazytrend-frontend"
echo "Next step: Set up the projects on Render.com"
