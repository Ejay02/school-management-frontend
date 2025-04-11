<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center py-8">
      <LoadingScreen message="Loading announcements..." />
    </div>
    <div v-else-if="error" class="  w-full">
      <ErrorScreen :message="error" />
    </div>
    <div v-else>
      <!-- Filters - Always show when not loading or error -->
      <div class="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div
          class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
        >
          <div class="relative flex-1">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search announcements..."
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

      <!-- Empty state when no announcements match -->
      <div
        v-if="!filteredAnnouncements.length"
        class="flex justify-center items-center py-8 w-full max-w-5xl mx-auto"
      >
        <EmptyState
          icon="fa-solid fa-bell"
          heading="No announcement found"
          description="Check back later for updates"
        />
      </div>

      <!-- Announcements list -->
      <div v-else class="space-y-4 border-t pt-4">
        <div
          v-for="announcement in filteredAnnouncements"
          :key="announcement.id"
          class="bg-white rounded-lg shadow-sm overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
          :class="{
            'border-l-4 border-indigo-500':
              !announcementStore.isAnnouncementRead(announcement.id),
          }"
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
                    {{
                      announcement.classId
                        ? announcement.class?.name || "Class"
                        : "General"
                    }}
                  </span>
                  <span
                    v-if="
                      announcement.targetRoles &&
                      announcement.targetRoles.length
                    "
                    class="hidden md:table-cell px-2 py-1 text-xs font-medium rounded-md bg-teal-100 text-teal-800 capitalize"
                  >
                    For: {{ formatTargetRoles(announcement.targetRoles) }}s
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
                class="mt-2 text-gray-500 line-clamp-2 prose max-w-none font-serif text-lg"
                v-html="announcement.content"
              ></div>
            </router-link>

            <div class="mt-4 flex justify-between items-center">
              <small>
                Posted by:
                <span class="capitalize">
                  {{
                    announcementStore.getCreatorName(announcement.creatorId)
                  }}</span
                >
              </small>

              <div class="flex space-x-2">
                <button
                  v-if="!announcementStore.isAnnouncementRead(announcement.id)"
                  @click="markAsRead(announcement.id)"
                  class="group relative text-indigo-600 hover:text-indigo-400 text-sm font-medium transform transition-all hover:scale-105"
                >
                  <i class="fa-solid fa-check-double"></i>
                  <span
                    class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  >
                    Mark as Read
                  </span>
                </button>

                <button
                  v-if="canEditAnnouncement(announcement)"
                  @click="
                    showEditModal(
                      announcement.id,
                      announcement.title,
                      announcement,
                      'announcementList'
                    )
                  "
                  class="group relative text-indigo-600 hover:text-indigo-400 text-sm font-medium transform transition-all hover:scale-105"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                  <span
                    class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  >
                    Edit
                  </span>
                </button>

                <!-- Delete button - only for admins/creators -->
                <button
                  v-if="isCreatorOrAdmin(announcement)"
                  @click.stop="
                    showDelModal(
                      announcement.id,
                      announcement.title,
                      'announcementList',
                      announcement
                    )
                  "
                  class="group relative text-red-600 hover:text-red-400 text-sm font-medium transform transition-all hover:scale-105"
                >
                  <i class="fa-solid fa-trash-can"></i>
                  <span
                    class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  >
                    Delete Globally
                  </span>
                </button>

                <!-- Archive button - for everyone else -->
                <button
                  v-else
                  @click="archiveAnnouncement(announcement)"
                  class="group relative text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  <i class="fa-solid fa-box-archive"></i>
                  <span
                    class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  >
                    Archive
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useApolloClient } from "@vue/apollo-composable";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useStorageSync } from "../../composables/useStorageSync";
import { socket } from "../../socket/socket";
import { useAnnouncementStore } from "../../store/announcementStore";
import { useModalStore } from "../../store/useModalStore";
import { useUserStore } from "../../store/userStore";
import { formatDate } from "../../utils/date.holidays";
import { availableTargetRoles } from "../../utils/utility";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";

const modalStore = useModalStore();

const showDelModal = (id, title, type, data) => {
  modalStore.deleteModal = true;
  modalStore.modalId = id;
  modalStore.modalTitle = title;
  modalStore.source = type;
  modalStore.data = data;
};

const showEditModal = (id, title, data, type) => {
  modalStore.editModal = true;
  modalStore.modalId = id;
  modalStore.modalTitle = title;
  modalStore.data = data;
  modalStore.source = type;
};

const userStore = useUserStore();
const announcementStore = useAnnouncementStore();

const searchQuery = ref("");
const selectedCategory = ref("");
const selectedTargetRole = ref("");

const { client: apolloClient } = useApolloClient();

const loading = computed(() => announcementStore.loading);
const error = computed(() => announcementStore.error);

const announcements = computed(() => {
  return announcementStore.announcements || [];
});

const filteredAnnouncements = computed(() => {
  let filtered = announcements.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
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

const isAdminOrTeacher = computed(() => {
  const role = userStore.userInfo?.role?.toLowerCase();
  return role === "admin" || role === "teacher" || role === "super_admin";
});

const isCreatorOrAdmin = (announcement) => {
  const userId = userStore.userInfo?.id;
  const userRole = userStore.userInfo?.role?.toLowerCase();
  return (
    userRole === "admin" ||
    userRole === "super_admin" ||
    announcement.creatorId === userId
  );
};

const canEditAnnouncement = (announcement) => {
  const userId = userStore.userInfo?.id;
  const userRole = userStore.userInfo?.role?.toLowerCase();
  return (
    userRole === "admin" ||
    userRole === "super_admin" ||
    announcement.creatorId === userId
  );
};

const canDeleteAnnouncement = canEditAnnouncement;

const markAsRead = async (id) => {
  try {
    await announcementStore.markAsRead(id);
  } catch (error) {
    console.error("Failed to mark as read:", error);
  }
};

const archiveAnnouncement = async (announcement) => {
  try {
    await announcementStore.archiveAnnouncement(announcement.id);
  } catch (error) {
    console.error("Failed to archive:", error);
  }
};

const formatTargetRoles = (roles) => {
  return roles.map((role) => role.toLowerCase()).join(", ");
};

const setupSocketConnection = () => {
  // Join appropriate rooms based on user role and class
  socket.emit("joinRooms", {
    role: userStore.userInfo?.role,
    classId: userStore.userInfo?.classId,
    userId: userStore.userInfo?.id,
  });

  // Listen for new announcements
  socket.on("newAnnouncement", (announcement) => {
    announcementStore.announcements.unshift(announcement);
  });

  socket.on("announcementArchived", (data) => {
    if (data && data.announcementId) {
      // Remove announcement from active list
      announcementStore.announcements = announcementStore.announcements.filter(
        (announcement) => announcement.id !== data.announcementId
      );
    }
  });

  // Listen for deleted announcements
  socket.on("announcementDeleted", ({ id }) => {
    announcementStore.announcements = announcementStore.announcements.filter(
      (announcement) => announcement.id !== id
    );
  });

  // Listen for read status updates
  socket.on("readStatus", ({ announcementId, isRead }) => {
    const announcement = announcementStore.announcements.find(
      (a) => a.id === announcementId
    );
    if (announcement) {
      announcement.isRead = isRead;
    }
  });

  // Listen for archive status updates
  socket.on("announcementArchiveStatus", ({ id, isArchived }) => {
    const announcement = announcementStore.announcements.find(
      (a) => a.id === id
    );
    if (announcement) {
      if (isArchived) {
        announcementStore.announcements =
          announcementStore.announcements.filter((a) => a.id !== id);
      }
    }
  });
};

useStorageSync("readAnnouncements", (newReadAnnouncements) => {
  announcementStore.readAnnouncements = newReadAnnouncements || [];
});

watch(announcements, async () => {
  await announcementStore.fetchCreatorDetails(apolloClient);
});

// Lifecycle hooks
onMounted(async () => {
  await announcementStore.fetchAnnouncements();
  await announcementStore.fetchCreatorDetails(apolloClient);

  setupSocketConnection();
});

onUnmounted(() => {
  socket.off("newAnnouncement");
  socket.off("announcementDeleted");
  socket.off("readStatus");
  socket.off("announcementArchived");
  socket.off("announcementDeleted");
  socket.off("announcementArchiveStatus");
});
</script>
