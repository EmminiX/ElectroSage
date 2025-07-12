#!/bin/bash

# ElectroSage Academy - Deployment Script
# This script prepares and deploys the application

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Check if required environment variables are set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ Error: OPENAI_API_KEY environment variable is not set"
    echo "Please set your OpenAI API key before deploying"
    exit 1
fi

echo "✅ Environment variables validated"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run build
echo "🔨 Building application..."
npm run build

# Run tests (if any)
echo "🧪 Running tests..."
# npm test (uncomment when tests are added)

echo "✅ Build completed successfully!"
echo "📊 Build statistics:"
du -sh .next/

echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Deploy .next/ folder to your hosting platform"
echo "2. Set environment variables on your hosting platform"
echo "3. Start the application with 'npm start'"
echo ""
echo "For Vercel deployment:"
echo "  vercel --prod"
echo ""
echo "For Docker deployment:"
echo "  docker build -t electrosage-academy ."
echo "  docker run -p 4100:4100 electrosage-academy"
