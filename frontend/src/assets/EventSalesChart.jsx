import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EventSalesChart = ({ data }) => {
  // Sort data by date
  const sortedData = [...data].sort((a, b) => 
    new Date(a.saleStartDate) - new Date(b.saleStartDate)
  );

  const chartData = {
    labels: sortedData.map(event => 
      format(new Date(event.saleStartDate), 'MMM dd, yyyy')
    ),
    datasets: [
      {
        label: 'Revenue',
        data: sortedData.map(event => event.totalRevenue),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.4
      },
      {
        label: 'Tickets Sold',
        data: sortedData.map(event => event.ticketsSold),
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.label === 'Revenue') {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            } else {
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 10 // Adjust this value based on your needs
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false
        },
        ticks: {
          callback: function(value) {
            if (this.chart.scales.y.id === 'revenue') {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value);
            }
            return value;
          }
        }
      }
    }
  };

  return (
    <div className="h-[300px]">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default EventSalesChart;
