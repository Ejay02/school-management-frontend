<template>
  <div class="rounded border-l border-t border-b border-gray-300 p-2 w-full">
    <div class="mt-1">
      <!-- user cards -->
      <div class="flex gap-4 justify-between flex-wrap mb-4 md:flex-row">
        <UserCard
          v-for="item in rolesData"
          :key="item.role"
          :role="item.role"
          :count="item.count"
          :academicYear="item.academicYear"
          :nextYear="item.nextYear"
        />
      </div>

      <!-- middle charts -->
      <div class="flex gap-4 flex-col lg:flex-row mb-4">
        <!-- count -->
        <div class="w-full lg:w-1/3 h-[450px]">
          <CountCard />
        </div>

        <!-- attendance -->
        <div class="w-full lg:w-2/3 h-[450px]">
          <AttendanceCard label="Attendance Overview" />
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
import { computed, onMounted, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import UserCard from "../../components/cards/userCard.vue";
import CountCard from "../../components/cards/countCard.vue";
import FinanceCard from "../../components/cards/financeCard.vue";
import { getDashboardUserCardSummary } from "../../graphql/queries";
import AttendanceCard from "../../components/cards/attendanceCard.vue";
import { useAttendanceStore } from "../../store/attendanceStore";
import {
  formatDateForInput,
  getFriday,
  getMonday,
} from "../../utils/date.holidays";

const attendanceStore = useAttendanceStore();

const { result, loading, error } = useQuery(getDashboardUserCardSummary);

const rolesData = computed(() => {
  if (!result.value || !result.value.getDashboardUserCardSummary) return [];

  const summary = result.value.getDashboardUserCardSummary;
  const academicYear = summary.academicYear.current;
  const nextYear = summary.academicYear.next.toString().slice(-2);

  return [
    { role: "Admin", count: summary.counts.admins, academicYear, nextYear },
    { role: "Teacher", count: summary.counts.teachers, academicYear, nextYear },
    { role: "Student", count: summary.counts.students, academicYear, nextYear },
    { role: "Parent", count: summary.counts.parents, academicYear, nextYear },
  ];
});

const startDate = ref(formatDateForInput(getMonday(new Date())));
const endDate = ref(formatDateForInput(getFriday(new Date())));

onMounted(() => {
  attendanceStore.fetchAttendanceData(startDate.value, endDate.value);
});
</script>

<style scoped></style>
