<template>
  <div class="p-4 bg-white rounded-lg shadow-lg cursor-pointer">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-lg font-semibold">Announcements</h1>
      <router-link to="/announcements" class="text-gray-400 text-xs"
        >View All</router-link
      >
    </div>

    <div class="flex flex-col gap-4">
      <ListSkeleton v-if="loading" v-for="i in 3" :key="`skeleton-${i}`" />

      <ErrorScreen v-else-if="error" :message="error" />

      <EmptyState
        v-else-if="!announcements.length"
        icon="fa-solid fa-bell"
        heading="No announcement found"
        description="Check back later for updates"
      />

      <div
        v-else
        class="p-5 rounded-md odd:bg-eduSkyLight even:bg-eduPurpleLight hover:bg-gray-100 cursor-pointer shadow-sm border-gray-200 hover:shadow-md transition-all"
        v-for="announce in announcements"
        :key="announce?.id"
        :class="{
          'border-l-4 border-indigo-500': !announcementStore.isAnnouncementRead(
            announce.id
          ),
        }"
      >
        <router-link :to="`/announcement/${announce.id}`" class="block">
          <div class="flex items-center justify-between">
            <h1
              class="line-clamp-1 font-medium text-gray-600 capitalize text-sm"
            >
              {{ announce?.title }}
            </h1>
            <span class="text-[10px] items-center font-medium text-gray-600">{{
              formatDate(announce?.createdAt)
            }}</span>
          </div>

          <div class="mt-2">
            <span class="text-gray-400 line-clamp-2 text-xs">{{
              announce?.content
            }}</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from "vue";
import { socket } from "../../socket/socket";
import { useAnnouncementStore } from "../../store/announcementStore";
import { useUserStore } from "../../store/userStore";
import { formatDate } from "../../utils/date.holidays";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";

import ListSkeleton from "../skeletonLoaders/listSkeleton.vue";

const userStore = useUserStore();
const announcementStore = useAnnouncementStore();

const loading = computed(() => announcementStore.loading);
const error = computed(() => announcementStore.error);

const announcements = computed(() => {
  return (announcementStore.announcements || []).slice(0, 3);
});

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

onMounted(() => {
  announcementStore.fetchAnnouncements();
  setupSocketConnection();
});

onUnmounted(() => {
  // Cleanup socket listeners
  socket.off("newAnnouncement");
  socket.off("announcementDeleted");
  socket.off("readStatus");
  socket.off("announcementArchiveStatus");
});
</script>

<style scoped></style>
