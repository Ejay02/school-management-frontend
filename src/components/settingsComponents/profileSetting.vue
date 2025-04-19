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
                <label for="dateOfBirth" class="block text-sm font-medium text-gray-500"
                  >Date of Birth</label
                >
                <input
                  v-model="formData.dateOfBirth"
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
import { apolloClient } from "../../../apollo-client";
import {
  updateAdminProfile,
  updateParentProfile,
  updateStudentProfile,
  updateTeacherProfile,
} from "../../graphql/mutations";
import { useNotificationStore } from "../../store/notification";

import { useUserStore } from "../../store/userStore";

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
  dateOfBirth: userStore.userInfo.dateOfBirth || "",
  emailNotifications: true,
  pushNotifications: false,
});

const profilePreview = ref(null);
const fileInput = ref(null);
const imageFile = ref(null);
const imageBase64 = ref(null);

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

    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePreview.value = e.target.result;
      imageBase64.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Get the appropriate mutation based on user role
const getProfileMutation = () => {
  const role = userStore.currentRole.toLowerCase();

  if (role === "admin" || role === "super_admin") {
    return updateAdminProfile;
  } else if (role === "teacher") {
    return updateTeacherProfile;
  } else if (role === "student") {
    return updateStudentProfile;
  } else if (role === "parent") {
    return updateParentProfile;
  }

  throw new Error(`No profile update mutation available for role: ${role}`);
};

// Prepare form data for upload
const prepareFormData = () => {
  // Prepare the input object
  const input = {
    name: formData.name,
    surname: formData.surname,
    username: formData.username,
    dateOfBirth: formData.dateOfBirth,
  };

  // If an image file is selected, add the base64 string to the input
  if (imageBase64.value) {
    input.img = imageBase64.value;
  }

  return input;
};

const saveSettings = async () => {
  try {
    loading.value = true;

    // Get the appropriate mutation based on user role
    const mutation = getProfileMutation();

    // Prepare the input data including image as base64 string
    const input = prepareFormData();

    // Execute the GraphQL mutation with the base64 string
    const { data } = await apolloClient.mutate({
      mutation,
      variables: { input },
    });

    // Extract the response data based on the mutation type
    let userData;
    if (
      userStore.currentRole.toLowerCase() === "admin" ||
      userStore.currentRole.toLowerCase() === "super_admin"
    ) {
      userData = data.updateAdminProfile;
    } else if (userStore.currentRole.toLowerCase() === "teacher") {
      userData = data.updateTeacherProfile;
    } else if (userStore.currentRole.toLowerCase() === "student") {
      userData = data.updateStudentProfile;
    } else if (userStore.currentRole.toLowerCase() === "parent") {
      userData = data.updateParentProfile;
    }

    // Update local user store with the returned data
    if (userData) {
      userStore.updateUserProfile(userData);

      notificationStore.addNotification({
        type: "success",
        message: "Profile updated successfully!",
      });
    }
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Error saving settings: ${error.message}`,
    });
  } finally {
    loading.value = false;
  }
};

const loading = ref(false);
</script>

<style scoped></style>
