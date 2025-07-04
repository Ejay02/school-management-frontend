<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center py-8">
      <LoadingScreen message="Loading archived announcements..." />
    </div>
    <div v-else-if="error" class="w-full">
      <ErrorScreen :message="error" />
    </div>

    <!-- Add filters section -->
    <div class="" v-else>
      <div class="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div
          class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
        >
          <div class="relative flex-1">
            <input
              type="text"
              v-model="archiveSearchQuery"
              placeholder="Search archived announcements..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-eduPurple focus:border-eduPurple focus:outline-none cursor-pointer"
            />
          </div>
          <div
            class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"
          >
            <select
              v-model="selectedCategory"
              class="px-4 py-2 border border-gray-300 rounded-md focus:ring-eduPurple focus:border-eduPurple focus:outline-none text-gray-700 cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="class">Class Announcements</option>
              <option value="general">General Announcements</option>
            </select>
            <select
              v-if="isAdminOrTeacher"
              v-model="selectedTargetRole"
              class="px-4 py-2 border border-gray-300 rounded-md focus:ring-eduPurple focus:border-eduPurple focus:outline-none text-gray-700 cursor-pointer"
            >
              <option value="">All Audiences</option>
              <option
                v-for="role in availableTargetRoles"
                :key="role.value"
                :value="role.value"
              >
                {{ role.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div
        v-if="!filteredArchivedAnnouncements?.length"
        class="flex justify-center items-center mt-28"
      >
        <EmptyState
          icon="fa-solid fa-box-archive"
          heading="No archived announcements"
          description="When you archive announcements, they'll appear here"
        />
      </div>

      <div v-else class="space-y-4 mt-2">
        <div
          v-for="announcement in displayedArchivedAnnouncements"
          :key="announcement.id"
          class="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md border-l-4 border-gray-300"
        >
          <div class="p-6">
            <router-link
              :to="`/announcement/${announcement.id}`"
              class="block cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span
                    :class="{
                      'bg-blue-100 text-blue-800': announcement.classId,
                      'bg-purple-100 text-purple-800': !announcement.classId,
                    }"
                    class="px-2 py-1 text-xs font-medium rounded-md"
                  >
                    {{ announcement.classId ? "Class" : "General" }}
                  </span>
                  <span
                    v-if="
                      announcement.targetRoles &&
                      announcement.targetRoles.length
                    "
                    class="px-2 py-1 text-xs font-medium rounded-md bg-teal-100 text-teal-800 capitalize"
                  >
                    For: {{ formatTargetRoles(announcement.targetRoles) }}
                  </span>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800"
                  >
                    Archived
                  </span>
                </div>
                <div class="flex items-center space-x-2">
                  <p class="text-sm text-gray-500">
                    {{
                      formatDate(
                        announcement.createdAt || announcement.updatedAt
                      )
                    }}
                  </p>
                </div>
              </div>

              <h3 class="mt-3 text-lg font-medium text-gray-900">
                {{ announcement.title }}
              </h3>
              <div
                class="mt-2 text-sm text-gray-600 line-clamp-2"
                v-html="announcement.content"
              ></div>
            </router-link>

            <div class="mt-4 flex justify-between items-center">
              <div class="flex items-center text-sm text-gray-500">
                <span>
                  <small>
                    Posted by:
                    <span class="capitalize">
                      {{
                        announcementStore.getCreatorName(announcement.creatorId)
                      }}</span
                    >
                  </small>

                  <span v-if="announcement.class"
                    >({{ announcement.class.name }})</span
                  >
                </span>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="
                    announcementStore.restoreAnnouncement(announcement.id)
                  "
                  class="group relative text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  <i class="fas fa-undo"></i>
                  <span
                    class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  >
                    Restore
                  </span>
                </button>
                <button
                  @click="
                    showDelModal(
                      announcement.id,
                      announcement.title,
                      'personalAnnouncementDelete',
                      announcement
                    )
                  "
                  class="group relative text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  <i class="fa-solid fa-trash-can"></i>
                  <span
                    class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  >
                    Delete from Inbox
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading indicator for infinite scroll -->
      <div v-if="isLoadingMore" class="flex justify-center items-center py-4">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"
        ></div>
      </div>

      <!-- Intersection observer target element -->
      <div ref="loadMoreTrigger" class="h-4"></div>
    </div>
  </div>
</template>

<script setup>
import { useModalStore } from "@/store/useModalStore";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { socket } from "../../socket/socket";
import { useAnnouncementStore } from "../../store/announcementStore";
import { useUserStore } from "../../store/userStore";
import { formatDate } from "../../utils/date.holidays";
import { setupInfiniteScroll } from "../../utils/scroll";
import { availableTargetRoles } from "../../utils/utility";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";

const showDelModal = (id, title, type, data) => {
  modalStore.deleteModal = true;
  modalStore.modalId = id;
  modalStore.modalTitle = title;
  modalStore.source = type; // This will be 'personalAnnouncementDelete'
  modalStore.data = data;
};

const userStore = useUserStore();
const modalStore = useModalStore();
const announcementStore = useAnnouncementStore();

const archiveSearchQuery = ref("");

const loading = computed(() => announcementStore.loading);
const error = computed(() => announcementStore.error);

const pageSize = 5;
const currentPage = ref(1);
const isLoadingMore = ref(false);
const loadMoreTrigger = ref(null);

const archivedAnnouncements = computed(
  () => announcementStore.archivedAnnouncements
);

const formatTargetRoles = (roles) => {
  return roles.map((role) => role.toLowerCase()).join(", ");
};

const selectedCategory = ref("");
const selectedTargetRole = ref("");

const isAdminOrTeacher = computed(() => {
  const role = userStore.userInfo?.role?.toLowerCase();
  return role === "admin" || role === "teacher" || role === "super_admin";
});

const filteredArchivedAnnouncements = computed(() => {
  let filtered = archivedAnnouncements.value || [];

  if (archiveSearchQuery.value) {
    const query = archiveSearchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.content.toLowerCase().includes(query)
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter((a) =>
      selectedCategory.value === "class" ? a.classId : !a.classId
    );
  }

  if (selectedTargetRole.value) {
    filtered = filtered.filter((a) =>
      a.targetRoles?.includes(selectedTargetRole.value)
    );
  }

  return filtered;
});

const displayedArchivedAnnouncements = computed(() => {
  const endIndex = currentPage.value * pageSize;
  return filteredArchivedAnnouncements.value.slice(0, endIndex);
});

const loadMoreArchivedAnnouncements = async () => {
  if (isLoadingMore.value) return;

  if (
    displayedArchivedAnnouncements.value.length >=
    filteredArchivedAnnouncements.value.length
  ) {
    return;
  }

  isLoadingMore.value = true;
  await new Promise((resolve) => setTimeout(resolve, 500));
  currentPage.value++;
  isLoadingMore.value = false;
};

const { setupObserver, cleanup } = setupInfiniteScroll(
  loadMoreArchivedAnnouncements,
  loadMoreTrigger,
  { threshold: 0.1 }
);

onMounted(async () => {
  await announcementStore.fetchArchivedAnnouncements();

  setupObserver();

  socket.on("announcementDeleted", (data) => {
    if (data && data.announcementId) {
      // Remove announcement from archived list
      announcementStore.archivedAnnouncements =
        announcementStore.archivedAnnouncements.filter(
          (announcement) => announcement.id !== data.announcementId
        );
    }
  });
});

onUnmounted(() => {
  cleanup();

  socket.off("announcementDeleted");
});
</script>
