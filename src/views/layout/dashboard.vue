<template>
  <RouterView />
  <div class="h-screen flex">
    <!-- side Nav -->
    <LeftNav />

    <!-- right -->
    <RightNav />
  </div>
</template>

<script setup>
import LeftNav from "../../components/leftNav.vue";
import RightNav from "../../components/rightNav.vue";
</script>

<style lang="scss" scoped></style>
