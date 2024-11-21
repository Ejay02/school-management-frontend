<template>
  <div class="p-4 flex gap-4 flex-col md:flex-row  bg-gray-200">
    <!-- left -->
    <LeftCard />
    <!-- right -->
    <RightCard />
  </div>
</template>

<script setup>
import LeftCard from "../../components/admin/leftPage.vue";
import RightCard from "../../components/admin/rightPage.vue";
</script>

<style scoped></style>
