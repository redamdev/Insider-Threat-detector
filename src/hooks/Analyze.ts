import { useState, useCallback } from 'react';
import { AnalysisData } from '../types/types';
import { SummaryData } from '../types/types';

// Custom hook to handle tweet analysis
export function Analyze() {
  
  const [isAnalyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData[] | null>(null);
  const [summary, setSummary]  = useState<SummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeTweets = useCallback(async (files: File[]) => {
    if (!files || files.length === 0) {
      setError("No file selected");
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      console.log("Sending file to API:", files[0].name);
      
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data:", data);

      setAnalysis(data.analysis);
      setSummary(data.summary);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setAnalysis(null);
      setSummary(null);
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysis(null);
    setSummary(null);
    setAnalyzing(false);
    setError(null);
  }, []);

    
  return { isAnalyzing, analysis, summary, error, analyzeTweets, reset };
}