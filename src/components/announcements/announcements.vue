<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div
      class="min-h-screen bg-gray-50 p-4 rounded-md flex-1 m-1 mt-0 shadow-xl"
    >
      <!-- Main content view -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <AnnouncementHeader
            :active-view="activeView"
            :archived-count="archivedAnnouncements.length"
            @view-change="handleViewChange"
            @create-announcement="showNewAnnouncementModal = true"
          />
        </div>

        <!-- MAIN VIEW: Announcements List -->
        <div v-if="activeView === 'main'">
          <MainAnnouncementView />
        </div>

        <!-- ARCHIVE VIEW: Archived Announcements List -->
        <div v-if="activeView === 'archive'">
          <ArchivedAnnouncements />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useAnnouncementStore } from "../../store/announcementStore";
import { useNotificationStore } from "../../store/notification";
import { useUserStore } from "../../store/userStore";
import AnnouncementHeader from "./announcementHeader.vue";
import ArchivedAnnouncements from "./archivedAnnouncements.vue";
import MainAnnouncementView from "./mainAnnouncementView.vue";

const userStore = useUserStore();
const announcementStore = useAnnouncementStore();
const notificationStore = useNotificationStore();

// State
const activeView = ref("main"); // Start with main view
const showNewAnnouncementModal = ref(false);
const editingAnnouncement = ref(null);
const announcementForm = ref({
  title: "",
  content: "",
  targetRoles: [],
  classId: "",
});

const archivedAnnouncements = computed(
  () => announcementStore.archivedAnnouncements || []
);

const resetForm = () => {
  announcementForm.value = {
    title: "",
    content: "",
    targetRoles: [],
    classId: "",
  };
  editingAnnouncement.value = null;
};

const handleViewChange = async (newView) => {
  activeView.value = newView;

  try {
    // Clear existing announcements before fetching new ones
    announcementStore.announcements = [];
    announcementStore.archivedAnnouncements = [];

    // Fetch appropriate announcements based on the view
    if (newView === "main") {
      await announcementStore.fetchAnnouncements();
    } else {
      await announcementStore.fetchArchivedAnnouncements();
    }
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Failed to fetch announcements: ${error.message}`,
    });
  }
};



onMounted(async () => {
  await announcementStore.fetchAnnouncements();
});
</script>
