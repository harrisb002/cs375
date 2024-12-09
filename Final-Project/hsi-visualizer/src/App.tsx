import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FileUploader from './components/FileUploader';
import ImageGrid from './components/ImageGrid';
import ScatterPlot from './components/ScatterPlot';

const App: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [scatterData, setScatterData] = useState<{ frequency: number; intensity: number }[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleFilesUploaded = (files: File[]) => {
    setImages((prev) => [...prev, ...files]);
  };

  const handleImageSelect = (image: File) => {
    setSelectedImage(image);

    // Mock scatter data
    setScatterData(
      Array.from({ length: 100 }, () => ({
        frequency: Math.random() * 100,
        intensity: Math.random() * 100,
      }))
    );
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '960px', margin: '0 auto' }}>
        <FileUploader onFilesUploaded={handleFilesUploaded} />
        <ImageGrid images={images} onSelectImage={handleImageSelect} />
        {selectedImage && <h2 style={{ textAlign: 'center' }}>Scatter Plot for {selectedImage.name}</h2>}
        {scatterData.length > 0 && <ScatterPlot data={scatterData} width={800} height={400} />}
      </div>
    </div>
  );
};

export default App;
