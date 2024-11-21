<template>
  <div class="w-full lg:w-2/3 flex-col gap-8 p-4 cursor-pointer">
    <!-- user cards -->
    <div class="flex gap-4 justify-between flex-wrap mb-4">
      <UserCard />
      <UserCard />
      <UserCard />
      <UserCard />
    </div>

    <!-- middle charts -->
    <div class="flex gap-4 flex-col lg:flex-row mb-4">
      <!-- count -->
      <div class="w-full lg:w-1/3 h-[450px]">
        <CountCard />
      </div>

      <!-- attendance -->
      <div class="w-full lg:w-2/3 h-[450px]">
        <AttendanceCard />
      </div>
    </div>

    <!-- bottom -->
    <div class="w-full h-[500px]">
      <FinanceCard />
    </div>
  </div>
</template>

<script setup>
import UserCard from "../cards/userCard.vue";
import CountCard from "../cards/countCard.vue";
import FinanceCard from "../cards/financeCard.vue";
import AttendanceCard from "../cards/attendanceCard.vue";
</script>

<style scoped></style>
