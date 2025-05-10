<template>
  <div
    v-if="loading"
    class="flex justify-center items-center min-h-screen bg-gray-50"
  >
    <LoadingScreen />
  </div>
  <div
    v-else-if="error"
    class="flex justify-center items-center min-h-screen bg-gray-50"
  >
    <ErrorScreen :message="error" />
  </div>
  <div v-else class="rounded border border-gray-300 p-2 w-full">
    <div class="">
      <!-- Card with gradient header -->
      <div class="bg-white rounded-xl shadow-xl overflow-hidden w-full">
        <!-- Gradient header -->
        <div
          class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative"
        >
          <div class="absolute inset-0 pattern-dots opacity-10"></div>
          <div class="flex items-center gap-4">
            <button
              @click="goBack"
              class="bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-all animate-bounce-once flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>

            <h1 class="text-2xl font-bold text-white truncate">
              {{ announcement?.title }}
            </h1>
          </div>

          <div class="flex flex-wrap gap-2 mt-4 ml-12">
            <span
              v-if="announcement?.classId"
              class="px-3 py-1 rounded-full text-sm bg-white bg-opacity-20 text-white font-medium"
            >
              {{ announcement?.class?.name }}
            </span>
            <span
              v-if="announcement?.targetRoles?.length"
              class="px-3 py-1 rounded-full text-sm bg-white bg-opacity-20 text-white font-medium capitalize"
            >
              {{ formatTargetRoles(announcement.targetRoles) }}
            </span>
          </div>
        </div>

        <!-- Content area -->
        <div class="p-6">
          <div
            class="prose max-w-none font-serif text-lg"
            v-html="announcement?.content"
          ></div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <div class="">
                <img
                  v-if="creator?.image"
                  :src="creator?.image"
                  class="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  alt="Creator avatar"
                />
                <div
                  v-else
                  class="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm border-2 border-indigo-200 capitalize"
                >
                  {{ creator?.name?.[0] || "N"
                  }}{{ creator?.surname?.[0] || "A" }}
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">
                  <!-- {{ creator?.name }} -->
                  {{ getCreatorName }}
                </p>
                <p class="text-xs text-gray-500">
                  Posted {{ formatDate(announcement?.createdAt) }}
                </p>
              </div>
            </div>

            <div>
              <button
                v-if="canArchive"
                @click="handleArchive"
                class="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                :class="
                  announcement?.isArchived
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                "
              >
                <i
                  class="mr-1"
                  :class="
                    announcement?.isArchived
                      ? 'fa-solid fa-box-open'
                      : 'fa-solid fa-box'
                  "
                ></i>
                {{ announcement?.isArchived ? "Unarchive" : "Archive" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useApolloClient } from "@vue/apollo-composable";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNavigation } from "../../composables/useNavigation";
import { useAnnouncementStore } from "../../store/announcementStore";
import { useUserStore } from "../../store/userStore";
import { formatDate } from "../../utils/date.holidays";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";

const route = useRoute();
const router = useRouter();

const announcementId = route.params.id;

const { goBack } = useNavigation();
const { client } = useApolloClient();

const userStore = useUserStore();
const announcementStore = useAnnouncementStore();

const announcement = ref(null);

const creator = ref(null);
const loading = ref(true);
const error = ref(null);

const canArchive = computed(() => {
  const userRole = userStore.userInfo?.role?.toLowerCase();
  return (
    userRole === "admin" ||
    userRole === "super_admin" ||
    announcement.value?.creatorId === userStore.userInfo?.id
  );
});

const getCreatorName = computed(() => {
  if (!creator.value) return "";
  return creator.value.name
    ? `${creator.value.name} ${creator.value.surname || ""}`.trim()
    : creator.value.username;
});

const formatTargetRoles = (roles) => {
  return roles.map((role) => role.toLowerCase()).join(", ");
};

const handleArchive = async () => {
  try {
    if (announcement.value.isArchived) {
      await announcementStore.restoreAnnouncement(announcement.value.id);
    } else {
      await announcementStore.archiveAnnouncement(announcement.value.id);
    }
    announcement.value.isArchived = !announcement.value.isArchived;
  } catch (err) {
    error.value = "Failed to update archive status";
  }
};

const fetchAnnouncement = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await announcementStore.fetchAnnouncementById(announcementId);
    announcement.value = data;

    // Mark as read when viewing
    if (!announcementStore.isAnnouncementRead(announcementId)) {
      await announcementStore.markAsRead(announcementId);
    }

    // Fetch creator details
    if (announcement.value?.creatorId) {
      creator.value = await userStore.findUserById(
        announcement.value.creatorId,
        client
      );
    }
  } catch (err) {
    error.value = err.message || "Failed to load announcement";
    console.error("Error loading announcement:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAnnouncement);
</script>
