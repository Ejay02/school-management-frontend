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
          :disabled="!selectedStudent || busy || !canDownloadStudent(selectedStudent?.id)"
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
          class="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          :disabled="!readyDraftCount || busy"
          @click="publishReadyClassReports"
        >
          {{ bulkPublishing ? "Publishing..." : `Publish Ready Reports (${readyDraftCount})` }}
        </button>

        <button
          type="button"
          class="rounded-md border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
          :disabled="!publishedCount || busy"
          @click="revertPublishedClassReports"
        >
          {{ bulkReverting ? "Reverting..." : `Revert Published (${publishedCount})` }}
        </button>

        <button
          type="button"
          class="rounded-md border border-indigo-300 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
          :disabled="!downloadableCount || busy"
          @click="downloadClassReports"
        >
          {{
            bulkDownloading
              ? "Preparing ZIP..."
              : `Download Class ZIP (${downloadableCount})`
          }}
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
                  class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Status
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Readiness
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
                  {{ getSummaryPositionLabel(student.id) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ getSummaryAverageLabel(student.id) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ getSummaryAttendanceLabel(student.id) }}
                </td>
                <td class="px-4 py-3 text-sm">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                    :class="
                      getSummaryStatus(student.id) === 'PUBLISHED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    "
                  >
                    {{ formatStatusLabel(getSummaryStatus(student.id)) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  <div class="relative inline-block text-left">
                    <button
                      v-if="getSummaryReadinessMeta(student.id).issues.length"
                      type="button"
                      class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                      :class="getSummaryReadinessMeta(student.id).className"
                      @click="toggleIssuesPopover(student.id)"
                    >
                      {{ getSummaryReadinessMeta(student.id).label }}
                    </button>
                    <span
                      v-else
                      class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                      :class="getSummaryReadinessMeta(student.id).className"
                    >
                      {{ getSummaryReadinessMeta(student.id).label }}
                    </span>

                    <div
                      v-if="openIssuesStudentId === student.id"
                      class="absolute right-0 z-20 mt-2 w-72 rounded-lg border border-amber-200 bg-white p-3 shadow-lg"
                    >
                      <div class="flex items-start justify-between gap-3">
                        <div>
                          <p class="text-xs font-semibold uppercase tracking-wide text-amber-600">
                            Missing Items
                          </p>
                          <p class="mt-1 text-sm font-medium text-gray-700">
                            {{ getStudentName(student) }}
                          </p>
                        </div>
                        <button
                          type="button"
                          class="text-xs font-medium text-gray-400 transition hover:text-gray-600"
                          @click="closeIssuesPopover"
                        >
                          Close
                        </button>
                      </div>

                      <ul class="mt-3 space-y-2 text-sm text-gray-600">
                        <li
                          v-for="issue in getSummaryReadinessMeta(student.id).issues"
                          :key="issue"
                          class="rounded-md bg-amber-50 px-3 py-2"
                        >
                          {{ issue }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-right">
                  <button
                    type="button"
                    class="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-gray-400"
                    :disabled="busy || !canDownloadStudent(student.id)"
                    @click="downloadStudentReport(student)"
                  >
                    {{
                      downloadingStudentId === student.id
                        ? "Preparing..."
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

            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="
                  reportPreview.status === 'PUBLISHED'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                "
              >
                {{ formatStatusLabel(reportPreview.status) }}
              </span>
              <span class="text-xs text-gray-500">
                {{ reportPreview.readiness?.ready ? "Ready to publish" : "Not ready to publish" }}
              </span>
              <span
                v-if="reportPreview.publishedAt"
                class="text-xs text-gray-500"
              >
                Published {{ formatTimestamp(reportPreview.publishedAt) }}
              </span>
            </div>

            <div
              class="rounded-lg border px-3 py-3"
              :class="
                reportPreview.readiness?.ready
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-amber-200 bg-amber-50'
              "
            >
              <p
                class="text-sm font-medium"
                :class="
                  reportPreview.readiness?.ready
                    ? 'text-emerald-700'
                    : 'text-amber-700'
                "
              >
                {{
                  reportPreview.readiness?.ready
                    ? "This report is ready for publishing."
                    : "This report is still missing required items."
                }}
              </p>
              <p
                v-if="!reportPreview.readiness?.ready"
                class="mt-2 text-sm text-amber-700"
              >
                {{ reportPreview.readiness?.issues?.join(" ") }}
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
                :disabled="reportPreview.status === 'PUBLISHED'"
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Enter the official term remark that should appear on the report..."
              ></textarea>
              <p class="mt-2 text-xs text-gray-500">
                Saved remark appears in downloaded PDFs and overrides scattered
                result comments.
              </p>
              <p
                v-if="reportPreview.status === 'PUBLISHED'"
                class="mt-2 text-xs text-amber-700"
              >
                Revert this report to draft before editing the remark.
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <button
                type="button"
                class="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-gray-400"
                :disabled="
                  savingRemark ||
                  !reportPreview ||
                  reportPreview.status === 'PUBLISHED'
                "
                @click="saveRemark"
              >
                {{ savingRemark ? "Saving..." : "Save Remark" }}
              </button>
              <button
                v-if="reportPreview.status !== 'PUBLISHED'"
                type="button"
                class="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                :disabled="publishingReport || !reportPreview?.readiness?.ready"
                @click="publishReport"
              >
                {{ publishingReport ? "Publishing..." : "Publish Report" }}
              </button>
              <button
                v-else
                type="button"
                class="rounded-md border border-amber-300 bg-white px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:text-amber-300"
                :disabled="revertingReport"
                @click="revertReportToDraft"
              >
                {{ revertingReport ? "Reverting..." : "Revert To Draft" }}
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
import {
  publishStudentTermReportMutation,
  revertStudentTermReportToDraftMutation,
  upsertTermReportRemarkMutation,
} from "../../graphql/mutations";
import {
  getClassTermReportSummaries,
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
const summaryLoading = ref(false);
const reportLoading = ref(false);
const savingRemark = ref(false);
const publishingReport = ref(false);
const revertingReport = ref(false);
const bulkPublishing = ref(false);
const bulkReverting = ref(false);
const selectedClassName = ref("");
const selectedStudentId = ref("");
const selectedTerm = ref("FIRST");
const academicPeriod = ref("");
const setupState = ref(null);
const reportSummaries = ref([]);
const reportPreview = ref(null);
const remarkDraft = ref("");
const downloadingStudentId = ref("");
const bulkDownloading = ref(false);
const bulkProgressText = ref("");
const openIssuesStudentId = ref("");

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
    downloadingStudentId.value ||
      bulkDownloading.value ||
      savingRemark.value ||
      publishingReport.value ||
      revertingReport.value ||
      bulkPublishing.value ||
      bulkReverting.value,
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

const reportSummaryMap = computed(() => {
  return new Map(
    (Array.isArray(reportSummaries.value) ? reportSummaries.value : []).map(
      (summary) => [summary.studentId, summary],
    ),
  );
});

const readyDraftCount = computed(() => {
  return reportSummaries.value.filter(
    (summary) => summary?.status !== "PUBLISHED" && summary?.readiness?.ready,
  ).length;
});

const downloadableCount = computed(() => {
  return reportSummaries.value.filter((summary) =>
    canDownloadStudent(summary?.studentId),
  ).length;
});

const publishedCount = computed(() => {
  return reportSummaries.value.filter(
    (summary) => summary?.status === "PUBLISHED",
  ).length;
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

function formatStatusLabel(status) {
  return status === "PUBLISHED" ? "Published" : "Draft";
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

function getReportSummary(studentId) {
  return reportSummaryMap.value.get(studentId) || null;
}

function getSummaryAverageLabel(studentId) {
  return formatScoreLabel(getReportSummary(studentId)?.overallAverage);
}

function getSummaryAttendanceLabel(studentId) {
  return formatScoreLabel(getReportSummary(studentId)?.attendanceRate);
}

function getSummaryPositionLabel(studentId) {
  const summary = getReportSummary(studentId);
  const position = summary?.position;
  const totalStudents = summary?.totalStudents || 0;
  if (!position) return totalStudents ? `- / ${totalStudents}` : "-";
  return `${position} / ${totalStudents}`;
}

function getSummaryStatus(studentId) {
  return getReportSummary(studentId)?.status || "DRAFT";
}

function getSummaryReadinessLabel(studentId) {
  const summary = getReportSummary(studentId);
  if (!summary) return summaryLoading.value ? "Loading..." : "-";
  if (summary.status === "PUBLISHED") return "Published";
  return summary.readiness?.ready ? "Ready" : "Needs review";
}

function getSummaryReadinessMeta(studentId) {
  const summary = getReportSummary(studentId);
  if (!summary) {
    return {
      label: summaryLoading.value ? "Loading" : "-",
      className: "bg-slate-100 text-slate-600",
      title: "",
      issues: [],
    };
  }

  if (summary.status === "PUBLISHED") {
    return {
      label: "Published",
      className: "bg-emerald-100 text-emerald-700",
      title: "This report is published and locked.",
      issues: [],
    };
  }

  if (summary.readiness?.ready) {
    return {
      label: "Ready",
      className: "bg-emerald-100 text-emerald-700",
      title: "This draft report is ready for publishing and download.",
      issues: [],
    };
  }

  const issues = Array.isArray(summary.readiness?.issues)
    ? summary.readiness.issues
    : [];
  return {
    label: issues.length ? `${issues.length} issue${issues.length > 1 ? "s" : ""}` : "Needs review",
    className: "bg-amber-100 text-amber-700",
    title: issues.join(" "),
    issues,
  };
}

function toggleIssuesPopover(studentId) {
  openIssuesStudentId.value =
    openIssuesStudentId.value === studentId ? "" : studentId;
}

function closeIssuesPopover() {
  openIssuesStudentId.value = "";
}

function canDownloadStudent(studentId) {
  const summary = getReportSummary(studentId);
  if (!summary) return false;
  if (summary.status === "PUBLISHED") return true;
  return Boolean(summary.readiness?.ready);
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

async function loadClassReportSummaries() {
  if (!selectedClass.value?.id || !validateInputs(false)) {
    reportSummaries.value = [];
    closeIssuesPopover();
    return;
  }

  summaryLoading.value = true;

  try {
    const { data } = await apolloClient.query({
      query: getClassTermReportSummaries,
      variables: {
        classId: selectedClass.value.id,
        academicPeriod: academicPeriod.value,
        term: selectedTerm.value,
      },
      fetchPolicy: "network-only",
    });

    reportSummaries.value = Array.isArray(data?.getClassTermReportSummaries)
      ? data.getClassTermReportSummaries
      : [];
    if (
      openIssuesStudentId.value &&
      !reportSummaries.value.some(
        (summary) => summary.studentId === openIssuesStudentId.value,
      )
    ) {
      closeIssuesPopover();
    }
  } catch (error) {
    console.error("Failed to load class term report summaries", error);
    reportSummaries.value = [];
    notificationStore.addNotification({
      type: "error",
      message: "Unable to load class report readiness.",
      timeout: 3500,
    });
  } finally {
    summaryLoading.value = false;
  }
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
    await loadClassReportSummaries();
    await loadSelectedReportPreview();

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

async function publishReport() {
  if (!reportPreview.value) return;

  publishingReport.value = true;
  try {
    const { data } = await apolloClient.mutate({
      mutation: publishStudentTermReportMutation,
      variables: {
        input: {
          studentId: reportPreview.value.studentId,
          academicPeriod: academicPeriod.value,
          term: selectedTerm.value,
        },
      },
    });

    if (data?.publishStudentTermReport) {
      reportPreview.value = await fetchStudentReportData(reportPreview.value.studentId);
      remarkDraft.value = String(reportPreview.value?.remark?.remark || "").trim();
      await loadClassReportSummaries();
    }

    notificationStore.addNotification({
      type: "success",
      message: "Report published and locked.",
    });
  } catch (error) {
    console.error("Failed to publish term report", error);
    notificationStore.addNotification({
      type: "error",
      message: error?.message || "Failed to publish the report.",
      timeout: 3500,
    });
  } finally {
    publishingReport.value = false;
  }
}

async function publishReadyClassReports() {
  if (!validateInputs() || !readyDraftCount.value) return;

  const readyDrafts = reportSummaries.value.filter(
    (summary) => summary?.status !== "PUBLISHED" && summary?.readiness?.ready,
  );

  bulkPublishing.value = true;
  try {
    for (let index = 0; index < readyDrafts.length; index += 1) {
      const summary = readyDrafts[index];
      bulkProgressText.value = `Publishing ${index + 1} of ${readyDrafts.length}`;

      await apolloClient.mutate({
        mutation: publishStudentTermReportMutation,
        variables: {
          input: {
            studentId: summary.studentId,
            academicPeriod: academicPeriod.value,
            term: selectedTerm.value,
          },
        },
      });
    }

    await loadClassReportSummaries();
    if (selectedStudent.value) {
      await loadSelectedReportPreview();
    }

    notificationStore.addNotification({
      type: "success",
      message: `Published ${readyDrafts.length} report${readyDrafts.length > 1 ? "s" : ""}.`,
      timeout: 3500,
    });
  } catch (error) {
    console.error("Failed to publish ready class reports", error);
    notificationStore.addNotification({
      type: "error",
      message: error?.message || "Failed to bulk publish ready reports.",
      timeout: 3500,
    });
  } finally {
    bulkProgressText.value = "";
    bulkPublishing.value = false;
  }
}

async function revertPublishedClassReports() {
  if (!validateInputs() || !publishedCount.value) return;

  const publishedReports = reportSummaries.value.filter(
    (summary) => summary?.status === "PUBLISHED",
  );

  bulkReverting.value = true;
  try {
    for (let index = 0; index < publishedReports.length; index += 1) {
      const summary = publishedReports[index];
      bulkProgressText.value = `Reverting ${index + 1} of ${publishedReports.length}`;

      await apolloClient.mutate({
        mutation: revertStudentTermReportToDraftMutation,
        variables: {
          input: {
            studentId: summary.studentId,
            academicPeriod: academicPeriod.value,
            term: selectedTerm.value,
          },
        },
      });
    }

    await loadClassReportSummaries();
    if (selectedStudent.value) {
      await loadSelectedReportPreview();
    }

    notificationStore.addNotification({
      type: "success",
      message: `Reverted ${publishedReports.length} published report${publishedReports.length > 1 ? "s" : ""} to draft.`,
      timeout: 3500,
    });
  } catch (error) {
    console.error("Failed to revert published class reports", error);
    notificationStore.addNotification({
      type: "error",
      message: error?.message || "Failed to bulk revert published reports.",
      timeout: 3500,
    });
  } finally {
    bulkProgressText.value = "";
    bulkReverting.value = false;
  }
}

async function revertReportToDraft() {
  if (!reportPreview.value) return;

  revertingReport.value = true;
  try {
    const { data } = await apolloClient.mutate({
      mutation: revertStudentTermReportToDraftMutation,
      variables: {
        input: {
          studentId: reportPreview.value.studentId,
          academicPeriod: academicPeriod.value,
          term: selectedTerm.value,
        },
      },
    });

    if (data?.revertStudentTermReportToDraft) {
      reportPreview.value = await fetchStudentReportData(reportPreview.value.studentId);
      remarkDraft.value = String(reportPreview.value?.remark?.remark || "").trim();
      await loadClassReportSummaries();
    }

    notificationStore.addNotification({
      type: "success",
      message: "Report reverted to draft.",
    });
  } catch (error) {
    console.error("Failed to revert term report", error);
    notificationStore.addNotification({
      type: "error",
      message: error?.message || "Failed to revert the report.",
      timeout: 3500,
    });
  } finally {
    revertingReport.value = false;
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

  if (!canDownloadStudent(student.id)) {
    const summary = getReportSummary(student.id);
    notificationStore.addNotification({
      type: "warning",
      message:
        summary?.readiness?.issues?.join(" ") ||
        "This draft report is not ready for download.",
      timeout: 4000,
    });
    return;
  }

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
  if (!downloadableCount.value) {
    notificationStore.addNotification({
      type: "warning",
      message: "No reports are ready for class download yet.",
      timeout: 3500,
    });
    return;
  }

  bulkDownloading.value = true;

  try {
    const files = [];
    let skippedCount = 0;

    for (let index = 0; index < classStudents.value.length; index += 1) {
      const student = classStudents.value[index];
      if (!canDownloadStudent(student.id)) {
        skippedCount += 1;
        continue;
      }
      downloadingStudentId.value = student.id;
      bulkProgressText.value = `Preparing ${files.length + 1} of ${downloadableCount.value}`;

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
      message:
        skippedCount > 0
          ? `Downloaded ${files.length} reports. Skipped ${skippedCount} not-ready draft reports.`
          : `Downloaded ${files.length} reports as a ZIP.`,
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

watch([selectedClassName, selectedTerm, academicPeriod], async () => {
  closeIssuesPopover();
  await loadClassReportSummaries();
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
