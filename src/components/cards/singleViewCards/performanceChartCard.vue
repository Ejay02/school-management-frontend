<template>
  <div class="bg-white rounded-xl w-full h-full p-4 ">
    <!-- title -->
    <div class="flex justify-between items-center">
      <h1 class="text-lg font-semibold">Performance</h1>
      <img src="/moreDark.png" alt="more icon" class="h-5 w-5" />
    </div>

    <!-- one -->
    <div class="w-full h-[45%] flex justify-center items-center p-2 relative">
      <canvas ref="radialChartCanvas" class="h-[200px]"></canvas>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-6"
      >
        <h1 class="text-3xl font-bold">9.2</h1>
        <p class="text-sm text-gray-300">of 10 max ETS</p>
      </div>
      <div class="font-medium absolute bottom-1">
        1st Semester - 2nd Semester
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
    createHalfDoughnutChart();
  }
});

const createHalfDoughnutChart = () => {
  const config = {
    type: "doughnut",
    data: {
      labels: ["Group A", "Group B"],
      datasets: [
        {
          data: [87, 13],
          backgroundColor: ["#C3EBFA", "#FAE27C"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      circumference: 180, // Half circle
      rotation: 270, // Start from bottom
      cutout: "70%", // Creates donut hole
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
