<template>
  <div class="rounded-lg border border-gray-300 p-4 w-full bg-gray-50 mt-4">
    <div class="flex flex-col gap-4">
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
      >
        <div>
          <h2 class="text-xl font-bold text-gray-700">Term Reports</h2>
          <p class="text-sm text-gray-500">
            Auto-calculated draft reports from marked exams, assessments, and
            attendance. Review, save the final remark, then download one PDF or
            a class ZIP.
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
          @click="downloadSelectedStudentReport"
        >
          {{
            downloadingStudentId === selectedStudent?.id
              ? "Preparing..."
              : "Download Student PDF"
          }}
        </button>

        <button
          type="button"
          class="rounded-md border border-indigo-300 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
          :disabled="!classStudents.length || busy"
          @click="downloadClassReports"
        >
          {{ bulkDownloading ? "Preparing ZIP..." : "Download Class ZIP" }}
        </button>
      </div>

      <div
        class="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700"
      >
        Formula: {{ reportFormulaLabel }}
      </div>

      <LoadingScreen
        v-if="initializing"
        message="Loading report generator..."
      />

      <EmptyState
        v-else-if="!classStudents.length"
        icon="fa-regular fa-file-lines"
        heading="No students in this class"
        description="Select a class with enrolled students to preview and download term reports."
      />

      <div v-else class="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div
          class="xl:col-span-2 overflow-x-auto rounded-lg border border-gray-200 bg-white"
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
                  Position
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Average
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Attendance
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
                  {{
                    previewMatchesStudent(student.id)
                      ? previewPositionLabel
                      : "-"
                  }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{
                    previewMatchesStudent(student.id)
                      ? previewAverageLabel
                      : "-"
                  }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{
                    previewMatchesStudent(student.id)
                      ? previewAttendanceLabel
                      : "-"
                  }}
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

        <div class="rounded-lg border border-gray-200 bg-white p-4">
          <LoadingScreen
            v-if="reportLoading"
            message="Loading selected report..."
          />

          <EmptyState
            v-else-if="!reportPreview"
            icon="fa-regular fa-file-lines"
            heading="No report selected"
            description="Choose a student, term, and academic period to preview the auto-calculated report and save the final term remark."
          />

          <div v-else class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">
                {{ reportPreview.studentName }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ reportPreview.className }} • {{ selectedTermLabel }} •
                {{ reportPreview.academicPeriod }}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-lg bg-indigo-50 p-3">
                <div class="text-xs uppercase tracking-wide text-indigo-500">
                  Average
                </div>
                <div class="mt-1 text-lg font-semibold text-indigo-700">
                  {{ previewAverageLabel }}
                </div>
              </div>
              <div class="rounded-lg bg-emerald-50 p-3">
                <div class="text-xs uppercase tracking-wide text-emerald-500">
                  Attendance
                </div>
                <div class="mt-1 text-lg font-semibold text-emerald-700">
                  {{ previewAttendanceLabel }}
                </div>
              </div>
              <div class="rounded-lg bg-amber-50 p-3">
                <div class="text-xs uppercase tracking-wide text-amber-500">
                  Position
                </div>
                <div class="mt-1 text-lg font-semibold text-amber-700">
                  {{ previewPositionLabel }}
                </div>
              </div>
              <div class="rounded-lg bg-slate-50 p-3">
                <div class="text-xs uppercase tracking-wide text-slate-500">
                  Subjects
                </div>
                <div class="mt-1 text-lg font-semibold text-slate-700">
                  {{ reportPreview.subjectGrades?.length || 0 }}
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Official Term Remark
              </label>
              <textarea
                v-model.trim="remarkDraft"
                rows="7"
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Enter the official term remark that should appear on the report..."
              ></textarea>
              <p class="mt-2 text-xs text-gray-500">
                Saved remark appears in downloaded PDFs and overrides scattered
                result comments.
              </p>
            </div>

            <div class="flex items-center gap-3">
              <button
                type="button"
                class="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-gray-400"
                :disabled="savingRemark || !reportPreview"
                @click="saveRemark"
              >
                {{ savingRemark ? "Saving..." : "Save Remark" }}
              </button>
              <span
                v-if="reportPreview.remark?.updatedAt"
                class="text-xs text-gray-500"
              >
                Last saved {{ formatTimestamp(reportPreview.remark.updatedAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { apolloClient } from "../../../apollo-client";
import { upsertTermReportRemarkMutation } from "../../graphql/mutations";
import {
  getSetupStateQuery,
  getStudentTermReport,
} from "../../graphql/queries";
import { useClassStore } from "../../store/classStore";
import { useNotificationStore } from "../../store/notification";
import Dropdown from "../dropdowns/dropdown.vue";
import EmptyState from "../emptyState.vue";
import LoadingScreen from "../loadingScreen.vue";
import {
  buildTermReportPdfBlob,
  downloadTermReportPdf,
  downloadZipArchive,
  formatScoreLabel,
} from "../../utils/termReportPdf";

const classStore = useClassStore();
const notificationStore = useNotificationStore();

const initializing = ref(true);
const reportLoading = ref(false);
const savingRemark = ref(false);
const selectedClassName = ref("");
const selectedStudentId = ref("");
const selectedTerm = ref("FIRST");
const academicPeriod = ref("");
const setupState = ref(null);
const reportPreview = ref(null);
const remarkDraft = ref("");
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
  return Boolean(
    downloadingStudentId.value || bulkDownloading.value || savingRemark.value,
  );
});

const previewAverageLabel = computed(() => {
  return formatScoreLabel(reportPreview.value?.overallAverage);
});

const previewAttendanceLabel = computed(() => {
  return formatScoreLabel(reportPreview.value?.attendance?.attendanceRate);
});

const previewPositionLabel = computed(() => {
  const position = reportPreview.value?.ranking?.position;
  const totalStudents = reportPreview.value?.ranking?.totalStudents || 0;
  if (!position) return totalStudents ? `- / ${totalStudents}` : "-";
  return `${position} / ${totalStudents}`;
});

const reportFormulaLabel = computed(() => {
  const examWeight = Number(setupState.value?.reportExamWeight ?? 60);
  const assessmentWeight = Number(
    setupState.value?.reportAssessmentWeight ?? 30,
  );
  const attendanceWeight = Number(
    setupState.value?.reportAttendanceWeight ?? 10,
  );
  return `${examWeight}% exams, ${assessmentWeight}% assessments, ${attendanceWeight}% attendance`;
});

function getStudentName(student) {
  return (
    [student?.name, student?.surname].filter(Boolean).join(" ") || "Student"
  );
}

function formatTimestamp(value) {
  if (!value) return "";
  return new Date(value).toLocaleString();
}

function buildDefaultAcademicPeriod(state) {
  const current = String(state?.academicYearCurrent || "").trim();
  const next = String(state?.academicYearNext || "").trim();
  if (current && next) return `${current}/${next}`;
  return "";
}

function hasValidAcademicPeriod(value) {
  return /^\d{4}\s*\/\s*\d{4}$/.test(String(value || "").trim());
}

function validateInputs(notify = true) {
  if (!selectedClassName.value) {
    if (notify) {
      notificationStore.addNotification({
        type: "warning",
        message: "Select a class before loading reports.",
      });
    }
    return false;
  }

  if (!academicPeriod.value) {
    if (notify) {
      notificationStore.addNotification({
        type: "warning",
        message: "Enter the academic period to load reports.",
      });
    }
    return false;
  }

  if (!hasValidAcademicPeriod(academicPeriod.value)) {
    if (notify) {
      notificationStore.addNotification({
        type: "warning",
        message: "Academic period must use the format YYYY/YYYY.",
      });
    }
    return false;
  }

  return true;
}

function previewMatchesStudent(studentId) {
  return reportPreview.value?.studentId === studentId;
}

function mapReportToPdfPayload(report) {
  return {
    school: {
      name: report?.schoolName || "My School",
      logoUrl: report?.schoolLogo || "",
      address: report?.schoolAddress || "",
    },
    studentName: report?.studentName || "Student",
    studentId: report?.studentCode || report?.studentId || "-",
    className: report?.className || "-",
    academicPeriod: report?.academicPeriod || academicPeriod.value || "-",
    term: report?.term || selectedTerm.value,
    termLabel: selectedTermLabel.value,
    generatedAtLabel: new Date().toLocaleString(),
    overallAverage: report?.overallAverage ?? null,
    overallAverageLabel: formatScoreLabel(report?.overallAverage),
    attendance: {
      present: report?.attendance?.presentClasses || 0,
      absent: report?.attendance?.absentClasses || 0,
      total: report?.attendance?.totalClasses || 0,
      rate: report?.attendance?.attendanceRate || 0,
    },
    attendanceRateLabel: formatScoreLabel(report?.attendance?.attendanceRate),
    subjects: Array.isArray(report?.subjectGrades)
      ? report.subjectGrades.map((subject) => ({
          ...subject,
          examAverageLabel: formatScoreLabel(subject?.examAverage),
          assignmentAverageLabel: formatScoreLabel(subject?.assignmentAverage),
          finalScoreLabel: formatScoreLabel(subject?.finalScore),
        }))
      : [],
    teacherRemarks: report?.remark?.remark ? [report.remark.remark] : [],
    ranking: report?.ranking || { position: null, totalStudents: 0 },
  };
}

async function fetchStudentReportData(studentId) {
  const { data } = await apolloClient.query({
    query: getStudentTermReport,
    variables: {
      studentId,
      academicPeriod: academicPeriod.value,
      term: selectedTerm.value,
    },
    fetchPolicy: "network-only",
  });

  return data?.getStudentTermReport || null;
}

async function loadSelectedReportPreview() {
  if (
    !selectedStudent.value ||
    !validateInputs(false) ||
    !hasValidAcademicPeriod(academicPeriod.value)
  ) {
    reportPreview.value = null;
    remarkDraft.value = "";
    return;
  }

  reportLoading.value = true;

  try {
    const report = await fetchStudentReportData(selectedStudent.value.id);
    reportPreview.value = report;
    remarkDraft.value = String(report?.remark?.remark || "").trim();
  } catch (error) {
    console.error("Failed to load term report preview", error);
    reportPreview.value = null;
    remarkDraft.value = "";
    notificationStore.addNotification({
      type: "error",
      message: "Unable to load the selected term report.",
      timeout: 3500,
    });
  } finally {
    reportLoading.value = false;
  }
}

async function saveRemark() {
  if (!reportPreview.value) return;

  const nextRemark = String(remarkDraft.value || "").trim();
  if (!nextRemark) {
    notificationStore.addNotification({
      type: "warning",
      message: "Enter a remark before saving.",
    });
    return;
  }

  savingRemark.value = true;

  try {
    const { data } = await apolloClient.mutate({
      mutation: upsertTermReportRemarkMutation,
      variables: {
        input: {
          studentId: reportPreview.value.studentId,
          academicPeriod: academicPeriod.value,
          term: selectedTerm.value,
          remark: nextRemark,
        },
      },
    });

    reportPreview.value = {
      ...reportPreview.value,
      remark: data?.upsertTermReportRemark || null,
    };

    notificationStore.addNotification({
      type: "success",
      message: "Term remark saved.",
    });
  } catch (error) {
    console.error("Failed to save term report remark", error);
    notificationStore.addNotification({
      type: "error",
      message: "Failed to save the term remark.",
      timeout: 3500,
    });
  } finally {
    savingRemark.value = false;
  }
}

async function resolveReportForStudent(studentId) {
  if (reportPreview.value?.studentId === studentId) {
    return reportPreview.value;
  }
  return fetchStudentReportData(studentId);
}

async function downloadStudentReport(student) {
  if (!validateInputs() || !student) return;

  downloadingStudentId.value = student.id;

  try {
    const report = await resolveReportForStudent(student.id);
    await downloadTermReportPdf(mapReportToPdfPayload(report));

    notificationStore.addNotification({
      type: "success",
      message: `Downloaded ${getStudentName(student)}'s term report.`,
    });
  } catch (error) {
    console.error("Failed to download student term report", error);
    notificationStore.addNotification({
      type: "error",
      message: `Failed to download ${getStudentName(student)}'s report.`,
      timeout: 3500,
    });
  } finally {
    downloadingStudentId.value = "";
  }
}

async function downloadSelectedStudentReport() {
  if (!selectedStudent.value) return;
  await downloadStudentReport(selectedStudent.value);
}

async function downloadClassReports() {
  if (!validateInputs() || !classStudents.value.length) return;

  bulkDownloading.value = true;

  try {
    const files = [];

    for (let index = 0; index < classStudents.value.length; index += 1) {
      const student = classStudents.value[index];
      downloadingStudentId.value = student.id;
      bulkProgressText.value = `Preparing ${index + 1} of ${classStudents.value.length}`;

      const report = await resolveReportForStudent(student.id);
      const pdfBlob = await buildTermReportPdfBlob(
        mapReportToPdfPayload(report),
      );
      files.push({
        name: `${getStudentName(student)} - ${selectedTermLabel.value} - ${academicPeriod.value}.pdf`,
        blob: pdfBlob,
      });
    }

    await downloadZipArchive(
      files,
      `${selectedClassName.value} - ${selectedTermLabel.value} - ${academicPeriod.value}.zip`,
    );

    notificationStore.addNotification({
      type: "success",
      message: `Downloaded ${classStudents.value.length} reports as a ZIP.`,
      timeout: 3500,
    });
  } catch (error) {
    console.error("Failed to build class term report ZIP", error);
    notificationStore.addNotification({
      type: "error",
      message: "Failed to finish the class report ZIP.",
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

watch([selectedStudentId, selectedTerm, academicPeriod], async () => {
  await loadSelectedReportPreview();
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
      message: "Unable to load the term report workspace.",
      timeout: 3500,
    });
  } finally {
    initializing.value = false;
  }
});
</script>
