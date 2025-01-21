<template>
  <div class="min-h-screen bg-eduSky">
    <!-- Hero Section -->
    <div class="relative bg-eduPurpleLight py-16">
      <div class="absolute inset-0">
        <img
          src="/bg_1.jpg"
          alt="School campus"
          class="w-full h-full object-cover opacity-20"
        />
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
        <h1 class="text-4xl font-bold text-gray-600 mb-4">
          Join Our School Community
        </h1>
        <p class="text-xl text-gray-500 max-w-3xl mx-auto">
          Begin your journey with us. We welcome students who are eager to
          learn, grow, and contribute to our vibrant community.
        </p>
      </div>
    </div>

    <!-- Application Timeline -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-600 mb-8 text-center">
          Admissions Process
        </h2>
        <div class="relative">
          <!-- Timeline Line -->
          <div
            class="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-eduPurple"
          ></div>

          <!-- Timeline Items -->
          <div class="space-y-12">
            <!-- Step 1 -->
            <div
              class="relative flex items-center justify-between md:justify-normal md:even:flex-row-reverse group"
            >
              <div class="flex items-center w-full md:w-1/2 md:px-8">
                <div class="bg-eduPurpleLight p-6 rounded-lg shadow-md w-full">
                  <div class="flex items-center mb-4">
                    <span class="text-2xl font-bold text-eduPurple mr-4"
                      >01</span
                    >
                    <h3 class="text-xl font-semibold text-gray-600">
                      Submit Inquiry Form
                    </h3>
                  </div>
                  <p class="text-gray-500">
                    Complete our online inquiry form to express your interest
                    and receive detailed information about our programs.
                  </p>
                </div>
              </div>
              <div
                class="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
              >
                <div
                  class="w-8 h-8 rounded-full border-2 border-eduPurple bg-eduPurpleLight"
                ></div>
              </div>
            </div>

            <!-- Step 2 -->
            <div
              class="relative flex items-center justify-between md:justify-normal group"
            >
              <div class="flex items-center w-full md:w-1/2 md:px-8">
                <div class="bg-eduPurpleLight p-6 rounded-lg shadow-md w-full">
                  <div class="flex items-center mb-4">
                    <span class="text-2xl font-bold text-eduPurple mr-4"
                      >02</span
                    >
                    <h3 class="text-xl font-semibold text-gray-600">
                      Schedule a Visit
                    </h3>
                  </div>
                  <p class="text-gray-500">
                    Tour our campus, observe classes, and meet with our
                    admissions team to learn more about our school community.
                  </p>
                </div>
              </div>
              <div
                class="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
              >
                <div
                  class="w-8 h-8 rounded-full border-2 border-eduPurple bg-eduPurpleLight"
                ></div>
              </div>
            </div>

            <!-- Step 3 -->
            <div
              class="relative flex items-center justify-between md:justify-normal md:even:flex-row-reverse group"
            >
              <div class="flex items-center w-full md:w-1/2 md:px-8">
                <div class="bg-eduPurpleLight p-6 rounded-lg shadow-md w-full">
                  <div class="flex items-center mb-4">
                    <span class="text-2xl font-bold text-eduPurple mr-4"
                      >03</span
                    >
                    <h3 class="text-xl font-semibold text-gray-600">
                      Complete Application
                    </h3>
                  </div>
                  <p class="text-gray-500">
                    Submit the full application along with required documents,
                    including academic records and recommendations.
                  </p>
                </div>
              </div>
              <div
                class="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
              >
                <div
                  class="w-8 h-8 rounded-full border-2 border-eduPurple bg-eduPurpleLight"
                ></div>
              </div>
            </div>

            <!-- Step 4 -->
            <div
              class="relative flex items-center justify-between md:justify-normal group"
            >
              <div class="flex items-center w-full md:w-1/2 md:px-8">
                <div class="bg-eduPurpleLight p-6 rounded-lg shadow-md w-full">
                  <div class="flex items-center mb-4">
                    <span class="text-2xl font-bold text-eduPurple mr-4"
                      >04</span
                    >
                    <h3 class="text-xl font-semibold text-gray-600">
                      Assessment & Interview
                    </h3>
                  </div>
                  <p class="text-gray-500">
                    Students complete grade-appropriate assessments and
                    participate in an interview with our academic team.
                  </p>
                </div>
              </div>
              <div
                class="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
              >
                <div
                  class="w-8 h-8 rounded-full border-2 border-eduPurple bg-eduPurpleLight"
                ></div>
              </div>
            </div>

            <!-- Step 5 -->
            <div
              class="relative flex items-center justify-between md:justify-normal md:even:flex-row-reverse group"
            >
              <div class="flex items-center w-full md:w-1/2 md:px-8">
                <div class="bg-eduPurpleLight p-6 rounded-lg shadow-md w-full">
                  <div class="flex items-center mb-4">
                    <span class="text-2xl font-bold text-eduPurple mr-4"
                      >05</span
                    >
                    <h3 class="text-xl font-semibold text-gray-600">
                      Admission Decision
                    </h3>
                  </div>
                  <p class="text-gray-500">
                    Receive admission decision and welcome package with next
                    steps for enrollment.
                  </p>
                </div>
              </div>
              <div
                class="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
              >
                <div
                  class="w-8 h-8 rounded-full border-2 border-eduPurple bg-eduPurpleLight"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Requirements -->
    <section class="py-16 bg-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">
          Application Requirements
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Primary School -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Primary School (Grades 1-6)
            </h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <svg
                  class="h-5 w-5 text-blue-600 mt-1 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-gray-600">Previous school records</span>
              </li>
              <li class="flex items-start">
                <svg
                  class="h-5 w-5 text-blue-600 mt-1 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-gray-600">Teacher recommendation</span>
              </li>
              <li class="flex items-start">
                <svg
                  class="h-5 w-5 text-blue-600 mt-1 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-gray-600">Birth certificate</span>
              </li>
              <li class="flex items-start">
                <svg
                  class="h-5 w-5 text-blue-600 mt-1 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-gray-600">Health records</span>
              </li>
            </ul>
          </div>

          <!-- Secondary School -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Secondary School (Grades 7-12)
            </h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <svg
                  class="h-5 w-5 text-blue-600 mt-1 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-gray-600"
                  >Last 2 years of academic records</span
                >
              </li>
              <li class="flex items-start">
                <svg
                  class="h-5 w-5 text-blue-600 mt-1 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-gray-600">Two teacher recommendations</span>
              </li>
              <li class="flex items-start">
                <svg
                  class="h-5 w-5 text-blue-600 mt-1 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-gray-600">Student essay</span>
              </li>
              <li class="flex items-start">
                <svg
                  class="h-5 w-5 text-blue-600 mt-1 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-gray-600"
                  >Standardized test scores (if available)</span
                >
              </li>
            </ul>
          </div>

          <!-- Additional Documents -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Additional Documents
            </h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <svg
                  class="h-5 w-5 text-blue-600 mt-1 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-gray-600">Passport/ID copy</span>
              </li>
              <li class="flex items-start">
                <svg
                  class="h-5 w-5 text-blue-600 mt-1 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-gray-600">Recent photograph</span>
              </li>
              <li class="flex items-start">
                <svg
                  class="h-5 w-5 text-blue-600 mt-1 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-gray-600">Immunization records</span>
              </li>
              <li class="flex items-start">
                <svg
                  class="h-5 w-5 text-blue-600 mt-1 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-gray-600"
                  >Special needs documentation (if applicable)</span
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Application Form Section -->
    <section class="py-16">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
          Start Your Application
        </h2>
        <div class="bg-white rounded-lg shadow-md p-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Student Information -->
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-4">
                Student Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >First Name</label
                  >
                  <input
                    type="text"
                    v-model="form.firstName"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Last Name</label
                  >
                  <input
                    type="text"
                    v-model="form.lastName"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Date of Birth</label
                  >
                  <input
                    type="date"
                    v-model="form.dateOfBirth"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Grade Applying For</label
                  >
                  <select
                    v-model="form.gradeApplying"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Grade</option>
                    <option v-for="grade in 12" :key="grade" :value="grade">
                      Grade {{ grade }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Parent/Guardian Information -->
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-4">
                Parent/Guardian Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Parent/Guardian Name</label
                  >
                  <input
                    type="text"
                    v-model="form.parentName"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Relationship to Student</label
                  >
                  <input
                    type="text"
                    v-model="form.relationship"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Email</label
                  >
                  <input
                    type="email"
                    v-model="form.email"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Phone Number</label
                  >
                  <input
                    type="tel"
                    v-model="form.phone"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <!-- Current School Information -->
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-4">
                Current School Information
              </h3>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Current School Name</label
                  >
                  <input
                    type="text"
                    v-model="form.currentSchool"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Current Grade</label
                  >
                  <input
                    type="text"
                    v-model="form.currentGrade"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >School Address</label
                  >
                  <textarea
                    v-model="form.schoolAddress"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Additional Information -->
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-4">
                Additional Information
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >How did you hear about us?</label
                  >
                  <select
                    v-model="form.referralSource"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select an option</option>
                    <option value="website">School Website</option>
                    <option value="social">Social Media</option>
                    <option value="friend">Friend/Family</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Any special needs or requirements?</label
                  >
                  <textarea
                    v-model="form.specialNeeds"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-center">
              <button
                type="submit"
                class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";

const form = ref({
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gradeApplying: "",
  parentName: "",
  relationship: "",
  email: "",
  phone: "",
  currentSchool: "",
  currentGrade: "",
  schoolAddress: "",
  referralSource: "",
  specialNeeds: "",
});

const isFormValid = computed(() => {
  return (
    form.value.firstName &&
    form.value.lastName &&
    form.value.dateOfBirth &&
    form.value.gradeApplying &&
    form.value.parentName &&
    form.value.email &&
    form.value.phone
  );
});

const handleSubmit = async () => {
  if (!isFormValid.value) {
    return;
  }
  try {
    // Handle form submission logic here
    console.log("Form submitted:", form.value);
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};
</script>
