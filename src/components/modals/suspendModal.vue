<template>
  <transition name="fade">
    <div
      v-if="isModalVisible"
      class="fixed top-0 left-0 w-full h-full bg-gray-900/80 flex justify-center items-center z-50"
      @click.self="closeModal()"
      :key="isModalVisible"
    >
      <div
        class="bg-white p-6 rounded-lg w-[450px] h-auto min-h-[200px] mt-4 shadow-xl"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center">
            <div class="bg-red-100 p-2 rounded-full">
              <svg
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 class="ml-3 text-lg font-medium text-gray-900">Suspend User</h3>
          </div>
          <button
            @click="closeModal()"
            class="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="mt-4 border-t border-gray-200 pt-4">
          <p class="text-gray-600 text-sm">
            {{ modalMessage || fallbackMessage }}
          </p>

          <div class="mt-5">
            <label
              for="suspendReason"
              class="block text-sm font-medium text-gray-700"
            >
              Reason for suspension <span class="text-red-500">*</span>
            </label>

            <textarea
              id="suspendReason"
              v-model="reason"
              rows="2"
              required
              placeholder="Add a reason for audit purposes"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm cursor-pointer"
            ></textarea>
            <p class="mt-1 text-xs text-gray-500">
              This reason is stored for audit purposes.
            </p>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            class="bg-white border border-gray-300 text-gray-700 py-2 px-5 rounded-md hover:bg-gray-50 transition-colors duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            @click="closeModal()"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button
            class="bg-red-500 text-white py-2 px-5 rounded-md hover:bg-red-600 transition-colors duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            @click="handleConfirm"
            :disabled="isLoading || !reason.trim()"
          >
            <span v-if="!isLoading">Yes, Suspend</span>
            <div v-else class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </div>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useModalStore } from "@/store/useModalStore";
import { computed, ref, watch } from "vue";
import { apolloClient } from "../../../apollo-client";
import { setUserActiveStatus } from "../../graphql/mutations";
import { useNotificationStore } from "../../store/notification";
import { extractGraphQLErrorMessage } from "../../utils/graphqlError";

const modalStore = useModalStore();
const notificationStore = useNotificationStore();

const isModalVisible = ref(modalStore.suspendModal);
const isLoading = ref(false);
const reason = ref("");

const modalMessage = computed(() => modalStore.modalMessage);
const title = computed(() => modalStore.modalTitle);

const fallbackMessage = computed(() => {
  const name = title.value ? ` "${title.value}"` : "";
  return `Are you sure you want to suspend${name}? They will be unable to log in until reactivated.`;
});

const closeModal = (force = false) => {
  if (isLoading.value && !force) return;
  modalStore.suspendModal = false;
  modalStore.modalId = null;
  modalStore.modalTitle = "";
  modalStore.modalMessage = "";
  modalStore.confirmAction = "";
  modalStore.source = "";
  modalStore.data = null;
};

const handleConfirm = async () => {
  if (!reason.value.trim()) {
    notificationStore.addNotification({
      type: "error",
      message: "Please provide a reason for suspension",
    });
    return;
  }

  const targetId = modalStore.modalId;
  if (!targetId) return;

  try {
    isLoading.value = true;

    const { data } = await apolloClient.mutate({
      mutation: setUserActiveStatus,
      variables: {
        targetId,
        isActive: false,
        reason: reason.value.trim(),
      },
    });

    const updated = data?.setUserActiveStatus;
    if (updated && modalStore.data) {
      modalStore.data.isActive = Boolean(updated.isActive);
      modalStore.data.deactivatedAt = updated.deactivatedAt || null;
    }

    notificationStore.addNotification({
      type: "success",
      message: "User suspended",
    });

    closeModal(true);
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: extractGraphQLErrorMessage(error, "Unable to suspend user"),
    });
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => modalStore.suspendModal,
  (newVal) => {
    isModalVisible.value = newVal;
    if (newVal) reason.value = "";
  },
  { immediate: true },
);
</script>
