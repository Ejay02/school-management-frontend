<template>
  <div class="rounded-lg border border-gray-300 p-4 w-full bg-gray-50 mt-4">
    <div class="flex flex-col gap-4">
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
      >
        <div>
          <h2 class="text-xl font-bold text-gray-700">Term Reports</h2>
          <p class="text-sm text-gray-500">
            Generate clean PDF reports for individual students or batch download
            a full class.
          </p>
        </div>

        <div
          v-if="bulkProgressText"
          class="text-sm text-indigo-600 font-medium"
        >
          {{ bulkProgressText }}
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Dropdown
          class="w-full"
          v-model="selectedClassName"
          label="Class"
          :options="classOptions"
          emptyLabel="Select a class"
        />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Academic Period
          </label>
          <input
            v-model.trim="academicPeriod"
            type="text"
            placeholder="2024/2025"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Term
          </label>
          <select
            v-model="selectedTerm"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option
              v-for="term in termOptions"
              :key="term.value"
              :value="term.value"
            >
              {{ term.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Student
          </label>
          <select
            v-model="selectedStudentId"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Select a student</option>
            <option
              v-for="student in classStudents"
              :key="student.id"
              :value="student.id"
            >
              {{ getStudentName(student) }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          :disabled="!selectedStudent || busy"
          @click="downloadStudentReport(selectedStudent)"
        >
          {{
            downloadingStudentId === selectedStudent?.id
              ? "Generating..."
              : "Download Student PDF"
          }}
        </button>

        <button
          type="button"
          class="rounded-md border border-indigo-300 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
          :disabled="!classStudents.length || busy"
          @click="downloadClassReports"
        >
          {{
            bulkDownloading ? "Preparing Batch..." : "Download Class Reports"
          }}
        </button>
      </div>

      <LoadingScreen
        v-if="initializing"
        message="Loading report generator..."
      />

      <EmptyState
        v-else-if="!classStudents.length"
        icon="fa-regular fa-file-lines"
        heading="No students in this class"
        description="Select a class with enrolled students to generate term reports."
      />

      <div
        v-else
        class="overflow-x-auto rounded-lg border border-gray-200 bg-white"
      >
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Student
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Class
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Period
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Term
              </th>
              <th
                class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="student in classStudents" :key="student.id">
              <td class="px-4 py-3 text-sm text-gray-700">
                {{ getStudentName(student) }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">
                {{ selectedClassName || "-" }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">
                {{ academicPeriod || "-" }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">
                {{ selectedTermLabel }}
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  type="button"
                  class="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-gray-400"
                  :disabled="busy"
                  @click="downloadStudentReport(student)"
                >
                  {{
                    downloadingStudentId === student.id
                      ? "Generating..."
                      : "Download"
                  }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { apolloClient } from "../../../apollo-client";
import {
  getAttendances,
  getSetupStateQuery,
  getStudentResults,
} from "../../graphql/queries";
import { useClassStore } from "../../store/classStore";
import { useNotificationStore } from "../../store/notification";
import Dropdown from "../dropdowns/dropdown.vue";
import EmptyState from "../emptyState.vue";
import LoadingScreen from "../loadingScreen.vue";
import {
  downloadTermReportPdf,
  formatScoreLabel,
} from "../../utils/termReportPdf";

const classStore = useClassStore();
const notificationStore = useNotificationStore();

const initializing = ref(true);
const selectedClassName = ref("");
const selectedStudentId = ref("");
const selectedTerm = ref("FIRST");
const academicPeriod = ref("");
const setupState = ref(null);
const downloadingStudentId = ref("");
const bulkDownloading = ref(false);
const bulkProgressText = ref("");

const termOptions = [
  { label: "First Term", value: "FIRST" },
  { label: "Second Term", value: "SECOND" },
  { label: "Third Term", value: "THIRD" },
];

const classOptions = computed(() => {
  return classStore.getClassNames?.map((classItem) => classItem.name) || [];
});

const selectedClass = computed(() => {
  return classStore.getClassByName(selectedClassName.value);
});

const classStudents = computed(() => {
  return Array.isArray(selectedClass.value?.students)
    ? selectedClass.value.students
    : [];
});

const selectedStudent = computed(() => {
  return (
    classStudents.value.find(
      (student) => student.id === selectedStudentId.value,
    ) || null
  );
});

const selectedTermLabel = computed(() => {
  return (
    termOptions.find((term) => term.value === selectedTerm.value)?.label ||
    "Term"
  );
});

const busy = computed(() => {
  return Boolean(downloadingStudentId.value || bulkDownloading.value);
});

function getStudentName(student) {
  return (
    [student?.name, student?.surname].filter(Boolean).join(" ") || "Student"
  );
}

function buildDefaultAcademicPeriod(state) {
  const current = String(state?.academicYearCurrent || "").trim();
  const next = String(state?.academicYearNext || "").trim();
  if (current && next) return `${current}/${next}`;
  return "";
}

function resolveAcademicYears(periodValue) {
  const trimmed = String(periodValue || "").trim();
  const match = trimmed.match(/(\d{4})\s*\/\s*(\d{4})/);
  if (match) {
    return {
      firstYear: Number.parseInt(match[1], 10),
      secondYear: Number.parseInt(match[2], 10),
    };
  }

  const setupFirstYear = Number.parseInt(
    String(setupState.value?.academicYearCurrent || ""),
    10,
  );
  const setupSecondYear = Number.parseInt(
    String(setupState.value?.academicYearNext || ""),
    10,
  );

  if (Number.isFinite(setupFirstYear) && Number.isFinite(setupSecondYear)) {
    return { firstYear: setupFirstYear, secondYear: setupSecondYear };
  }

  return null;
}

function getTermDateRange(term, periodValue) {
  const years = resolveAcademicYears(periodValue);
  if (!years) return null;

  if (term === "FIRST") {
    return {
      start: new Date(years.firstYear, 8, 1),
      end: new Date(years.firstYear, 11, 31, 23, 59, 59, 999),
    };
  }

  if (term === "SECOND") {
    return {
      start: new Date(years.secondYear, 0, 1),
      end: new Date(years.secondYear, 2, 31, 23, 59, 59, 999),
    };
  }

  return {
    start: new Date(years.secondYear, 3, 1),
    end: new Date(years.secondYear, 6, 31, 23, 59, 59, 999),
  };
}

function average(values) {
  if (!Array.isArray(values) || !values.length) return null;
  return (
    values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length
  );
}

function buildSubjectRows(filteredResults) {
  const subjectMap = new Map();

  filteredResults.forEach((result) => {
    const subjectName =
      result?.exam?.subject?.name ||
      result?.assignment?.subject?.name ||
      "General";

    if (!subjectMap.has(subjectName)) {
      subjectMap.set(subjectName, {
        name: subjectName,
        examScores: [],
        assignmentScores: [],
      });
    }

    const subject = subjectMap.get(subjectName);
    if (result?.exam?.id) {
      subject.examScores.push(Number(result.score || 0));
    } else if (result?.assignment?.id) {
      subject.assignmentScores.push(Number(result.score || 0));
    } else {
      subject.assignmentScores.push(Number(result.score || 0));
    }
  });

  return Array.from(subjectMap.values())
    .map((subject) => {
      const examAverage = average(subject.examScores);
      const assignmentAverage = average(subject.assignmentScores);
      const finalScore =
        Number.isFinite(examAverage) && Number.isFinite(assignmentAverage)
          ? examAverage * 0.6 + assignmentAverage * 0.4
          : Number.isFinite(examAverage)
            ? examAverage
            : Number.isFinite(assignmentAverage)
              ? assignmentAverage
              : null;

      return {
        name: subject.name,
        examAverage,
        assignmentAverage,
        finalScore,
        examAverageLabel: formatScoreLabel(examAverage),
        assignmentAverageLabel: formatScoreLabel(assignmentAverage),
        finalScoreLabel: formatScoreLabel(finalScore),
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
}

function buildTeacherRemarks(filteredResults) {
  const remarks = filteredResults
    .map((result) => String(result?.comments || "").trim())
    .filter(Boolean);

  return [...new Set(remarks)].slice(0, 4);
}

function buildAttendanceSummary(attendances, periodValue) {
  const dateRange = getTermDateRange(selectedTerm.value, periodValue);
  const scopedAttendances = Array.isArray(attendances)
    ? attendances.filter((attendance) => {
        if (!dateRange) return true;
        const date = new Date(attendance.date);
        return date >= dateRange.start && date <= dateRange.end;
      })
    : [];

  const total = scopedAttendances.length;
  const present = scopedAttendances.filter(
    (attendance) => attendance.present,
  ).length;
  const absent = total - present;
  const rate = total ? (present / total) * 100 : 0;

  return {
    present,
    absent,
    total,
    rate,
  };
}

async function fetchStudentReportData(student) {
  const [resultsResponse, attendanceResponse] = await Promise.all([
    apolloClient.query({
      query: getStudentResults,
      variables: { studentId: student.id },
      fetchPolicy: "network-only",
    }),
    apolloClient.query({
      query: getAttendances,
      variables: { studentId: student.id },
      fetchPolicy: "network-only",
    }),
  ]);

  const results = Array.isArray(resultsResponse?.data?.getStudentResults)
    ? resultsResponse.data.getStudentResults
    : [];
  const attendances = Array.isArray(attendanceResponse?.data?.getAttendances)
    ? attendanceResponse.data.getAttendances
    : [];

  const filteredResults = results.filter((result) => {
    const sameTerm = String(result?.term || "") === selectedTerm.value;
    const samePeriod = !academicPeriod.value
      ? true
      : String(result?.academicPeriod || "").trim() === academicPeriod.value;
    return sameTerm && samePeriod;
  });

  const subjects = buildSubjectRows(filteredResults);
  const finalScores = subjects
    .map((subject) => subject.finalScore)
    .filter((score) => Number.isFinite(score));
  const overallAverage = finalScores.length ? average(finalScores) : null;
  const attendance = buildAttendanceSummary(attendances, academicPeriod.value);
  const teacherRemarks = buildTeacherRemarks(filteredResults);
  const schoolName =
    String(setupState.value?.schoolName || "").trim() || "My School";

  return {
    school: {
      name: schoolName,
      logoUrl: setupState.value?.schoolLogo || "",
      address: setupState.value?.schoolAddress || "",
    },
    studentName: getStudentName(student),
    studentId: student?.id || "-",
    className: selectedClassName.value || "-",
    academicPeriod: academicPeriod.value || "All Periods",
    term: selectedTerm.value,
    termLabel: selectedTermLabel.value,
    generatedAtLabel: new Date().toLocaleString(),
    overallAverage,
    overallAverageLabel: formatScoreLabel(overallAverage),
    attendance,
    attendanceRateLabel: formatScoreLabel(attendance.rate),
    subjects,
    teacherRemarks,
  };
}

function validateInputs() {
  if (!selectedClassName.value) {
    notificationStore.addNotification({
      type: "warning",
      message: "Select a class before generating reports.",
    });
    return false;
  }

  if (!academicPeriod.value) {
    notificationStore.addNotification({
      type: "warning",
      message: "Enter the academic period to generate reports.",
    });
    return false;
  }

  return true;
}

async function downloadStudentReport(student) {
  if (!validateInputs() || !student) return;

  downloadingStudentId.value = student.id;

  try {
    const report = await fetchStudentReportData(student);
    await downloadTermReportPdf(report);

    notificationStore.addNotification({
      type: "success",
      message: `Downloaded ${getStudentName(student)}'s term report.`,
    });
  } catch (error) {
    console.error("Failed to generate student term report", error);
    notificationStore.addNotification({
      type: "error",
      message: `Failed to generate ${getStudentName(student)}'s report.`,
      timeout: 3500,
    });
  } finally {
    downloadingStudentId.value = "";
  }
}

async function downloadClassReports() {
  if (!validateInputs() || !classStudents.value.length) return;

  bulkDownloading.value = true;

  try {
    for (let index = 0; index < classStudents.value.length; index += 1) {
      const student = classStudents.value[index];
      downloadingStudentId.value = student.id;
      bulkProgressText.value = `Generating ${index + 1} of ${classStudents.value.length}`;

      const report = await fetchStudentReportData(student);
      await downloadTermReportPdf(report);

      await new Promise((resolve) => {
        window.setTimeout(resolve, 200);
      });
    }

    notificationStore.addNotification({
      type: "success",
      message: `Downloaded ${classStudents.value.length} term reports for ${selectedClassName.value}.`,
      timeout: 3500,
    });
  } catch (error) {
    console.error("Failed to generate class term reports", error);
    notificationStore.addNotification({
      type: "error",
      message: "Failed to finish the class report download.",
      timeout: 3500,
    });
  } finally {
    downloadingStudentId.value = "";
    bulkProgressText.value = "";
    bulkDownloading.value = false;
  }
}

watch(selectedClassName, () => {
  const firstStudent = classStudents.value[0];
  selectedStudentId.value = firstStudent?.id || "";
});

watch(classStudents, (students) => {
  if (!students.length) {
    selectedStudentId.value = "";
    return;
  }

  const stillExists = students.some(
    (student) => student.id === selectedStudentId.value,
  );
  if (!stillExists) {
    selectedStudentId.value = students[0].id;
  }
});

onMounted(async () => {
  try {
    if (!classStore.getClassNames?.length) {
      await classStore.fetchClasses({ page: 1, limit: 1000 });
    }

    const { data } = await apolloClient.query({
      query: getSetupStateQuery,
      fetchPolicy: "network-only",
    });

    setupState.value = data?.getSetupState || null;
    academicPeriod.value = buildDefaultAcademicPeriod(setupState.value);
    selectedTerm.value = setupState.value?.currentTerm || "FIRST";

    if (classOptions.value.length) {
      selectedClassName.value = classOptions.value[0];
    }
  } catch (error) {
    console.error("Failed to initialize term reports", error);
    notificationStore.addNotification({
      type: "error",
      message: "Unable to load the term report generator.",
      timeout: 3500,
    });
  } finally {
    initializing.value = false;
  }
});
</script>
