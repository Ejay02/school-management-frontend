<template>
  <div class="rounded border-l border-t border-b border-gray-300 p-2 w-full">
    <div class="gap-4 flex-col xl:flex-row w-full mt-1">
      <div class="">
        <div class="">
          <div class="h-full bg-white p-4 rounded-md w-full">
            <div class="mb-6">
              <h1 class="text-xl font-semibold text-gray-600">
                Family Overview
              </h1>
              <p class="mt-2 text-sm text-gray-500">
                Welcome{{ parentName ? `, ${parentName}` : "" }}. Keep track of
                your child&apos;s timetable, school updates, and upcoming items
                from one place.
              </p>
              <p
                v-if="shouldShowParentLinkEmptyState"
                class="mt-2 text-sm text-amber-700"
              >
                Your child&apos;s schedule and school activity will appear here
                once the school links them to this parent account.
              </p>
            </div>

            <div
              v-if="hasLinkedStudents"
              class="mb-4"
            >
              <ParentChildSelector />
            </div>
            <div class="flex-col w-full">
              <PlannerCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useParentLinkedStudents } from "../../composables/useParentLinkedStudents";
import { useUserStore } from "../../store/userStore";
import { formatNamePart } from "../../utils/displayValue";
import PlannerCard from "../../components/cards/plannerCard.vue";
import ParentChildSelector from "../../components/parents/parentChildSelector.vue";

const userStore = useUserStore();
const { fetchLinkedStudents, hasLinkedStudents, shouldShowParentLinkEmptyState } =
  useParentLinkedStudents();

const parentName = computed(() => formatNamePart(userStore.userInfo?.name));

onMounted(() => {
  fetchLinkedStudents();
});
</script>

<style lang="scss" scoped></style>
