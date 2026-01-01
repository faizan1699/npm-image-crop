# Testing Guide for React Image Cropper Pro

This guide explains how to test the package locally before publishing to npm.

## Method 1: Using the Test App (Recommended)

We've created a complete test application using Vite that allows you to test all features.

### Setup

1. **Build the package first:**
   ```bash
   npm run build
   ```

2. **Navigate to test app:**
   ```bash
   cd test-app
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   The app will be available at `http://localhost:5173` (or the port shown in terminal)

### Testing Features

The test app includes:
- ✅ Image upload functionality
- ✅ Aspect ratio selector
- ✅ Crop, download, and reset buttons
- ✅ Auto-blob generation toggle
- ✅ Real-time crop preview
- ✅ Console logging for all callbacks

### What to Test

1. **Basic Functionality:**
   - Upload an image
   - Drag the crop area
   - Resize using handles
   - Change aspect ratios
   - Crop and download

2. **Advanced Features:**
   - Enable auto-blob generation
   - Check console for callbacks
   - Test different aspect ratios
   - Try reset functionality

3. **Edge Cases:**
   - Very small images
   - Very large images
   - Different image formats (JPG, PNG, WebP)
   - Different aspect ratios

## Method 2: Using npm link (For Integration Testing)

This method allows you to test the package in your own React project.

### Step 1: Build and Link the Package

```bash
# In the package root directory
npm run build
npm link
```

### Step 2: Link in Your Test Project

```bash
# In your test React project
npm link react-image-cropper-pro
```

### Step 3: Use in Your Project

```tsx
import { ImageCropper } from 'react-image-cropper-pro';
import 'react-image-cropper-pro/styles';
```

### Step 4: Unlink When Done

```bash
# In your test project
npm unlink react-image-cropper-pro

# In the package root
npm unlink
```

## Method 3: Direct Import from Source (Development)

For active development, you can import directly from source:

### In test-app/vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-image-cropper-pro': path.resolve(__dirname, '../src/index.ts'),
    },
  },
});
```

This is already configured in the test app!

## Method 4: Using the Example File

You can also use the example file directly:

```bash
# Install dependencies in a React project
npm install react react-dom @types/react @types/react-dom

# Copy example.tsx to your project and use it
```

## Testing Checklist

### Core Features
- [ ] Image loads correctly
- [ ] Crop area is visible
- [ ] Drag to move works
- [ ] Resize handles work (all 8 handles)
- [ ] Aspect ratio constraint works
- [ ] Grid lines appear/disappear correctly

### Advanced Features
- [ ] Zoom functionality (if enabled)
- [ ] Rotation functionality (if enabled)
- [ ] Custom classes apply correctly
- [ ] Custom IDs apply correctly
- [ ] Styles DTO works
- [ ] Feature toggles work

### Export Functions
- [ ] `getCroppedImageBlob()` returns valid blob
- [ ] `getCroppedImageBase64()` returns valid base64
- [ ] `getCroppedImageDataURL()` returns valid data URL
- [ ] Blob size is reasonable
- [ ] Image quality is correct

### Callbacks
- [ ] `onCropChange` fires on crop change
- [ ] `onZoomChange` fires on zoom change
- [ ] `onRotationChange` fires on rotation change
- [ ] `onCropBlob` fires when `isBlobNeeded` is true

### Ref Methods
- [ ] `getCrop()` returns current crop
- [ ] `setCrop()` sets crop correctly
- [ ] `setZoom()` sets zoom correctly
- [ ] `setRotation()` sets rotation correctly
- [ ] `resetCrop()` resets correctly
- [ ] `getFeatures()` returns current features
- [ ] `setFeature()` toggles features correctly

### Edge Cases
- [ ] Very small images (< 100px)
- [ ] Very large images (> 5000px)
- [ ] Different aspect ratios
- [ ] Minimum/maximum size constraints
- [ ] Disabled state
- [ ] Multiple instances

## Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Testing

- [ ] Large images (> 5MB) load without lag
- [ ] Smooth dragging and resizing
- [ ] No memory leaks on multiple crops
- [ ] Fast blob generation

## Troubleshooting Test Issues

### Issue: Module not found
**Solution:** Make sure you've built the package (`npm run build`)

### Issue: Styles not loading
**Solution:** Import the CSS: `import 'react-image-cropper-pro/styles'`

### Issue: TypeScript errors
**Solution:** Ensure React types are installed: `npm install --save-dev @types/react @types/react-dom`

### Issue: Image not loading
**Solution:** Check CORS settings if loading from external URL, or use base64

## Running Automated Tests (Future)

When you add unit tests:

```bash
npm test
```

For coverage:

```bash
npm run test:coverage
```

## Publishing Checklist

Before publishing to npm:

- [ ] All tests pass
- [ ] Build succeeds without errors
- [ ] TypeScript compiles without errors
- [ ] README is complete
- [ ] Package.json has correct version
- [ ] All features work in test app
- [ ] No console errors or warnings
- [ ] Bundle size is reasonable

## Quick Test Command

Run this to quickly test the build:

```bash
npm run build && cd test-app && npm install && npm run dev
```

This will:
1. Build the package
2. Install test app dependencies
3. Start the dev server

Happy Testing! 🚀

