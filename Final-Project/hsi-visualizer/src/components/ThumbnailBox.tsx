import React, { useEffect, useRef } from 'react';
import { fromArrayBuffer } from 'geotiff';

interface ThumbnailBoxProps {
  image: File;
  onClick: () => void;
}

const ThumbnailBox: React.FC<ThumbnailBoxProps> = ({ image, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderTiff = async () => {
      const canvas = canvasRef.current;

      // Check if the canvas element exists
      if (!canvas) {
        console.error('Canvas element is not available.');
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Unable to get canvas context.');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (!arrayBuffer) {
            console.error('Failed to read the file.');
            return;
          }

          const tiff = await fromArrayBuffer(arrayBuffer);
          const tiffImage = await tiff.getImage();
          const width = tiffImage.getWidth();
          const height = tiffImage.getHeight();

          console.log('TIFF Width:', width);
          console.log('TIFF Height:', height);

          canvas.width = width;
          canvas.height = height;

          const rasterData = await tiffImage.readRasters({ interleave: true });

          if (rasterData instanceof Uint8Array || rasterData instanceof Uint8ClampedArray) {
            // If rasterData is a single TypedArray, use it directly
            const clampedData = rasterData instanceof Uint8ClampedArray
              ? rasterData
              : new Uint8ClampedArray(rasterData);

            const imageData = new ImageData(clampedData, width, height);
            ctx.putImageData(imageData, 0, 0);
          } else if (Array.isArray(rasterData)) {
            // If rasterData is an array of bands, combine them into RGBA
            const rgba = new Uint8ClampedArray(width * height * 4);

            for (let i = 0; i < width * height; i++) {
              rgba[i * 4] = rasterData[0]?.[i] || 0; // Red
              rgba[i * 4 + 1] = rasterData[1]?.[i] || 0; // Green
              rgba[i * 4 + 2] = rasterData[2]?.[i] || 0; // Blue
              rgba[i * 4 + 3] = 255; // Alpha
            }

            const imageData = new ImageData(rgba, width, height);
            ctx.putImageData(imageData, 0, 0);
          } else {
            console.error('Unexpected raster data format.');
          }
        } catch (error) {
          console.error('Error rendering TIFF:', error);
        }
      };

      reader.readAsArrayBuffer(image);
    };

    renderTiff();
  }, [image]);

  return (
    <div
      onClick={onClick}
      style={{
        textAlign: 'center',
        margin: '10px',
        cursor: 'pointer',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          borderRadius: '8px',
          border: '1px solid #D1D5DB',
          objectFit: 'cover',
        }}
      ></canvas>
      <p style={{ marginTop: '5px', fontSize: '14px', color: '#374151' }}>{image.name}</p>
    </div>
  );
};

export default ThumbnailBox;
