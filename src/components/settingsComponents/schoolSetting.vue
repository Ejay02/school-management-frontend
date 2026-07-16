<template>
  <div class="p-6">
    <LoadingScreen v-if="loading" message="Loading school settings..." />
    <ErrorScreen v-else-if="error" />

    <form v-else @submit.prevent="saveSchoolSettings" class="space-y-8">
      <div class="space-y-2">
        <h2 class="text-lg font-medium text-gray-600 text-center">
          School Settings
        </h2>
        <p class="text-sm text-center text-gray-500">
          Update your school profile and academic configuration.
        </p>
      </div>

      <div class="space-y-6">
        <h3 class="text-sm font-semibold text-gray-600">School Profile</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-500"
              >School Name</label
            >
            <input
              v-model="formData.schoolName"
              type="text"
              class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
              placeholder="e.g. My School"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500"
              >Contact Name</label
            >
            <input
              v-model="formData.schoolContactName"
              type="text"
              class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
              placeholder="e.g. Jane Admin"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-500"
              >Address</label
            >
            <input
              v-model="formData.schoolAddress"
              type="text"
              class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
              placeholder="School address"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500"
              >School Domain (Optional)</label
            >
            <input
              v-model="formData.schoolDomain"
              type="text"
              class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
              placeholder="e.g. school.com"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-500">Email</label>
            <input
              v-model="formData.schoolEmail"
              type="email"
              class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
              placeholder="school@email.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500">Phone</label>
            <input
              v-model="formData.schoolPhone"
              type="tel"
              class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
              placeholder="Phone number"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-500"
              >Timezone</label
            >
            <select
              v-model="formData.schoolTimezone"
              class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
            >
              <option value="">Select</option>
              <option v-for="tz in timezoneOptions" :key="tz" :value="tz">
                {{ tz }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500"
              >School Logo</label
            >

            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-md bg-gray-100 overflow-hidden">
                <img
                  v-if="logoPreview"
                  :src="logoPreview"
                  alt="School logo preview"
                  class="h-10 w-10 object-cover"
                />
              </div>

              <div class="flex-1">
                <input
                  v-model="formData.schoolLogo"
                  type="text"
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                  placeholder="Paste logo URL"
                />
              </div>

              <button
                type="button"
                class="px-3 py-2 text-xs font-medium text-white bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                @click="$refs.logoInput.click()"
              >
                Upload
              </button>

              <input
                type="file"
                ref="logoInput"
                accept="image/*"
                class="hidden"
                @change="handleLogoChange"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <h3 class="text-sm font-semibold text-gray-600">Academic Config</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-500"
              >Current Session (Year)</label
            >
            <input
              v-model="formData.academicYearCurrent"
              type="text"
              readonly
              class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
              placeholder="e.g. 2025"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500"
              >Next Session (Year)</label
            >
            <input
              v-model="formData.academicYearNext"
              type="text"
              readonly
              class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
              placeholder="e.g. 2026"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500"
              >Current Term</label
            >
            <select
              v-model="formData.currentTerm"
              class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
            >
              <option value="">Select</option>
              <option value="FIRST">First</option>
              <option value="SECOND">Second</option>
              <option value="THIRD">Third</option>
            </select>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <h3 class="text-sm font-semibold text-gray-600">
          Weekly Parent Digest
        </h3>

        <div class="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-gray-700">
                Send weekly digest emails to parents
              </p>
              <p class="text-sm text-gray-500">
                Parents receive one scannable summary email for all their
                children.
              </p>
            </div>

            <button
              type="button"
              @click="
                formData.weeklyDigestEnabled = !formData.weeklyDigestEnabled
              "
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out"
              :class="[
                formData.weeklyDigestEnabled ? 'bg-indigo-500' : 'bg-gray-200',
              ]"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1"
                :class="[
                  formData.weeklyDigestEnabled
                    ? 'translate-x-6'
                    : 'translate-x-1',
                ]"
              />
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-500"
                >Send Day</label
              >
              <select
                v-model.number="formData.weeklyDigestDayOfWeek"
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6 disabled:bg-gray-50 disabled:text-gray-400"
                :disabled="!formData.weeklyDigestEnabled"
              >
                <option
                  v-for="day in weeklyDigestDayOptions"
                  :key="day.value"
                  :value="day.value"
                >
                  {{ day.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500"
                >Send Hour</label
              >
              <select
                v-model.number="formData.weeklyDigestSendHour"
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6 disabled:bg-gray-50 disabled:text-gray-400"
                :disabled="!formData.weeklyDigestEnabled"
              >
                <option
                  v-for="hour in weeklyDigestHourOptions"
                  :key="hour.value"
                  :value="hour.value"
                >
                  {{ hour.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500"
                >Send Minute</label
              >
              <select
                v-model.number="formData.weeklyDigestSendMinute"
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6 disabled:bg-gray-50 disabled:text-gray-400"
                :disabled="!formData.weeklyDigestEnabled"
              >
                <option
                  v-for="minute in weeklyDigestMinuteOptions"
                  :key="minute.value"
                  :value="minute.value"
                >
                  {{ minute.label }}
                </option>
              </select>
            </div>
          </div>

          <p class="text-xs text-gray-500">
            Digest timing uses the school timezone above.
          </p>
        </div>
      </div>

      <div class="space-y-6">
        <h3 class="text-sm font-semibold text-gray-600">Attendance</h3>

        <div class="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
          <label class="block text-sm font-medium text-gray-500">
            Reason codes (comma or new-line separated)
          </label>
          <textarea
            v-model="formData.attendanceReasonCodesText"
            rows="3"
            class="cursor-pointer block w-full rounded-md bg-white px-3 py-2 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
            placeholder="SICK, FAMILY, UNCONTACTED"
          />
          <p class="text-xs text-gray-500">
            Used to validate attendance reason codes sent by teachers.
          </p>
        </div>
      </div>

      <div class="space-y-6">
        <h3 class="text-sm font-semibold text-gray-600">Term Report Formula</h3>

        <div class="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
          <p class="text-sm text-gray-500">
            Draft term reports are auto-calculated from marked records using these
            weights. The three values must add up to 100.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-500">
                Exam Weight (%)
              </label>
              <input
                v-model.number="formData.reportExamWeight"
                type="number"
                min="0"
                max="100"
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">
                Assessment Weight (%)
              </label>
              <input
                v-model.number="formData.reportAssessmentWeight"
                type="number"
                min="0"
                max="100"
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500">
                Attendance Weight (%)
              </label>
              <input
                v-model.number="formData.reportAttendanceWeight"
                type="number"
                min="0"
                max="100"
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
              />
            </div>
          </div>

          <div
            class="rounded-md px-3 py-2 text-sm"
            :class="
              reportWeightTotal === 100
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            "
          >
            Current total: {{ reportWeightTotal }}%
          </div>
        </div>
      </div>

      <!-- Branding & Theme Customizer -->
      <div class="space-y-6">
        <h3 class="text-sm font-semibold text-gray-650">School Branding & Theme Customizer</h3>

        <div class="rounded-lg border border-gray-200 bg-white p-5 space-y-6">
          <p class="text-xs text-gray-500 leading-relaxed">
            Customize the primary and secondary branding colors of your school dashboard. Presets and colors update the interface instantly and persist across sessions.
          </p>

          <!-- Presets -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-650">Theme Presets</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="preset in themePresets"
                :key="preset.name"
                type="button"
                @click="applyPreset(preset)"
                class="px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 transition active:scale-95"
                :class="currentPresetName === preset.name ? 'border-indigo-500 bg-indigo-50/20 text-indigo-750' : 'border-gray-200 text-gray-600'"
              >
                <span class="h-2.5 w-2.5 rounded-full ring-1 ring-black/10" :style="{ backgroundColor: preset.primary }"></span>
                {{ preset.name }}
              </button>
            </div>
          </div>

          <!-- Color Pickers -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-gray-600">Primary Color</label>
              <div class="flex items-center gap-3">
                <input
                  v-model="themeState.primary"
                  type="color"
                  @input="handleThemeColorChange"
                  class="h-9 w-9 rounded-lg border border-gray-300 p-0.5 cursor-pointer bg-white"
                />
                <input
                  v-model="themeState.primary"
                  type="text"
                  @change="handleThemeColorChange"
                  class="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:outline-none"
                  placeholder="#4f46e5"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-semibold text-gray-600">Secondary Color</label>
              <div class="flex items-center gap-3">
                <input
                  v-model="themeState.secondary"
                  type="color"
                  @input="handleThemeColorChange"
                  class="h-9 w-9 rounded-lg border border-gray-300 p-0.5 cursor-pointer bg-white"
                />
                <input
                  v-model="themeState.secondary"
                  type="text"
                  @change="handleThemeColorChange"
                  class="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:outline-none"
                  placeholder="#7c3aed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-4 border-t border-gray-200 pt-4">
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          :disabled="saving"
        >
          <span v-if="!saving">Save Changes</span>
          <span v-else>Saving...</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { updateCssVariables } from "../../utils/theme";
import LoadingScreen from "../loadingScreen.vue";
import ErrorScreen from "../errorScreen.vue";
import { useNotificationStore } from "../../store/notification";
import { useUserStore } from "../../store/userStore";
import { getSetupStateQuery } from "../../graphql/queries";
import { updateSetupStateMutation } from "../../graphql/mutations";

const notificationStore = useNotificationStore();
const userStore = useUserStore();

const { result, loading, error } = useQuery(getSetupStateQuery, null, {
  fetchPolicy: "network-only",
});

const { mutate: updateSetupState, loading: saving } = useMutation(
  updateSetupStateMutation,
);

const formData = reactive({
  schoolName: "",
  schoolDomain: "",
  schoolAddress: "",
  schoolLogo: "",
  schoolContactName: "",
  schoolEmail: "",
  schoolPhone: "",
  schoolTimezone: "",
  academicYearCurrent: "",
  academicYearNext: "",
  currentTerm: "",
  weeklyDigestEnabled: true,
  weeklyDigestDayOfWeek: 0,
  weeklyDigestSendHour: 18,
  weeklyDigestSendMinute: 0,
  attendanceReasonCodesText: "",
  reportExamWeight: 60,
  reportAssessmentWeight: 30,
  reportAttendanceWeight: 10,
});

const academicYearDefaults = computed(() => {
  const year = new Date().getFullYear();
  return {
    current: String(year),
    next: String(year + 1),
  };
});

const timezoneOptions = computed(() => {
  const supported = Intl?.supportedValuesOf?.("timeZone");
  if (Array.isArray(supported) && supported.length) return supported;
  return [
    "Africa/Lagos",
    "Africa/Accra",
    "Africa/Nairobi",
    "Africa/Johannesburg",
    "Europe/London",
    "Europe/Paris",
    "America/New_York",
    "America/Chicago",
    "America/Los_Angeles",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Singapore",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];
});

const weeklyDigestDayOptions = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const weeklyDigestHourOptions = Array.from({ length: 24 }, (_, hour) => ({
  value: hour,
  label: `${String(hour).padStart(2, "0")}:00`,
}));

const weeklyDigestMinuteOptions = [0, 10, 20, 30, 40, 50].map((minute) => ({
  value: minute,
  label: String(minute).padStart(2, "0"),
}));

const initialized = ref(false);
const reportWeightTotal = computed(() => {
  return (
    Number(formData.reportExamWeight || 0) +
    Number(formData.reportAssessmentWeight || 0) +
    Number(formData.reportAttendanceWeight || 0)
  );
});

watch(
  () => result.value?.getSetupState,
  (state) => {
    if (!state || initialized.value) return;
    formData.schoolName = state.schoolName || "";
    formData.schoolDomain = state.schoolDomain || "";
    formData.schoolAddress = state.schoolAddress || "";
    formData.schoolLogo = state.schoolLogo || "";
    formData.schoolContactName = state.schoolContactName || "";
    formData.schoolEmail = state.schoolEmail || "";
    formData.schoolPhone = state.schoolPhone || "";
    formData.schoolTimezone =
      state.schoolTimezone ||
      Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone ||
      "";
    formData.academicYearCurrent = academicYearDefaults.value.current;
    formData.academicYearNext = academicYearDefaults.value.next;
    formData.currentTerm = state.currentTerm || "";
    formData.weeklyDigestEnabled = state.weeklyDigestEnabled ?? true;
    formData.weeklyDigestDayOfWeek = Number.isInteger(
      state.weeklyDigestDayOfWeek,
    )
      ? state.weeklyDigestDayOfWeek
      : 0;
    formData.weeklyDigestSendHour = Number.isInteger(state.weeklyDigestSendHour)
      ? state.weeklyDigestSendHour
      : 18;
    formData.weeklyDigestSendMinute = Number.isInteger(
      state.weeklyDigestSendMinute,
    )
      ? state.weeklyDigestSendMinute
      : 0;
    formData.attendanceReasonCodesText = Array.isArray(
      state.attendanceReasonCodes,
    )
      ? state.attendanceReasonCodes.join(", ")
      : "";
    formData.reportExamWeight = Number.isInteger(state.reportExamWeight)
      ? state.reportExamWeight
      : 60;
    formData.reportAssessmentWeight = Number.isInteger(
      state.reportAssessmentWeight,
    )
      ? state.reportAssessmentWeight
      : 30;
    formData.reportAttendanceWeight = Number.isInteger(
      state.reportAttendanceWeight,
    )
      ? state.reportAttendanceWeight
      : 10;
    initialized.value = true;
  },
  { immediate: true },
);

const logoPreview = computed(() => {
  return formData.schoolLogo || "";
});

const handleLogoChange = async (event) => {
  const file = event?.target?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const value = typeof reader.result === "string" ? reader.result : "";
    formData.schoolLogo = value;
  };
  reader.readAsDataURL(file);
};

const normalizeString = (value) => {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed.length ? trimmed : null;
};

const parseAttendanceReasonCodes = (value) => {
  const raw = typeof value === "string" ? value : "";
  const parts = raw
    .split(/[\n,]+/g)
    .map((p) =>
      String(p || "")
        .trim()
        .toUpperCase(),
    )
    .filter(Boolean)
    .filter((p) => p.length <= 40);
  return [...new Set(parts)];
};

const saveSchoolSettings = async () => {
  if (reportWeightTotal.value !== 100) {
    notificationStore.addNotification({
      type: "error",
      message: "Term report weights must add up to 100%.",
    });
    return;
  }

  try {
    const res = await updateSetupState({
      input: {
        schoolName: normalizeString(formData.schoolName),
        schoolDomain: normalizeString(formData.schoolDomain),
        schoolAddress: normalizeString(formData.schoolAddress),
        schoolLogo: normalizeString(formData.schoolLogo),
        schoolContactName: normalizeString(formData.schoolContactName),
        schoolEmail: normalizeString(formData.schoolEmail),
        schoolPhone: normalizeString(formData.schoolPhone),
        schoolTimezone: normalizeString(formData.schoolTimezone),
        academicYearCurrent: academicYearDefaults.value.current,
        academicYearNext: academicYearDefaults.value.next,
        currentTerm: formData.currentTerm || null,
        weeklyDigestEnabled: Boolean(formData.weeklyDigestEnabled),
        weeklyDigestDayOfWeek: Number(formData.weeklyDigestDayOfWeek),
        weeklyDigestSendHour: Number(formData.weeklyDigestSendHour),
        weeklyDigestSendMinute: Number(formData.weeklyDigestSendMinute),
        attendanceReasonCodes: parseAttendanceReasonCodes(
          formData.attendanceReasonCodesText,
        ),
        reportExamWeight: Number(formData.reportExamWeight),
        reportAssessmentWeight: Number(formData.reportAssessmentWeight),
        reportAttendanceWeight: Number(formData.reportAttendanceWeight),
      },
    });

    if (res?.data?.updateSetupState) {
      userStore.setSchoolInfo(res.data.updateSetupState);
    }

    notificationStore.addNotification({
      type: "success",
      message: "School settings saved successfully!",
    });
  } catch (e) {
    notificationStore.addNotification({
      type: "error",
      message: e?.message || "Unable to save school settings",
    });
  }
};

// Theme presets definition
const themePresets = [
  { name: "Classic Indigo", primary: "#4f46e5", secondary: "#7c3aed" },
  { name: "Deep Ocean", primary: "#0284c7", secondary: "#0369a1" },
  { name: "Forest Green", primary: "#059669", secondary: "#047857" },
  { name: "Sunset Orange", primary: "#ea580c", secondary: "#b45309" },
  { name: "Crimson Red", primary: "#dc2626", secondary: "#b91c1c" },
];

const themeState = reactive({
  primary: "#4f46e5",
  secondary: "#7c3aed",
});

const currentPresetName = ref("Classic Indigo");

const loadSavedThemeConfig = () => {
  const saved = localStorage.getItem("school_theme");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.primary && parsed.secondary) {
        themeState.primary = parsed.primary;
        themeState.secondary = parsed.secondary;
        
        // Find if matches a preset
        const matched = themePresets.find(
          (p) => p.primary.toLowerCase() === parsed.primary.toLowerCase() &&
                 p.secondary.toLowerCase() === parsed.secondary.toLowerCase()
        );
        currentPresetName.value = matched ? matched.name : "Custom";
      }
    } catch {
      localStorage.removeItem("school_theme");
    }
  }
};

const applyPreset = (preset) => {
  themeState.primary = preset.primary;
  themeState.secondary = preset.secondary;
  currentPresetName.value = preset.name;
  saveThemeConfig();
};

const handleThemeColorChange = () => {
  currentPresetName.value = "Custom";
  saveThemeConfig();
};

const saveThemeConfig = () => {
  localStorage.setItem("school_theme", JSON.stringify({
    primary: themeState.primary,
    secondary: themeState.secondary,
  }));
  updateCssVariables(themeState.primary, themeState.secondary);
};

// Load saved config on script initialization
loadSavedThemeConfig();
</script>

<style scoped></style>
