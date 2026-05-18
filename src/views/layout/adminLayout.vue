<template>
  <div class="rounded border-l border-t border-b border-gray-300 p-2 w-full">
    <div class="mt-1">
      <div
        v-if="shouldShowSetupChecklist"
        class="mb-4 rounded-xl border border-gray-200 bg-white p-4"
      >
        <div
          class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"
        >
          <div>
            <h2 class="text-base font-semibold text-gray-800">
              Setup checklist
            </h2>
            <p class="mt-1 text-sm text-gray-500">
              {{ onboardingChecklist.completedSteps }} of
              {{ onboardingChecklist.totalSteps }} steps complete
            </p>
          </div>

          <router-link
            to="/settings/school"
            class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-500"
          >
            Continue setup
          </router-link>
        </div>

        <div class="mt-4">
          <div class="h-2 w-full rounded-full bg-gray-100">
            <div
              class="h-2 rounded-full bg-indigo-600 transition-all"
              :style="{ width: `${onboardingChecklist.completionPercentage}%` }"
            ></div>
          </div>
        </div>

        <div class="mt-4 grid gap-3 md:grid-cols-2">
          <router-link
            v-for="step in onboardingChecklist.steps"
            :key="step.key"
            :to="getOnboardingStepRoute(step.key)"
            class="rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50"
          >
            <div class="flex items-start gap-3">
              <div
                class="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border"
                :class="
                  step.complete
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-gray-50 text-gray-500'
                "
              >
                <i
                  v-if="step.complete"
                  class="fa-solid fa-check text-[10px]"
                ></i>
                <i v-else class="fa-solid fa-arrow-right text-[10px]"></i>
              </div>

              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-gray-800">
                  {{ step.label }}
                </p>
                <p class="mt-1 text-xs text-gray-500 line-clamp-2">
                  {{ step.summary }}
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <div class="mb-4 grid gap-4 md:grid-cols-2">
        <router-link
          to="/settings/team?tab=invitations"
          class="block rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50"
        >
          <div
            class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 class="text-base font-semibold text-gray-800">
                Pending invites
              </h2>
              <p class="mt-1 text-sm text-gray-500">
                {{ inviteSummary.activationLabel }}
              </p>
            </div>
            <div class="flex flex-wrap gap-2 text-xs font-medium text-gray-700">
              <span class="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
                Pending: {{ inviteSummary.pending }}
              </span>
              <span class="rounded-full bg-green-100 px-3 py-1 text-green-700">
                Accepted: {{ inviteSummary.accepted }}
              </span>
              <span class="rounded-full bg-gray-100 px-3 py-1">
                Sent: {{ inviteSummary.totalSent }}
              </span>
            </div>
          </div>
          <div class="mt-3 text-xs font-medium text-indigo-600">
            Manage invitations
          </div>
        </router-link>

        <router-link
          to="/settings/billing"
          class="block rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-base font-semibold text-gray-800">
                Fees due this week
              </h2>
              <p class="mt-1 text-sm text-gray-500">
                {{ feesDue.count }} invoice{{ feesDue.count === 1 ? "" : "s" }}
                due
              </p>
            </div>
            <div class="text-right">
              <div class="text-lg font-semibold text-gray-900">
                {{ formatCurrency(feesDue.amountDue) }}
              </div>
              <div class="mt-1 text-xs font-medium text-indigo-600">
                Open fee management
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- user cards -->
      <div class="flex gap-4 justify-between flex-wrap mb-4 md:flex-row">
        <UserCard
          v-for="item in rolesData"
          :key="item.role"
          :role="item.role"
          :count="item.count"
          :academicYear="item.academicYear"
          :nextYear="item.nextYear"
          class="flex-1 min-w-[220px]"
          @click="handleRoleCardClick(item.to)"
        />
      </div>

      <!-- middle charts -->
      <div class="flex gap-4 flex-col lg:flex-row mb-4">
        <!-- count -->
        <div class="w-full lg:w-1/3 h-[450px]">
          <router-link to="/students" class="block h-full">
            <CountCard />
          </router-link>
        </div>

        <!-- attendance -->
        <div class="w-full lg:w-2/3 h-[450px]">
          <router-link to="/attendance" class="block h-full">
            <AttendanceCard label="Attendance Overview" />
          </router-link>
        </div>
      </div>

      <!-- bottom -->
      <div class="w-full h-[500px]">
        <router-link to="/settings/billing" class="block h-full">
          <FinanceCard
            :overview="overview?.financeOverview"
            :disableQuery="true"
          />
        </router-link>
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
import { useRouter } from "vue-router";
import UserCard from "../../components/cards/userCard.vue";
import CountCard from "../../components/cards/countCard.vue";
import FinanceCard from "../../components/cards/financeCard.vue";
import { useAttendanceStore } from "../../store/attendanceStore";
import { getAdminDashboardOverview } from "../../graphql/queries";
import AttendanceCard from "../../components/cards/attendanceCard.vue";

const router = useRouter();

const attendanceStore = useAttendanceStore();

const { result: overviewResult } = useQuery(getAdminDashboardOverview);

const overview = computed(() => {
  return overviewResult.value?.getAdminDashboardOverview;
});

const rolesData = computed(() => {
  const summary = overview.value?.dashboardSummary;
  if (!summary) return [];

  const academicYear = summary.academicYear.current;
  const nextYear = summary.academicYear.next.toString().slice(-2);

  return [
    {
      role: "Admin",
      count: summary.counts.admins,
      academicYear,
      nextYear,
      to: "/settings/team?tab=users",
    },
    {
      role: "Teacher",
      count: summary.counts.teachers,
      academicYear,
      nextYear,
      to: "/teachers",
    },
    {
      role: "Student",
      count: summary.counts.students,
      academicYear,
      nextYear,
      to: "/students",
    },
    {
      role: "Parent",
      count: summary.counts.parents,
      academicYear,
      nextYear,
      to: "/parents",
    },
  ];
});

const handleRoleCardClick = (to) => {
  router.push(to);
};

const inviteSummary = computed(() => {
  const summary = overview.value?.invitationSummary;
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

const onboardingChecklist = computed(() => {
  const checklist = overview.value?.onboardingChecklist;
  if (!checklist) {
    return {
      completedSteps: 0,
      totalSteps: 0,
      completionPercentage: 0,
      steps: [],
    };
  }

  return checklist;
});

const shouldShowSetupChecklist = computed(() => {
  const checklist = onboardingChecklist.value;
  if (!checklist.totalSteps) return false;

  return checklist.completedSteps < checklist.totalSteps;
});

const getOnboardingStepRoute = (stepKey) => {
  switch (stepKey) {
    case "school_profile_complete":
      return "/settings/school";
    case "classes_created":
      return "/classes";
    case "subjects_assigned":
      return "/subjects";
    case "teachers_invited":
    case "parents_invited":
      return "/settings/team?tab=invitations";
    default:
      return "/dashboard/admin";
  }
};

const feesDue = computed(() => {
  const invoices = overview.value?.invoicesDueThisWeek || [];

  const amountDue = invoices.reduce((sum, invoice) => {
    const paidAmount = Number(invoice.paidAmount || 0);
    const totalAmount = Number(invoice.totalAmount || 0);
    return sum + Math.max(totalAmount - paidAmount, 0);
  }, 0);

  return {
    count: invoices.length,
    amountDue,
  };
});

const formatCurrency = (value) => {
  const safeValue = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(safeValue);
};

const startDate = ref(formatDateForInput(getMonday(new Date())));
const endDate = ref(formatDateForInput(getFriday(new Date())));

onMounted(() => {
  attendanceStore.fetchAttendanceData(startDate.value, endDate.value);
});
</script>
