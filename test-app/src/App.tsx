import React, { useState, useRef } from 'react';
import { ImageCropper, ImageCropperRef } from 'react-image-cropper-pro';
import '../../dist/styles.css';
import './App.css';

function App() {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [croppedImage, setCroppedImage] = useState<string>('');
  const cropperRef = useRef<ImageCropperRef>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(1);
  const [isBlobNeeded, setIsBlobNeeded] = useState(false);
  const [cursorFollowCrop, setCursorFollowCrop] = useState(false);

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
      alert('Error cropping image. Please try again.');
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
      alert('Error downloading image. Please try again.');
    }
  };

  const handleReset = () => {
    if (cropperRef.current) {
      cropperRef.current.resetCrop();
      cropperRef.current.setZoom(1);
      cropperRef.current.setRotation(0);
    }
  };

  const handleBlob = (blob: Blob) => {
    console.log('Blob generated:', blob.size, 'bytes');
    // You can process the blob here
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🖼️ React Image Cropper Pro - Test App</h1>
        <p className="subtitle">Test all features of the image cropper component</p>

        <div className="controls">
          <div className="control-group">
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-input"
              />
              <button
                className="btn btn-primary"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                📁 Select Image
              </button>
            </label>
          </div>

          <div className="control-group">
            <label>
              Aspect Ratio:
              <select
                value={aspectRatio === null ? 'free' : aspectRatio.toString()}
                onChange={(e) =>
                  setAspectRatio(
                    e.target.value === 'free' ? null : parseFloat(e.target.value)
                  )
                }
              >
                <option value="free">Free</option>
                <option value="1">1:1 (Square)</option>
                <option value="16/9">16:9</option>
                <option value="4/3">4:3</option>
                <option value="3/2">3:2</option>
              </select>
            </label>
          </div>

          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={isBlobNeeded}
                onChange={(e) => setIsBlobNeeded(e.target.checked)}
              />
              Auto-generate Blob
            </label>
          </div>

          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={cursorFollowCrop}
                onChange={(e) => setCursorFollowCrop(e.target.checked)}
              />
              Cursor Follow Crop
            </label>
          </div>
        </div>

        {imageSrc ? (
          <div className="cropper-section">
            <div className="cropper-container">
              <h2>Image Cropper</h2>
              <div className="cropper-wrapper">
                <ImageCropper
                  ref={cropperRef}
                  src={imageSrc}
                  aspectRatio={aspectRatio}
                  isBlobNeeded={isBlobNeeded}
                  onCropBlob={handleBlob}
                  features={{
                    cursorFollowCrop: cursorFollowCrop,
                  }}
                  onCropChange={(crop) => {
                    console.log('Crop changed:', crop);
                  }}
                  onZoomChange={(zoom) => {
                    console.log('Zoom changed:', zoom);
                  }}
                  onRotationChange={(rotation) => {
                    console.log('Rotation changed:', rotation);
                  }}
                />
              </div>

              <div className="actions">
                <button className="btn btn-success" onClick={handleCrop}>
                  ✂️ Crop Image
                </button>
                <button className="btn btn-info" onClick={handleDownload}>
                  💾 Download
                </button>
                <button className="btn btn-warning" onClick={handleReset}>
                  🔄 Reset
                </button>
              </div>
            </div>

            {croppedImage && (
              <div className="result-container">
                <h2>Cropped Result</h2>
                <div className="result-image">
                  <img src={croppedImage} alt="Cropped" />
                </div>
                <p className="result-info">
                  Image cropped successfully! You can download it using the button above.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="placeholder">
            <div className="placeholder-content">
              <div className="placeholder-icon">📷</div>
              <h2>No Image Selected</h2>
              <p>Click the "Select Image" button above to start cropping</p>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>Features to Test:</h3>
          <ul>
            <li>✅ Drag the crop area to move it</li>
            <li>✅ Use resize handles (corners and edges) to resize</li>
            <li>✅ Try different aspect ratios</li>
            <li>✅ Check console for crop, zoom, and rotation callbacks</li>
            <li>✅ Test blob generation when enabled</li>
            <li>✅ Test cursor follow crop - crop area follows cursor movement</li>
            <li>✅ Download cropped images</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

