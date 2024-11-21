<template>
  <div class="w-full lg:w-2/3">
    <div class="flex gap-4 justify-between flex-wrap">
      <UserCard />
      <UserCard />
      <UserCard />
      <UserCard />
    </div>
  </div>
</template>

<script setup>
import UserCard from "../cards/userCard.vue";
</script>

<style scoped></style>
