import React from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import ThumbnailBox from './ThumbnailBox';

interface ImageGridProps {
  images: File[];
  onSelectImage: (image: File) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onSelectImage }) => (
  <Scrollbar style={{ height: '400px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, 150px)',
        gap: '10px',
        padding: '10px',
        justifyContent: 'center',
      }}
    >
      {images.map((image, index) => (
        <ThumbnailBox key={index} image={image} onClick={() => onSelectImage(image)} />
      ))}
    </div>
  </Scrollbar>
);

export default ImageGrid;
