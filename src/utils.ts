import { CropArea } from './types';

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Get the center point of a crop area
 */
export const getCropCenter = (crop: CropArea): { x: number; y: number } => {
  return {
    x: crop.x + crop.width / 2,
    y: crop.y + crop.height / 2,
  };
};

/**
 * Constrain crop area to boundaries
 */
export const constrainCrop = (
  crop: CropArea,
  containerWidth: number,
  containerHeight: number,
  minWidth?: number,
  minHeight?: number,
  maxWidth?: number,
  maxHeight?: number,
  aspectRatio?: number | null
): CropArea => {
  let { x, y, width, height } = crop;

  // Apply aspect ratio constraint
  if (aspectRatio !== null && aspectRatio !== undefined) {
    const currentAspect = width / height;
    if (currentAspect > aspectRatio) {
      height = width / aspectRatio;
    } else {
      width = height * aspectRatio;
    }
  }

  // Apply min/max constraints
  if (minWidth !== undefined) width = Math.max(width, minWidth);
  if (minHeight !== undefined) height = Math.max(height, minHeight);
  if (maxWidth !== undefined) width = Math.min(width, maxWidth);
  if (maxHeight !== undefined) height = Math.min(height, maxHeight);

  // Constrain to container bounds
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x + width > containerWidth) x = containerWidth - width;
  if (y + height > containerHeight) y = containerHeight - height;

  // Ensure crop area doesn't go outside bounds
  if (x < 0) {
    width += x;
    x = 0;
  }
  if (y < 0) {
    height += y;
    y = 0;
  }
  if (x + width > containerWidth) {
    width = containerWidth - x;
  }
  if (y + height > containerHeight) {
    height = containerHeight - y;
  }

  return { x, y, width, height };
};

/**
 * Calculate distance between two points
 */
export const getDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/**
 * Load image and return dimensions
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Get image dimensions
 */
export const getImageDimensions = (
  src: string
): Promise<{ width: number; height: number }> => {
  return loadImage(src).then((img) => ({
    width: img.width,
    height: img.height,
  }));
};

/**
 * Create a canvas element
 */
export const createCanvas = (
  width: number,
  height: number
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

/**
 * Rotate a point around a center
 */
export const rotatePoint = (
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  angle: number
): { x: number; y: number } => {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = x - centerX;
  const dy = y - centerY;
  return {
    x: centerX + dx * cos - dy * sin,
    y: centerY + dx * sin + dy * cos,
  };
};

