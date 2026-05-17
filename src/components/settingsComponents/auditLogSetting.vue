<template>
  <div class="container mx-auto px-4 py-8">
    <div
      class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-bold leading-tight">Activity Log</h1>
        <p class="text-sm text-gray-500">
          View admin audit trails with before/after diffs.
        </p>
      </div>

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        <select
          v-model="entityType"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-52"
        >
          <option value="">All entities</option>
          <option v-for="t in entityTypeOptions" :key="t" :value="t">
            {{ t }}
          </option>
        </select>

        <input
          v-model="actor"
          type="text"
          placeholder="Actor name/email"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-52"
        />

        <input
          v-model="startDate"
          type="date"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-40"
        />

        <input
          v-model="endDate"
          type="date"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-40"
        />

        <input
          v-model="search"
          type="text"
          placeholder="Search..."
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-56"
        />

        <button
          type="button"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          :disabled="loading || exporting"
          @click="exportCsv"
        >
          {{ exporting ? "Exporting..." : "Export CSV" }}
        </button>
      </div>
    </div>

    <LoadingScreen v-if="loading" message="Loading activity log..." />
    <ErrorScreen v-else-if="error" />

    <EmptyState
      v-else-if="!logs.length"
      icon="fa-solid fa-clipboard-list"
      heading="No logs found"
      description="There are no activity entries matching your filters."
    />

    <div
      v-else
      class="overflow-x-auto rounded-lg border border-gray-200 bg-white"
    >
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Time
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actor
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Action
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Entity
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Changes
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              IP
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="entry in logs" :key="entry.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
              {{ formatTimestamp(entry.timestamp) }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              <div class="flex flex-col">
                <span>{{ formatActorDisplay(entry) }}</span>
                <span v-if="entry.actorEmail" class="text-xs text-gray-500">
                  {{ entry.actorEmail }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-sm font-medium text-gray-800">
              {{ formatAction(entry.action) }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              <div class="flex flex-col">
                <span class="font-medium text-gray-800">
                  {{ entry.entityType }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ entry.entityLabel || entry.entityId || "-" }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              <div
                v-if="entry.changes && entry.changes.length"
                class="flex flex-col gap-1"
              >
                <div
                  v-for="change in visibleChanges(entry)"
                  :key="change.field"
                  class="flex flex-col"
                >
                  <span class="text-xs font-medium text-gray-600">
                    {{ change.field }}
                  </span>
                  <span class="text-xs text-gray-700">
                    {{ formatDiff(change.before) }} →
                    {{ formatDiff(change.after) }}
                  </span>
                </div>

                <button
                  v-if="entry.changes.length > changePreviewLimit"
                  type="button"
                  class="mt-1 text-left text-xs font-medium text-indigo-600 hover:text-indigo-700"
                  @click="toggleExpanded(entry.id)"
                >
                  {{ expanded.has(entry.id) ? "Show less" : "Show more" }}
                </button>
              </div>
              <span v-else class="text-sm text-gray-500">-</span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
              {{ entry.ipAddress || "-" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-6" v-if="!loading">
      <Pagination
        :currentPage="currentPage"
        :hasMore="pageInfo.hasMore"
        :totalPages="pageInfo.totalPages"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { apolloClient } from "../../../apollo-client";
import { auditLogsQuery } from "../../graphql/queries";
import Pagination from "../pagination.vue";
import LoadingScreen from "../loadingScreen.vue";
import ErrorScreen from "../errorScreen.vue";
import EmptyState from "../emptyState.vue";

const limit = 20;
const currentPage = ref(1);
const search = ref("");
const entityType = ref("");
const actor = ref("");
const startDate = ref("");
const endDate = ref("");

const loading = ref(false);
const error = ref(null);
const entries = ref([]);
const pageInfo = ref({ hasMore: false, totalPages: 1 });
const exporting = ref(false);

const expanded = ref(new Set());
const changePreviewLimit = 3;

const entityTypeOptions = [
  "Admin",
  "Teacher",
  "Student",
  "Parent",
  "Class",
  "Subject",
  "Lesson",
  "Exam",
  "Assignment",
  "Invoice",
  "Payment",
  "FeeStructure",
  "Event",
  "Announcement",
  "SetupState",
  "Invitation",
];

const formatTimestamp = (value) => {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value || "");
  }
};

const formatAction = (value) => {
  const key = String(value || "")
    .trim()
    .toUpperCase();
  if (key === "CREATE") return "Created";
  if (key === "UPDATE") return "Updated";
  if (key === "DELETE") return "Deleted";
  return String(value || "");
};

const formatActorDisplay = (entry) => {
  const fullName = [entry.actorName, entry.actorSurname]
    .filter(Boolean)
    .join(" ")
    .trim();
  return fullName || entry.actorUsername || "-";
};

const formatDiff = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const str = String(value);
  if (str.length <= 80) return str;
  return `${str.slice(0, 77)}...`;
};

const toggleExpanded = (id) => {
  const next = new Set(expanded.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  expanded.value = next;
};

const visibleChanges = (entry) => {
  const changes = entry?.changes || [];
  if (expanded.value.has(entry.id)) return changes;
  return changes.slice(0, changePreviewLimit);
};

const logs = computed(() => entries.value || []);

const parseDateRange = () => {
  const start = startDate.value
    ? new Date(`${startDate.value}T00:00:00`)
    : null;
  const end = endDate.value ? new Date(`${endDate.value}T23:59:59.999`) : null;
  return { start, end };
};

const fetchLogs = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { start, end } = parseDateRange();
    const { data } = await apolloClient.query({
      query: auditLogsQuery,
      fetchPolicy: "network-only",
      variables: {
        params: { page: currentPage.value, limit, search: search.value.trim() },
        entityType: entityType.value || null,
        actor: actor.value.trim() || null,
        startDate: start,
        endDate: end,
      },
    });

    entries.value = data?.auditLogs?.items || [];
    pageInfo.value = data?.auditLogs?.pageInfo || {
      hasMore: false,
      totalPages: 1,
    };
  } catch (e) {
    error.value = e;
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

watch(currentPage, () => fetchLogs());
watch([search, actor, entityType, startDate, endDate], () => {
  currentPage.value = 1;
  fetchLogs();
});

onMounted(() => fetchLogs());

const escapeCsv = (value) => {
  const v = value === null || value === undefined ? "" : String(value);
  const escaped = v.replace(/"/g, '""');
  return `"${escaped}"`;
};

const buildCsvRows = (items) => {
  const header = [
    "timestamp",
    "actor",
    "actorEmail",
    "action",
    "entityType",
    "entityLabel",
    "entityId",
    "field",
    "before",
    "after",
    "ipAddress",
  ];

  const rows = [header.map(escapeCsv).join(",")];

  for (const entry of items || []) {
    const actorDisplay = formatActorDisplay(entry);
    const common = [
      entry.timestamp,
      actorDisplay,
      entry.actorEmail || "",
      formatAction(entry.action),
      entry.entityType,
      entry.entityLabel || "",
      entry.entityId || "",
    ];

    const changes = Array.isArray(entry.changes) ? entry.changes : [];
    if (!changes.length) {
      rows.push(
        [...common, "", "", "", entry.ipAddress || ""].map(escapeCsv).join(","),
      );
      continue;
    }

    for (const change of changes) {
      rows.push(
        [
          ...common,
          change.field,
          change.before ?? "",
          change.after ?? "",
          entry.ipAddress || "",
        ]
          .map(escapeCsv)
          .join(","),
      );
    }
  }

  return rows.join("\n");
};

const exportCsv = async () => {
  exporting.value = true;
  try {
    const { start, end } = parseDateRange();
    const { data } = await apolloClient.query({
      query: auditLogsQuery,
      fetchPolicy: "network-only",
      variables: {
        params: { page: 1, limit: 1000, search: search.value.trim() },
        entityType: entityType.value || null,
        actor: actor.value.trim() || null,
        startDate: start,
        endDate: end,
      },
    });

    const items = data?.auditLogs?.items || [];
    const csv = buildCsvRows(items);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "activity-log.csv";
    a.click();
    URL.revokeObjectURL(url);
  } finally {
    exporting.value = false;
  }
};
</script>
