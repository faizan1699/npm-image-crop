#!/bin/bash
echo "🚀 Quick Test Script for React Image Cropper Pro"
echo "================================================"
echo ""

# Build the package
echo "📦 Building package..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Check if test-app exists
if [ ! -d "test-app" ]; then
    echo "❌ test-app directory not found!"
    exit 1
fi

# Navigate to test app
cd test-app

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📥 Installing test app dependencies..."
    npm install
fi

echo ""
echo "🎉 Starting test app..."
echo "Open http://localhost:5173 in your browser"
echo ""
npm run dev
