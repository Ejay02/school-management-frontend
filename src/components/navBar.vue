<template>
  <div class="bg-[#F7F8FA] h-20 rounded border border-gray-300 m-4">
    <div class="flex justify-between items-center p-2 cursor-pointer">
      <!-- left section-->
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
      <div class="flex items-center gap-6 justify-end w-full">
        <!-- msg -->
        <router-link
          to="/list/messages"
          class="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-eduPurple"
        >
          <img
            src="/message.png"
            alt="message icon"
            class="h-8 w-8 items-center p-2"
          />
        </router-link>

        <!-- announcement -->
        <router-link
          to="/list/announcements"
          class="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative hover:bg-eduPurple"
        >
          <img
            src="/announcement.png"
            alt="announcement icon"
            class="h-8 w-8 items-center p-2"
          />
          <!-- counter -->
          <div
            class="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs"
          >
            12
          </div>
        </router-link>

        <!-- user -->
        <div class="flex flex-col">
          <span class="text-sm leading-3 font-medium">Mandy Max</span>
          <span class="text-[10px] text-gray-400 text-right capitalize">{{
            role
          }}</span>
        </div>

        <!-- avatar -->
        <div class="">
          <img
            src="/avatar.png"
            alt="avatar"
            class="h-14 w-14 items-center p-2 rounded-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "../store/userStore";

const userStore = useUserStore();

const role = userStore.currentRole;
</script>

<style scoped></style>
