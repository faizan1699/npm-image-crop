import { CSSProperties } from 'react';
import { ImageCropperStylesDTO } from './styles.dto';

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FeatureConfig {
  /** Enable/disable drag to move crop area */
  drag?: boolean;
  /** Enable/disable resize handles */
  resize?: boolean;
  /** Enable/disable zoom functionality */
  zoom?: boolean;
  /** Enable/disable rotation functionality */
  rotation?: boolean;
  /** Enable/disable grid lines */
  grid?: boolean;
}

export interface CustomClasses {
  /** Custom class name for container */
  container?: string;
  /** Custom class name for image element */
  image?: string;
  /** Custom class name for overlay */
  overlay?: string;
  /** Custom class name for crop area */
  cropArea?: string;
  /** Custom class name for resize handles */
  handles?: string;
  /** Custom class name for specific handle (nw, ne, sw, se, n, s, w, e) */
  handle?: (handle: string) => string;
}

export interface CustomIds {
  /** Custom ID for container */
  container?: string;
  /** Custom ID for image element */
  image?: string;
  /** Custom ID for overlay */
  overlay?: string;
  /** Custom ID for crop area */
  cropArea?: string;
  /** Custom ID for resize handles */
  handles?: (handle: string) => string;
}

export interface ImageCropperProps {
  /** Source image URL or base64 string */
  src: string;
  /** Initial crop area */
  initialCrop?: CropArea;
  /** Aspect ratio (width/height). Set to null for free aspect */
  aspectRatio?: number | null;
  /** Minimum crop area width */
  minWidth?: number;
  /** Minimum crop area height */
  minHeight?: number;
  /** Maximum crop area width */
  maxWidth?: number;
  /** Maximum crop area height */
  maxHeight?: number;
  /** Enable zoom functionality */
  zoomable?: boolean;
  /** Enable rotation functionality */
  rotatable?: boolean;
  /** Feature configuration for granular control */
  features?: FeatureConfig;
  /** Zoom level (1 = 100%) */
  zoom?: number;
  /** Rotation angle in degrees */
  rotation?: number;
  /** Grid lines visibility */
  showGrid?: boolean;
  /** Custom container style */
  containerStyle?: CSSProperties;
  /** Custom crop area style */
  cropAreaStyle?: CSSProperties;
  /** Styles DTO for programmatic style control */
  stylesDTO?: Partial<ImageCropperStylesDTO>;
  /** Custom classes for different elements */
  customClasses?: CustomClasses;
  /** Custom IDs for different elements */
  customIds?: CustomIds;
  /** Callback when crop area changes */
  onCropChange?: (crop: CropArea) => void;
  /** Callback when zoom changes */
  onZoomChange?: (zoom: number) => void;
  /** Callback when rotation changes */
  onRotationChange?: (rotation: number) => void;
  /** Enable automatic blob generation on crop change */
  isBlobNeeded?: boolean;
  /** Callback when blob is generated (fires when isBlobNeeded is true) */
  onCropBlob?: (blob: Blob) => void;
  /** Image quality for export (0-1) */
  imageQuality?: number;
  /** Image format for export */
  imageFormat?: 'image/png' | 'image/jpeg' | 'image/webp';
  /** Disable the cropper */
  disabled?: boolean;
  /** Custom class name (deprecated: use customClasses.container instead) */
  className?: string;
}

export interface ImageCropperRef {
  /** Get current crop area */
  getCrop: () => CropArea;
  /** Get cropped image as blob */
  getCroppedImageBlob: () => Promise<Blob>;
  /** Get cropped image as base64 */
  getCroppedImageBase64: () => Promise<string>;
  /** Get cropped image as data URL */
  getCroppedImageDataURL: () => Promise<string>;
  /** Reset crop area to initial */
  resetCrop: () => void;
  /** Set crop area programmatically */
  setCrop: (crop: CropArea) => void;
  /** Set zoom level */
  setZoom: (zoom: number) => void;
  /** Set rotation angle */
  setRotation: (rotation: number) => void;
  /** Get container element */
  getContainerElement: () => HTMLDivElement | null;
  /** Get image element */
  getImageElement: () => HTMLImageElement | null;
  /** Get crop area element */
  getCropAreaElement: () => HTMLDivElement | null;
  /** Set custom class on container */
  setContainerClass: (className: string) => void;
  /** Set custom class on crop area */
  setCropAreaClass: (className: string) => void;
  /** Get current feature configuration */
  getFeatures: () => FeatureConfig;
  /** Enable/disable specific feature */
  setFeature: (feature: keyof FeatureConfig, enabled: boolean) => void;
}

