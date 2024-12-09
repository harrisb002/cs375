import React from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  onFilesUploaded: (files: File[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesUploaded }) => {
  const onDrop = (acceptedFiles: File[]) => onFilesUploaded(acceptedFiles);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px dashed #4F46E5',
        padding: '20px',
        textAlign: 'center',
        margin: '20px 0',
        borderRadius: '8px',
        background: '#EFF6FF',
        cursor: 'pointer',
      }}
    >
      <input {...getInputProps()} />
      <p>Drag & drop HSI (TIFF) files here, or click to select files</p>
    </div>
  );
};

export default FileUploader;
