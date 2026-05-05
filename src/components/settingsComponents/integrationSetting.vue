<template>
  <div class="p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-600 text-center">Integrations</h2>
      <p class="mt-1 text-sm text-gray-500 text-center">
        Connect your school management system with other services to enhance
        functionality.
      </p>
    </div>

    <!-- Integrations Grid -->
    <div class="grid gap-6 md:grid-cols-2">
      <div
        v-for="integration in integrations"
        :key="integration.id"
        class="bg-gray-100 rounded-lg shadow p-4 sm:p-6 border border-gray-200"
      >
        <div class="flex flex-col sm:flex-row items-start justify-between">
          <div class="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full">
            <div class="flex justify-center w-full sm:w-auto">
              <img
                :src="integration.icon"
                alt="Integration Logo"
                class="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28"
              />
            </div>
            <div class="text-center sm:text-left">
              <h3 class="text-lg font-medium text-gray-600">
                {{ integration.name }}
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                {{ integration.description }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-4 sm:mt-6">
          <div class="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ring-1 ring-inset"
                :class="getStatusColor(integration.status)"
              >
                {{ integration.status.replace("_", " ") }}
              </span>
              <span class="text-xs text-gray-500" v-if="integration.lastSync">
                Last sync: {{ formatLastSync(integration.lastSync) }}
              </span>
            </div>

            <div class="flex flex-wrap justify-center sm:justify-end gap-2">
              <button
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-400 bg-white cursor-not-allowed"
                disabled
              >
                Coming soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const integrations = ref([
  {
    id: 1,
    name: "Google Workspace",
    description:
      "Sync student data with Google Classroom, manage calendar events, and enable single sign-on.",
    icon: "/google-workspace.svg",
    status: "not_configured",
    lastSync: null,
  },
  {
    id: 2,
    name: "Microsoft Teams",
    description:
      "Enable virtual classrooms, assignments, and collaboration tools through Microsoft Teams.",
    icon: "/microsoft-teams.svg",
    status: "not_configured",
    lastSync: null,
  },
  {
    id: 3,
    name: "Zoom",
    description:
      "Schedule and manage virtual classes, parent-teacher meetings through Zoom.",
    icon: "/zoom-app.svg",
    status: "not_configured",
    lastSync: null,
  },
  {
    id: 4,
    name: "PayStack",
    description: "Process school fees and other payments securely.",
    icon: "/paystack-2.svg",
    status: "not_configured",
    lastSync: null,
  },
  {
    id: 5,
    name: "SMS Gateway",
    description: "Send automated SMS notifications to parents and staff.",
    icon: "/gateway.svg",
    status: "not_configured",
    lastSync: null,
  },
]);

const getStatusColor = (status) => {
  switch (status) {
    case "not_configured":
      return "bg-gray-50 text-gray-600 ring-gray-500/10";
    default:
      return "bg-gray-50 text-gray-600 ring-gray-500/10";
  }
};

const formatLastSync = (date) => {
  if (!date) return "Never";
  return new Date(date).toLocaleString();
};
</script>
