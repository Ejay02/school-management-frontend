<template>
  <div class="w-full xl:w-2/3">
    <!-- top Section-->
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- user info card -->
      <TeacherInfoCard />

      <!-- small card -->

      <SmallInfoCards />
    </div>

    <!-- bottom Section -->
    <div class="mt-4 mb-4 bg-white rounded-md p-2 h-[730px] cursor-pointer">
      <h1 class="mt-4 mb-4 text-xl font-semibold">Teacher's Schedule</h1>

      <PlannerCard />
    </div>
  </div>
</template>

<script setup>
import PlannerCard from "../cards/plannerCard.vue";
import SmallInfoCards from "./cards/smallInfoCards.vue";
import TeacherInfoCard from "./cards/teacherInfoCard.vue";
</script>

<style lang="scss" scoped></style>
