<template>
  <div class="p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-650 text-center">Integrations</h2>
      <p class="mt-1 text-sm text-gray-500 text-center">
        Connect your school management system with external cloud services to expand classroom, payment, and support features.
      </p>
    </div>

    <!-- Integrations Grid -->
    <div class="grid gap-6 md:grid-cols-2">
      <div
        v-for="integration in integrations"
        :key="integration.id"
        class="bg-white rounded-xl shadow-sm p-5 border border-gray-150 flex flex-col justify-between hover:shadow-md transition"
      >
        <div>
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 h-16 w-16 bg-gray-50 border border-gray-150 rounded-xl flex items-center justify-center p-2">
              <img
                :src="integration.icon"
                :alt="`${integration.name} Logo`"
                class="max-h-full max-w-full object-contain"
                @error="handleIconFallback($event)"
              />
            </div>
            <div>
              <h3 class="text-base font-semibold text-gray-750">
                {{ integration.name }}
              </h3>
              <p class="mt-1 text-xs text-gray-500 leading-relaxed">
                {{ integration.description }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-100">
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <div class="flex items-center gap-2">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ring-1 ring-inset"
                :class="getStatusColor(integration.status)"
              >
                {{ integration.status.replace("_", " ") }}
              </span>
              <span class="text-[11px] text-gray-400" v-if="integration.lastSync">
                Sync: {{ formatLastSync(integration.lastSync) }}
              </span>
            </div>

            <div class="flex gap-2">
              <button
                v-if="integration.status === 'connected'"
                @click="openConfigDrawer(integration)"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-semibold rounded-lg text-gray-650 bg-white hover:bg-gray-50 transition"
              >
                Manage
              </button>
              <button
                v-else
                @click="openConfigDrawer(integration)"
                class="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition shadow-sm"
              >
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sliding Configurations Drawer Backdrop -->
    <Transition name="fade">
      <div
        v-if="isDrawerOpen"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40"
        @click="closeDrawer"
      ></div>
    </Transition>

    <!-- Side-out Setup Drawer -->
    <Transition name="drawer">
      <div
        v-if="isDrawerOpen"
        class="fixed top-0 right-0 h-full w-[460px] bg-white shadow-2xl border-l border-slate-200 flex flex-col z-50 overflow-hidden"
      >
        <!-- Drawer Header -->
        <header class="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-5 flex justify-between items-center shadow">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 bg-white/10 rounded-lg flex items-center justify-center text-sm border border-white/15">
              <i class="fa-solid fa-plug text-indigo-400"></i>
            </div>
            <div>
              <h3 class="text-sm font-semibold tracking-wide">{{ activeIntegration.name }} Setup</h3>
              <p class="text-[10px] text-slate-300">Integration Configuration Wizard</p>
            </div>
          </div>
          <button @click="closeDrawer" class="text-slate-400 hover:text-white transition">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </header>

        <!-- Drawer Form Area -->
        <div class="flex-grow overflow-y-auto p-6 space-y-6">
          <div class="space-y-2">
            <h4 class="text-sm font-bold text-gray-700">Service Configuration</h4>
            <p class="text-xs text-gray-500">Provide the client secret credentials to verify communication with your cloud endpoint.</p>
          </div>

          <!-- Configuration Fields -->
          <div class="space-y-4" v-if="activeIntegration.status !== 'connected' && connectProgress === 0">
            <div v-for="field in setupFields" :key="field.key" class="space-y-1">
              <label class="block text-xs font-semibold text-gray-600">{{ field.label }}</label>
              
              <textarea
                v-if="field.type === 'textarea'"
                v-model="formValues[field.key]"
                rows="4"
                :placeholder="field.placeholder"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              ></textarea>
              
              <input
                v-else
                v-model="formValues[field.key]"
                :type="field.type"
                :readonly="field.readonly"
                :placeholder="field.placeholder"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 read-only:bg-slate-50 read-only:text-gray-400"
              />
            </div>

            <button
              @click="startConnection"
              class="w-full mt-6 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition"
            >
              Verify & Connect Service
            </button>
          </div>

          <!-- Sync Connection progress tracker -->
          <div v-else-if="connectProgress > 0 && connectProgress < 100" class="py-8 text-center space-y-4">
            <div class="relative inline-flex items-center justify-center">
              <i class="fa-solid fa-spinner fa-spin text-3xl text-indigo-600"></i>
              <span class="absolute text-[10px] font-bold text-indigo-700">{{ connectProgress }}%</span>
            </div>
            <div class="space-y-2">
              <h5 class="text-sm font-bold text-gray-700">Connecting Gateway...</h5>
              <p class="text-xs text-indigo-600 font-mono">{{ connectStatusText }}</p>
            </div>

            <!-- Loader Progress Bar -->
            <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-indigo-600 transition-all duration-300"
                :style="{ width: `${connectProgress}%` }"
              ></div>
            </div>
          </div>

          <!-- Connected Active Setup View -->
          <div v-else-if="activeIntegration.status === 'connected'" class="space-y-6 animate-fade-in">
            <!-- Connected Status Banner -->
            <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
              <div class="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <i class="fa-solid fa-circle-check"></i>
              </div>
              <div>
                <h5 class="text-sm font-bold text-emerald-850">Connected Successfully</h5>
                <p class="text-xs text-emerald-700 mt-0.5">Your endpoint is authorized and active. Background sync executes automatically.</p>
              </div>
            </div>

            <!-- Sync Statistics Logs Table -->
            <div class="space-y-3">
              <h5 class="text-xs font-bold text-gray-600 uppercase tracking-wider">Sync Log History</h5>
              <div class="border border-gray-150 rounded-xl overflow-hidden shadow-sm">
                <table class="min-w-full divide-y divide-gray-150">
                  <thead class="bg-slate-50">
                    <tr>
                      <th class="px-4 py-2.5 text-left text-[10px] font-bold text-gray-500 uppercase">Sync Date</th>
                      <th class="px-4 py-2.5 text-left text-[10px] font-bold text-gray-500 uppercase">Sync Action</th>
                      <th class="px-4 py-2.5 text-center text-[10px] font-bold text-gray-500 uppercase">Records</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 text-xs">
                    <tr v-for="sync in activeIntegration.syncHistory" :key="sync.date" class="hover:bg-slate-50/50">
                      <td class="px-4 py-2 text-gray-600 font-mono">{{ sync.date }}</td>
                      <td class="px-4 py-2 text-gray-700 font-semibold">{{ sync.type }}</td>
                      <td class="px-4 py-2 text-center font-bold text-indigo-600">{{ sync.records }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Disconnect Controls -->
            <button
              @click="disconnectIntegration"
              class="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 active:scale-95 transition"
            >
              Disconnect Integration
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useNotificationStore } from "../../store/notification";

const notificationStore = useNotificationStore();

const integrations = ref([
  {
    id: 1,
    name: "Google Workspace",
    description: "Sync student directories with Google Classroom, manage calendar events, and enable single sign-on access.",
    icon: "/google-workspace.svg",
    status: "not_configured",
    lastSync: null,
    syncHistory: [],
  },
  {
    id: 2,
    name: "Microsoft Teams",
    description: "Enable virtual classrooms, team channels, assignments, and calendar syncs through Microsoft Teams APIs.",
    icon: "/microsoft-teams.svg",
    status: "not_configured",
    lastSync: null,
    syncHistory: [],
  },
  {
    id: 3,
    name: "Zoom",
    description: "Schedule live remote learning classes and coordinate supervisor parent-teacher consultations on Zoom.",
    icon: "/zoom-app.svg",
    status: "not_configured",
    lastSync: null,
    syncHistory: [],
  },
  {
    id: 4,
    name: "PayStack",
    description: "Accept and reconcile tuition fees, registrations, and installment receipts securely with PayStack Checkout.",
    icon: "/paystack-2.svg",
    status: "not_configured",
    lastSync: null,
    syncHistory: [],
  },
  {
    id: 5,
    name: "SMS Gateway",
    description: "Broadcast emergency notifications, parent reminders, and fees alerts using Twilio/Africa's Talking gateways.",
    icon: "/gateway.svg",
    status: "not_configured",
    lastSync: null,
    syncHistory: [],
  },
]);

const isDrawerOpen = ref(false);
const activeIntegration = ref(null);
const setupFields = ref([]);
const formValues = reactive({});
const connectProgress = ref(0);
const connectStatusText = ref("");

const getStatusColor = (status) => {
  return status === "connected"
    ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
    : "bg-slate-50 text-gray-600 ring-gray-500/10";
};

const formatLastSync = (date) => {
  if (!date) return "Never";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const handleIconFallback = (event) => {
  // If icon logo fails to load, use a default fontawesome icon inside fallback slot
  event.target.style.display = "none";
};

// Persistent configurations state helper
const saveState = () => {
  localStorage.setItem("school_integrations", JSON.stringify(integrations.value));
};

const getSetupFields = (id) => {
  switch (id) {
    case 1:
      return [
        { label: "Google Workspace Domain", key: "domain", placeholder: "e.g. schooladmin.edu", type: "text" },
        { label: "OAuth Client ID", key: "clientId", placeholder: "Enter client credentials id...", type: "text" },
        { label: "OAuth Client Secret / Keyfile JSON", key: "clientSecret", placeholder: "Paste credentials keyfile details...", type: "textarea" },
      ];
    case 2:
      return [
        { label: "Azure Active Directory Tenant ID", key: "tenantId", placeholder: "Tenant UUID...", type: "text" },
        { label: "Application (Client) ID", key: "clientId", placeholder: "Client Application ID UUID...", type: "text" },
        { label: "Client Secret Key", key: "clientSecret", placeholder: "Enter secret passcode...", type: "password" },
      ];
    case 3:
      return [
        { label: "Zoom Account ID", key: "accountId", placeholder: "Zoom corporate account identity...", type: "text" },
        { label: "Zoom OAuth Client ID", key: "clientId", placeholder: "Enter Client ID...", type: "text" },
        { label: "Zoom OAuth Secret", key: "clientSecret", placeholder: "Enter Secret...", type: "password" },
      ];
    case 4:
      return [
        { label: "PayStack Secret Key", key: "secretKey", placeholder: "sk_live_...", type: "password" },
        { label: "PayStack Public Key", key: "publicKey", placeholder: "pk_live_...", type: "text" },
        { label: "Webhook Callback URI", key: "webhookUrl", placeholder: "https://api.eduhub.com/payments/paystack/webhook", type: "text", readonly: true },
      ];
    case 5:
      return [
        { label: "Gateway Secret API Key", key: "apiKey", placeholder: "Twilio / Africa's Talking Key...", type: "password" },
        { label: "Sender Identifier (SenderID)", key: "senderId", placeholder: "e.g. EDUSHUB", type: "text" },
        { label: "Endpoint routing gateway", key: "endpoint", placeholder: "https://api.africastalking.com/version1/messaging", type: "text" },
      ];
    default:
      return [];
  }
};

const generateMockSyncHistory = (name) => {
  return [
    { date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), type: "Full Directory Sync", records: 320 },
    { date: new Date(Date.now() - 3600000).toLocaleDateString() + " " + new Date(Date.now() - 3600000).toLocaleTimeString(), type: "Webhooks Initialization", records: 2 },
  ];
};

const openConfigDrawer = (integration) => {
  activeIntegration.value = integration;
  setupFields.value = getSetupFields(integration.id);
  
  // Prefill form key records
  setupFields.value.forEach((field) => {
    formValues[field.key] = field.readonly ? field.placeholder : "";
  });

  connectProgress.value = 0;
  connectStatusText.value = "";
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
  activeIntegration.value = null;
};

// Connect workflow timer simulating steps at 25%, 50%, 75%
const startConnection = () => {
  connectProgress.value = 5;
  connectStatusText.value = "[25%] Initializing OAuth/Handshake verification...";

  setTimeout(() => {
    connectProgress.value = 25;
    connectStatusText.value = "[50%] Matching directory schemas and user mapping...";

    setTimeout(() => {
      connectProgress.value = 50;
      connectStatusText.value = "[75%] Testing webhook listener endpoint integrations...";

      setTimeout(() => {
        connectProgress.value = 75;
        connectStatusText.value = "[100%] Synchronization and data replication finalized!";

        setTimeout(() => {
          connectProgress.value = 100;
          
          const target = integrations.value.find((i) => i.id === activeIntegration.value.id);
          if (target) {
            target.status = "connected";
            target.lastSync = new Date().toISOString();
            target.syncHistory = generateMockSyncHistory(target.name);
            saveState();
          }

          notificationStore.addNotification({
            type: "success",
            message: `${activeIntegration.value.name} is configured and connected!`,
          });
        }, 800);
      }, 1000);
    }, 1000);
  }, 1000);
};

const disconnectIntegration = () => {
  const target = integrations.value.find((i) => i.id === activeIntegration.value.id);
  if (target) {
    target.status = "not_configured";
    target.lastSync = null;
    target.syncHistory = [];
    saveState();
  }

  notificationStore.addNotification({
    type: "warning",
    message: `${activeIntegration.value.name} disconnected.`,
  });
  
  closeDrawer();
};

onMounted(() => {
  const saved = localStorage.getItem("school_integrations");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === integrations.value.length) {
        integrations.value = parsed;
      }
    } catch {
      localStorage.removeItem("school_integrations");
    }
  }
});
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
