<template>
  <div class="h-screen flex">
    <!-- side Nav -->
    <LeftNav />

    <!-- right -->
    <!-- border border-gray-300 -->
    <div class="w-full">
      <RightNav />
    </div>
  </div>
</template>

<script setup>
import LeftNav from "../../components/leftNav.vue";
import RightNav from "../../components/rightNav.vue";
</script>

<style scoped></style>
