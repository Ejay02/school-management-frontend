<template>
  <div class="container mx-auto px-4 py-8">
    <div
      class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-bold leading-tight">Activity Log</h1>
        <p class="text-sm text-gray-500">
          View security/admin trails (suspensions, activations, failed logins).
        </p>
      </div>

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          v-model="search"
          type="text"
          placeholder="Search..."
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-64"
        />
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-48"
        />
        <input
          v-model="action"
          type="text"
          placeholder="Action"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-48"
        />
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
              Action
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actor
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Target
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Reason
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
            <td class="px-4 py-3 text-sm font-medium text-gray-800">
              {{ formatAction(entry.action) }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              {{ formatActor(entry) }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              <div class="flex flex-col">
                <span>{{ formatTargetName(entry) }}</span>
                <span
                  v-if="formatTargetEmail(entry)"
                  class="text-xs text-gray-500"
                >
                  {{ formatTargetEmail(entry) }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              {{ entry.parsed?.reason || "-" }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
              {{ entry.ipAddress }}
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
import { securityLogsQuery } from "../../graphql/queries";
import Pagination from "../pagination.vue";
import LoadingScreen from "../loadingScreen.vue";
import ErrorScreen from "../errorScreen.vue";
import EmptyState from "../emptyState.vue";

const limit = 20;
const currentPage = ref(1);
const search = ref("");
const username = ref("");
const action = ref("");

const loading = ref(false);
const error = ref(null);
const entries = ref([]);
const pageInfo = ref({ hasMore: false, totalPages: 1 });

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
  if (key === "USER_SUSPENDED") return "User suspended";
  if (key === "USER_ACTIVATED") return "User activated";
  if (key === "FAILED_LOGIN") return "Failed login";
  if (key === "IP_BLOCKED") return "IP Blocked";
  return String(value || "");
};

const actionKey = (value) =>
  String(value || "")
    .trim()
    .toUpperCase();

const formatActor = (entry) => {
  const key = actionKey(entry?.action);
  if (key === "FAILED_LOGIN" || key === "IP_BLOCKED") return "-";
  return entry?.username || "-";
};

const formatTargetName = (entry) => {
  const key = actionKey(entry?.action);
  const target = entry?.parsed?.target;
  if (!target) {
    if (key === "FAILED_LOGIN") return entry?.username || "-";
    return "-";
  }
  const fullName = [target.name, target.surname]
    .filter(Boolean)
    .join(" ")
    .trim();
  return fullName || target.username || "-";
};

const formatTargetEmail = (entry) => {
  const target = entry?.parsed?.target;
  const email = target?.email ? String(target.email).trim() : "";
  return email || null;
};

const parseDetails = (details) => {
  if (!details) return null;
  try {
    return JSON.parse(details);
  } catch {
    return null;
  }
};

const logs = computed(() =>
  (entries.value || []).map((e) => ({ ...e, parsed: parseDetails(e.details) })),
);

const fetchLogs = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await apolloClient.query({
      query: securityLogsQuery,
      fetchPolicy: "network-only",
      variables: {
        params: { page: currentPage.value, limit, search: search.value.trim() },
        action: action.value.trim() || null,
        username: username.value.trim() || null,
      },
    });

    entries.value = data?.securityLogs?.items || [];
    pageInfo.value = data?.securityLogs?.pageInfo || {
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
watch([search, username, action], () => {
  currentPage.value = 1;
  fetchLogs();
});

onMounted(() => fetchLogs());
</script>
