<template>
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
   
    <div v-if="hasData" class="h-64">
      <canvas ref="chartRef"></canvas>
    </div>
    <EmptyState 
      v-else
      icon="fa-solid fa-chart-line"
      heading="No Revenue Data Available"
      description="There is no revenue trend data to display at this time."
    />
  </div>
</template>

<script setup>
import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { computed, onMounted, ref, watch } from "vue";
import EmptyState from "../../../emptyState.vue";
import { useBillingDashboardStore } from "../../../../store/billingDashboardStore";

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

const billingDashboardStore = useBillingDashboardStore();
const revenueTrend = computed(() => billingDashboardStore.getRevenueTrend);

// Check if there's actual data (any non-zero value)
const hasData = computed(() => {
  if (!revenueTrend.value || !revenueTrend.value.data || !revenueTrend.value.months) {
    return false;
  }
  
  // Check if there are months and if any revenue value is greater than zero
  return revenueTrend.value.months.length > 0 && revenueTrend.value.data.some(value => value > 0);
});

const chartRef = ref(null);
let chartInstance = null;

const createChart = () => {
  if (chartRef.value && revenueTrend.value.months.length > 0 && hasData.value) {
    const ctx = chartRef.value.getContext("2d");

    // Create gradient for area under the line
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(99, 102, 241, 0.4)");
    gradient.addColorStop(1, "rgba(99, 102, 241, 0.0)");

    // Destroy existing chart if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(chartRef.value, {
      type: "line",
      data: {
        labels: revenueTrend.value.months,
        datasets: [
          {
            label: "Revenue",
            data: revenueTrend.value.data,
            borderColor: "#6366f1", // Indigo color
            backgroundColor: gradient,
            borderWidth: 2,
            fill: true,
            tension: 0.4, // Smooth curve
            pointBackgroundColor: "#6366f1",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              usePointStyle: true,
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
            callbacks: {
              label: function (context) {
                return `Revenue: $${context.raw.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 11,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              font: {
                size: 11,
              },
              callback: function (value) {
                return "$" + value.toLocaleString();
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
            tension: 0.4, // Smooth curve
          },
        },
      },
    });
  }
};

// Watch for changes in the revenue trend data and hasData state
watch(
  [revenueTrend, hasData],
  () => {
    if (hasData.value) {
      createChart();
    } else if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  },
  { deep: true }
);

onMounted(() => {
  if (hasData.value) {
    createChart();
  }
});
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
