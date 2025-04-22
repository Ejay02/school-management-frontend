<template>
  <transition name="fade">
    <div
      v-if="isModalVisible"
      class="fixed top-0 left-0 w-full h-full bg-gray-900/80 flex justify-center items-center z-50"
      @click.self="handleCancel"
      :key="isModalVisible"
    >
      <div
        class="bg-white p-6 rounded-lg w-[450px] h-auto min-h-[180px] mt-4 shadow-xl"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center">
            <div class="bg-orange-100 p-2 rounded-full">
              <svg
                class="w-6 h-6 text-orange-600"
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
            <h3 class="ml-3 text-lg font-medium text-gray-900">
              Cancel Confirmation
            </h3>
          </div>
          <button
            @click="handleCancel"
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
            Are you sure you want to cancel
            <b class="capitalize text-gray-800">{{ title }}</b
            >?
            <span class="text-orange-600 font-medium"
              >This action cannot be undone.</span
            >
          </p>
        

          <div class="mt-5">
            <label
              for="cancelReason"
              class="block text-sm font-medium text-gray-700"
              >Reason for cancellation
              <span class="text-red-500">*</span></label
            >
           
            <textarea
              id="cancelReason"
              v-model="cancelReason"
              rows="2"
              required
              placeholder="Please provide a reason for cancellation"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            ></textarea>
            <p class="mt-1 text-xs text-gray-500">
              This reason will be visible to all affected participants.
            </p>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            class="bg-white border border-gray-300 text-gray-700 py-2 px-5 rounded-md hover:bg-gray-50 transition-colors duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            @click="handleCancel"
            :disabled="isLoading"
          >
            No, Keep
          </button>
          <button
            class="bg-orange-500 text-white py-2 px-5 rounded-md hover:bg-orange-600 transition-colors duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            @click="handleConfirm"
            :disabled="isLoading || !cancelReason.trim()"
          >
            <span v-if="!isLoading">Yes, Cancel</span>
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
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { apolloClient } from "../../../apollo-client";
import { cancelEvent } from "../../graphql/mutations";
import { useEventStore } from "../../store/eventStore";
import { useNotificationStore } from "../../store/notification";

const modalStore = useModalStore();
const eventStore = useEventStore();
const router = useRouter();
const notificationStore = useNotificationStore();

const isModalVisible = ref(modalStore.cancelModal);
const title = ref(modalStore.modalTitle);
const source = ref(modalStore.confirmAction);
const cancelReason = ref("");
const isLoading = ref(false);

const handleCancel = () => {
  if (isLoading.value) return;
  modalStore.cancelModal = false;
  modalStore.modalId = null;
  modalStore.modalTitle = "";
  modalStore.confirmAction = "";
  modalStore.modalMessage = "";
};

const handleConfirm = async () => {
  if (!cancelReason.value.trim()) {
    notificationStore.addNotification({
      type: "error",
      message: "Please provide a reason for cancellation",
    });
    return;
  }

  try {
    isLoading.value = true;

    if (source.value === "cancelEvent") {
      await apolloClient.mutate({
        mutation: cancelEvent,
        variables: {
          id: modalStore.modalId,
          reason: cancelReason.value.trim(),
        },
      });

      await eventStore.fetchEvents();

      notificationStore.addNotification({
        type: "success",
        message: "Event cancelled successfully",
      });

      // If we're on the event view page, redirect to events list
      if (router.currentRoute.value.name === "EventView") {
        router.push("/events");
      }
    }

    modalStore.cancelModal = false;
    modalStore.modalId = null;
    modalStore.modalTitle = "";
    modalStore.confirmAction = "";
    modalStore.modalMessage = "";
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Error cancelling ${title.value}: ${error.message}`,
    });
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => modalStore.cancelModal,
  (newVal) => {
    isModalVisible.value = newVal;
    if (newVal) {
      cancelReason.value = ""; // Reset reason when modal opens
    }
  },
  { immediate: true }
);

watch(
  () => modalStore.modalTitle,
  (newVal) => {
    title.value = newVal;
  }
);

watch(
  () => modalStore.confirmAction,
  (newVal) => {
    source.value = newVal;
  }
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
