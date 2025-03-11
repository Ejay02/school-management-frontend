<template>
  <div>
    <form @submit.prevent="saveSettings" class="p-6">
      <!-- Notifications -->
      <div class="space-y-6 mb-8">
        <h2 class="text-lg font-medium text-gray-600 text-center">
          Notification Settings
        </h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-600">
                Email Notifications
              </h3>
              <p class="text-sm text-gray-500">
                Receive email updates about your account activity
              </p>
            </div>
            <button
              type="button"
              @click="
                formData.emailNotifications = !formData.emailNotifications
              "
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out"
              :class="[
                formData.emailNotifications ? 'bg-indigo-500' : 'bg-gray-200',
              ]"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1"
                :class="[
                  formData.emailNotifications
                    ? 'translate-x-6'
                    : 'translate-x-1',
                ]"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-600">
                Push Notifications
              </h3>
              <p class="text-sm text-gray-500">
                Receive notifications directly on your device
              </p>
            </div>
            <button
              type="button"
              @click="formData.pushNotifications = !formData.pushNotifications"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out"
              :class="[
                formData.pushNotifications ? 'bg-indigo-500' : 'bg-gray-200',
              ]"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1"
                :class="[
                  formData.pushNotifications
                    ? 'translate-x-6'
                    : 'translate-x-1',
                ]"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end mt-4 border-t border-gray-200">
        <button
          type="submit"
          class="mt-4 px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const user = {
  name: "John Doe",
  username: "johndoe",
  dob: "1990-01-01",
  profileImage:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  emailNotifications: true,
  pushNotifications: false,
};

const formData = reactive({
  name: user.name,
  username: user.username,
  dob: user.dob,
  emailNotifications: user.emailNotifications,
  pushNotifications: user.pushNotifications,
});
</script>

<style scoped></style>
