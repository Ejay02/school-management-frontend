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

      <div class="mb-4 rounded-xl border border-gray-200 bg-white p-4">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-base font-semibold text-gray-800">Invitations</h2>
            <p class="mt-1 text-sm text-gray-500">
              {{ inviteSummary.activationLabel }}
            </p>
          </div>
          <div class="flex flex-wrap gap-2 text-xs font-medium text-gray-700">
            <span class="rounded-full bg-gray-100 px-3 py-1">
              Sent: {{ inviteSummary.totalSent }}
            </span>
            <span class="rounded-full bg-green-100 px-3 py-1 text-green-700">
              Accepted: {{ inviteSummary.accepted }}
            </span>
            <span class="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
              Pending: {{ inviteSummary.pending }}
            </span>
            <span class="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
              Expired: {{ inviteSummary.expired }}
            </span>
          </div>
        </div>
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
import {
  formatDateForInput,
  getFriday,
  getMonday,
} from "../../utils/date.holidays";
import { computed, onMounted, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import UserCard from "../../components/cards/userCard.vue";
import CountCard from "../../components/cards/countCard.vue";
import FinanceCard from "../../components/cards/financeCard.vue";
import { useAttendanceStore } from "../../store/attendanceStore";
import { getDashboardUserCardSummary, invitationSummaryQuery } from "../../graphql/queries";
import AttendanceCard from "../../components/cards/attendanceCard.vue";

const attendanceStore = useAttendanceStore();

const { result, loading, error } = useQuery(getDashboardUserCardSummary);
const { result: inviteSummaryResult } = useQuery(invitationSummaryQuery);

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

const inviteSummary = computed(() => {
  const summary = inviteSummaryResult.value?.invitationSummary;
  if (!summary) {
    return {
      totalSent: 0,
      accepted: 0,
      pending: 0,
      expired: 0,
      activationLabel: "0 of 0 invited users activated",
    };
  }

  return summary;
});

const startDate = ref(formatDateForInput(getMonday(new Date())));
const endDate = ref(formatDateForInput(getFriday(new Date())));

onMounted(() => {
  attendanceStore.fetchAttendanceData(startDate.value, endDate.value);
});
</script>

<style scoped></style>
