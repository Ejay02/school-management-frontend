<template>
  <div class="rounded border-l border-t border-b border-gray-300 p-2 w-full">
    <div class="mt-1">
      <!-- user cards -->
      <div class="flex gap-4 justify-between flex-wrap mb-4 md:flex-row">
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
  </div>
</template>

<script setup>
import UserCard from "../../components/cards/userCard.vue";
import CountCard from "../../components/cards/countCard.vue";
import FinanceCard from "../../components/cards/financeCard.vue";
import AttendanceCard from "../../components/cards/attendanceCard.vue";
</script>

<style scoped></style>
