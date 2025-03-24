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
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../../store/userStore";
import AnnouncementHeader from "./announcementHeader.vue";
import MainAnnouncementView from "./mainAnnouncementView.vue";
import { useNotificationStore } from "../../store/notification";
import ArchivedAnnouncements from "./archivedAnnouncements.vue";
import { useAnnouncementStore } from "../../store/announcementStore";

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
  () => announcementStore.announcements?.filter((a) => a.isArchived) || []
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
    // Always fetch all announcements when changing views
    await announcementStore.fetchAnnouncements();
    await announcementStore.fetchArchivedAnnouncements();
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Failed to fetch announcements: ${error.message}`,
    });
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
      notificationStore.addNotification({
        type: "success",
        message: `Announcement updated successfully`,
      });
    } else {
      await announcementStore.createAnnouncement(formData);
      notificationStore.addNotification({
        type: "success",
        message: `Announcement published successfully`,
      });
    }

    resetForm();
    showNewAnnouncementModal.value = false;
    // Refresh announcements after saving
    await announcementStore.fetchAnnouncements();
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Failed to save announcement: ${error.message}`,
    });
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

onMounted(async () => {
  await announcementStore.fetchAnnouncements();
});
</script>
