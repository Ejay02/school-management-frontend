<template>
  <div
    class="bg-white rounded-lg p-4 w-full h-full cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300"
  >
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-lg font-semibold">{{ label }}</h1>
      <div class="flex items-center gap-2">
        <button
          class="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
        >
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
        </button>
      </div>
    </div>

    <!-- Chart Legend - More compact -->
    <div class="flex gap-4 justify-start mb-6">
      <div class="flex items-center gap-1">
        <div
          class="bg-eduSky rounded-lg p-2 border border-blue-300 text-xs transition-transform duration-300 hover:scale-105 hover:shadow-lg"
        >
          <span class="font-bold text-center text-xs">
            {{ getTotalPresent() }}
          </span>
        </div>
        <span class="text-xs text-gray-600 font-semibold">Present</span>
      </div>
      <div class="flex items-center gap-1">
        <div
          class="bg-eduYellow p-2 rounded-lg border border-yellow-300 text-xs transition-transform duration-300 hover:scale-105 hover:shadow-lg"
        >
          <span class="font-bold text-center text-xs">
            {{ getTotalAbsent() }}
          </span>
        </div>
        <span class="text-xs text-gray-600 font-semibold">Absent</span>
      </div>
    </div>

    <!-- Date range selector - More compact -->
    <div class="flex justify-between items-center text-xs text-gray-500 mb-6">
      <span>{{ formatDateRange() }}</span>
      <button @click="regenerateData" class="text-eduPurple hover:underline">
        Refresh
      </button>
    </div>

    <!-- Chart Container - Fixed height approach -->
    <div>
      <div class="h-full w-full">
        <canvas ref="chartCanvas"></canvas>
      </div>
      <div class="mt-6">
        <div v-if="noDataToShow" class="text-center text-gray-500 text-sm">
          *No attendance data for this week
        </div>
        <div v-else class="text-center text-gray-500 text-xs">Day of Week</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, nextTick } from "vue";
import { Chart, registerables } from "chart.js";
import { useAttendanceStore } from "../../store/attendanceStore";

const props = defineProps({
  label: {
    type: String,
  },
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
          data: presentData.map((value) => Math.max(value, 0.5)), // Ensure minimum visible height
          backgroundColor: "#C3EBFA", // eduSky
          barThickness: 15,
          borderRadius: 10,
          borderColor: "transparent",
          borderWidth: 2,
        },
        {
          data: absentData.map((value) => Math.max(value, 0.5)), // Ensure minimum visible height
          backgroundColor: "#FAE27C", // eduYellow
          barThickness: 15,
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
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
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
              color: "#E5E7EB",
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
              // callback: function (value) {
              //   // Only show actual values in the axis labels
              //   return value > 0.5 ? value : 0;
              // },
            },
            // min: 0, // Start at zero
            // suggestedMax: Math.max(...presentData, ...absentData) * 1.2 || 100, // Dynamic height with 20% padding
          },
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

onMounted(async () => {
  // Get the current week's Monday and Friday
  const { monday, friday } = getCurrentWeekRange();
  // Pass ISO strings to match the DateTime scalar
  await attendanceStore.fetchSchoolAttendanceStats(monday, friday);

  // Create the chart after a short delay to ensure proper sizing
  setTimeout(() => {
    createChart();
  }, 50);

  // Add resize listener to handle responsive behavior better
  window.addEventListener("resize", handleResize);
});

// Clean up event listener when component unmounts
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  if (currentChart) {
    currentChart.destroy();
  }
});
</script>

<style scoped></style>
