#!/bin/bash

echo "🚀 Publishing React Image Cropper Pro to npm"
echo "=============================================="
echo ""

# Check if logged in
echo "📋 Checking npm login status..."
if ! npm whoami &> /dev/null; then
    echo "❌ Not logged in to npm!"
    echo "Please run: npm login"
    exit 1
fi

echo "✅ Logged in as: $(npm whoami)"
echo ""

# Check package name availability
echo "🔍 Checking if package name is available..."
if npm view react-image-cropper-pro &> /dev/null; then
    echo "⚠️  Package name 'react-image-cropper-pro' already exists!"
    echo "You can still publish if you own it, or use a different name."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Package name is available!"
fi
echo ""

# Build package
echo "📦 Building package..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Show what will be published
echo "📄 Files to be published:"
npm pack --dry-run 2>/dev/null | grep -E "\.(js|d\.ts|css|md)$" | head -10
echo ""

# Ask for confirmation
read -p "🚀 Ready to publish? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Publishing cancelled."
    exit 1
fi

# Publish
echo ""
echo "📤 Publishing to npm..."
npm publish

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully published!"
    echo "📦 Package: https://www.npmjs.com/package/react-image-cropper-pro"
    echo ""
    echo "Install with:"
    echo "  npm install react-image-cropper-pro"
else
    echo ""
    echo "❌ Publishing failed!"
    exit 1
fi

