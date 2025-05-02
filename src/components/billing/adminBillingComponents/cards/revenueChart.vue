<template>
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
    <div class="h-64">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

// Register Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

const chartRef = ref(null);
let chartInstance = null;

// Dummy data for the chart
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const revenueData = [85000, 72000, 90000, 105000, 95000, 110000, 120000, 115000, 130000, 145000, 135000, 150000];

onMounted(() => {
  if (chartRef.value) {
    const ctx = chartRef.value.getContext('2d');
    
    // Create gradient for area under the line
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
    
    chartInstance = new Chart(chartRef.value, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Revenue',
          data: revenueData,
          borderColor: '#6366f1', // Indigo color
          backgroundColor: gradient,
          borderWidth: 2,
          fill: true,
          tension: 0.4, // Smooth curve
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleFont: {
              size: 13
            },
            bodyFont: {
              size: 12
            },
            callbacks: {
              label: function(context) {
                return `Revenue: $${context.raw.toLocaleString()}`;
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
              font: {
                size: 11
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              font: {
                size: 11
              },
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        elements: {
          line: {
            tension: 0.4 // Smooth curve
          }
        }
      }
    });
  }
});
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>