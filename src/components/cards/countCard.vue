<template>
  <div class="bg-white rounded-xl w-full h-full p-4">
    <!-- title -->
    <div class="flex justify-between items-center ">
      <h1 class="text-lg font-semibold">Students</h1>
      <img src="/moreDark.png" alt="more icon" class="h-5 w-5" />
    </div>
    <!-- chart -->
    <div class="w-full h-[65%] flex justify-center items-center mb-2 p-2 relative">
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
        <h1 class="font-bold">1,234</h1>
        <h2 class="text-sm text-gray-300">Boys (43%)</h2>
      </div>
      <div class="flex flex-col gap-1">
        <div class="w-5 h-5 bg-eduYellow rounded-full"></div>
        <h1 class="font-bold">1,234</h1>
        <h2 class="text-sm text-gray-300">Girls (57%)</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Chart, registerables } from "chart.js";

// Register all Chart.js components
Chart.register(...registerables);

const radialChartCanvas = ref(null);

onMounted(() => {
  if (radialChartCanvas.value) {
    createCircularChart();
  }
});

const createCircularChart = () => {
  // Custom circular chart configuration
  const config = {
    type: "doughnut",
    data: {
      labels: ["Boys", "c", "Girls"],
      datasets: [
        {
          // Top circle
          data: [43, 57],
          backgroundColor: ["#C3EBFA", "#D3D3D3"],
          borderWidth: 0,
        },
        {
          // Top circle
          data: [],
          backgroundColor: ["#fff", "#fff"],
          borderColor: "white",
          spacing: 0,
          hoverBackgroundColor: "white",
          borderColor: "white",
        },
        {
          // Bottom circle
          data: [57, 43],
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
