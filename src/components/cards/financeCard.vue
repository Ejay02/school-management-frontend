<template>
  <div class="bg-white rounded-xl w-full h-full p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-lg font-semibold text-gray-800">Finance Overview</h1>
      <div
        class="text-gray-600 hover:text-gray-800 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
          />
        </svg>
      </div>
    </div>

    <div class="flex flex-wrap gap-4 justify-center mb-6">
      <div class="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full transition-transform hover:scale-105">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-5 text-blue-500"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
          />
        </svg>
        <h2 class="text-sm font-medium text-blue-600">Income</h2>
      </div>
      
      <div class="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full transition-transform hover:scale-105">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-5 text-purple-500"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
          />
        </svg>
        <h2 class="text-sm font-medium text-purple-600">Expense</h2>
      </div>
    </div>

    <div class="w-full h-64 relative">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
      <canvas ref="chartRef"></canvas>
    </div>
    
    <div class="mt-4 grid grid-cols-2 gap-4 text-center">
      <div class="p-2 rounded-lg bg-blue-50">
        <p class="text-xs text-gray-500">Total Income</p>
        <p class="text-lg font-semibold text-blue-600">${{ getTotalIncome() }}</p>
      </div>
      <div class="p-2 rounded-lg bg-purple-50">
        <p class="text-xs text-gray-500">Total Expenses</p>
        <p class="text-lg font-semibold text-purple-600">${{ getTotalExpenses() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Filler,
} from "chart.js";
import { useQuery } from "@vue/apollo-composable";
import { getIncomeGraphData } from "../../graphql/queries";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Filler
);

const chartRef = ref(null);
let chartInstance = null;

const { result, loading, error } = useQuery(getIncomeGraphData);

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const chartData = {
  labels: months,
  datasets: [
    {
      label: "Income",
      data: [],
      borderColor: "#3b82f6", // Blue
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#3b82f6",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: "Expenses",
      data: [45, 0, 35, 60, 48, 72, 85, 76, 91, 68, 57, 32],
      borderColor: "#8b5cf6", // Purple
      backgroundColor: "rgba(139, 92, 246, 0.1)",
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#8b5cf6",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

// Calculate totals for display in the summary cards
const getTotalIncome = () => {
  if (chartData.datasets[0].data.length === 0) return 0;
  return chartData.datasets[0].data.reduce((sum, value) => sum + value, 0).toLocaleString();
};

const getTotalExpenses = () => {
  return chartData.datasets[1].data.reduce((sum, value) => sum + value, 0).toLocaleString();
};

onMounted(() => {
  if (chartRef.value) {
    const ctx = chartRef.value.getContext("2d");
    
    chartInstance = new Chart(chartRef.value, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "end",
            labels: {
              usePointStyle: true,
              boxWidth: 6,
              padding: 15,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            titleFont: {
              size: 13,
            },
            bodyFont: {
              size: 12,
            },
            padding: 10,
            cornerRadius: 4,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: 'USD',
                    minimumFractionDigits: 0
                  }).format(context.parsed.y);
                }
                return label;
              }
            }
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
              drawBorder: false,
            },
            ticks: {
              color: "#9ca3af",
              padding: 10,
              font: {
                size: 11,
              },
              callback: function(value) {
                return '$' + value;
              }
            },
          },
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              color: "#9ca3af",
              padding: 5,
              font: {
                size: 11,
              },
            },
          },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
        elements: {
          line: {
            tension: 0.4,
          },
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      },
    });
  }
});

watch(result, (newVal) => {
  if (
    newVal &&
    newVal.getIncomeGraphData &&
    newVal.getIncomeGraphData.revenue
  ) {
    // Update the revenue dataset with the fetched data
    chartData.datasets[0].data = newVal.getIncomeGraphData.revenue;
    if (chartInstance) {
      chartInstance.update();
    }
  }
});
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 100% !important;
}

@media (max-width: 640px) {
  .flex-wrap {
    justify-content: space-around;
  }
  
  .grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}

@media (max-width: 768px) {
  .h-64 {
    height: 12rem;
  }
}
</style>
