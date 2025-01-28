<template>
  <div>
    <form @submit.prevent="saveSettings" class="p-6">
      <!-- Profile Section -->
      <div
        class="flex justify-between flex-auto space-x-6 border-b border-gray-100 p-2 mb-4"
      >
        <div class="">
          <h2 class="text-lg font-medium text-gray-600">
            Personal Information
          </h2>
          <h6 class="text-gray-500">
            Use a permanent address where you can receive mail.
          </h6>
        </div>
        <div class="">
          <!-- img -->
          <div class="flex flex-col items-center mb-8">
            <div class="relative">
              <img
                :src="profilePreview || user.profileImage"
                class="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                alt="Profile image"
              />
              <button
                type="button"
                @click="$refs.fileInput.click()"
                class="absolute bottom-0 right-0 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
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
          </div>

          <!-- Personal Information -->
          <div class="space-y-6 mb-8">
            <div class="grid gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700"
                  >Full Name</label
                >
                <input
                  v-model="formData.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >Username</label
                  >
                  <input
                    v-model="formData.username"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Choose a username"
                  />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >Date of Birth</label
                  >
                  <input
                    v-model="formData.dob"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <button
        type="submit"
        class="text-end px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        Save Changes
      </button>
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
