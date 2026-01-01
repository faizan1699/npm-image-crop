/**
 * Styles DTO (Data Transfer Object) for Image Cropper
 * Provides programmatic access to CSS styles
 */

import { CSSProperties } from 'react';

export interface ImageCropperStylesDTO {
  container: CSSProperties;
  overlay: CSSProperties;
  cropArea: CSSProperties;
  cropAreaActive: CSSProperties;
  handle: CSSProperties;
  handleHover: CSSProperties;
  handleNW: CSSProperties;
  handleNE: CSSProperties;
  handleSW: CSSProperties;
  handleSE: CSSProperties;
  handleN: CSSProperties;
  handleS: CSSProperties;
  handleW: CSSProperties;
  handleE: CSSProperties;
}

export const defaultStyles: ImageCropperStylesDTO = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    userSelect: 'none',
    backgroundColor: '#f0f0f0',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  cropArea: {
    position: 'absolute',
    border: '2px solid #fff',
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
    cursor: 'move',
    pointerEvents: 'auto',
  },
  cropAreaActive: {
    cursor: 'grabbing',
  },
  handle: {
    position: 'absolute',
    width: '10px',
    height: '10px',
    backgroundColor: '#fff',
    border: '2px solid #007bff',
    borderRadius: '50%',
    pointerEvents: 'auto',
    zIndex: 10,
    transition: 'transform 0.1s ease',
  } as CSSProperties,
  handleHover: {
    transform: 'scale(1.2)',
  } as CSSProperties,
  handleNW: {
    top: '-5px',
    left: '-5px',
    cursor: 'nw-resize',
  },
  handleNE: {
    top: '-5px',
    right: '-5px',
    cursor: 'ne-resize',
  },
  handleSW: {
    bottom: '-5px',
    left: '-5px',
    cursor: 'sw-resize',
  },
  handleSE: {
    bottom: '-5px',
    right: '-5px',
    cursor: 'se-resize',
  },
  handleN: {
    top: '-5px',
    left: '50%',
    transform: 'translateX(-50%)',
    cursor: 'n-resize',
  },
  handleS: {
    bottom: '-5px',
    left: '50%',
    transform: 'translateX(-50%)',
    cursor: 's-resize',
  },
  handleW: {
    left: '-5px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'w-resize',
  },
  handleE: {
    right: '-5px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'e-resize',
  },
};

/**
 * Merge custom styles with default styles
 */
export const mergeStyles = (
  customStyles?: Partial<ImageCropperStylesDTO>
): ImageCropperStylesDTO => {
  if (!customStyles) {
    return defaultStyles;
  }

  return {
    container: { ...defaultStyles.container, ...customStyles.container },
    overlay: { ...defaultStyles.overlay, ...customStyles.overlay },
    cropArea: { ...defaultStyles.cropArea, ...customStyles.cropArea },
    cropAreaActive: {
      ...defaultStyles.cropAreaActive,
      ...customStyles.cropAreaActive,
    },
    handle: { ...defaultStyles.handle, ...customStyles.handle },
    handleHover: { ...defaultStyles.handleHover, ...customStyles.handleHover },
    handleNW: { ...defaultStyles.handleNW, ...customStyles.handleNW },
    handleNE: { ...defaultStyles.handleNE, ...customStyles.handleNE },
    handleSW: { ...defaultStyles.handleSW, ...customStyles.handleSW },
    handleSE: { ...defaultStyles.handleSE, ...customStyles.handleSE },
    handleN: { ...defaultStyles.handleN, ...customStyles.handleN },
    handleS: { ...defaultStyles.handleS, ...customStyles.handleS },
    handleW: { ...defaultStyles.handleW, ...customStyles.handleW },
    handleE: { ...defaultStyles.handleE, ...customStyles.handleE },
  };
};

