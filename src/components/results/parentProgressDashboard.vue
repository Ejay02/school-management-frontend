<template>
  <div class="space-y-6">
    <!-- Top Filter Controls -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Academic Period</label>
        <input
          v-model.trim="academicPeriod"
          type="text"
          placeholder="e.g. 2024/2025"
          @change="fetchData"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Term</label>
        <select
          v-model="selectedTerm"
          @change="fetchData"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="FIRST">First Term</option>
          <option value="SECOND">Second Term</option>
          <option value="THIRD">Third Term</option>
        </select>
      </div>

      <div class="flex items-end">
        <button
          type="button"
          class="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300 flex items-center justify-center gap-2"
          :disabled="loading || !report"
          @click="downloadReportPDF"
        >
          <i class="fa-solid fa-file-pdf"></i>
          {{ downloadingPdf ? "Preparing PDF..." : "Download Report Card (PDF)" }}
        </button>
      </div>
    </div>

    <LoadingScreen v-if="loading" message="Loading analytics dashboard..." />

    <!-- No Report State -->
    <div
      v-else-if="!report"
      class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
    >
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-4">
        <i class="fa-regular fa-calendar-times text-lg"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-900">Report Card Not Published</h3>
      <p class="mt-2 text-sm text-gray-500 max-w-md mx-auto">
        The official report card for {{ selectedStudentName }} in {{ selectedTermLabel }} ({{ academicPeriod }}) has not been published yet by the school administration.
      </p>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-6 animate-fade-in">
      <!-- Overview Statistics Cards -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Average Score Card -->
        <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-wider text-indigo-100 font-semibold">Term Average</p>
            <p class="mt-2 text-3xl font-bold">{{ overallAverageLabel }}</p>
          </div>
          <div class="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-xl">
            <i class="fa-solid fa-graduation-cap"></i>
          </div>
        </div>

        <!-- Class Position Card -->
        <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-wider text-emerald-100 font-semibold">Class Position</p>
            <p class="mt-2 text-3xl font-bold">{{ classPositionLabel }}</p>
          </div>
          <div class="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-xl">
            <i class="fa-solid fa-award"></i>
          </div>
        </div>

        <!-- Attendance Card -->
        <div class="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-5 text-white shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-wider text-amber-100 font-semibold">Attendance Rate</p>
            <p class="mt-2 text-3xl font-bold">{{ attendanceRateLabel }}</p>
          </div>
          <div class="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-xl">
            <i class="fa-solid fa-calendar-check"></i>
          </div>
        </div>
      </section>

      <!-- Charts Section -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Subject Scores Chart -->
        <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <i class="fa-solid fa-chart-bar text-indigo-500"></i>
            Subject Grade Comparison
          </h3>
          <div class="h-64 flex items-center justify-center">
            <Bar :data="subjectChartData" :options="subjectChartOptions" />
          </div>
        </div>

        <!-- Term Progression Chart -->
        <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <i class="fa-solid fa-chart-line text-purple-500"></i>
            Term Performance Progression
          </h3>
          <div class="h-64 flex items-center justify-center">
            <Line :data="progressionChartData" :options="progressionChartOptions" />
          </div>
        </div>
      </section>

      <!-- Detailed Breakdown & Remark Grid -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Subject Marks Breakdown Table -->
        <div class="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="bg-gray-50/70 px-5 py-4 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-700">Subject Breakdown</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50/50">
                <tr>
                  <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Subject</th>
                  <th class="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Assignments</th>
                  <th class="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Exams</th>
                  <th class="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 font-bold">Final Term Score</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="subject in report.subjectGrades" :key="subject.name" class="hover:bg-gray-50/40">
                  <td class="px-5 py-3.5 text-sm font-medium text-gray-700">{{ subject.name }}</td>
                  <td class="px-5 py-3.5 text-sm text-center text-gray-500">{{ formatScoreLabel(subject.assignmentAverage) }}</td>
                  <td class="px-5 py-3.5 text-sm text-center text-gray-500">{{ formatScoreLabel(subject.examAverage) }}</td>
                  <td class="px-5 py-3.5 text-sm text-center font-bold" :class="getGradeColorClass(subject.finalScore)">
                    {{ formatScoreLabel(subject.finalScore) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Official Report Card Remark -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-700 border-b pb-3 flex items-center gap-2">
              <i class="fa-solid fa-quote-left text-gray-400"></i>
              Supervisor Remark
            </h3>
            <p class="text-sm font-serif italic text-gray-600 leading-relaxed whitespace-pre-line">
              {{ report.remark?.remark || "No formal remark entered for this term report yet." }}
            </p>
          </div>

          <div v-if="report.remark?.publishedAt" class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>Approved by Administration</span>
            <span>{{ formatDateLabel(report.remark.publishedAt) }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { apolloClient } from "../../../apollo-client";
import { getStudentTermReport, getSetupStateQuery } from "../../graphql/queries";
import { useParentLinkedStudents } from "../../composables/useParentLinkedStudents";
import { useNotificationStore } from "../../store/notification";
import LoadingScreen from "../loadingScreen.vue";
import {
  downloadTermReportPdf,
  formatScoreLabel,
} from "../../utils/termReportPdf";

// Chart.js imports
import { Bar, Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const notificationStore = useNotificationStore();
const { selectedStudentId, selectedStudentName } = useParentLinkedStudents();

const loading = ref(false);
const downloadingPdf = ref(false);
const academicPeriod = ref("");
const selectedTerm = ref("FIRST");
const report = ref(null);
const progressionData = ref({
  FIRST: null,
  SECOND: null,
  THIRD: null,
});

const termOptions = [
  { label: "First Term", value: "FIRST" },
  { label: "Second Term", value: "SECOND" },
  { label: "Third Term", value: "THIRD" },
];

const selectedTermLabel = computed(() => {
  return termOptions.find((t) => t.value === selectedTerm.value)?.label || "Term";
});

const overallAverageLabel = computed(() => {
  return formatScoreLabel(report.value?.overallAverage);
});

const attendanceRateLabel = computed(() => {
  return formatScoreLabel(report.value?.attendance?.attendanceRate);
});

const classPositionLabel = computed(() => {
  const position = report.value?.ranking?.position;
  const total = report.value?.ranking?.totalStudents || 0;
  if (!position) return total ? `- / ${total}` : "-";
  return `${position} / ${total}`;
});

const getGradeColorClass = (score) => {
  if (typeof score !== "number") return "text-gray-400";
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-indigo-650";
  if (score >= 40) return "text-amber-600";
  return "text-rose-600";
};

const formatDateLabel = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Chart Data Configs
const subjectChartData = computed(() => {
  const grades = report.value?.subjectGrades || [];
  return {
    labels: grades.map((g) => g.name),
    datasets: [
      {
        label: "Final Score",
        data: grades.map((g) => g.finalScore ?? 0),
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderRadius: 6,
        borderWidth: 0,
      },
    ],
  };
});

const subjectChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 100,
      ticks: {
        callback: (value) => `${value}%`,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

const progressionChartData = computed(() => {
  return {
    labels: ["First Term", "Second Term", "Third Term"],
    datasets: [
      {
        label: "Overall Average",
        data: [
          progressionData.value.FIRST,
          progressionData.value.SECOND,
          progressionData.value.THIRD,
        ],
        borderColor: "rgba(168, 85, 247, 0.8)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        pointBackgroundColor: "rgba(168, 85, 247, 1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };
});

const progressionChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 100,
      ticks: {
        callback: (value) => `${value}%`,
      },
    },
  },
};

// Data Actions
async function fetchProgressionData() {
  if (!selectedStudentId.value || !academicPeriod.value) return;

  const terms = ["FIRST", "SECOND", "THIRD"];
  const promises = terms.map((term) =>
    apolloClient
      .query({
        query: getStudentTermReport,
        variables: {
          studentId: selectedStudentId.value,
          academicPeriod: academicPeriod.value,
          term,
        },
        fetchPolicy: "network-only",
      })
      .catch(() => null)
  );

  const results = await Promise.all(promises);
  results.forEach((res, index) => {
    const term = terms[index];
    progressionData.value[term] =
      res?.data?.getStudentTermReport?.overallAverage ?? null;
  });
}

async function fetchData() {
  if (!selectedStudentId.value) return;
  loading.value = true;
  report.value = null;

  try {
    const { data } = await apolloClient.query({
      query: getStudentTermReport,
      variables: {
        studentId: selectedStudentId.value,
        academicPeriod: academicPeriod.value,
        term: selectedTerm.value,
      },
      fetchPolicy: "network-only",
    });

    report.value = data?.getStudentTermReport || null;
  } catch (error) {
    // Report not found or draft (returns ForbiddenException/GraphQLError)
    report.value = null;
  } finally {
    loading.value = false;
    await fetchProgressionData();
  }
}

// Prefill setup state academic period
async function loadSetupState() {
  try {
    const { data } = await apolloClient.query({
      query: getSetupStateQuery,
    });
    const state = data?.getSetupState;
    if (state) {
      const current = String(state.academicYearCurrent || "").trim();
      const next = String(state.academicYearNext || "").trim();
      if (current && next) {
        academicPeriod.value = `${current}/${next}`;
      }
      selectedTerm.value = state.currentTerm || "FIRST";
    }
  } catch {
    // Use fallback prefill
    academicPeriod.value = "2024/2025";
  }
}

function mapReportToPdfPayload(r) {
  return {
    school: {
      name: r.schoolName || "School",
      logoUrl: r.schoolLogo || "",
      address: r.schoolAddress || "",
    },
    studentName: r.studentName || "Student",
    studentId: r.studentCode || r.studentId || "-",
    className: r.className || "-",
    academicPeriod: r.academicPeriod || academicPeriod.value || "-",
    term: r.term || selectedTerm.value,
    termLabel: selectedTermLabel.value,
    generatedAtLabel: new Date().toLocaleString(),
    overallAverage: r.overallAverage ?? null,
    overallAverageLabel: formatScoreLabel(r.overallAverage),
    attendance: {
      present: r.attendance?.presentClasses || 0,
      absent: r.attendance?.absentClasses || 0,
      total: r.attendance?.totalClasses || 0,
      rate: r.attendance?.attendanceRate || 0,
    },
    attendanceRateLabel: formatScoreLabel(r.attendance?.attendanceRate),
    subjects: Array.isArray(r.subjectGrades)
      ? r.subjectGrades.map((subject) => ({
          ...subject,
          examAverageLabel: formatScoreLabel(subject.examAverage),
          assignmentAverageLabel: formatScoreLabel(subject.assignmentAverage),
          finalScoreLabel: formatScoreLabel(subject.finalScore),
        }))
      : [],
    teacherRemarks: r.remark?.remark ? [r.remark.remark] : [],
    ranking: r.ranking || { position: null, totalStudents: 0 },
  };
}

async function downloadReportPDF() {
  if (!report.value || downloadingPdf.value) return;
  downloadingPdf.value = true;

  try {
    const payload = mapReportToPdfPayload(report.value);
    await downloadTermReportPdf(payload);
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: "Failed to download report PDF card: " + error.message,
    });
  } finally {
    downloadingPdf.value = false;
  }
}

onMounted(async () => {
  await loadSetupState();
  await fetchData();
});

watch(selectedStudentId, async () => {
  await fetchData();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
