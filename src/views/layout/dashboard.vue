<template>
  <div class="h-screen flex">
    <!-- side Nav -->
    <LeftNav />

    <!-- right -->
    <div class="min-w-0 flex-1">
      <RightNav />
    </div>
  </div>
</template>

<script setup>
import LeftNav from "../../components/leftNav.vue";
import RightNav from "../../components/rightNav.vue";
</script>

<style scoped></style>
