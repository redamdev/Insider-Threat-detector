import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Legend } from 'chart.js';
import { GAUGE_COLORS, getGaugeChartOptions, getValueLabel, getGaugeTextColorClass } from '../utils/ChartConfigs';
import styles from '../styles/Charts.module.css';

ChartJS.register(ArcElement, Legend);

interface GaugeChartProps {
  value: number; 
  label: string;
  colorScheme: 'red' | 'blue' | 'yellow'; 
}

export function GaugeChart({ value, label, colorScheme }: GaugeChartProps) {
  // Get colors based on the color scheme
  const colors = GAUGE_COLORS[colorScheme] || GAUGE_COLORS.blue;
  
  // Value to display (rounded to nearest integer)
  const displayValue = Math.round(value);
  
  // Get text color class based on value
  const textColorClass = getGaugeTextColorClass(value);

  // Configure gauge chart data
  const data = {
    datasets: [
      {
        data: [value, 100 - value], // Value and remaining space
        backgroundColor: [colors.main, colors.background],
        borderWidth: 0,
        circumference: 180, // Half a circle
        rotation: -90, // Start at the top
      },
    ],
  };

  // Get gauge chart options from utility
  const options = getGaugeChartOptions();

  return (
    <div className={styles.gaugeContainer}>
      <Doughnut data={data} options={options} />
      <div className={styles.gaugeValueContainer}>
        <div className={`${styles.gaugeValue} ${styles[textColorClass]}`}>
          {displayValue}%
        </div>
        <div className={styles.gaugeLabel}>{label}</div>
        <div className={`${styles.gaugeDescription} ${styles[textColorClass]}`}>
          {getValueLabel(value)}
        </div>
      </div>
      
      {/* Add threshold markers */}
      <div className={styles.thresholdMarkers}>
        <span>|<br/>0</span>
        <span>|<br/>25</span>
        <span>|<br/>50</span>
        <span>|<br/>75</span>
        <span>|<br/>100</span>
      </div>
    </div>
  );
}