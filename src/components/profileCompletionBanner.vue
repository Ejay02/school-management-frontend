<template>
  <div
    v-if="showBanner"
    class="mx-4 mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
  >
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="font-semibold">Complete your profile to unlock the rest of your account.</p>
        <p class="mt-1 text-amber-800">
          Missing: {{ missingFieldsText }}. Until these details are added, you can only access
          your account settings.
        </p>
      </div>

      <router-link
        to="/settings/profile"
        class="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700"
      >
        Complete Profile
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "../store/userStore";

const userStore = useUserStore();

const showBanner = computed(() => {
  return (
    userStore.requiresProfileCompletion &&
    userStore.incompleteProfileFields.length > 0
  );
});

const missingFieldsText = computed(() => {
  return userStore.incompleteProfileFields.join(", ");
});
</script>
