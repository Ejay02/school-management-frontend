<template>
  <div class="bg-white rounded-lg p-4 h-full">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-lg font-semibold">Attendance</h1>
      <img src="/moreDark.png" alt="more icon" class="h-5 w-5" />
    </div>

    <!-- chart -->
    <div class="flex gap-6 justify-start mb-7">
      <div class="flex gap-1">
        <div class="w-5 h-5 bg-eduSky rounded-full"></div>
        <h2 class="text-sm text-eduSky">Present</h2>
      </div>
      <!-- 2 -->
      <div class="flex gap-1">
        <div class="w-5 h-5 bg-eduYellow rounded-full"></div>
        <h2 class="text-sm text-eduYellow">Absent</h2>
      </div>
    </div>
    <div class="w-full h-4/5">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Chart, registerables } from "chart.js";

const chartCanvas = ref(null);

// Register Chart.js modules
Chart.register(...registerables);

onMounted(() => {
  // Sample data for male and female across months
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        // label: "Present",
        data: [65, 59, 80, 81, 56],
        backgroundColor: "#C3EBFA",
        borderWidth: 0,
        barThickness: 15,
        borderRadius: 10,
        borderColor: "transparent", // Transparent border color
      },

      {
        // label: "Absent",
        data: [28, 48, 40, 19, 96],
        backgroundColor: "#FAE27C ",
        barThickness: 20,
        borderRadius: 10,
        borderColor: "transparent", // Transparent border color
        borderWidth: 2, // Add spacing effect
      },
    ],
  };

  // Chart configuration
  const config = {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
    layout: {
      scales: {
        x: {
          grid: {
            display: false, // Remove vertical grid lines
            drawBorder: false,
          },
          ticks: {
            color: "#d1d5db", // Color for the x-axis labels (Mon, Tue, etc.)
          },
          barPercentage: 0.8, // Adjust spacing between bars in the same group
          categoryPercentage: 0.5,
        },
        y: {
          grid: {
            color: "#E5E7EB",
            drawBorder: false,
          },
          ticks: {
            stepSize: 20, // This ensures ticks at 0, 20, 40, etc.
            beginAtZero: true,
            color: "#d1d5db", // Color for the y-axis labels (0, 10, etc.)
          },
        },
      },
    },
  };

  // Create the chart
  new Chart(chartCanvas.value, config);
});
</script>

<style scoped></style>
