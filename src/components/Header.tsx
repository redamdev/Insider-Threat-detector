import MitreLogo from "../assets/MITRE Corporation Logo.png";
import styles from '../styles/Header.module.css';
import { useEffect, useState } from 'react';

// Header component
export function Header() {
  const [testFilePath, setTestFilePath] = useState('');
  
  // Function to handle test file download
  const handleDownloadTest = () => {
    // Create a link to download the file
    const link = document.createElement('a');
    link.href = testFilePath;
    link.download = 'targeted-test-10-tweets.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Use useEffect to create a URL for the test file
  useEffect(() => {
    // Import the test file dynamically
    import('../test_xlsx/targeted-test-10-tweets.xlsx').then((module) => {
      setTestFilePath(module.default);
    }).catch(error => {
      console.error('Error loading test file:', error);
    });
    
    // Clean up function
    return () => {
      if (testFilePath) {
        URL.revokeObjectURL(testFilePath);
      }
    };
  }, []);

  return (
    <div className={styles.main}>
      <button 
        className={styles.downloadButton} 
        onClick={handleDownloadTest}
        title="Download Test File"
      >
        <svg className={styles.downloadIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Test File
      </button>
      <img src={MitreLogo} alt="MITRE Logo" className={styles.icon} />
      <h1>Insider Threat Tweet Analyzer</h1>
      <p>Upload tweets to find the insider threats! (.xlsx)</p>
    </div>
  );
}