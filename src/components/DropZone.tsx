import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import styles from '../styles/DropZone.module.css';
import { DropZoneProps } from '../types/types';


// DropZone component
export function DropZone({ onFileUpload }: DropZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileUpload(acceptedFiles);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps({ className: `${styles.main} ${isDragActive ? styles.active : ''}` })}>
      <input {...getInputProps()} />
      <Upload className={styles.icon}/>
    </div>
  );
}