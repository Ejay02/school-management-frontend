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
      <div
        class="relative inline-flex w-48 h-12 bg-white rounded-full shadow-md overflow-hidden"
        role="group"
      >
        <!-- Container for the toggle options -->
        <div
          class="flex w-full h-full items-center justify-between relative z-10"
        >
          <!-- Main Option -->
          <button
            @click="$emit('view-change', 'main')"
            class="flex-1 h-full flex items-center justify-center text-sm font-medium transition-colors duration-300"
            :class="activeView === 'main' ? 'text-white' : 'text-gray-700'"
          >
            Main
          </button>

          <!-- Archive Option -->
          <button
            @click="$emit('view-change', 'archive')"
            class="flex-1 h-full flex items-center justify-center text-sm font-medium transition-colors duration-300"
            :class="activeView === 'archive' ? 'text-white' : 'text-gray-700'"
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

        <!-- Sliding background for active state -->
        <div
          class="absolute top-1 left-1 w-1/2 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full transition-transform duration-300 ease-in-out"
          :class="activeView === 'main' ? 'translate-x-0' : 'translate-x-full'"
        ></div>
      </div>

      <!--  -->

      <div v-if="canCreateAnnouncement && activeView === 'main'">
        <button
          @click="showAddModal(`${url}`)"
          class="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          New Announcement
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAnnouncementStore } from "../../store/announcementStore";
import { useModalStore } from "../../store/useModalStore";
import { useUserStore } from "../../store/userStore";

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

const route = useRoute();

const url = ref("");

const extractUrlPath = () => {
  // Use a regex to match the last word after the final slash
  const match = route.path.match(/\/([^/]+)$/);
  url.value = match ? match[1].toLowerCase() : "";
};

// Extract URL path when component is mounted
onMounted(extractUrlPath);

const emit = defineEmits(["view-change", "create-announcement"]);

const showAddModal = (type) => {
  modalStore.addModal = true;
  // modalStore.modalId = id;
  // modalStore.modalTitle = title;
  modalStore.source = type;
};

const modalStore = useModalStore();
const userStore = useUserStore();
const announcementStore = useAnnouncementStore();

const isAdminOrTeacher = computed(() => {
  const role = userStore.userInfo?.role?.toLowerCase();
  return role === "admin" || role === "teacher" || role === "super_admin";
});

const canCreateAnnouncement = computed(() => isAdminOrTeacher.value);
</script>
