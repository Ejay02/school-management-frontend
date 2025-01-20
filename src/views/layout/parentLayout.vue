<template>
    <div class="rounded border-l border-t border-b border-gray-300 p-2 w-full">
  <div class="gap-4 flex-col xl:flex-row w-full mt-1">
    <div class="">
      <div class="w-full xl:w-2/3">
        <div class="h-full bg-white p-4 rounded-md w-full">
          <h1 class="text-xl font-semibold mb-6 text-gray-500">Schedule (Mandy Jones)</h1>

          <div class="gap-4 flex-col xl:flex-row w-full">
            <PlannerCard />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import PlannerCard from "../../components/cards/plannerCard.vue";
</script>

<style lang="scss" scoped></style>
