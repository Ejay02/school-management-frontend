<template>
  <!-- xl:w-2/3 -->
  <div class="w-full">
    <!-- top Section-->
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- user info card -->
      <InfoCard
        :profileImage="profileImage"
        :name="name"
        :surname="surname"
        :description="description"
        :details="details"
      />

      <!-- small card -->

      <SmallInfoCards :infoCards="infoCards" />
    </div>

    <!-- bottom Section -->
    <div class="mt-4 mb-4 bg-white rounded-md p-2 h-[820px] cursor-pointer">
      <h1 class="mt-4 mb-8 text-xl font-semibold">{{ heading }}</h1>

      <PlannerCard />
    </div>
  </div>
</template>

<script setup>
import PlannerCard from "../../components/cards/plannerCard.vue";
import InfoCard from "../../components/cards/singleViewCards/infoCard.vue";
import SmallInfoCards from "../../components/cards/singleViewCards/smallInfoCards.vue";

const props = defineProps({
  heading: {
    type: String,
    required: true,
  },
  infoCards: {
    type: Array,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  details: {
    type: Array,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
