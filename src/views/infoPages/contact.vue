<template>
  <header class="relative bg-gray-100 shadow-md">
    <div
      class="container mx-auto py-4 flex justify-between items-center px-4 md:px-16"
    >
      <button
        @click="goBack"
        class="group flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-5 w-5 group-hover:translate-x-[-2px] transition-transform"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
          />
        </svg>
        <span>Back</span>
      </button>
    </div>
  </header>

  <div class="w-full bg-gray-200 flex items-center justify-center p-4 md:p-8">
    <div class="bg-white shadow-xl rounded-lg w-full max-w-2xl p-6 md:p-8">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">
        Contact Us
      </h2>
      <p class="text-center text-gray-500 mb-6">
        We'll get back to you within 24 hours
      </p>

      <div
        v-if="formSubmitted"
        class="bg-green-50 border border-green-200 rounded-md p-4 mb-6"
      >
        <div class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-green-500 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <p class="text-green-700">
            Thanks for reaching out, {{ submittedName }}! Your message has been
            sent successfully.
          </p>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="space-y-4" v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-gray-700 font-medium mb-2"
              >Full Name</label
            >
            <input
              id="name"
              v-model="name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
              placeholder="John Doe"
            />
            <p v-if="nameError" class="mt-1 text-sm text-red-600">
              {{ nameError }}
            </p>
          </div>

          <div>
            <label for="email" class="block text-gray-700 font-medium mb-2"
              >Email Address</label
            >
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
              placeholder="you@example.com"
            />
            <p v-if="emailError" class="mt-1 text-sm text-red-600">
              {{ emailError }}
            </p>
          </div>
        </div>

        <div>
          <label for="inquiry" class="block text-gray-700 font-medium mb-2"
            >Purpose of Inquiry</label
          >
          <select
            id="inquiry"
            v-model="inquiryType"
            required
            class="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
            :class="{ 'border-red-300': inquiryError }"
          >
            <option value="" disabled selected>Select Inquiry Type</option>
            <option value="admissions">Admissions Information</option>
            <option value="academics">Academic Programs</option>
            <option value="financial">Financial Aid & Scholarships</option>
            <option value="support">Technical Support</option>
            <option value="other">Other</option>
          </select>
          <p v-if="inquiryError" class="mt-1 text-sm text-red-600">
            {{ inquiryError }}
          </p>
        </div>

        <div>
          <label for="message" class="block text-gray-700 font-medium mb-2"
            >Message</label
          >
          <textarea
            id="message"
            v-model="message"
            required
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
            placeholder="How can we help you today?"
          ></textarea>
          <p v-if="messageError" class="mt-1 text-sm text-red-600">
            {{ messageError }}
          </p>
          <p class="text-sm text-gray-500 mt-1">
            {{ characterCount }}/500 characters
          </p>
        </div>

        <div class="flex items-center">
          <input
            id="agreement"
            v-model="agreeToTerms"
            type="checkbox"
            required
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
          />
          <label for="agreement" class="ml-2 block text-sm text-gray-700">
            I agree to the
            <a href="#" class="text-indigo-600 hover:text-indigo-800"
              >Privacy Policy</a
            >
            and
            <a href="#" class="text-indigo-600 hover:text-indigo-800"
              >Terms of Service</a
            >
          </label>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 px-4 rounded-md transition duration-300 font-medium flex justify-center items-center"
          :class="{ 'opacity-75 cursor-not-allowed': isSubmitting }"
        >
          <span v-if="isSubmitting" class="mr-2">
            <svg
              class="animate-spin h-5 w-5 text-white"
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
          </span>
          {{ isSubmitting ? "Sending..." : "Send Message" }}
        </button>

        <div class="flex justify-center space-x-6 mt-6 border-t pt-4">
          <a
            href="https://github.com/Ejay02"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-600 hover:text-indigo-600 transition duration-300"
            aria-label="GitHub Profile"
          >
            <i class="fa-brands fa-github text-2xl"></i>
          </a>

          <a
            href="https://www.linkedin.com/in/ejakpovi"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-600 hover:text-indigo-600 transition duration-300"
            aria-label="LinkedIn Profile"
          >
            <i class="fa-brands fa-linkedin text-2xl"></i>
          </a>

          <a
            href="mailto:e.jae02@gmail.com"
            class="text-gray-600 hover:text-indigo-600 transition duration-300"
            aria-label="Email Us"
          >
            <i class="fa-regular fa-envelope text-2xl"></i>
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useNavigation } from "../../composables/useNavigation";

const { goBack } = useNavigation();

// Form data
const name = ref("");
const email = ref("");
const message = ref("");
const inquiryType = ref("");
const agreeToTerms = ref(false);

// Form validation
const nameError = ref("");
const emailError = ref("");
const messageError = ref("");
const inquiryError = ref("");

// Form submission states
const isSubmitting = ref(false);
const formSubmitted = ref(false);
const submittedName = ref("");

// Character count for message
const characterCount = computed(() => message.value.length);

// Watch for changes to validate in real-time
watch(name, (newValue) => {
  validateName(newValue);
});

watch(email, (newValue) => {
  validateEmail(newValue);
});

watch(message, (newValue) => {
  validateMessage(newValue);
});

watch(inquiryType, (newValue) => {
  validateInquiry(newValue);
});

function validateName(value) {
  nameError.value = "";
  if (value.trim().length < 2) {
    nameError.value = "Name must be at least 2 characters";
  }
}

function validateEmail(value) {
  emailError.value = "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    emailError.value = "Please enter a valid email address";
  }
}

function validateMessage(value) {
  messageError.value = "";
  if (value.trim().length < 10) {
    messageError.value = "Message must be at least 10 characters";
  } else if (value.length > 500) {
    messageError.value = "Message cannot exceed 500 characters";
  }
}

function validateInquiry(value) {
  inquiryError.value = "";
  if (!value) {
    inquiryError.value = "Please select an inquiry type";
  }
}

function validateForm() {
  let isValid = true;

  validateName(name.value);
  validateEmail(email.value);
  validateMessage(message.value);
  validateInquiry(inquiryType.value);

  if (
    nameError.value ||
    emailError.value ||
    messageError.value ||
    inquiryError.value
  ) {
    isValid = false;
  }

  return isValid;
}

async function submitForm() {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Form Submitted", {
      name: name.value,
      email: email.value,
      inquiryType: inquiryType.value,
      message: message.value,
      agreeToTerms: agreeToTerms.value,
    });

    // Store the name for the success message
    submittedName.value = name.value.split(" ")[0];

    // Show success state
    formSubmitted.value = true;

    // Reset form after successful submission
    setTimeout(() => {
      name.value = "";
      email.value = "";
      message.value = "";
      inquiryType.value = "";
      agreeToTerms.value = false;
      formSubmitted.value = false;
    }, 5000);
  } catch (error) {
    console.error("Error submitting form:", error);
    // Handle error case here
  } finally {
    isSubmitting.value = false;
  }
}
</script>
