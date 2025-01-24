<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center p-8"
  >
    <div
      class="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2"
    >
      <!-- Left Side: Decorative Image -->
      <div
        class="hidden md:block bg-cover bg-center"
        style="background-image: url('/contact-bg.jpg')"
      >
        <div
          class="w-full h-full bg-indigo-900 bg-opacity-60 flex items-center justify-center"
        >
          <div class="text-center text-white p-8">
            <h2 class="text-4xl font-bold mb-4">Let's Connect</h2>
            <p class="text-xl opacity-80">
              We're here to answer your questions and help you take the next
              step in your educational journey.
            </p>
          </div>
        </div>
      </div>

      <!-- Right Side: Contact Form -->
      <div class="p-12">
        <form @submit.prevent="submitForm" class="space-y-6">
          <h3 class="text-3xl font-bold text-gray-800 mb-6 text-center">
            Contact EduHub
          </h3>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-2">First Name</label>
              <input
                v-model="firstName"
                type="text"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label class="block text-gray-700 mb-2">Last Name</label>
              <input
                v-model="lastName"
                type="text"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label class="block text-gray-700 mb-2">Email Address</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label class="block text-gray-700 mb-2">Purpose of Inquiry</label>
            <select
              v-model="inquiryType"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="">Select Inquiry Type</option>
              <option value="admissions">Admissions</option>
              <option value="academics">Academic Programs</option>
              <option value="support">General Support</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-700 mb-2">Your Message</label>
            <textarea
              v-model="message"
              required
              rows="4"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            ></textarea>
          </div>

          <button
            type="submit"
            class="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition transform hover:scale-105 duration-300 ease-in-out"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const inquiryType = ref("");
const message = ref("");

const submitForm = () => {
  // Placeholder submission logic
  console.log({
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    inquiryType: inquiryType.value,
    message: message.value,
  });

  // Reset form
  firstName.value = "";
  lastName.value = "";
  email.value = "";
  inquiryType.value = "";
  message.value = "";

  // Show success message
  alert("Message sent successfully!");
};
</script>
