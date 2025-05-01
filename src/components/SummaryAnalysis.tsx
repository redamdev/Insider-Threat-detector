import summaryStyles from '../styles/SummaryAnalysis.module.css';
import chartStyles from '../styles/Charts.module.css';
import { SummaryProps } from '../types/types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { CHART_COLORS, getBarChartOptions, getDonutChartOptions } from '../utils/ChartConfigs';
import { useState } from 'react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Legend
);

// Analysis summary component
export function AnalysisSummary({data_analysis, data_summary}:SummaryProps) {
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Function to handle download excel
  const handleDownloadExcel = async () => {
    try {
      setIsDownloading(true);
      setDownloadError(null);
      
      // Fetch request to generate excel
      const response = await fetch('http://localhost:5000/api/generate_excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({analysis: data_analysis, summary: data_summary}),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Excel generation failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
    
      a.href = url;
      a.download = 'tweet_analysis.xlsx'; 
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Excel download failed:", err);
      setDownloadError(err instanceof Error ? err.message : "Failed to download Excel file");
    } finally {
      setIsDownloading(false);
    }
  }
  
  // Function to get threat color
  const getThreatColor = (found: boolean) => {
    if (found) return summaryStyles.high;
    return summaryStyles.low;
  };


  if (!data_analysis || !data_summary) {
    return <p className={summaryStyles.noData}>No analysis results to display.</p>;
  }

  // Chart data for the bar chart comparing average scores
  const barChartData = {
    labels: ['Sentiment', 'Toxicity', 'LLM'],
    datasets: [
      {
        label: 'Average Scores',
        data: [
          data_summary.avg_sentiment,
          data_summary.avg_toxicity, 
          data_summary.avg_llm
        ],
        backgroundColor: [
          CHART_COLORS.blue.primary,
          CHART_COLORS.red.primary,
          CHART_COLORS.yellow.primary,
        ],
        borderColor: [
          CHART_COLORS.blue.secondary,
          CHART_COLORS.red.secondary,
          CHART_COLORS.yellow.secondary,
        ],
        borderWidth: 1,
        borderRadius: 6,
        maxBarThickness: 80,
      },
    ],
  };

  // Get bar chart options from utility
  const barChartOptions = getBarChartOptions();

  // Count threat vs non-threat tweets
  const threatCount = data_analysis.filter(tweet => tweet.threat === 1).length;
  const nonThreatCount = data_analysis.length - threatCount;

  // Chart data for threat distribution donut chart
  const donutChartData = {
    labels: ['Threat', 'Non-Threat'],
    datasets: [
      {
        data: [threatCount, nonThreatCount],
        backgroundColor: [
          CHART_COLORS.red.primary,
          CHART_COLORS.green.primary,
        ],
        borderColor: [
          CHART_COLORS.red.secondary,
          CHART_COLORS.green.secondary,
        ],
        borderWidth: 1,
      },
    ],
  };

  // Get donut chart options from utility
  const donutChartOptions = getDonutChartOptions(threatCount, nonThreatCount);

  // Calculate percentage of threats
  const threatPercentage = threatCount > 0 
    ? Math.round((threatCount / (threatCount + nonThreatCount)) * 100) 
    : 0;

  return (
    <div className={summaryStyles.mainContainer}>
      <div className={summaryStyles.threatIndicator}>
        <h2 className={summaryStyles.header}>Insider Threat Detection</h2>
        <div className={`${summaryStyles.threatStatus} ${getThreatColor(data_summary.threat_found)}`}>
          {data_summary.threat_found ? 'Threats Detected' : 'No Threats Detected'}
        </div>
      </div>
      
      <div className={summaryStyles.chartsContainer}>
        <div className={summaryStyles.chartCard}>
          <div className={chartStyles.chartContainer}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
        
        <div className={summaryStyles.chartCard}>
          <div className={chartStyles.chartContainer}>
            <Doughnut data={donutChartData} options={donutChartOptions} />
            {threatCount > 0 && (
              <div className={chartStyles.chartOverlay}>
                <div className={chartStyles.threatPercentage}>{threatPercentage}%</div>
                <div className={chartStyles.threatLabel}>Threat Rate</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className={summaryStyles.statsContainer}>
        <div className={summaryStyles.statCard}>
          <h3>Total Tweets</h3>
          <div className={summaryStyles.statValue}>{data_summary.total_tweets}</div>
        </div>
        
        <div className={summaryStyles.statCard}>
          <h3>Identified Threats</h3>
          <div className={summaryStyles.statValue}>{threatCount}</div>
        </div>
      </div>
      
      {downloadError && (
        <div className={summaryStyles.error}>{downloadError}</div>
      )}
      
      <button 
        onClick={handleDownloadExcel} 
        className={summaryStyles.button}
        disabled={isDownloading}
      >
        {isDownloading ? 'Downloading...' : 'Download Excel'}
      </button>
    </div>
  );
}