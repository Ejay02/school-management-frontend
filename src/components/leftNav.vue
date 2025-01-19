<template>
  <div class="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-gray-200">
    <router-link to="/" class="flex items-center lg:justify-start gap-2 p-2">
      <img
        src="/edu.png"
        alt="logo"
        class="mt-4 w-10 h-10 rounded-md animate-bounce-once duration-200 items-center justify-center"
      />
      <span class="hidden lg:block text-sm font-bold">EduHub Portal</span>
    </router-link>
    <menu class="m-4 text-sm">
      <ul v-for="menuItem in filteredMenuItems" :key="menuItem?.title" class="">
        <!-- <li class="flex flex-col gap-2 text-gray-400 text-left">
          {{ menuItem?.title }}
        </li> -->
        <li v-for="item in menuItem?.items" :key="item?.label" class="mb-2">
          <router-link
            :to="item?.href || '/'"
            activeClass="bg-eduPurpleLight"
            class="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-eduSkyLight text-sm"
          >
            <img :src="item?.icon" :alt="item?.label" class="w-5 h-5" />
            <span class="hidden lg:block">{{ item?.label }}</span>
          </router-link>
        </li>
      </ul>
    </menu>
  </div>
</template>

<script setup>
import { useUserStore } from "../store/userStore";

import { storeToRefs } from "pinia";

const userStore = useUserStore();

const { filteredMenuItems } = storeToRefs(userStore);
</script>

<style scoped></style>
