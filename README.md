# React Image Cropper Pro

<div align="center">

![npm version](https://img.shields.io/npm/v/react-image-cropper-pro?style=flat-square)
![license](https://img.shields.io/npm/l/react-image-cropper-pro?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square)

**A highly customizable, feature-rich React image cropper component with drag, resize, zoom, rotation, and aspect ratio control.**

[Features](#features) • [Installation](#installation) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Examples](#examples) • [API Reference](#api-reference)

</div>

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Basic Usage](#basic-usage)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Advanced Features](#advanced-features)
- [Styling Guide](#styling-guide)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Features

- 🖱️ **Drag to Move** - Easily move the crop area by dragging
- 🔄 **Resize Handles** - 8 resize handles (corners and edges) for precise cropping
- 🔍 **Zoom Support** - Zoom in/out on images (0.1x to 5x)
- 🔃 **Rotation** - Rotate images before cropping (0-360 degrees)
- 📐 **Aspect Ratio Control** - Lock aspect ratio or allow free cropping
- 🎯 **Grid Lines** - Optional grid lines for better composition (rule of thirds)

### Advanced Features

- 🎨 **Customizable Styling** - Fully customizable styles via CSS or DTO
- 🏷️ **Custom Classes & IDs** - Add custom CSS classes and IDs to all elements
- ⚙️ **Feature Configuration** - Granular control over individual features
- 🔧 **Programmatic Control** - Control features and styling via ref methods
- 📦 **Blob Generation** - Automatic blob generation on crop change
- 🎭 **Styles DTO** - Programmatic style control with Data Transfer Object pattern
- 📱 **Responsive** - Works on all screen sizes
- ⚡ **TypeScript** - Full TypeScript support with comprehensive type definitions
- 🖼️ **Multiple Export Formats** - Export as Blob, Base64, or Data URL

## Installation

### npm

```bash
npm install react-image-cropper-pro
```

### yarn

```bash
yarn add react-image-cropper-pro
```

### pnpm

```bash
pnpm add react-image-cropper-pro
```

### Peer Dependencies

This package requires React 16.8.0 or higher (for hooks support).

```bash
npm install react react-dom
```

## Quick Start

### 1. Import the Component

```tsx
import React, { useRef } from 'react';
import { ImageCropper, ImageCropperRef } from 'react-image-cropper-pro';
import 'react-image-cropper-pro/styles';
```

### 2. Use in Your Component

```tsx
function App() {
  const cropperRef = useRef<ImageCropperRef>(null);

  return (
    <div style={{ width: '800px', height: '600px' }}>
      <ImageCropper
        ref={cropperRef}
        src="/path/to/image.jpg"
        aspectRatio={16 / 9}
      />
    </div>
  );
}
```

### 3. Get Cropped Image

```tsx
const handleCrop = async () => {
  if (cropperRef.current) {
    const blob = await cropperRef.current.getCroppedImageBlob();
    // Use the blob (upload, download, etc.)
  }
};
```

## Testing Locally

### Using the Test App (Recommended)

We've included a complete test application in the `test-app` directory:

```bash
# 1. Build the package
npm run build

# 2. Navigate to test app
cd test-app

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

The test app will open at `http://localhost:5173` and allows you to test all features interactively.

For more testing options, see [TESTING.md](./TESTING.md).

## Basic Usage

### Simple Image Cropper

```tsx
import React from 'react';
import { ImageCropper } from 'react-image-cropper-pro';
import 'react-image-cropper-pro/styles';

function SimpleCropper() {
  return (
    <div style={{ width: '800px', height: '600px' }}>
      <ImageCropper src="/image.jpg" />
    </div>
  );
}
```

### With Aspect Ratio

```tsx
<ImageCropper
  src="/image.jpg"
  aspectRatio={1} // Square crop
/>
```

### With Callbacks

```tsx
<ImageCropper
  src="/image.jpg"
  onCropChange={(crop) => {
    console.log('Crop area:', crop);
  }}
  onZoomChange={(zoom) => {
    console.log('Zoom level:', zoom);
  }}
  onRotationChange={(rotation) => {
    console.log('Rotation:', rotation);
  }}
/>
```

## API Reference

### ImageCropperProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **required** | Source image URL or base64 string |
| `initialCrop` | `CropArea` | `undefined` | Initial crop area |
| `aspectRatio` | `number \| null` | `null` | Aspect ratio (width/height). `null` for free aspect |
| `minWidth` | `number` | `50` | Minimum crop area width |
| `minHeight` | `number` | `50` | Minimum crop area height |
| `maxWidth` | `number` | `undefined` | Maximum crop area width |
| `maxHeight` | `number` | `undefined` | Maximum crop area height |
| `zoomable` | `boolean` | `true` | Enable zoom functionality |
| `rotatable` | `boolean` | `true` | Enable rotation functionality |
| `features` | `FeatureConfig` | `undefined` | Granular feature control |
| `zoom` | `number` | `1` | Initial zoom level (1 = 100%) |
| `rotation` | `number` | `0` | Initial rotation angle in degrees |
| `showGrid` | `boolean` | `true` | Show grid lines in crop area |
| `stylesDTO` | `Partial<ImageCropperStylesDTO>` | `undefined` | Styles DTO for programmatic styling |
| `containerStyle` | `CSSProperties` | `undefined` | Custom container style |
| `cropAreaStyle` | `CSSProperties` | `undefined` | Custom crop area style |
| `customClasses` | `CustomClasses` | `undefined` | Custom CSS classes |
| `customIds` | `CustomIds` | `undefined` | Custom IDs |
| `onCropChange` | `(crop: CropArea) => void` | `undefined` | Callback when crop area changes |
| `onZoomChange` | `(zoom: number) => void` | `undefined` | Callback when zoom changes |
| `onRotationChange` | `(rotation: number) => void` | `undefined` | Callback when rotation changes |
| `isBlobNeeded` | `boolean` | `false` | Enable automatic blob generation |
| `onCropBlob` | `(blob: Blob) => void` | `undefined` | Callback when blob is generated |
| `imageQuality` | `number` | `0.92` | Image quality for export (0-1) |
| `imageFormat` | `'image/png' \| 'image/jpeg' \| 'image/webp'` | `'image/jpeg'` | Image format for export |
| `disabled` | `boolean` | `false` | Disable the cropper |
| `className` | `string` | `''` | Custom class name (deprecated) |

### ImageCropperRef Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `getCrop()` | Get current crop area | `CropArea` |
| `getCroppedImageBlob()` | Get cropped image as Blob | `Promise<Blob>` |
| `getCroppedImageBase64()` | Get cropped image as base64 | `Promise<string>` |
| `getCroppedImageDataURL()` | Get cropped image as data URL | `Promise<string>` |
| `resetCrop()` | Reset crop area to initial | `void` |
| `setCrop(crop)` | Set crop area programmatically | `void` |
| `setZoom(zoom)` | Set zoom level (0.1 - 5) | `void` |
| `setRotation(rotation)` | Set rotation angle in degrees | `void` |
| `getContainerElement()` | Get container DOM element | `HTMLDivElement \| null` |
| `getImageElement()` | Get image DOM element | `HTMLImageElement \| null` |
| `getCropAreaElement()` | Get crop area DOM element | `HTMLDivElement \| null` |
| `setContainerClass(className)` | Set custom class on container | `void` |
| `setCropAreaClass(className)` | Set custom class on crop area | `void` |
| `getFeatures()` | Get current feature configuration | `FeatureConfig` |
| `setFeature(feature, enabled)` | Enable/disable specific feature | `void` |

### Type Definitions

#### CropArea

```typescript
interface CropArea {
  x: number;      // X position
  y: number;      // Y position
  width: number;  // Width
  height: number; // Height
}
```

#### FeatureConfig

```typescript
interface FeatureConfig {
  drag?: boolean;     // Enable/disable drag to move
  resize?: boolean;   // Enable/disable resize handles
  zoom?: boolean;     // Enable/disable zoom
  rotation?: boolean; // Enable/disable rotation
  grid?: boolean;     // Enable/disable grid lines
}
```

#### CustomClasses

```typescript
interface CustomClasses {
  container?: string;              // Custom class for container
  image?: string;                  // Custom class for image
  overlay?: string;                // Custom class for overlay
  cropArea?: string;               // Custom class for crop area
  handles?: string;                // Custom class for all handles
  handle?: (handle: string) => string; // Function for specific handle
}
```

#### CustomIds

```typescript
interface CustomIds {
  container?: string;                    // Custom ID for container
  image?: string;                       // Custom ID for image
  overlay?: string;                     // Custom ID for overlay
  cropArea?: string;                    // Custom ID for crop area
  handles?: (handle: string) => string; // Function for specific handle
}
```

## Examples

### Example 1: Square Crop (1:1 Aspect Ratio)

```tsx
import React, { useRef } from 'react';
import { ImageCropper, ImageCropperRef } from 'react-image-cropper-pro';
import 'react-image-cropper-pro/styles';

function SquareCropper() {
  const cropperRef = useRef<ImageCropperRef>(null);

  const handleSave = async () => {
    if (cropperRef.current) {
      const blob = await cropperRef.current.getCroppedImageBlob();
      // Use blob
    }
  };

  return (
    <div style={{ width: '600px', height: '600px' }}>
      <ImageCropper
        ref={cropperRef}
        src="/image.jpg"
        aspectRatio={1}
        minWidth={200}
        minHeight={200}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
```

### Example 2: 16:9 Aspect Ratio (Video Thumbnail)

```tsx
<ImageCropper
  src="/image.jpg"
  aspectRatio={16 / 9}
  minWidth={320}
  minHeight={180}
/>
```

### Example 3: Free Aspect Ratio

```tsx
<ImageCropper
  src="/image.jpg"
  aspectRatio={null} // or omit the prop
/>
```

### Example 4: Upload and Crop

```tsx
import React, { useState, useRef } from 'react';
import { ImageCropper, ImageCropperRef } from 'react-image-cropper-pro';
import 'react-image-cropper-pro/styles';

function UploadAndCrop() {
  const [imageSrc, setImageSrc] = useState<string>('');
  const cropperRef = useRef<ImageCropperRef>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = async () => {
    if (!cropperRef.current || !imageSrc) return;

    try {
      const blob = await cropperRef.current.getCroppedImageBlob();
      // Upload blob to server
      const formData = new FormData();
      formData.append('image', blob, 'cropped-image.jpg');
      
      await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imageSrc && (
        <div style={{ width: '800px', height: '600px', marginTop: '20px' }}>
          <ImageCropper
            ref={cropperRef}
            src={imageSrc}
            aspectRatio={1}
          />
          <button onClick={handleCrop} style={{ marginTop: '10px' }}>
            Crop and Upload
          </button>
        </div>
      )}
    </div>
  );
}
```

### Example 5: Download Cropped Image

```tsx
import React, { useRef } from 'react';
import { ImageCropper, ImageCropperRef } from 'react-image-cropper-pro';
import 'react-image-cropper-pro/styles';

function DownloadCropper() {
  const cropperRef = useRef<ImageCropperRef>(null);

  const handleDownload = async () => {
    if (!cropperRef.current) return;

    try {
      const blob = await cropperRef.current.getCroppedImageBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cropped-image.jpg';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div style={{ width: '800px', height: '600px' }}>
      <ImageCropper
        ref={cropperRef}
        src="/image.jpg"
        aspectRatio={1}
      />
      <button onClick={handleDownload}>Download</button>
    </div>
  );
}
```

### Example 6: Automatic Blob Generation

```tsx
import React, { useRef } from 'react';
import { ImageCropper, ImageCropperRef } from 'react-image-cropper-pro';
import 'react-image-cropper-pro/styles';

function AutoBlobCropper() {
  const cropperRef = useRef<ImageCropperRef>(null);

  const handleBlob = (blob: Blob) => {
    console.log('Blob generated:', blob.size, 'bytes');
    // Automatically upload or process blob
  };

  return (
    <div style={{ width: '800px', height: '600px' }}>
      <ImageCropper
        ref={cropperRef}
        src="/image.jpg"
        isBlobNeeded={true}
        onCropBlob={handleBlob}
        aspectRatio={1}
      />
    </div>
  );
}
```

### Example 7: Programmatic Control

```tsx
import React, { useRef, useEffect } from 'react';
import { ImageCropper, ImageCropperRef } from 'react-image-cropper-pro';
import 'react-image-cropper-pro/styles';

function ProgrammaticControl() {
  const cropperRef = useRef<ImageCropperRef>(null);

  useEffect(() => {
    // Set initial zoom and rotation after component mounts
    setTimeout(() => {
      if (cropperRef.current) {
        cropperRef.current.setZoom(1.5);
        cropperRef.current.setRotation(90);
        cropperRef.current.setCrop({
          x: 100,
          y: 100,
          width: 300,
          height: 300,
        });
      }
    }, 1000);
  }, []);

  const handleReset = () => {
    if (cropperRef.current) {
      cropperRef.current.resetCrop();
      cropperRef.current.setZoom(1);
      cropperRef.current.setRotation(0);
    }
  };

  return (
    <div style={{ width: '800px', height: '600px' }}>
      <ImageCropper
        ref={cropperRef}
        src="/image.jpg"
      />
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
```

### Example 8: Feature Configuration

```tsx
<ImageCropper
  src="/image.jpg"
  features={{
    drag: true,      // Enable drag to move
    resize: false,   // Disable resize handles
    zoom: true,      // Enable zoom
    rotation: false, // Disable rotation
    grid: true,      // Show grid lines
  }}
/>
```

### Example 9: Custom Styling with CSS

```tsx
<ImageCropper
  src="/image.jpg"
  containerStyle={{
    borderRadius: '8px',
    border: '2px solid #ccc',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  }}
  cropAreaStyle={{
    border: '3px solid #007bff',
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
  }}
/>
```

### Example 10: Custom Classes and IDs

```tsx
<ImageCropper
  src="/image.jpg"
  customClasses={{
    container: 'my-custom-container',
    image: 'my-custom-image',
    cropArea: 'my-custom-crop-area',
    handles: 'my-custom-handles',
    handle: (handle) => `handle-${handle}`,
  }}
  customIds={{
    container: 'image-cropper-container',
    image: 'cropper-image',
    cropArea: 'crop-area',
    handles: (handle) => `handle-${handle}`,
  }}
/>
```

### Example 11: Styles DTO

```tsx
import { ImageCropper, defaultStyles } from 'react-image-cropper-pro';
import 'react-image-cropper-pro/styles';

<ImageCropper
  src="/image.jpg"
  stylesDTO={{
    container: {
      ...defaultStyles.container,
      backgroundColor: '#1a1a1a',
    },
    handle: {
      ...defaultStyles.handle,
      border: '3px solid #ff6b6b',
      backgroundColor: '#fff',
    },
    cropArea: {
      ...defaultStyles.cropArea,
      border: '3px solid #4ecdc4',
    },
  }}
/>
```

### Example 12: Dynamic Feature Toggle

```tsx
import React, { useRef, useState } from 'react';
import { ImageCropper, ImageCropperRef } from 'react-image-cropper-pro';
import 'react-image-cropper-pro/styles';

function DynamicFeatures() {
  const cropperRef = useRef<ImageCropperRef>(null);
  const [resizeEnabled, setResizeEnabled] = useState(true);

  const toggleResize = () => {
    if (cropperRef.current) {
      cropperRef.current.setFeature('resize', !resizeEnabled);
      setResizeEnabled(!resizeEnabled);
    }
  };

  return (
    <div>
      <div style={{ width: '800px', height: '600px' }}>
        <ImageCropper
          ref={cropperRef}
          src="/image.jpg"
          features={{
            resize: resizeEnabled,
          }}
        />
      </div>
      <button onClick={toggleResize}>
        {resizeEnabled ? 'Disable' : 'Enable'} Resize
      </button>
    </div>
  );
}
```

## Advanced Features

### Styles DTO (Data Transfer Object)

The Styles DTO provides programmatic control over all component styles:

```tsx
import { ImageCropper, defaultStyles, mergeStyles } from 'react-image-cropper-pro';

// Use default styles
const styles = defaultStyles;

// Merge with custom styles
const customStyles = mergeStyles({
  container: {
    backgroundColor: '#000',
  },
  handle: {
    border: '3px solid red',
  },
});

<ImageCropper
  src="/image.jpg"
  stylesDTO={customStyles}
/>
```

### Automatic Blob Generation

Enable automatic blob generation that fires whenever the crop area changes:

```tsx
<ImageCropper
  src="/image.jpg"
  isBlobNeeded={true}
  onCropBlob={(blob) => {
    // Blob is automatically generated on every crop change
    console.log('New blob:', blob.size);
  }}
/>
```

### Programmatic Feature Control

Control features dynamically using ref methods:

```tsx
const cropperRef = useRef<ImageCropperRef>(null);

// Get current features
const features = cropperRef.current?.getFeatures();

// Toggle a feature
cropperRef.current?.setFeature('resize', false);
cropperRef.current?.setFeature('zoom', true);
```

## Styling Guide

### Method 1: CSS Classes

Import the default CSS and override with your own:

```css
/* Your custom CSS */
.image-cropper-container {
  border-radius: 8px;
  border: 2px solid #ccc;
}

.image-cropper-handle {
  border: 3px solid #007bff;
}
```

### Method 2: Inline Styles

Use `containerStyle` and `cropAreaStyle` props:

```tsx
<ImageCropper
  src="/image.jpg"
  containerStyle={{
    borderRadius: '8px',
    border: '2px solid #ccc',
  }}
  cropAreaStyle={{
    border: '3px solid #007bff',
  }}
/>
```

### Method 3: Styles DTO

Use the DTO for programmatic styling:

```tsx
import { defaultStyles } from 'react-image-cropper-pro';

<ImageCropper
  src="/image.jpg"
  stylesDTO={{
    container: { ...defaultStyles.container, backgroundColor: '#000' },
    handle: { ...defaultStyles.handle, border: '3px solid red' },
  }}
/>
```

### Method 4: Custom Classes

Add custom classes to specific elements:

```tsx
<ImageCropper
  src="/image.jpg"
  customClasses={{
    container: 'my-container',
    cropArea: 'my-crop-area',
    handle: (handle) => `handle-${handle}`,
  }}
/>
```

## Troubleshooting

### Image Not Loading

**Problem:** Image doesn't appear in the cropper.

**Solutions:**
- Check that the `src` prop is a valid URL or base64 string
- Ensure CORS is enabled if loading from a different domain
- Check browser console for errors

```tsx
// Use base64 for local images
const base64Image = 'data:image/jpeg;base64,/9j/4AAQSkZJRg...';
<ImageCropper src={base64Image} />
```

### Crop Area Not Visible

**Problem:** Can't see the crop area.

**Solutions:**
- Ensure the container has a defined width and height
- Check that `showGrid` is not conflicting with custom styles
- Verify overlay background color is not transparent

```tsx
<div style={{ width: '800px', height: '600px' }}>
  <ImageCropper src="/image.jpg" />
</div>
```

### Blob Generation Not Working

**Problem:** `onCropBlob` callback not firing.

**Solutions:**
- Ensure `isBlobNeeded` is set to `true`
- Check that `onCropBlob` callback is provided
- Verify image is loaded before cropping

```tsx
<ImageCropper
  src="/image.jpg"
  isBlobNeeded={true}  // Must be true
  onCropBlob={(blob) => {
    console.log('Blob:', blob);
  }}
/>
```

### Aspect Ratio Not Working

**Problem:** Aspect ratio constraint not applying.

**Solutions:**
- Ensure `aspectRatio` is a valid number (not 0 or negative)
- Check that min/max width/height don't conflict with aspect ratio
- Verify crop area is large enough for the aspect ratio

```tsx
<ImageCropper
  src="/image.jpg"
  aspectRatio={16 / 9}  // Valid ratio
  minWidth={320}
  minHeight={180}
/>
```

### TypeScript Errors

**Problem:** TypeScript compilation errors.

**Solutions:**
- Ensure React types are installed: `npm install @types/react`
- Check that you're using TypeScript 4.5 or higher
- Verify all imports are correct

```bash
npm install --save-dev @types/react @types/react-dom
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/faizan1699/npm-image-crop.git

# Install dependencies
npm install

# Build the package
npm run build

# Run tests (if available)
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:

1. Check the [Troubleshooting](#troubleshooting) section
2. Search existing [Issues](https://github.com/faizan1699/npm-image-crop/issues)
3. Create a new issue with:
   - Description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Code example (if applicable)

## Changelog

### Version 1.0.0

- Initial release
- Drag and resize functionality
- Zoom and rotation support
- Aspect ratio control
- Custom classes and IDs
- Styles DTO support
- Automatic blob generation
- Full TypeScript support

---

<div align="center">

**Made with ❤️ by [faizan1699](https://github.com/faizan1699)**

⭐ Star this repo if you find it helpful!

</div>
