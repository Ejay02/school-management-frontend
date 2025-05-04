<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">
      Payment Status Distribution
    </h3>

    <div v-if="hasData" class="h-64 relative">
      <canvas ref="chartRef"></canvas>
    </div>
    <div v-else class="h-64 flex flex-col items-center justify-center text-gray-400">
      <i class="fas fa-chart-pie text-4xl mb-3"></i>
      <h4 class="text-lg font-medium">No Payment Data</h4>
      <p class="text-sm text-center">There are no payment records to display at this time.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useBillingDashboardStore } from "../../../../store/billingDashboardStore";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

// Register Chart.js components
Chart.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
);

const billingDashboardStore = useBillingDashboardStore();
const paymentStatusDistribution = computed(() => billingDashboardStore.getPaymentStatusDistribution);

// Check if there's actual data (any non-zero value)
const hasData = computed(() => {
  if (!paymentStatusDistribution.value || !paymentStatusDistribution.value.data) {
    return false;
  }
  
  // Check if all values are zero
  return paymentStatusDistribution.value.data.some(value => value > 0);
});

const chartRef = ref(null);
let chartInstance = null;

const createChart = () => {
  if (chartRef.value && paymentStatusDistribution.value.labels.length > 0 && hasData.value) {
    // Destroy existing chart if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }
    
    const chartData = {
      labels: paymentStatusDistribution.value.labels,
      datasets: [{
        data: paymentStatusDistribution.value.data,
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)', // Green for Paid
          'rgba(116, 107, 253, 0.8)', // Purple for Partial
          'rgba(234, 179, 8, 0.8)',  // Yellow for Pending
          'rgba(239, 68, 68, 0.8)'   // Red for Overdue
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(116, 107, 253, 1)', 
          'rgba(234, 179, 8, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1,
        hoverOffset: 5
      }]
    };
    
    chartInstance = new Chart(chartRef.value, {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleFont: {
              size: 13
            },
            bodyFont: {
              size: 12
            },
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}%`;
              }
            }
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  }
};

// Watch for changes in the payment status distribution data
watch([paymentStatusDistribution, hasData], () => {
  if (hasData.value) {
    createChart();
  } else if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
}, { deep: true });

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