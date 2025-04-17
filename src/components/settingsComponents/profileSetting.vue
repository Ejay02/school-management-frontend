<template>
  <div>
    <form @submit.prevent="saveSettings" class="p-6">
      <!-- Profile Section -->
      <div
        class="flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 md:space-x-6 p-2"
      >
        <!-- Profile Image Section -->
        <div
          class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6"
        >
          <div class="relative">
            <!-- Use profile preview or user's image from userStore -->
            <img
              v-if="profilePreview || userStore?.userInfo?.img"
              :src="profilePreview || userStore?.userInfo?.img"
              class="h-32 w-32 rounded-full object-cover border-2 border-white shadow-lg"
              alt="Profile avatar"
            />
            <!-- Fallback to initials if no image is available -->
            <div
              v-else
              class="h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm border-2 border-indigo-200 text-2xl"
            >
              {{ capitalizedName[0] }}{{ capitalizedSurname[0] }}
            </div>
            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="absolute bottom-0 right-0 h-8 w-8 bg-eduSky rounded-full flex items-center justify-center text-white hover:bg-eduPurple transition-colors"
            >
              <i class="fas fa-camera"></i>
            </button>
            <input
              type="file"
              ref="fileInput"
              @change="handleImageChange"
              accept="image/*"
              class="hidden"
            />
          </div>
          <!-- File type text moved to center vertically -->
          <div
            class="text-center font-semibold text-gray-600 text-xs flex items-center"
          >
            <span>JPG, GIF or PNG. 1MB max.</span>
          </div>
        </div>

        <!-- Form Fields Section -->
        <div class="flex-1 max-w-2xl">
          <div class="space-y-6">
            <!-- Name Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-500"
                  >First Name</label
                >
                <input
                  type="text"
                  v-model="formData.name"
                  required
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                />
              </div>
              <div>
                <label
                  for="surname"
                  class="block text-sm font-medium text-gray-500"
                  >Last Name</label
                >
                <input
                  type="text"
                  v-model="formData.surname"
                  required
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                />
              </div>
            </div>

            <!-- Username and DOB Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="">
                <label
                  for="username"
                  class="block text-sm font-medium text-gray-500"
                  >Username</label
                >
                <input
                  v-model="formData.username"
                  type="text"
                  required
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                  placeholder="Choose a username"
                />
              </div>
              <div>
                <label for="dob" class="block text-sm font-medium text-gray-500"
                  >Date of Birth</label
                >
                <input
                  v-model="formData.dob"
                  type="date"
                  required
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button  -->
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
import { computed, reactive, ref } from "vue";
import { useUserStore } from "../../store/userStore";
import { apolloClient } from "../../../apollo-client";
import { useNotificationStore } from "../../store/notification";

const userStore = useUserStore();
const notificationStore = useNotificationStore();

// Helper function to capitalize first letter
const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const capitalizedName = computed(() => capitalize(userStore.userInfo.name));
const capitalizedSurname = computed(() =>
  capitalize(userStore.userInfo.surname)
);

// Initialize form data with user info from store
const formData = reactive({
  name: userStore.userInfo.name || "",
  surname: userStore.userInfo.surname || "",
  username:
    userStore.userInfo.username ||
    userStore.userInfo.email?.split("@")[0] ||
    "",
  dob: userStore.userInfo.dob || "",
  emailNotifications: true,
  pushNotifications: false,
});

const profilePreview = ref(null);
const fileInput = ref(null);

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Check file size (1MB max)
    if (file.size > 1024 * 1024) {
      notificationStore.addNotification({
        type: "error",
        message: "File size exceeds 1MB limit",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      profilePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const saveSettings = async () => {
  try {
    console.log("Saving settings:", {
      name: formData.name,
      surname: formData.surname,
      username: formData.username,
      dob: formData.dob,
      profileImage: profilePreview.value,
    });

    // Update local user store (this is a placeholder - )
    userStore.setUser({
      ...userStore.userInfo,
      name: formData.name,
      surname: formData.surname,
      username: formData.username,
      dob: formData.dob,
      img: profilePreview.value || userStore.userInfo.img,
      userId: userStore.userInfo.id,
    });

    await userStore.refreshUsers(apolloClient, {});

    notificationStore.addNotification({
      type: "success",
      message: "Profile updated successfully!",
    });
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Error saving settings. Please try again. ${error.message}`,
    });
  }
};
</script>

<style scoped></style>
