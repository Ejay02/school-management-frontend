<template>
  <TeacherResults v-if="userRole === 'teacher'" />
  <ResultsTable v-else-if="userRole === 'admin' || userRole === 'super_admin'" />
  <div v-else class="p-4 text-center text-gray-600">
    You don't have permission to view results.
  </div>
</template>

<script setup>
import { computed } from "vue";

import { useUserStore } from "../../store/userStore";
import ResultsTable from "./resultsTable.vue";
import TeacherResults from "./teacherResults.vue";

const userStore = useUserStore();
const userRole = computed(() => userStore.currentRole);
console.log("userRole:", userRole);
</script>
