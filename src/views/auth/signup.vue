<template>
  <div class="flex min-h-screen">
    <!-- Left Section -->
    <div
      class="left w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50"
    >
      <!-- back arrow -->
      <div class="pl-4 mt-0">
        <router-link to="/" class="group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="text-gray-600 h-6 w-6 cursor-pointer group-hover:animate-bounce"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
        </router-link>
      </div>

      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2
          class="mb-5 text-center text-2xl/9 font-bold tracking-tight text-gray-800"
        >
          Create your account 🚀
        </h2>
      </div>

      <div class="mt-0 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Role Selection -->
          <div>
            <label
              for="role"
              class="block text-sm/6 font-medium text-indigo-600 mb-1"
              >Select Role</label
            >
            <select
              v-model="selectedRole"
              id="role"
              class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-eduPurpleLight sm:text-sm"
            >
              <option value="" disabled>Select your role</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label
                for="firstName"
                class="text-indigo-600 block text-sm/6 font-medium"
                >Name</label
              >
              <div class="mt-1">
                <input
                  type="text"
                  v-model="formData.firstName"
                  id="firstName"
                  autofocus
                  placeholder="Jane"
                  required
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurpleLight sm:text-sm/6"
                />
              </div>
            </div>

            <div class="flex-1">
              <label
                for="lastName"
                class="block text-sm/6 font-medium text-indigo-600"
                >Surname</label
              >
              <div class="mt-1">
                <input
                  type="text"
                  v-model="formData.lastName"
                  id="lastName"
                  placeholder="Bond"
                  required
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurpleLight sm:text-sm/6"
                />
              </div>
            </div>
          </div>

          <!-- Role-specific fields -->
          <div class="flex gap-4" v-if="selectedRole === 'student'">
            <div class="flex-1">
              <label
                for="parentId"
                class="block text-sm font-medium text-indigo-600"
              >
                Parent ID
              </label>
              <div class="mt-1">
                <input
                  type="text"
                  v-model="formData.parentId"
                  id="parentId"
                  placeholder="Enter parent ID"
                  required
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-eduPurpleLight sm:text-sm"
                />
              </div>
            </div>

            <div class="flex-1">
              <label
                for="class"
                class="block text-sm font-medium text-indigo-600"
              >
                Class
              </label>
              <div class="mt-1">
                <select
                  v-model="formData.selectedClass"
                  id="class"
                  required
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-eduPurpleLight sm:text-sm"
                >
                  <option value="" disabled>Select class</option>
                  <option
                    v-for="(value, key) in defaultClasses"
                    :key="key"
                    :value="key"
                  >
                    {{ value }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Username -->
          <div class="flex gap-4">
            <div class="flex-1">
              <label
                for="username"
                class="block text-sm/6 font-medium text-indigo-600"
                >Username</label
              >
              <div class="mt-1">
                <input
                  type="text"
                  v-model="formData.username"
                  id="username"
                  placeholder="janebond007"
                  required
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurpleLight sm:text-sm/6"
                />
              </div>
            </div>

            <!-- Email -->
            <div class="flex-1">
              <label
                for="email"
                class="block text-sm/6 font-medium text-indigo-600"
                >Email address</label
              >
              <div class="mt-1">
                <input
                  type="email"
                  v-model="formData.email"
                  id="email"
                  placeholder="janebond@007.com"
                  required
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurpleLight sm:text-sm/6"
                />
              </div>
            </div>
          </div>

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="block text-sm/6 font-medium text-indigo-600"
                >Password</label
              >
            </div>
            <div class="mt-1 relative">
              <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                placeholder="my-super-secret-password"
                required
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurpleLight sm:text-sm/6"
              />
              <button
                type="button"
                class="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                @click="showPassword = !showPassword"
              >
                <i
                  class="fa-regular"
                  :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                ></i>
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign up
            </button>
          </div>
        </form>

        <p class="mt-5 text-center text-sm/6 text-gray-500">
          Already have an account?
          <router-link
            to="/login"
            class="font-semibold text-indigo-600 hover:text-indigo-500"
            >Log in</router-link
          >
        </p>
      </div>
    </div>

    <!-- Right Section -->
    <div class="right hidden lg:block lg:w-1/2">
      <img
        src="/kimberly-farmer-lUaaKCUANVI-unsplash.jpg"
        alt="Background Image"
        class="h-full w-full object-cover"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const showPassword = ref(false);
const selectedRole = ref("");

const defaultClasses = {
  PRIMARY_1: "Primary 1",
  PRIMARY_2: "Primary 2",
  PRIMARY_3: "Primary 3",
  PRIMARY_4: "Primary 4",
  PRIMARY_5: "Primary 5",
  PRIMARY_6: "Primary 6",
  JSS_1: "JSS 1",
  JSS_2: "JSS 2",
  JSS_3: "JSS 3",
  SS_1: "SS 1",
  SS_2: "SS 2",
  SS_3: "SS 3",
};

const formData = reactive({
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  // Role-specific fields
  parentId: "",
  selectedClass: "",
  // childName: "",
  // subject: "",
  // department: "",
});

const handleSubmit = () => {
  // Here you can handle the form submission with the role and related data
  console.log("Form submitted:", {
    ...formData,
    role: selectedRole.value,
  });
};
</script>

<style scoped></style>
