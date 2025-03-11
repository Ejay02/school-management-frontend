<template>
  <header class="relative bg-gray-200 shadow-md">
    <div class="container mx-auto py-6 flex justify-between items-center">
      <div @click="goBack" class="group">
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
      </div>
    </div>
  </header>

  <div class="min-h-screen bg-gray-200 flex items-center justify-center p-4">
    <div class="bg-eduYellowLight shadow-xl rounded-lg w-full max-w-md p-8">
      <h2 class="text-2xl font-bold text-center text-gray-600 mb-6">
        Contact Us
      </h2>

      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block text-gray-600 mb-2">Name</label>
          <input
            v-model="name"
            type="text"
            required
            class="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-eduPurpleLight"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label class="block text-gray-600 mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-eduPurpleLight cursor-pointer"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label class="block text-gray-600 mb-2">Purpose of Inquiry</label>
          <select
            v-model="inquiryType"
            class="text-gray-600 cursor-pointer w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-eduPurpleLight focus:ring-2 transition"
          >
            <option value="" disabled selected class="text-gray-600">
              Select Inquiry Type
            </option>
            <option class="text-gray-600" value="admissions">Admissions</option>
            <option class="text-gray-600" value="academics">
              Academic Programs
            </option>
            <option class="text-gray-600" value="support">
              General Support
            </option>
          </select>
        </div>
        <div>
          <label class="block text-gray-600 mb-2">Message</label>
          <textarea
            v-model="message"
            required
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-eduPurpleLight cursor-pointer"
            placeholder="✨ Your message..."
          ></textarea>
        </div>

        <button
          type="submit"
          class="w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-2 rounded-md hover:bg-indigo-500 transition duration-300 animate-bounce-once"
        >
          Send Message
        </button>

        <div class="flex justify-center space-x-4 mt-4 border-t pt-2">
          <a
            href="https://github.com/Ejay02"
            target="_blank"
            class="text-eduPurple hover:text-eduPurpleLight transition duration-300"
          >
            <i class="fa-brands fa-github text-2xl"></i>
          </a>

          <a
            href="https://www.linkedin.com/in/ejakpovi"
            target="_blank"
            class="text-eduPurple hover:text-eduPurpleLight transition duration-300"
          >
            <i class="fa-brands fa-linkedin text-2xl"></i>
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useNavigation } from "../../composables/useNavigation";

const { goBack } = useNavigation();

const name = ref("");
const email = ref("");
const message = ref("");
const inquiryType = ref("");

function submitForm() {
  console.log("Form Submitted", {
    name: name.value,
    email: email.value,
    message: message.value,
  });

  name.value = "";
  email.value = "";
  message.value = "";
}
</script>
