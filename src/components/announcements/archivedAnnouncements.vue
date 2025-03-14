<template>
  <div v-if="loading" class="flex justify-center items-center py-8">
    <LoadingScreen message="Loading archived announcements..." />
  </div>
  <div v-else-if="error" class="flex justify-center items-center py-8">
    <ErrorScreen :message="error" />
  </div>

  <div
    v-if="!archivedAnnouncements?.length"
    class="flex justify-center items-center  mt-28"
  >
    <EmptyState
      icon="fa-solid fa-box-archive"
      heading="No archived announcements"
      description="When you archive announcements, they'll appear here"
    />
  </div>

  <div v-else class="space-y-4 mt-2">
    <div
      v-for="announcement in archivedAnnouncements"
      :key="announcement.id"
      class="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md border-l-4 border-gray-300"
    >
      <div class="p-6">
        <router-link
          :to="`/announcements/${announcement.id}`"
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
                  announcement.targetRoles && announcement.targetRoles.length
                "
                class="px-2 py-1 text-xs font-medium rounded-md bg-teal-100 text-teal-800"
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
                  formatDate(announcement.createdAt || announcement.updatedAt)
                }}
              </p>
            </div>
          </div>

          <h3 class="mt-3 text-lg font-medium text-gray-900">
            {{ announcement.title }}
          </h3>
          <div
            class="mt-2 text-sm text-gray-600"
            v-html="announcement.content"
          ></div>
        </router-link>

        <div class="mt-4 flex justify-between items-center">
          <div class="flex items-center text-sm text-gray-500">
            <span>
              Posted by {{ formatCreatorRole(announcement.creatorRole) }}
              <span v-if="announcement.class"
                >({{ announcement.class.name }})</span
              >
            </span>
          </div>
          <div class="flex space-x-2">
            <button
              @click="restoreAnnouncement(announcement)"
              class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Restore
            </button>
            <button
              @click="permanentlyDeleteAnnouncement(announcement.id)"
              class="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";
import { useUserStore } from "../../store/userStore";
import { useAnnouncementStore } from "../../store/announcementStore";



const announcementStore = useAnnouncementStore();
const userStore = useUserStore();

const loading = computed(() => announcementStore.loading);
const error = computed(() => announcementStore.error);
const archivedAnnouncements = computed(() =>
  announcementStore.announcements.filter((a) => a.isArchived)
);
console.log("archivedAnnouncements:", archivedAnnouncements);

const formatTargetRoles = (roles) => {
  return roles.map((role) => role.toLowerCase()).join(", ");
};

const getCreatorName = (creatorId) => {
  try {
    const creator = userStore.userCache[creatorId];
    if (!creator) return "Unknown";
    return creator.name
      ? `${creator.name} ${creator.surname || ""}`.trim()
      : creator.username || creator.email || "Unknown";
  } catch (error) {
    return "Unknown";
  }
};

const archiveSearchQuery = ref("");

const filteredArchivedAnnouncements = computed(() => {
  if (!archiveSearchQuery.value) return archivedAnnouncements.value;

  const query = archiveSearchQuery.value.toLowerCase();
  return archivedAnnouncements.value.filter(
    (a) =>
      a.title.toLowerCase().includes(query) ||
      a.content.toLowerCase().includes(query)
  );
});
</script>
