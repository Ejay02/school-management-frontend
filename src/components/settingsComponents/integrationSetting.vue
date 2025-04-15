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
                v-if="integration.status === 'connected'"
                @click="refreshIntegration(integration.id)"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                :disabled="integration.status === 'syncing'"
              >
                <i class="fa-solid fa-rotate-right mr-1.5"></i>
                Sync
              </button>
              <button
                v-if="integration.status === 'not_connected'"
                @click="connectIntegration(integration.id)"
                class="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                :disabled="integration.status === 'connecting'"
              >
                <i class="fa-solid fa-plug-circle-plus mr-1.5"></i>
                Connect
              </button>
              <button
                v-if="integration.status === 'connected'"
                @click="disconnectIntegration(integration.id)"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                :disabled="integration.status === 'disconnecting'"
              >
                <i class="fa-solid fa-plug-circle-minus mr-1.5"></i>
                Disconnect
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
    status: "connected",
    lastSync: "2024-01-28T10:30:00",
  },
  {
    id: 2,
    name: "Microsoft Teams",
    description:
      "Enable virtual classrooms, assignments, and collaboration tools through Microsoft Teams.",
    icon: "/microsoft-teams.svg",
    status: "not_connected",
    lastSync: null,
  },
  {
    id: 3,
    name: "Zoom",
    description:
      "Schedule and manage virtual classes, parent-teacher meetings through Zoom.",
    icon: "/zoom-app.svg",
    status: "connected",
    lastSync: "2024-01-27T15:45:00",
  },
  {
    id: 4,
    name: "PayStack",
    description: "Process school fees and other payments securely.",
    icon: "/paystack-2.svg",
    status: "not_connected",
    lastSync: null,
  },
  {
    id: 5,
    name: "SMS Gateway",
    description: "Send automated SMS notifications to parents and staff.",
    icon: "/gateway.svg",
    status: "connected",
    lastSync: "2024-01-28T09:15:00",
  },
]);

const connectIntegration = async (id) => {
  // Simulating API call
  const integration = integrations.value.find((i) => i.id === id);
  integration.status = "connecting";

  await new Promise((resolve) => setTimeout(resolve, 1500));

  integration.status = "connected";
  integration.lastSync = new Date().toISOString();
};

const disconnectIntegration = async (id) => {
  // Simulating API call
  const integration = integrations.value.find((i) => i.id === id);
  integration.status = "disconnecting";

  await new Promise((resolve) => setTimeout(resolve, 1500));

  integration.status = "not_connected";
  integration.lastSync = null;
};

const refreshIntegration = async (id) => {
  // Simulating API call
  const integration = integrations.value.find((i) => i.id === id);
  integration.status = "syncing";

  await new Promise((resolve) => setTimeout(resolve, 1500));

  integration.status = "connected";
  integration.lastSync = new Date().toISOString();
};

const getStatusColor = (status) => {
  switch (status) {
    case "connected":
      return "bg-green-50 text-green-700 ring-green-600/20";
    case "not_connected":
      return "bg-gray-50 text-gray-600 ring-gray-500/10";
    case "connecting":
    case "syncing":
      return "bg-blue-50 text-blue-700 ring-blue-700/10";
    case "disconnecting":
      return "bg-yellow-100 text-yellow-800 ring-yellow-600/20";
    default:
      return "bg-gray-50 text-gray-600 ring-gray-500/10";
  }
};

const formatLastSync = (date) => {
  if (!date) return "Never";
  return new Date(date).toLocaleString();
};
</script>
