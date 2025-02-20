<template>
  <div class="bg-white cursor-pointer rounded-xl w-full h-full p-4">
    <!-- title -->
    <div class="flex justify-between items-center">
      <h1 class="text-lg font-semibold">Students</h1>
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
    <!-- chart -->
    <div
      class="w-full h-[65%] flex justify-center items-center mb-2 p-2 relative"
    >
      <canvas ref="radialChartCanvas"></canvas>
      <img
        src="/maleFemale.png"
        alt="male female icon"
        class="h-10 w-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
    <!-- bottom -->
    <div class="flex justify-center gap-16 mb-4 p-2">
      <div class="flex flex-col gap-1">
        <div class="w-5 h-5 bg-eduSky rounded-full"></div>
        <h1 class="font-bold">{{ genderStats.maleCount }}</h1>
        <h2 class="text-sm text-gray-300">
          Boys ({{ genderStats.malePercentage }}%)
        </h2>
      </div>
      <div class="flex flex-col gap-1">
        <div class="w-5 h-5 bg-eduYellow rounded-full"></div>
        <h1 class="font-bold">{{ genderStats.femaleCount }}</h1>
        <h2 class="text-sm text-gray-300">
          Girls ({{ genderStats.femalePercentage }}%)
        </h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Chart, registerables } from "chart.js";
import { useStudentStore } from "../../store/studentStore";

// Register all Chart.js components
Chart.register(...registerables);

const radialChartCanvas = ref(null);
const studentStore = useStudentStore();
const genderStats = computed(() => studentStore.genderStats);

onMounted(async () => {
  // Fetch the gender stats from the API via the store
  await studentStore.fetchGenderStats();
  // Create the chart once the data is loaded
  if (radialChartCanvas.value) {
    createCircularChart();
  }
});

const createCircularChart = () => {
  // Use the fetched gender statistics
  const malePercentage = genderStats.value.malePercentage || 0;
  const femalePercentage = genderStats.value.femalePercentage || 0;

  // Custom circular chart configuration using actual data
  const config = {
    type: "doughnut",
    data: {
      labels: ["Boys", "Girls"],
      datasets: [
        {
          // Top circle using the computed percentages
          data: [malePercentage, femalePercentage],
          backgroundColor: ["#C3EBFA", "#D3D3D3"],
          borderWidth: 0,
        },
        {
          // Second dataset remains unchanged
          data: [],
          backgroundColor: ["#fff", "#fff"],
          borderColor: "white",
          spacing: 0,
          hoverBackgroundColor: "white",
        },
        {
          // Bottom circle with reversed order for a stylistic effect
          data: [femalePercentage, malePercentage],
          backgroundColor: ["#FAE27C", "#D3D3D3"],
          borderWidth: 0,
          borderColor: "white",
          spacing: 0,
          cutout: "40%",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    },
  };

  // Create the chart
  new Chart(radialChartCanvas.value, config);
};
</script>

<style scoped></style>
