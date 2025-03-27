<template>
  <div class="rounded-lg border border-gray-300 p-4 w-full bg-gray-50">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-700">Score Distribution</h2>

      <!-- Class selection dropdown -->
      <Dropdown
        class="w-56"
        v-model="selectedClass"
        label="Select Class"
        :options="classes"
        emptyLabel="Select a class"
      />
    </div>

    <div class="bg-gray-200 p-6 rounded-lg shadow-lg">
      <!-- Show a loading spinner when fetching data or generating dummy data -->
      <LoadingScreen
        v-if="loading || generatingDummy"
        message="Loading Data..."
      />

      <ErrorScreen v-else-if="error" />

      <EmptyState
        v-else-if="hasNoData && !loading && !generatingDummy"
        icon="fa-solid fa-chart-simple"
        heading="No data available"
        description="No scores have been recorded for this class yet."
      >
        <button
          @click="generateDummyData"
          class="mt-4 bg-indigo-500 hover:bg-indigo-400 text-white py-2 px-4 rounded-md transition-colors"
        >
          Generate Sample Data
        </button>
      </EmptyState>

      <!-- Chart container (only shown when we have data) -->
      <div class="chart-container" v-show="!hasNoData">
        <canvas ref="chartCanvas" height="250"></canvas>
      </div>

      <!-- Stats summary cards (always shown, even with zeros) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div class="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <div class="text-sm text-gray-600 mb-1">Above 90%</div>
          <div class="text-2xl font-bold text-emerald-600">
            {{ distribution.above90 }}
          </div>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div class="text-sm text-gray-600 mb-1">Above 80%</div>
          <div class="text-2xl font-bold text-blue-600">
            {{ distribution.above80 }}
          </div>
        </div>
        <div class="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <div class="text-sm text-gray-600 mb-1">Above 70%</div>
          <div class="text-2xl font-bold text-amber-600">
            {{ distribution.above70 }}
          </div>
        </div>
        <div class="bg-red-50 p-4 rounded-lg border border-red-200">
          <div class="text-sm text-gray-600 mb-1">Below 50%</div>
          <div class="text-2xl font-bold text-red-600">
            {{ distribution.below50 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Chart from "chart.js/auto";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useClassStore } from "../../store/classStore";
import { useResultStore } from "../../store/resultStore";

import Dropdown from "../dropdowns/dropdown.vue";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";

const classes = ref([]);

const chartCanvas = ref(null);
let myChart = null;

const classStore = useClassStore();
const resultStore = useResultStore();

const loading = computed(() => resultStore.loading);
const error = computed(() => resultStore.error);

const generatingDummy = ref(false);

const selectedClass = ref("Primary 1");

// Default empty distribution
const defaultDistribution = {
  above90: 0,
  above80: 0,
  above70: 0,
  below50: 0,
};

// Computed property to get current distribution with defaults
const distribution = computed(() => {
  return resultStore.results?.distribution || defaultDistribution;
});

// Check if all data values are zero
const hasNoData = computed(() => {
  return (
    distribution.value.above90 === 0 &&
    distribution.value.above80 === 0 &&
    distribution.value.above70 === 0 &&
    distribution.value.below50 === 0
  );
});

// Function to handle class change
const handleClassChange = async () => {
  if (myChart) {
    myChart.destroy();
    myChart = null;
  }

  await fetchData();
};

// Function to fetch data
const fetchData = async () => {
  resultStore.error = null;
  try {
    await resultStore.fetchResultStatistics(selectedClass.value);
    if (!hasNoData.value) {
      // Wait for the DOM to update before initializing the chart
      nextTick(() => {
        updateChart();
      });
    }
  } catch (err) {
    console.error("Failed to fetch data:", err);
  }
};

// Generate dummy data for demonstration with a simulated delay
const generateDummyData = async () => {
  generatingDummy.value = true;
  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const dummyData = {
    distribution: {
      above90: Math.floor(Math.random() * 15) + 5,
      above80: Math.floor(Math.random() * 20) + 10,
      above70: Math.floor(Math.random() * 25) + 15,
      below50: Math.floor(Math.random() * 10) + 3,
    },
  };

  // Update the store with dummy data
  resultStore.results = dummyData;
  generatingDummy.value = false;
};

// Function to initialize or update chart
const updateChart = () => {
  if (!chartCanvas.value) return;

  const ctx = chartCanvas.value.getContext("2d");

  const labels = ["Above 90%", "Above 80%", "Above 70%", "Below 50%"];
  const dataValues = [
    distribution.value.above90,
    distribution.value.above80,
    distribution.value.above70,
    distribution.value.below50,
  ];

  const chartColors = {
    backgroundColor: [
      "rgba(16, 185, 129, 0.2)",
      "rgba(59, 130, 246, 0.2)",
      "rgba(245, 158, 11, 0.2)",
      "rgba(239, 68, 68, 0.2)",
    ],
    borderColor: [
      "rgba(16, 185, 129, 1)",
      "rgba(59, 130, 246, 1)",
      "rgba(245, 158, 11, 1)",
      "rgba(239, 68, 68, 1)",
    ],
  };

  if (myChart) {
    // Update existing chart
    myChart.data.datasets[0].data = dataValues;
    myChart.update();
  } else {
    // Create new chart
    myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Students",
            data: dataValues,
            backgroundColor: chartColors.backgroundColor,
            borderColor: chartColors.borderColor,
            borderWidth: 2,
            borderRadius: 6,
            maxBarThickness: 80,
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
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 12,
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 14,
            },
            callbacks: {
              label: function (context) {
                return `${context.parsed.y} students`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              precision: 0,
              font: {
                size: 12,
              },
            },
            title: {
              display: true,
              text: "Number of Students",
              font: {
                size: 14,
                weight: "bold",
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 12,
              },
            },
          },
        },
        animation: {
          duration: 500,
        },
      },
    });
  }
};

onMounted(async () => {
  await fetchData();

  classes.value = classStore.getClassNames;
});

// Watch for data changes and update the chart accordingly
watch(
  distribution,
  (newDistribution) => {
    const allZero = Object.values(newDistribution).every(
      (value) => value === 0
    );

    if (!allZero) {
      // Ensure the DOM has updated (e.g. the chart container is rendered) before updating the chart
      nextTick(() => {
        updateChart();
      });
    } else if (myChart) {
      myChart.destroy();
      myChart = null;
    }
  },
  { deep: true }
);
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 250px;
}
</style>
