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

# Push backend repository
echo "Pushing backend repository..."
cd backend
git add .
git commit -m "Update backend code"
git push origin main

# Push frontend repository
echo "Pushing frontend repository..."
cd ../frontend
git add .
git commit -m "Update frontend code"
git push origin main

echo "Repositories updated and code pushed to GitHub."
echo "Backend: https://github.com/thetimii/thecompletelazytrend-backend"
echo "Frontend: https://github.com/thetimii/thecompletelazytrend-frontend"
echo "Next step: Set up the projects on Render.com"
