#!/bin/bash

# Deploy script for new clean repository
echo "🚀 Deploying Terminal Portfolio to new repository..."

# Build the project
echo "📦 Building project..."
npm run export

# Create gh-pages branch
echo "🔄 Creating gh-pages branch..."
git checkout -B gh-pages

# Remove all files except .git
echo "🧹 Clearing existing files..."
find . -mindepth 1 -not -path './.git*' -not -path './dist*' -delete

# Copy built files to root
echo "📋 Copying built files..."
cp -r dist/* .

# Remove dist directory
rm -rf dist

# Add all files
echo "💾 Committing changes..."
git add .

# Commit changes
git commit -m "Deploy clean terminal portfolio - $(date)"

# Push to gh-pages branch
echo "🚀 Pushing to GitHub Pages..."
git push origin gh-pages --force

# Switch back to main branch
git checkout main

echo "✅ Deployment complete!"
echo "🌐 Your site should be available at: https://shenoyabhijith.github.io/resume"
echo "⏰ It may take a few minutes for changes to appear." 