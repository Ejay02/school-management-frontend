<template>
  <div class="bg-white rounded-xl w-auto h-full p-4 shadow-lg cursor-pointer">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-lg font-semibold">Finance</h1>
      <div class="">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
          />
        </svg>
      </div>
    </div>

    <div class="flex gap-6 justify-center mb-7">
      <div class="flex gap-1">
        <!-- <div class="w-5 h-5 bg-eduSky rounded-full"></div> -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 text-[#C3EBFA]"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
          />
        </svg>

        <h2 class="text-sm text-eduSky">income</h2>
      </div>
      <!-- 2 -->
      <div class="flex gap-1">
        <!-- <div class="w-5 h-5 bg-[#C3EBFA] rounded-full"></div> -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 text-[#CFCEFF]"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
          />
        </svg>

        <h2 class="text-sm text-[#CFCEFF]">expense</h2>
      </div>
    </div>

    <div class="w-full h-64">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
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
  Tooltip
);

const chartRef = ref(null);

const { result, loading, error } = useQuery(getIncomeGraphData);

const chartData = {
  labels: [
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
  ],

  datasets: [
    {
      label: "Revenue",
      data: [],
      borderColor: "#C3EBFA",
      tension: 0,
      // pointRadius: 5,
      // pointBackgroundColor: "#",
    },
    {
      label: "Expenses",
      data: [45, 0, 35, 60, 48, 72, 85, 76, 91, 68, 57, 32],
      borderColor: "#CFCEFF",
      tension: 0.1,
    },
  ],
};

let chartInstance = null;

onMounted(() => {
  if (chartRef.value) {
    new Chart(chartRef.value, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "#d1d5db",
              margin: 20,
            },
            grid: {
              color: "#d1d5db",
            },
          },
          x: {
            ticks: {
              color: "#d1d5db",
            },
            grid: {
              color: "#d1d5db",
            },
          },
        },
      },
    });
  }
});

// Watch the query result and update the revenue data once available

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
</style>
