import { Header } from './components/Header';
import { DropZone } from './components/DropZone';
import { AnalysisSummary } from './components/SummaryAnalysis';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Analyze } from './hooks/Analyze';
import styles from './styles/App.module.css';

// Main App component
function App() {
  
  // Hook to handle analysis state
  const { isAnalyzing, analysis, analyzeTweets, summary, error, reset } = Analyze();

  return (
    <div className={styles.main}>
      <Header />
      
      <DropZone onFileUpload={analyzeTweets} />
      
      {isAnalyzing && <LoadingSpinner aria-label="Analyzing tweets..." />}
      
      {error && (
        <div className={styles.error}>
          <h3>Error:</h3>
          <p>{error}</p>
          <button onClick={reset} className={styles.resetButton}>Try Again</button>
        </div>
      )}
      
      {analysis && summary && <AnalysisSummary data_analysis={analysis} data_summary={summary}/>}
    </div>
  );
}

export default App;