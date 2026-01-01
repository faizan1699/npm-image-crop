/**
 * Example usage of React Image Cropper Pro
 * 
 * This is a simple example demonstrating how to use the ImageCropper component.
 * Copy this code to your React app to get started.
 */

import React, { useRef, useState } from 'react';
import { ImageCropper, ImageCropperRef } from './src/index';
import './src/styles.css';

function Example() {
  const cropperRef = useRef<ImageCropperRef>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [croppedImage, setCroppedImage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setCroppedImage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = async () => {
    if (!cropperRef.current || !imageSrc) return;

    try {
      const base64 = await cropperRef.current.getCroppedImageBase64();
      setCroppedImage(base64);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>React Image Cropper Pro - Example</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: '10px' }}
        />
      </div>

      {imageSrc && (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '400px' }}>
            <h2>Cropper</h2>
            <div
              style={{
                width: '100%',
                height: '500px',
                border: '2px solid #ccc',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <ImageCropper
                ref={cropperRef}
                src={imageSrc}
                aspectRatio={1}
                minWidth={200}
                minHeight={200}
                showGrid={true}
                onCropChange={(crop) => {
                  console.log('Crop area:', crop);
                }}
              />
            </div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button onClick={handleCrop} style={{ padding: '10px 20px' }}>
                Crop Image
              </button>
              <button onClick={handleDownload} style={{ padding: '10px 20px' }}>
                Download
              </button>
            </div>
          </div>

          {croppedImage && (
            <div style={{ flex: '1', minWidth: '400px' }}>
              <h2>Cropped Result</h2>
              <img
                src={croppedImage}
                alt="Cropped"
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  border: '2px solid #ccc',
                  borderRadius: '8px',
                }}
              />
            </div>
          )}
        </div>
      )}

      {!imageSrc && (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            border: '2px dashed #ccc',
            borderRadius: '8px',
            color: '#666',
          }}
        >
          Please select an image to start cropping
        </div>
      )}
    </div>
  );
}

export default Example;

