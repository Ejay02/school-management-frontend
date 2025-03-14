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
          <MainAnnouncementView @edit-announcement="editAnnouncement" />
        </div>

        <!-- ARCHIVE VIEW: Archived Announcements List -->
        <div v-if="activeView === 'archive'">
          <ArchivedAnnouncements />
        </div>

        <!-- New/Edit Announcement Modal -->
        <!-- Modal implementation here -->
      </main>
    </div>
  </div>
</template>

<script setup>
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";
import AnnouncementHeader from "./announcementHeader.vue";
import ArchivedAnnouncements from "./archivedAnnouncements.vue";
import MainAnnouncementView from "./mainAnnouncementView.vue";
import { useAnnouncementStore } from "../../store/announcementStore";
import { useUserStore } from "../../store/userStore";
import { ref, computed, onMounted } from "vue";

const announcementStore = useAnnouncementStore();
const userStore = useUserStore();

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

// Computed properties
const archivedAnnouncements = computed(
  () => announcementStore.announcements?.filter((a) => a.isArchived) || []
);

// Methods
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
  console.log("Changing view to:", newView);
  activeView.value = newView;

  try {
    // Always fetch all announcements when changing views
    await announcementStore.fetchAnnouncements();
  } catch (error) {
    console.error(`Failed to fetch announcements:`, error);
  }
};

const saveAnnouncement = async () => {
  try {
    const formData = {
      ...announcementForm.value,
      creatorId: userStore.userInfo?.id,
      creatorRole: userStore.userInfo?.role,
    };

    if (editingAnnouncement.value) {
      await announcementStore.updateAnnouncement(
        editingAnnouncement.value.id,
        formData
      );
      showNotification("Announcement updated successfully");
    } else {
      await announcementStore.createAnnouncement(formData);
      showNotification("Announcement published successfully");
    }

    resetForm();
    showNewAnnouncementModal.value = false;
    // Refresh announcements after saving
    await announcementStore.fetchAnnouncements();
  } catch (error) {
    console.error("Failed to save announcement", error);
    showNotification("Failed to save announcement", "error");
  }
};

const editAnnouncement = (announcement) => {
  editingAnnouncement.value = announcement;
  announcementForm.value = {
    title: announcement.title,
    content: announcement.content,
    targetRoles: announcement.targetRoles || [],
    classId: announcement.classId || "",
  };
  showNewAnnouncementModal.value = true;
};

const showNotification = (message, type = "success") => {
  console.log(`${type}: ${message}`);
};

// Lifecycle
onMounted(async () => {
  try {
    await announcementStore.fetchAnnouncements();
  } catch (error) {
    console.error("Failed to initialize component:", error);
  }
});
</script>
