<template>
  <div class="bg-[#F7F8FA] h-20 rounded border border-gray-300 m-4 mb-0">
    <div class="flex justify-between items-center p-2 cursor-pointer">
      <!-- left section stays the same -->
      <div
        class="ml-2 hidden md:flex justify-center rounded-full text-xs gap-2 bg-white cursor-pointer items-center ring-[1.5px] ring-gray-300 px-2"
      >
        <img
          src="/search.png"
          alt="search icon"
          class="h-8 w-8 items-center p-2"
        />
        <input
          type="text"
          placeholder="Search..."
          autofocus
          class="border-none outline-none cursor-pointer w-[200px] bg-transparent"
        />
      </div>

      <!-- right section -->
      <div class="flex items-center gap-6 justify-end w-full text-center">
        <!-- msg -->
        <router-link
          to="/messages"
          class="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-eduSkyLight relative"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-8 w-8 p-2 hover:text-purple-500 text-gray-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
          <div
            class="absolute -top-3 -right-1 w-5 h-5 flex items-center justify-center bg-indigo-500 text-white rounded-full text-[8px] font-medium"
          >
            124
          </div>
        </router-link>

        <!-- announcement -->
        <router-link
          to="/announcements"
          class="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative hover:bg-eduSkyLight"
        >
          <img
            src="/announcement.png"
            alt="announcement icon"
            class="relative h-8 w-8 items-center p-2"
          />

          <div
            v-if="announcementStore.getUnreadCount > 0"
            class="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-indigo-500 text-white rounded-full text-[8px] font-medium"
          >
            {{ announcementStore.getUnreadCount }}
          </div>
        </router-link>

        <!-- user -->
        <div class="flex flex-col">
          <div class="relative inline-block">
            <span class="text-sm leading-3 font-medium pr-1">
              {{ capitalizedName }} {{ capitalizedSurname }}
            </span>
            <i
              class="fa-regular fa-copy text-xs absolute top-0"
              v-if="role === 'PARENT'"
              @click="copyParentId"
            ></i>
          </div>

          <span class="text-[10px] text-gray-400 text-right capitalize">{{
            role
          }}</span>
        </div>

        <!-- Here's the fixed avatar section -->
        <div class="" @click="toggleDropdown">
          <div class="mr-4 relative">
            <img
              v-if="userStore?.userInfo?.img"
              :src="userStore?.userInfo?.img"
              :alt="`${capitalizedName} avatar`"
              class="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
            />

            <div
              v-else
              class="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm border-2 border-indigo-200"
            >
              {{ capitalizedName[0] }}{{ capitalizedSurname[0] }}
            </div>
          </div>

          <ProfileDropdown v-if="showDropdown" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "../store/userStore";
import ProfileDropdown from "./dropdown/profileDropdown.vue";
import { useNotificationStore } from "../store/notification";
import { useAnnouncementStore } from "../store/announcementStore";

const userStore = useUserStore();
const notificationStore = useNotificationStore();
const announcementStore = useAnnouncementStore();

const role = userStore.currentRole;

const parentId = userStore?.userInfo.id;

// Helper function to capitalize first letter
const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const capitalizedName = computed(() => capitalize(userStore.userInfo.name));
const capitalizedSurname = computed(() =>
  capitalize(userStore.userInfo.surname)
);

const showDropdown = ref(false);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const copyParentId = async () => {
  if (!parentId) return;
  try {
    await navigator.clipboard.writeText(parentId);

    notificationStore.addNotification({
      type: "info",
      message: `Parent Id copied to clipboard!`,
    });
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Failed to copy Parent Id: ${error.message}`,
    });
  }
};
</script>
