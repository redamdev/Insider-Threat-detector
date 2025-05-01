// Chart color palettes
export const CHART_COLORS = {
  red: {
    primary: 'rgba(235, 77, 75, 0.8)',
    secondary: 'rgba(235, 77, 75, 1)',
    background: 'rgba(235, 77, 75, 0.1)',
  },
  blue: {
    primary: 'rgba(34, 166, 179, 0.8)',
    secondary: 'rgba(34, 166, 179, 1)',
    background: 'rgba(34, 166, 179, 0.1)',
  },
  yellow: {
    primary: 'rgba(254, 202, 87, 0.8)',
    secondary: 'rgba(254, 202, 87, 1)',
    background: 'rgba(254, 202, 87, 0.1)',
  },
  green: {
    primary: 'rgba(29, 209, 161, 0.8)',
    secondary: 'rgba(29, 209, 161, 1)',
    background: 'rgba(29, 209, 161, 0.1)',
  },
  gray: {
    primary: 'rgba(72, 84, 96, 0.8)',
    secondary: 'rgba(72, 84, 96, 1)',
    background: 'rgba(72, 84, 96, 0.1)',
  },
};

// Import Chart.js types for proper typing
import { ChartOptions } from 'chart.js';

// Gauge chart colors
export const GAUGE_COLORS = {
  red: {
    main: 'rgba(235, 77, 75, 0.85)',
    background: 'rgba(235, 77, 75, 0.12)',
    shadow: 'rgba(235, 77, 75, 0.5)',
  },
  blue: {
    main: 'rgba(34, 166, 179, 0.85)',
    background: 'rgba(34, 166, 179, 0.12)',
    shadow: 'rgba(34, 166, 179, 0.5)',
  },
  yellow: {
    main: 'rgba(254, 202, 87, 0.85)',
    background: 'rgba(254, 202, 87, 0.12)',
    shadow: 'rgba(254, 202, 87, 0.5)',
  }
};

// Bar chart default options
export const getBarChartOptions = (): ChartOptions<'bar'> => ({
  responsive: true,
  maintainAspectRatio: true,
  animation: false, 
  interaction: {
    mode: null as any, 
    intersect: false,
  },
  hover: { mode: null as any }, 
  events: [], 
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Average Analysis Scores',
      font: {
        size: 16,
        weight: 'bold',
      },
      padding: {
        top: 10,
        bottom: 20,
      },
    },
    tooltip: {
      enabled: false, // Disable tooltips
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: 'Score (%)',
        font: {
          weight: 'bold',
        },
      },
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        font: {
          size: 12,
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
          weight: 'bold',
        },
      },
    },
  },
});

// Donut chart default options
export const getDonutChartOptions = (threatCount: number, nonThreatCount: number): ChartOptions<'doughnut'> => {
  // Using the parameters to customize title if needed
  const title = threatCount > 0 
    ? `Threat Distribution (${threatCount}/${threatCount + nonThreatCount})`
    : 'Threat Distribution';
    
  return {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '65%',
    animation: false,
    interaction: {
      mode: null as any, 
      intersect: false,
    },
    hover: { mode: null as any }, 
    events: [], 
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 13,
            weight: 'bold',
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 10,
        },
      },
      tooltip: {
        enabled: false, // Disable tooltips
      },
    },
  };
};

// Gauge chart default options
export const getGaugeChartOptions = (): ChartOptions<'doughnut'> => ({
  cutout: '75%', // Size of the hole in the middle (75%)
  animation: false, // Disable animations
  interaction: {
    mode: null as any, // Disable interaction
    intersect: false,
  },
  hover: { mode: null as any }, // Disable hover
  events: [], // Remove all events
  plugins: {
    tooltip: {
      enabled: false, // Disable tooltips
    },
    legend: {
      display: false, // Hide legend
    },
  },
  maintainAspectRatio: true,
  responsive: true,
});

// Helper function to get value label based on the score
export const getValueLabel = (value: number) => {
  if (value >= 80) return 'Very High';
  if (value >= 60) return 'High';
  if (value >= 40) return 'Medium';
  if (value >= 20) return 'Low';
  return 'Very Low';
};

// Helper function to get text color based on value
export const getGaugeTextColorClass = (value: number) => {
  if (value >= 75) return 'redText';
  if (value >= 50) return 'yellowText';
  return 'blueText';
};