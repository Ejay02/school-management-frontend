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
              placeholder="e.g. Eduhub Academy"
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
              placeholder="e.g. eduhub.com"
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

const initialized = ref(false);

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

const saveSchoolSettings = async () => {
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
</script>

<style scoped></style>
