<template>
  <div
    class="bg-white rounded-xl w-full h-full p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
  >
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-lg font-semibold text-gray-800">{{ label }}</h1>
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

    <!-- Chart Legend --->
    <div class="flex flex-wrap gap-4 justify-center mb-6 cursor-pointer">
      <div class="flex items-center gap-2 px-3 py-1.5 bg-eduSky bg-opacity-30 rounded-full transition-transform hover:scale-105">
        <div class="flex items-center justify-center w-6 h-6 rounded-full bg-eduSky">
          <span class="font-bold text-xs text-white">{{ getTotalPresent() }}</span>
        </div>
        <span class="text-sm font-medium text-gray-700">Present</span>
      </div>
      <div class="flex items-center gap-2 px-3 py-1.5 bg-eduYellow bg-opacity-30 rounded-full transition-transform hover:scale-105">
        <div class="flex items-center justify-center w-6 h-6 rounded-full bg-eduYellow">
          <span class="font-bold text-xs text-white">{{ getTotalAbsent() }}</span>
        </div>
        <span class="text-sm font-medium text-gray-700">Absent</span>
      </div>
    </div>

    <!-- Date range selector  -->
    <div class="flex justify-between items-center text-xs text-gray-500 mb-6 cursor-pointer">
      <div class="flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
        <span>{{ formatDateRange() }}</span>
      </div>
      <button 
        @click="regenerateData" 
        class="flex items-center gap-1 text-purple-700 hover:text-eduPurple transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        <span>Refresh</span>
      </button>
    </div>

    <!-- Chart Container with loading state -->
    <div class="w-full h-64 relative">
      <div v-if="noDataToShow" class="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 bg-opacity-50 rounded-lg cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-gray-300 mb-2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
        </svg>
        <p class="text-sm text-gray-500">No attendance data for this week</p>
      </div>
      <canvas ref="chartCanvas"></canvas>
    </div>
    
    <!-- Summary cards - Only shown when showSummary prop is true -->
    <div v-if="showSummary" class="mt-4 grid grid-cols-2 gap-4 text-center cursor-pointer">
      <div class="p-2 rounded-lg bg-blue-500 bg-opacity-10 transition-all duration-300 hover:bg-opacity-20">
        <p class="text-xs text-gray-500">Weekly Present</p>
        <p class="text-lg font-semibold text-gray-700">{{ getTotalPresent() }}</p>
      </div>
      <div class="p-2 rounded-lg bg-yellow-500 bg-opacity-10 transition-all duration-300 hover:bg-opacity-20">
        <p class="text-xs text-gray-500">Weekly Absent</p>
        <p class="text-lg font-semibold text-gray-700">{{ getTotalAbsent() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Chart, registerables } from "chart.js";
import { useAttendanceStore } from "../../store/attendanceStore";
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "Attendance Overview"
  },
  // New prop to control whether to show the summary cards
  showSummary: {
    type: Boolean,
    default: false
  }
});

// Register Chart.js modules
Chart.register(...registerables);

// Reference to the canvas
const chartCanvas = ref(null);

const attendanceStore = useAttendanceStore();
// Track if there's no meaningful data
const noDataToShow = ref(false);
let currentChart = null;

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

// Format date range for display
function formatDateRange() {
  const { monday, friday } = getCurrentWeekRange();
  return `${monday.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${friday.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
}

// Calculate total present students
function getTotalPresent() {
  if (
    !attendanceStore.stats.present ||
    attendanceStore.stats.present.length === 0
  ) {
    return 0;
  }
  return attendanceStore.stats.present.reduce(
    (sum, current) => sum + current,
    0
  );
}

// Calculate total absent students
function getTotalAbsent() {
  if (
    !attendanceStore.stats.absent ||
    attendanceStore.stats.absent.length === 0
  ) {
    return 0;
  }
  return attendanceStore.stats.absent.reduce(
    (sum, current) => sum + current,
    0
  );
}

// Function to create or update the chart
function createChart() {
  // Wait for DOM to be ready
  nextTick(() => {
    // Destroy existing chart if it exists
    if (currentChart) {
      currentChart.destroy();
    }

    if (!chartCanvas.value) {
      return;
    }

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
          data: presentData,
          backgroundColor: "#C3EBFA", // eduSky
          barThickness: 15,
          borderRadius: 8,
          borderColor: "#A7D8F0",
          borderWidth: 1,
          hoverBackgroundColor: "#A7D8F0",
        },
        {
          data: absentData,
          backgroundColor: "#FAE27C", // eduYellow
          barThickness: 15,
          borderRadius: 8,
          borderColor: "#F5D25A",
          borderWidth: 1,
          hoverBackgroundColor: "#F5D25A",
        },
      ],
    };

    const config = {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 10,
            bottom: 0,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
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
              label: function (context) {
                const datasetIndex = context.datasetIndex;
                const index = context.dataIndex;
                const value =
                  datasetIndex === 0 ? presentData[index] : absentData[index];
                const label = datasetIndex === 0 ? "Present: " : "Absent: ";
                return label + value;
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
              color: "#9CA3AF",
              font: {
                size: 10,
              },
            },
            barPercentage: 0.7,
            categoryPercentage: 0.5,
          },
          y: {
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
              drawBorder: false,
            },
            title: {
              display: false,
            },
            ticks: {
              stepSize: 20,
              beginAtZero: true,
              color: "#9CA3AF",
              font: {
                size: 10,
              },
              padding: 5,
            },
            min: 0, // Explicitly set minimum to 0
            suggestedMax: Math.max(...presentData, ...absentData) * 1.2 || 100, // Dynamic height with 20% padding
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
      },
    };

    // Create the chart
    currentChart = new Chart(chartCanvas.value, config);
  });
}

// Function to fetch new data and update the chart (for the refresh button)
async function regenerateData() {
  const { monday, friday } = getCurrentWeekRange();
  await attendanceStore.fetchSchoolAttendanceStats(monday, friday);
  createChart();
}

// Function to handle resize events
function handleResize() {
  if (currentChart) {
    currentChart.resize();
  }
}

onMounted(() => {
  // Simply create the chart using the already fetched stats from the parent
  createChart();
  window.addEventListener("resize", handleResize);
});

// Watch for changes in the store's stats and update the chart accordingly
watch(
  () => attendanceStore.stats,
  (newStats) => {
    createChart();
  }
);

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  if (currentChart) {
    currentChart.destroy();
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
