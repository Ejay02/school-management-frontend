<template>
  <div class="p-6">
    <form @submit.prevent="saveSettings" class="space-y-6">
      <div class="space-y-2">
        <h2 class="text-lg font-medium text-gray-600 text-center">
          Notification Settings
        </h2>
        <p class="text-sm text-center text-gray-500">
          Manage email summaries and school communication preferences.
        </p>
      </div>

      <div class="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-sm font-medium text-gray-700">
              Weekly Parent Digest
            </h3>
            <p class="text-sm text-gray-500">
              {{
                isParent
                  ? "Receive one weekly digest email with attendance, events, assignments, and fees for all your children."
                  : "Parents can manage whether they receive the weekly digest email from here."
              }}
            </p>
          </div>

          <button
            v-if="isParent"
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

        <div
          v-if="isParent"
          class="rounded-md border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm text-indigo-700"
        >
          <span v-if="formData.weeklyDigestEnabled">
            Weekly digest emails are enabled.
          </span>
          <span v-else
            >Weekly digest emails are disabled for your account.</span
          >
        </div>

        <div
          v-else
          class="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
        >
          School-wide digest timing is managed by admins in the School settings
          tab.
        </div>
      </div>

      <div
        v-if="isParent"
        class="flex justify-end mt-4 border-t border-gray-200 pt-4"
      >
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
import { computed, onMounted, reactive, watch } from "vue";
import { apolloClient } from "../../../apollo-client";
import { useMutation } from "@vue/apollo-composable";
import { updateWeeklyDigestPreference } from "../../graphql/mutations";
import { useNotificationStore } from "../../store/notification";
import { useUserStore } from "../../store/userStore";

const notificationStore = useNotificationStore();
const userStore = useUserStore();

const { mutate, loading: saving } = useMutation(updateWeeklyDigestPreference);

const isParent = computed(
  () => String(userStore.userInfo?.role || "").toLowerCase() === "parent",
);

const formData = reactive({
  weeklyDigestEnabled: !Boolean(userStore.userInfo?.weeklyDigestOptOut),
});

watch(
  () => userStore.userInfo?.weeklyDigestOptOut,
  (value) => {
    formData.weeklyDigestEnabled = !Boolean(value);
  },
  { immediate: true },
);

const saveSettings = async () => {
  if (!isParent.value) return;

  try {
    const response = await mutate({
      optOut: !formData.weeklyDigestEnabled,
    });

    const updatedParent = response?.data?.updateWeeklyDigestPreference;
    if (updatedParent) {
      userStore.updateUserProfile(updatedParent);
    } else {
      await userStore.syncCurrentUser(apolloClient);
    }

    notificationStore.addNotification({
      type: "success",
      message: formData.weeklyDigestEnabled
        ? "Weekly digest emails enabled."
        : "Weekly digest emails disabled.",
    });
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: error?.message || "Unable to update weekly digest preference",
    });
  }
};

onMounted(() => {
  if (isParent.value) {
    userStore.syncCurrentUser(apolloClient);
  }
});
</script>

<style scoped></style>
