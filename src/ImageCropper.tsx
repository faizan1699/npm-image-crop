import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  ImageCropperProps,
  ImageCropperRef,
  CropArea,
  FeatureConfig,
} from './types';
import {
  clamp,
  constrainCrop,
  loadImage,
  createCanvas,
  rotatePoint,
} from './utils';
import { mergeStyles, defaultStyles } from './styles.dto';
import './styles.css';

const ImageCropper = forwardRef<ImageCropperRef, ImageCropperProps>(
  (
    {
      src,
      initialCrop,
      aspectRatio = null,
      minWidth = 50,
      minHeight = 50,
      maxWidth,
      maxHeight,
      zoomable = true,
      rotatable = true,
      features,
      zoom: initialZoom = 1,
      rotation: initialRotation = 0,
      showGrid = true,
      containerStyle,
      cropAreaStyle,
      stylesDTO,
      customClasses,
      customIds,
      onCropChange,
      onZoomChange,
      onRotationChange,
      isBlobNeeded = false,
      onCropBlob,
      imageQuality = 0.92,
      imageFormat = 'image/jpeg',
      disabled = false,
      className = '',
    },
    ref
  ) => {
    // Merge styles DTO with defaults
    const styles = mergeStyles(stylesDTO);
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const cropAreaRef = useRef<HTMLDivElement>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [containerDimensions, setContainerDimensions] = useState({
      width: 0,
      height: 0,
    });
    const [crop, setCrop] = useState<CropArea>(() => {
      if (initialCrop) return initialCrop;
      return { x: 0, y: 0, width: 0, height: 0 };
    });
    const [zoom, setZoom] = useState(initialZoom);
    const [rotation, setRotation] = useState(initialRotation);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isCreatingCrop, setIsCreatingCrop] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeHandle, setResizeHandle] = useState<string | null>(null);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [freehandPath, setFreehandPath] = useState<Array<{ x: number; y: number }>>([]);
    const [isDrawingFreehand, setIsDrawingFreehand] = useState(false);
    const [freehandCanvasRef, setFreehandCanvasRef] = useState<HTMLCanvasElement | null>(null);
    const [featureConfig, setFeatureConfig] = useState<FeatureConfig>(() => {
      // Merge features prop with defaults, respecting zoomable/rotatable for backward compatibility
      return {
        drag: features?.drag ?? true,
        resize: features?.resize ?? true,
        zoom: features?.zoom ?? zoomable,
        rotation: features?.rotation ?? rotatable,
        grid: features?.grid ?? showGrid,
        freeStyleCrop: features?.freeStyleCrop ?? true, // Enable by default
        cursorFollowCrop: features?.cursorFollowCrop ?? false, // Disable by default
        photoshopStyleSelection: features?.photoshopStyleSelection ?? false, // Disable by default
        freehandSelection: features?.freehandSelection ?? false, // Disable by default
      };
    });

    // Update feature config when props change
    useEffect(() => {
      setFeatureConfig({
        drag: features?.drag ?? true,
        resize: features?.resize ?? true,
        zoom: features?.zoom ?? zoomable,
        rotation: features?.rotation ?? rotatable,
        grid: features?.grid ?? showGrid,
        freeStyleCrop: features?.freeStyleCrop ?? true,
        cursorFollowCrop: features?.cursorFollowCrop ?? false,
        photoshopStyleSelection: features?.photoshopStyleSelection ?? false,
        freehandSelection: features?.freehandSelection ?? false,
      });
    }, [features, zoomable, rotatable, showGrid]);

    // Load image and get dimensions
    useEffect(() => {
      loadImage(src)
        .then((img) => {
          setImageDimensions({ width: img.width, height: img.height });
          setImageLoaded(true);
        })
        .catch((error) => {
          console.error('Failed to load image:', error);
        });
    }, [src]);

    // Update container dimensions
    useEffect(() => {
      const updateDimensions = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setContainerDimensions({ width: rect.width, height: rect.height });
        }
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Initialize crop area
    useEffect(() => {
      if (imageLoaded && containerDimensions.width > 0 && containerDimensions.height > 0) {
        const defaultCrop: CropArea = initialCrop || {
          x: containerDimensions.width * 0.1,
          y: containerDimensions.height * 0.1,
          width: containerDimensions.width * 0.8,
          height: containerDimensions.height * 0.8,
        };

        const constrainedCrop = constrainCrop(
          defaultCrop,
          containerDimensions.width,
          containerDimensions.height,
          minWidth,
          minHeight,
          maxWidth,
          maxHeight,
          aspectRatio
        );

        setCrop(constrainedCrop);
        if (onCropChange) {
          onCropChange(constrainedCrop);
        }
      }
    }, [
      imageLoaded,
      containerDimensions,
      initialCrop,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      aspectRatio,
      onCropChange,
    ]);

    // Update crop when constraints change
    useEffect(() => {
      if (crop.width > 0 && crop.height > 0) {
        const constrainedCrop = constrainCrop(
          crop,
          containerDimensions.width,
          containerDimensions.height,
          minWidth,
          minHeight,
          maxWidth,
          maxHeight,
          aspectRatio
        );
        setCrop(constrainedCrop);
      }
    }, [aspectRatio, minWidth, minHeight, maxWidth, maxHeight]);

    // Handle mouse down for dragging
    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (disabled) return;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicking on resize handle (only if resize is enabled)
        if (featureConfig.resize) {
          const handleSize = 10;
          const handles = {
            nw: { x: crop.x, y: crop.y },
            ne: { x: crop.x + crop.width, y: crop.y },
            sw: { x: crop.x, y: crop.y + crop.height },
            se: { x: crop.x + crop.width, y: crop.y + crop.height },
            n: { x: crop.x + crop.width / 2, y: crop.y },
            s: { x: crop.x + crop.width / 2, y: crop.y + crop.height },
            w: { x: crop.x, y: crop.y + crop.height / 2 },
            e: { x: crop.x + crop.width, y: crop.y + crop.height / 2 },
          };

          for (const [handle, pos] of Object.entries(handles)) {
            if (
              Math.abs(x - pos.x) < handleSize &&
              Math.abs(y - pos.y) < handleSize
            ) {
              setIsResizing(true);
              setResizeHandle(handle);
              setDragStart({ x, y });
              return;
            }
          }
        }

        // Check if clicking inside crop area (only if drag is enabled)
        if (
          featureConfig.drag &&
          x >= crop.x &&
          x <= crop.x + crop.width &&
          y >= crop.y &&
          y <= crop.y + crop.height
        ) {
          setIsDragging(true);
          setDragStart({ x: x - crop.x, y: y - crop.y });
          return;
        }

        // Photoshop-style selection or Free-style crop: Click and drag anywhere to create new crop area
        if (featureConfig.photoshopStyleSelection || featureConfig.freeStyleCrop) {
          setIsCreatingCrop(true);
          setDragStart({ x, y });
          // Create initial crop area at click position
          const newCrop: CropArea = {
            x,
            y,
            width: 0,
            height: 0,
          };
          setCrop(newCrop);
        }
      },
      [crop, disabled, featureConfig]
    );

    // Handle mouse move
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (disabled) return;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Freehand selection: Add points to path while drawing
        if (isDrawingFreehand && featureConfig.freehandSelection) {
          setFreehandPath((prev) => {
            // Only add point if it's significantly different from last point (for performance)
            if (prev.length === 0 || 
                Math.abs(prev[prev.length - 1].x - x) > 2 || 
                Math.abs(prev[prev.length - 1].y - y) > 2) {
              return [...prev, { x, y }];
            }
            return prev;
          });
          return;
        }

        // Cursor follow crop feature - crop area follows cursor movement
        if (featureConfig.cursorFollowCrop && !isDragging && !isResizing && !isCreatingCrop && !isDrawingFreehand && crop.width > 0 && crop.height > 0) {
          let newCrop: CropArea = {
            x: x - crop.width / 2,
            y: y - crop.height / 2,
            width: crop.width,
            height: crop.height,
          };

          newCrop = constrainCrop(
            newCrop,
            containerDimensions.width,
            containerDimensions.height,
            minWidth,
            minHeight,
            maxWidth,
            maxHeight,
            aspectRatio
          );

          setCrop(newCrop);
          if (onCropChange) {
            onCropChange(newCrop);
          }
          return; // Don't process other mouse move events when cursor follow is active
        }

        if (isCreatingCrop) {
          // Create crop area while dragging
          const startX = Math.min(dragStart.x, x);
          const startY = Math.min(dragStart.y, y);
          const width = Math.abs(x - dragStart.x);
          const height = Math.abs(y - dragStart.y);

          let newCrop: CropArea = {
            x: startX,
            y: startY,
            width: width,
            height: height,
          };

          // Apply aspect ratio if set
          if (aspectRatio !== null && aspectRatio !== undefined && width > 0 && height > 0) {
            const currentAspect = width / height;
            if (currentAspect > aspectRatio) {
              newCrop.height = width / aspectRatio;
            } else {
              newCrop.width = height * aspectRatio;
            }
          }

          // Ensure minimum size
          if (newCrop.width < minWidth) {
            newCrop.width = minWidth;
            if (aspectRatio) {
              newCrop.height = minWidth / aspectRatio;
            }
          }
          if (newCrop.height < minHeight) {
            newCrop.height = minHeight;
            if (aspectRatio) {
              newCrop.width = minHeight * aspectRatio;
            }
          }

          newCrop = constrainCrop(
            newCrop,
            containerDimensions.width,
            containerDimensions.height,
            minWidth,
            minHeight,
            maxWidth,
            maxHeight,
            aspectRatio
          );

          setCrop(newCrop);
          if (onCropChange) {
            onCropChange(newCrop);
          }
        } else if (isDragging) {
          let newCrop: CropArea = {
            x: x - dragStart.x,
            y: y - dragStart.y,
            width: crop.width,
            height: crop.height,
          };

          newCrop = constrainCrop(
            newCrop,
            containerDimensions.width,
            containerDimensions.height,
            minWidth,
            minHeight,
            maxWidth,
            maxHeight,
            aspectRatio
          );

          setCrop(newCrop);
          if (onCropChange) {
            onCropChange(newCrop);
          }
        } else if (isResizing && resizeHandle) {
          let newCrop = { ...crop };
          const deltaX = x - dragStart.x;
          const deltaY = y - dragStart.y;

          switch (resizeHandle) {
            case 'nw':
              newCrop.x = crop.x + deltaX;
              newCrop.y = crop.y + deltaY;
              newCrop.width = crop.width - deltaX;
              newCrop.height = crop.height - deltaY;
              break;
            case 'ne':
              newCrop.y = crop.y + deltaY;
              newCrop.width = crop.width + deltaX;
              newCrop.height = crop.height - deltaY;
              break;
            case 'sw':
              newCrop.x = crop.x + deltaX;
              newCrop.width = crop.width - deltaX;
              newCrop.height = crop.height + deltaY;
              break;
            case 'se':
              newCrop.width = crop.width + deltaX;
              newCrop.height = crop.height + deltaY;
              break;
            case 'n':
              newCrop.y = crop.y + deltaY;
              newCrop.height = crop.height - deltaY;
              break;
            case 's':
              newCrop.height = crop.height + deltaY;
              break;
            case 'w':
              newCrop.x = crop.x + deltaX;
              newCrop.width = crop.width - deltaX;
              break;
            case 'e':
              newCrop.width = crop.width + deltaX;
              break;
          }

          // Apply aspect ratio
          if (aspectRatio !== null && aspectRatio !== undefined) {
            const currentAspect = newCrop.width / newCrop.height;
            if (currentAspect > aspectRatio) {
              newCrop.height = newCrop.width / aspectRatio;
            } else {
              newCrop.width = newCrop.height * aspectRatio;
            }
          }

          // Ensure minimum size
          if (newCrop.width < minWidth) {
            newCrop.width = minWidth;
            if (aspectRatio) {
              newCrop.height = minWidth / aspectRatio;
            }
          }
          if (newCrop.height < minHeight) {
            newCrop.height = minHeight;
            if (aspectRatio) {
              newCrop.width = minHeight * aspectRatio;
            }
          }

          newCrop = constrainCrop(
            newCrop,
            containerDimensions.width,
            containerDimensions.height,
            minWidth,
            minHeight,
            maxWidth,
            maxHeight,
            aspectRatio
          );

          setCrop(newCrop);
          if (onCropChange) {
            onCropChange(newCrop);
          }
          setDragStart({ x, y });
        }
      };

      const handleMouseUp = () => {
        // Freehand selection: Close path and convert to crop area
        if (isDrawingFreehand && featureConfig.freehandSelection && freehandPath.length > 2) {
          // Calculate bounding box from freehand path
          const xs = freehandPath.map(p => p.x);
          const ys = freehandPath.map(p => p.y);
          const minX = Math.min(...xs);
          const maxX = Math.max(...xs);
          const minY = Math.min(...ys);
          const maxY = Math.max(...ys);

          const newCrop: CropArea = {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
          };

          // Apply constraints
          let finalCrop = constrainCrop(
            newCrop,
            containerDimensions.width,
            containerDimensions.height,
            minWidth,
            minHeight,
            maxWidth,
            maxHeight,
            aspectRatio
          );

          setCrop(finalCrop);
          setFreehandPath([]);
          setIsDrawingFreehand(false);
          if (onCropChange) {
            onCropChange(finalCrop);
          }
          return;
        }

        // For Photoshop-style selection, apply constraints after mouse up
        if (isCreatingCrop && featureConfig.photoshopStyleSelection && crop.width > 0 && crop.height > 0) {
          let finalCrop = { ...crop };
          
          // Apply aspect ratio if set (after selection is complete)
          if (aspectRatio !== null && aspectRatio !== undefined) {
            const currentAspect = finalCrop.width / finalCrop.height;
            if (currentAspect > aspectRatio) {
              finalCrop.height = finalCrop.width / aspectRatio;
            } else {
              finalCrop.width = finalCrop.height * aspectRatio;
            }
          }

          // Ensure minimum size
          if (finalCrop.width < minWidth) {
            finalCrop.width = minWidth;
            if (aspectRatio) {
              finalCrop.height = minWidth / aspectRatio;
            }
          }
          if (finalCrop.height < minHeight) {
            finalCrop.height = minHeight;
            if (aspectRatio) {
              finalCrop.width = minHeight * aspectRatio;
            }
          }

          // Final constraint
          finalCrop = constrainCrop(
            finalCrop,
            containerDimensions.width,
            containerDimensions.height,
            minWidth,
            minHeight,
            maxWidth,
            maxHeight,
            aspectRatio
          );

          setCrop(finalCrop);
          if (onCropChange) {
            onCropChange(finalCrop);
          }
        }

        setIsDragging(false);
        setIsResizing(false);
        setIsCreatingCrop(false);
        setIsDrawingFreehand(false);
        setResizeHandle(null);
      };

      if (isDragging || isResizing || isCreatingCrop || isDrawingFreehand) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [
      isDragging,
      isResizing,
      isCreatingCrop,
      resizeHandle,
      dragStart,
      crop,
      containerDimensions,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      aspectRatio,
      onCropChange,
      disabled,
      featureConfig.freeStyleCrop,
      featureConfig.cursorFollowCrop,
      featureConfig.photoshopStyleSelection,
      featureConfig.freehandSelection,
      freehandPath,
      minWidth,
      minHeight,
    ]);

    // Handle zoom
    const handleZoom = useCallback(
      (delta: number) => {
        if (!featureConfig.zoom || disabled) return;
        const newZoom = clamp(zoom + delta, 0.1, 5);
        setZoom(newZoom);
        if (onZoomChange) {
          onZoomChange(newZoom);
        }
      },
      [zoom, featureConfig.zoom, disabled, onZoomChange]
    );

    // Handle rotation
    const handleRotation = useCallback(
      (delta: number) => {
        if (!featureConfig.rotation || disabled) return;
        const newRotation = (rotation + delta) % 360;
        setRotation(newRotation);
        if (onRotationChange) {
          onRotationChange(newRotation);
        }
      },
      [rotation, featureConfig.rotation, disabled, onRotationChange]
    );

    // Get cropped image
    const getCroppedImage = useCallback(async (): Promise<HTMLCanvasElement> => {
      const img = await loadImage(src);
      const canvas = createCanvas(crop.width, crop.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      // Calculate source coordinates accounting for zoom and rotation
      const scaleX = imageDimensions.width / containerDimensions.width;
      const scaleY = imageDimensions.height / containerDimensions.height;
      const sourceX = (crop.x * scaleX) / zoom;
      const sourceY = (crop.y * scaleY) / zoom;
      const sourceWidth = (crop.width * scaleX) / zoom;
      const sourceHeight = (crop.height * scaleY) / zoom;

      if (rotation !== 0) {
        // For rotation, we need to draw on a larger canvas first
        const tempCanvas = createCanvas(
          Math.max(img.width, img.height) * 2,
          Math.max(img.width, img.height) * 2
        );
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) throw new Error('Failed to get temp canvas context');

        const centerX = tempCanvas.width / 2;
        const centerY = tempCanvas.height / 2;

        tempCtx.translate(centerX, centerY);
        tempCtx.rotate((rotation * Math.PI) / 180);
        tempCtx.drawImage(
          img,
          -img.width / 2,
          -img.height / 2,
          img.width,
          img.height
        );
        tempCtx.setTransform(1, 0, 0, 1, 0, 0);

        // Now crop from the rotated image
        ctx.drawImage(
          tempCanvas,
          centerX + sourceX - img.width / 2,
          centerY + sourceY - img.height / 2,
          sourceWidth,
          sourceHeight,
          0,
          0,
          crop.width,
          crop.height
        );
      } else {
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          crop.width,
          crop.height
        );
      }

      return canvas;
    }, [src, crop, zoom, rotation, imageDimensions, containerDimensions]);

    // Generate blob from cropped image
    const generateBlob = useCallback(async (): Promise<Blob | null> => {
      if (!imageLoaded || crop.width === 0 || crop.height === 0) {
        return null;
      }

      try {
        const canvas = await getCroppedImage();
        return new Promise((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to create blob'));
              }
            },
            imageFormat,
            imageQuality
          );
        });
      } catch (error) {
        console.error('Error generating blob:', error);
        return null;
      }
    }, [imageLoaded, crop, getCroppedImage, imageFormat, imageQuality]);

    // Handle crop change with blob generation
    const handleCropChange = useCallback(
      async (newCrop: CropArea) => {
        if (onCropChange) {
          onCropChange(newCrop);
        }

        // Generate blob if needed
        if (isBlobNeeded && onCropBlob) {
          const blob = await generateBlob();
          if (blob) {
            onCropBlob(blob);
          }
        }
      },
      [onCropChange, isBlobNeeded, onCropBlob, generateBlob]
    );

    // Generate blob when crop changes and isBlobNeeded is true
    useEffect(() => {
      if (isBlobNeeded && onCropBlob && imageLoaded && crop.width > 0 && crop.height > 0) {
        generateBlob().then((blob) => {
          if (blob) {
            onCropBlob(blob);
          }
        });
      }
    }, [crop, isBlobNeeded, onCropBlob, imageLoaded, generateBlob]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getCrop: () => crop,
      getCroppedImageBlob: async () => {
        const canvas = await getCroppedImage();
        return new Promise((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Failed to create blob'));
            },
            imageFormat,
            imageQuality
          );
        });
      },
      getCroppedImageBase64: async () => {
        const canvas = await getCroppedImage();
        return canvas.toDataURL(imageFormat, imageQuality);
      },
      getCroppedImageDataURL: async () => {
        const canvas = await getCroppedImage();
        return canvas.toDataURL(imageFormat, imageQuality);
      },
      resetCrop: () => {
        if (containerDimensions.width > 0 && containerDimensions.height > 0) {
          const defaultCrop: CropArea = {
            x: containerDimensions.width * 0.1,
            y: containerDimensions.height * 0.1,
            width: containerDimensions.width * 0.8,
            height: containerDimensions.height * 0.8,
          };
          const constrainedCrop = constrainCrop(
            defaultCrop,
            containerDimensions.width,
            containerDimensions.height,
            minWidth,
            minHeight,
            maxWidth,
            maxHeight,
            aspectRatio
          );
          setCrop(constrainedCrop);
          handleCropChange(constrainedCrop);
        }
      },
      setCrop: (newCrop: CropArea) => {
        const constrainedCrop = constrainCrop(
          newCrop,
          containerDimensions.width,
          containerDimensions.height,
          minWidth,
          minHeight,
          maxWidth,
          maxHeight,
          aspectRatio
        );
        setCrop(constrainedCrop);
        if (onCropChange) {
          onCropChange(constrainedCrop);
        }
      },
      setZoom: (newZoom: number) => {
        const clampedZoom = clamp(newZoom, 0.1, 5);
        setZoom(clampedZoom);
        if (onZoomChange) {
          onZoomChange(clampedZoom);
        }
      },
      setRotation: (newRotation: number) => {
        setRotation(newRotation % 360);
        if (onRotationChange) {
          onRotationChange(newRotation % 360);
        }
      },
      getContainerElement: () => containerRef.current,
      getImageElement: () => imageRef.current,
      getCropAreaElement: () => cropAreaRef.current,
      setContainerClass: (className: string) => {
        if (containerRef.current) {
          containerRef.current.className = `image-cropper-container ${className}`;
        }
      },
      setCropAreaClass: (className: string) => {
        if (cropAreaRef.current) {
          cropAreaRef.current.className = `image-cropper-crop-area ${className}`;
        }
      },
      getFeatures: () => featureConfig,
      setFeature: (feature: keyof FeatureConfig, enabled: boolean) => {
        setFeatureConfig((prev) => ({
          ...prev,
          [feature]: enabled,
        }));
      },
    }));

    const imageStyle: React.CSSProperties = {
      transform: `scale(${zoom}) rotate(${rotation}deg)`,
      transformOrigin: 'center center',
      transition: isDragging || isResizing || isCreatingCrop ? 'none' : 'transform 0.1s',
    };

    // Build class names
    const containerClassName = [
      'image-cropper-container',
      customClasses?.container || className,
    ]
      .filter(Boolean)
      .join(' ');

    const imageClassName = customClasses?.image || '';

    const overlayClassName = customClasses?.overlay || 'image-cropper-overlay';

    const cropAreaClassName = [
      'image-cropper-crop-area',
      customClasses?.cropArea,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={containerRef}
        id={customIds?.container}
        className={containerClassName}
        style={{
          ...styles.container,
          ...containerStyle,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => {
          if (featureConfig.cursorFollowCrop && !isDragging && !isResizing && !isCreatingCrop) {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              setCursorPosition({ x, y });
              
              // Update crop area to follow cursor
              if (crop.width > 0 && crop.height > 0) {
                let newCrop: CropArea = {
                  x: x - crop.width / 2,
                  y: y - crop.height / 2,
                  width: crop.width,
                  height: crop.height,
                };

                newCrop = constrainCrop(
                  newCrop,
                  containerDimensions.width,
                  containerDimensions.height,
                  minWidth,
                  minHeight,
                  maxWidth,
                  maxHeight,
                  aspectRatio
                );

                setCrop(newCrop);
                if (onCropChange) {
                  onCropChange(newCrop);
                }
              }
            }
          }
        }}
      >
        <img
          ref={imageRef}
          id={customIds?.image}
          className={imageClassName}
          src={src}
          alt="Crop"
          style={{
            ...imageStyle,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: imageLoaded ? 'block' : 'none',
          }}
          onLoad={() => setImageLoaded(true)}
          draggable={false}
        />

        {imageLoaded && (
          <>
            {/* Crop overlay */}
            <div
              id={customIds?.overlay}
              className={overlayClassName}
              style={{
                ...styles.overlay,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                pointerEvents: (featureConfig.freeStyleCrop || featureConfig.photoshopStyleSelection || featureConfig.freehandSelection) ? 'auto' : 'none',
                cursor: featureConfig.freehandSelection ? 'crosshair' : (featureConfig.photoshopStyleSelection ? 'crosshair' : 'default'),
              }}
              onMouseDown={(featureConfig.freeStyleCrop || featureConfig.photoshopStyleSelection || featureConfig.freehandSelection) ? handleMouseDown : undefined}
            >
              {/* Transparent crop area */}
              <div
                ref={cropAreaRef}
                id={customIds?.cropArea}
                className={cropAreaClassName}
                style={{
                  ...styles.cropArea,
                  ...(isDragging && styles.cropAreaActive),
                  left: crop.x,
                  top: crop.y,
                  width: crop.width,
                  height: crop.height,
                  cursor: isDragging ? 'grabbing' : (isCreatingCrop ? (featureConfig.photoshopStyleSelection ? 'crosshair' : 'crosshair') : (featureConfig.drag ? 'move' : 'default')),
                  display: crop.width > 0 && crop.height > 0 ? 'block' : (isCreatingCrop && featureConfig.photoshopStyleSelection ? 'block' : 'none'),
                  opacity: isCreatingCrop && featureConfig.photoshopStyleSelection && (crop.width < minWidth || crop.height < minHeight) ? 0.5 : 1,
                  borderStyle: featureConfig.photoshopStyleSelection && isCreatingCrop ? 'dashed' : 'solid',
                  transition: featureConfig.photoshopStyleSelection && isCreatingCrop ? 'none' : 'all 0.1s',
                  ...cropAreaStyle,
                }}
              >
                {/* Freehand selection path */}
                {isDrawingFreehand && freehandPath.length > 0 && (
                  <svg
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                      zIndex: 1000,
                    }}
                  >
                    <path
                      d={`M ${freehandPath.map(p => `${p.x},${p.y}`).join(' L ')}`}
                      fill="rgba(0, 123, 255, 0.2)"
                      stroke="#007bff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {freehandPath.length > 1 && (
                      <line
                        x1={freehandPath[0].x}
                        y1={freehandPath[0].y}
                        x2={freehandPath[freehandPath.length - 1].x}
                        y2={freehandPath[freehandPath.length - 1].y}
                        stroke="#007bff"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    )}
                  </svg>
                )}

                {/* Grid lines */}
                {featureConfig.grid && (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        left: '33.33%',
                        top: 0,
                        bottom: 0,
                        width: '1px',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: '66.66%',
                        top: 0,
                        bottom: 0,
                        width: '1px',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '33.33%',
                        left: 0,
                        right: 0,
                        height: '1px',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '66.66%',
                        left: 0,
                        right: 0,
                        height: '1px',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      }}
                    />
                  </>
                )}

                {/* Resize handles */}
                {!disabled && featureConfig.resize && (
                  <>
                    {['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'].map((handle) => {
                      const handleClassName = [
                        'image-cropper-handle',
                        `image-cropper-handle-${handle}`,
                        customClasses?.handles,
                        customClasses?.handle?.(handle),
                      ]
                        .filter(Boolean)
                        .join(' ');

                      // Get handle-specific style from DTO
                      const handleStyleMap: Record<string, React.CSSProperties> = {
                        nw: styles.handleNW,
                        ne: styles.handleNE,
                        sw: styles.handleSW,
                        se: styles.handleSE,
                        n: styles.handleN,
                        s: styles.handleS,
                        w: styles.handleW,
                        e: styles.handleE,
                      };

                      return (
                        <div
                          key={handle}
                          id={customIds?.handles?.(handle)}
                          className={handleClassName}
                          style={{
                            ...styles.handle,
                            ...handleStyleMap[handle],
                          }}
                        />
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {!imageLoaded && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#666',
            }}
          >
            Loading image...
          </div>
        )}
      </div>
    );
  }
);

ImageCropper.displayName = 'ImageCropper';

export default ImageCropper;

