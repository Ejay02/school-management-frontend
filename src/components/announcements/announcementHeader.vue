<template>
  <div
    class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between"
  >
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Announcements</h2>
      <p class="mt-1 text-sm text-gray-500">
        Stay updated with the latest school announcements
      </p>
    </div>
    <div class="mt-4 sm:mt-0 flex space-x-3">
      <!-- View tabs -->
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          @click="$emit('view-change', 'main')"
          class="px-4 py-2 text-sm font-medium border rounded-l-lg"
          :class="
            activeView === 'main'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          "
        >
          Main
        </button>
        <button
          @click="$emit('view-change', 'archive')"
          class="px-4 py-2 text-sm font-medium border-t border-b border-r rounded-r-lg"
          :class="
            activeView === 'archive'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          "
        >
          Archive
          <span
            v-if="archivedCount"
            class="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-800"
          >
            {{ archivedCount }}
          </span>
        </button>
      </div>

      <div v-if="canCreateAnnouncement && activeView === 'main'">
        <button
          @click="$emit('create-announcement')"
          class="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          New Announcement
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "../../store/userStore";
import { useAnnouncementStore } from "../../store/announcementStore";

const props = defineProps({
  activeView: {
    type: String,
    required: true,
  },
  archivedCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["view-change", "create-announcement"]);

const userStore = useUserStore();
const announcementStore = useAnnouncementStore();

const isAdminOrTeacher = computed(() => {
  const role = userStore.userInfo?.role?.toLowerCase();
  return role === "admin" || role === "teacher" || role === "super_admin";
});

const canCreateAnnouncement = computed(() => isAdminOrTeacher.value);
</script>
