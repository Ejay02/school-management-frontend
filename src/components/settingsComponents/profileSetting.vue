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
            <img
              :src="profilePreview || user.profileImage"
              class="h-32 w-32 rounded-full object-cover border-2 border-white shadow-lg"
              alt="Profile image"
            />
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
                  for="firstname"
                  class="block text-sm font-medium text-gray-500"
                  >First Name</label
                >
                <input
                  type="text"
                  v-model="formData.firstName"
                  required
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Last Name</label
                >
                <input
                  type="text"
                  v-model="formData.lastName"
                  required
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                />
              </div>
            </div>

            <!-- Username and DOB Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="">
                <label class="block text-sm font-medium text-gray-500"
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
                <label class="block text-sm font-medium text-gray-500"
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
import { ref, reactive } from "vue";

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

const profilePreview = ref(null);
const fileInput = ref(null);

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
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
      ...formData,
      profileImage: profilePreview.value,
    });
    alert("Settings saved successfully!");
  } catch (error) {
    console.error("Error saving settings:", error);
    alert("Error saving settings. Please try again.");
  }
};
</script>

<style scoped></style>
