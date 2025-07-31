#!/bin/bash

# Deploy script for GitHub Pages
echo "🚀 Deploying Terminal Portfolio to GitHub Pages..."

# Build the project
echo "📦 Building project..."
npm run export

# Create gh-pages branch if it doesn't exist
git checkout -b gh-pages 2>/dev/null || git checkout gh-pages

# Remove all files except .git
git rm -rf . || true

# Copy dist contents to root
cp -r dist/* .

# Add all files
git add .

# Commit changes
git commit -m "Deploy to GitHub Pages - $(date)"

# Push to gh-pages branch
git push origin gh-pages --force

# Switch back to main branch
git checkout main

echo "✅ Deployment complete!"
echo "🌐 Your site should be available at: https://shenoyabhijith.github.io/terminal-portfolio"
echo "⏰ It may take a few minutes for changes to appear." 