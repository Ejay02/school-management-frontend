<template>
  <div class="bg-white rounded-lg p-4 h-full cursor-pointer">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-lg font-semibold">Attendance</h1>
      <div>
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

    <!-- Chart Legend -->
    <div class="flex gap-6 justify-start mb-0">
      <div class="flex gap-1">
        <div class="w-5 h-5 bg-eduSky rounded-full"></div>
        <h2 class="text-sm text-eduSky">Present</h2>
      </div>
      <div class="flex gap-1">
        <div class="w-5 h-5 bg-eduYellow rounded-full"></div>
        <h2 class="text-sm text-eduYellow">Absent</h2>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="w-full">
      <canvas ref="chartCanvas"></canvas>
      <div v-if="noDataToShow" class="text-center text-gray-500 mt-4 text-sm">
        *No attendance data for this week
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Chart, registerables } from "chart.js";
import { useAttendanceStore } from "../../store/attendanceStore";

// Register Chart.js modules
Chart.register(...registerables);

// Reference to the canvas
const chartCanvas = ref(null);

const attendanceStore = useAttendanceStore();
// Track if there's no meaningful data
const noDataToShow = ref(false);

// Helper: Compute current week's Monday and Friday dates
function getCurrentWeekRange() {
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.
  // If it's Sunday, consider it the last day of the previous week; otherwise, calculate Monday.
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() + diffToMonday);
  // Friday is 4 days after Monday.
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  return { monday, friday };
}

onMounted(async () => {
  // Get the current week's Monday and Friday
  const { monday, friday } = getCurrentWeekRange();
  // Pass ISO strings to match the DateTime scalar
  await attendanceStore.fetchSchoolAttendanceStats(monday, friday);

  // Prepare chart data with defaults if needed
  const defaultLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const labels =
    attendanceStore.stats.labels && attendanceStore.stats.labels.length
      ? attendanceStore.stats.labels
      : defaultLabels;
  const presentData =
    attendanceStore.stats.present && attendanceStore.stats.present.length
      ? attendanceStore.stats.present
      : [0, 0, 0, 0, 0];

  const absentData =
    attendanceStore.stats.absent && attendanceStore.stats.absent.length
      ? attendanceStore.stats.absent
      : [0, 0, 0, 0, 0];

  // Check if we have any non-zero data
  const hasData = [...presentData, ...absentData].some((value) => value > 0);
  noDataToShow.value = !hasData;

  // Chart data and configuration
  const data = {
    labels: labels,
    datasets: [
      {
        data: presentData.map((value) => Math.max(value, 0.5)), // Ensure minimum visible height
        backgroundColor: "#C3EBFA",
        borderWidth: 0,
        barThickness: 15,
        borderRadius: 10,
        borderColor: "transparent",
      },
      {
        data: absentData.map((value) => Math.max(value, 0.5)), // Ensure minimum visible height
        backgroundColor: "#FAE27C",
        barThickness: 20,
        borderRadius: 10,
        borderColor: "transparent",
        borderWidth: 2,
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              // Show the actual value in the tooltip, not the adjusted one
              const datasetIndex = context.datasetIndex;
              const index = context.dataIndex;
              const actualValue =
                datasetIndex === 0 ? presentData[index] : absentData[index];
              const label = datasetIndex === 0 ? "Present: " : "Absent: ";
              return label + actualValue;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: "#d1d5db",
          },
          barPercentage: 0.8,
          categoryPercentage: 0.5,
        },
        y: {
          grid: {
            color: "#E5E7EB",
            drawBorder: false,
          },
          ticks: {
            stepSize: 20,
            beginAtZero: true,
            color: "#d1d5db",
            callback: function (value) {
              // Only show actual values in the axis labels
              return value > 0.5 ? value : 0;
            },
          },
          min: 0, // Start at zero
          suggestedMax: 100, // Set a minimum suggested height
        },
      },
    },
  };

  // Create the chart
  new Chart(chartCanvas.value, config);
});
</script>

<style scoped></style>
