#!/bin/bash

# Deploy script for GitHub Pages
echo "🚀 Deploying Terminal Portfolio to GitHub Pages..."

# Build the project
echo "📦 Building project..."
npm run export

# Step 1: Checkout main
echo "🔄 Checking out main branch..."
git checkout main

# Step 2: Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Step 3: Create or switch to gh-pages branch
echo "🔄 Creating/checking out gh-pages branch..."
git checkout -B gh-pages

# Step 4: Push it forcefully to overwrite the remote gh-pages
echo "🚀 Pushing to GitHub Pages..."
git push origin gh-pages --force

# Switch back to main branch
git checkout main

echo "✅ Deployment complete!"
echo "🌐 Your site should be available at: https://shenoyabhijith.github.io/terminal-portfolio-new"
echo "⏰ It may take a few minutes for changes to appear." 