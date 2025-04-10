<template>
  <div class="w-[14%] md:w-[8%] lg:w-[14%] xl:w-[14%] bg-gray-200">
    <router-link to="/" class="flex items-center lg:justify-start gap-2 p-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-8 h-8 rounded-md animate-bounce-once duration-200 items-center justify-center text-purple-500"
      >
        <!-- class="mx-auto h-10 w-auto text-purple-500" -->
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
        />
      </svg>

      <span class="hidden lg:block text-sm font-bold">EduHub Portal</span>
    </router-link>
    <menu class="m-2 text-sm">
      <ul v-for="menuItem in filteredMenuItems" :key="menuItem?.title" class="">
        <li v-for="item in menuItem?.items" :key="item?.label" class="mb-2">
          <router-link
            :to="
              item?.label === 'Home'
                ? `/dashboard/${
                    currentRole.toLowerCase() === 'super_admin' ? 'admin' : currentRole
                  }`
                : item?.href || '/'
            "
            active-class="bg-eduPurpleLight text-purple-600"
            :class="isLinkActive(item?.href) ? 'bg-eduPurpleLight text-purple-600' : ''"
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
import { useRoute } from 'vue-router';

const route = useRoute();
const userStore = useUserStore();
const { filteredMenuItems, currentRole } = storeToRefs(userStore);

// Function to check if a link should be active based on current route
const isLinkActive = (href) => {
  if (!href) return false;
  
  // Extract the base path from href (e.g., '/lessons' from '/lessons')
  const basePath = href.split('/').filter(Boolean)[0];
  
  // Extract the current path from route
  const currentPath = route.path.split('/').filter(Boolean);
  
  // Special case for dashboard paths
  if (currentPath[0] === 'dashboard') {
    // For paths like /dashboard/lesson/new, we need to check the second segment
    if (currentPath.length > 1) {
      const dashboardSubpath = currentPath[1];
      
      // Check for singular/plural matches
      return (
        basePath === dashboardSubpath ||
        (basePath === 'lessons' && dashboardSubpath === 'lesson') ||
        (basePath === 'assignments' && dashboardSubpath === 'assignment') ||
        (basePath === 'exams' && dashboardSubpath === 'exam') ||
        (basePath === 'announcements' && dashboardSubpath === 'announcement') ||
        (basePath === 'events' && dashboardSubpath === 'event') ||
        (basePath === 'teachers' && dashboardSubpath === 'teacher') ||
        (basePath === 'students' && dashboardSubpath === 'student')
      );
    }
  }
  
  // For non-dashboard paths
  return (
    currentPath[0] === basePath ||
    (basePath === 'lessons' && currentPath[0] === 'lesson') ||
    (basePath === 'assignments' && currentPath[0] === 'assignment') ||
    (basePath === 'exams' && currentPath[0] === 'exam') ||
    (basePath === 'announcements' && currentPath[0] === 'announcement') ||
    (basePath === 'events' && currentPath[0] === 'event') ||
    (basePath === 'teachers' && currentPath[0] === 'teacher') ||
    (basePath === 'students' && currentPath[0] === 'student')
  );
};
</script>

<style scoped></style>
