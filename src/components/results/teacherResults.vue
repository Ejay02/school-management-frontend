<template>
  <div class="rounded-lg border border-gray-300 p-4 w-full bg-gray-50">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-700">Class Results</h2>

      <div class="flex space-x-4">
        <!-- Class selection dropdown -->
        <Dropdown
          class="w-56"
          v-model="selectedClass"
          label="Select Class"
          :options="classOptions"
          emptyLabel="Select a class"
        />

        <!-- Academic Period dropdown -->
        <Dropdown
          class="w-56"
          v-model="selectedPeriod"
          label="Academic Period"
          :options="academicPeriods"
          emptyLabel="Select period"
        />
      </div>
    </div>

    <div class="bg-gray-200 p-6 rounded-lg shadow-lg">
      <LoadingScreen v-if="loading" message="Loading Results..." />

      <ErrorScreen v-else-if="error" />

      <EmptyState
        v-else-if="!hasResults && !loading"
        icon="fa-solid fa-chart-simple"
        heading="No results available"
        description="No results have been recorded for this class and period yet."
      />

      <!-- Results Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg overflow-hidden">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Student
              </th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-600">
                First Term
              </th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Second Term
              </th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Third Term
              </th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Overall
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="student in students"
              :key="student.id"
              class="hover:bg-gray-50"
            >
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img
                      :src="student.image || '/avatar.png'"
                      class="h-10 w-10 rounded-full object-cover"
                      alt="Student"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="font-medium text-gray-900">
                      {{ student.name }} {{ student.surname }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 text-sm">
                {{
                  student.termResults.FIRST.averageScore
                    ? `${student.termResults.FIRST.averageScore}%`
                    : "N/A"
                }}
              </td>
              <td class="py-3 px-4 text-sm">
                {{
                  student.termResults.SECOND.averageScore
                    ? `${student.termResults.SECOND.averageScore}%`
                    : "N/A"
                }}
              </td>
              <td class="py-3 px-4 text-sm">
                {{
                  student.termResults.THIRD.averageScore
                    ? `${student.termResults.THIRD.averageScore}%`
                    : "N/A"
                }}
              </td>
              <td
                class="py-3 px-4 text-sm font-medium"
                :class="getScoreColorClass(student.termResults.OVERALL.score)"
              >
                {{
                  student.termResults.OVERALL.score
                    ? `${student.termResults.OVERALL.score}%`
                    : "N/A"
                }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="mt-4 flex justify-between items-center">
          <div class="text-sm text-gray-700">
            Showing {{ students.length }} of {{ totalStudents }} students
          </div>
          <Pagination
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useClassStore } from "../../store/classStore";
import { useResultStore } from "../../store/resultStore";

import Dropdown from "../dropdowns/dropdown.vue";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";
import Pagination from "../pagination.vue";

const classStore = useClassStore();
const resultStore = useResultStore();

const loading = computed(() => resultStore.loading);
const error = computed(() => resultStore.error);

// Class selection
const selectedClass = ref("");
const selectedClassId = ref("");

// Academic period selection
const selectedPeriod = ref("2023/2024");
const academicPeriods = ref(["2022/2023", "2023/2024", "2024/2025"]);

// Pagination
const currentPage = ref(1);
const pageLimit = ref(10);

const classOptions = computed(() => {
  return classStore.getClassNames?.map((classItem) => classItem.name) || [];
});

// Computed properties for results data
const students = computed(() => {
  return resultStore.classResults?.data || [];
});

const totalStudents = computed(() => {
  return resultStore.classResults?.meta?.total || 0;
});

const totalPages = computed(() => {
  return resultStore.classResults?.meta?.lastPage || 1;
});

const hasResults = computed(() => {
  return students.value.length > 0;
});

// Function to fetch class results
const fetchClassResults = async () => {
  if (!selectedClassId.value || !selectedPeriod.value) return;

  const params = {
    page: currentPage.value,
    limit: pageLimit.value,
  };

  await resultStore.fetchClassResults(
    selectedClassId.value,
    selectedPeriod.value,
    params
  );
};

// Handle page change
const handlePageChange = (page) => {
  currentPage.value = page;
};

// Get color class based on score
const getScoreColorClass = (score) => {
  if (!score) return "";
  if (score >= 90) return "text-emerald-600";
  if (score >= 80) return "text-blue-600";
  if (score >= 70) return "text-amber-600";
  if (score < 50) return "text-red-600";
  return "text-gray-700";
};

// Map class name to class ID
watch(selectedClass, (newClassName) => {
  const classObj = classStore.getClassNames.find(
    (c) => c.name === newClassName
  );
  if (classObj) {
    selectedClassId.value = classObj.id;
    fetchClassResults();
  }
});

// Watch for page changes
watch([currentPage, selectedPeriod], () => {
  if (selectedClassId.value) {
    fetchClassResults();
  }
});

onMounted(async () => {
  // Load classes if not already loaded
  if (!classStore.getClassNames || classStore.getClassNames.length === 0) {
    await classStore.fetchClasses();
  }

  // Set default class if available
  if (classStore.getClassNames && classStore.getClassNames.length > 0) {
    selectedClass.value = classStore.getClassNames[0].name;
    selectedClassId.value = classStore.getClassNames[0].id;
    fetchClassResults();
  }
});
</script>
