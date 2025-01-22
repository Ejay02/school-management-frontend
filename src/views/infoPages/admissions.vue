<template>
  <div class="min-h-screen bg-eduSkyLight">
    <!-- Hero Section -->
    <AdmissionsHero />

    <!-- Application Timeline -->
    <ApplicationTimeline />

    <!-- Requirements -->
    <Requirements />

    <!-- Application Form Section -->
    <section class="py-16">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-600 mb-8 text-center">
          Start Your Application
        </h2>
        <div class="bg-eduPurpleLight rounded-lg shadow-lg p-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Student Information -->
            <div>
              <h3 class="text-xl font-semibold text-gray-600 mb-4 text-center">
                Student Information
              </h3>

              <!-- name -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    for="firstname"
                    class="block text-sm font-medium text-gray-500"
                    >First Name</label
                  >
                  <input
                    type="text"
                    v-model="form.firstName"
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
                    v-model="form.lastName"
                    required
                    class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500"
                    >Date of Birth</label
                  >
                  <input
                    type="date"
                    v-model="form.dateOfBirth"
                    required
                    class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500"
                    >Class Applying For</label
                  >
                  <select
                    v-model="form.gradeApplying"
                    class="cursor-pointer block w-full rounded-md bg-white px-3 py-2 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple"
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
              <h3 class="text-xl font-semibold text-gray-600 mb-4">
                Parent/Guardian Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500"
                    >Parent/Guardian Name</label
                  >
                  <input
                    type="text"
                    v-model="form.parentName"
                    required
                    class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500"
                    >Relationship to Student</label
                  >
                  <input
                    type="text"
                    v-model="form.relationship"
                    required
                    class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500"
                    >Email</label
                  >
                  <input
                    type="email"
                    v-model="form.email"
                    required
                    class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500"
                    >Phone Number</label
                  >
                  <input
                    type="tel"
                    v-model="form.phone"
                    required
                    class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                  />
                </div>
              </div>
            </div>

            <!-- Current School Information -->
            <div>
              <h3 class="text-xl font-semibold text-gray-600 mb-4">
                Current School Information
              </h3>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500"
                    >Current School Name</label
                  >
                  <input
                    type="text"
                    v-model="form.currentSchool"
                    required
                    class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500"
                    >Current Grade</label
                  >
                  <input
                    type="text"
                    v-model="form.currentGrade"
                    required
                    class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500"
                    >School Address</label
                  >
                  <textarea
                    v-model="form.schoolAddress"
                    rows="3"
                    class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Additional Information -->
            <div>
              <h3 class="text-xl font-semibold text-gray-600 mb-4">
                Additional Information
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500"
                    >How did you hear about us?</label
                  >
                  <select
                    v-model="form.referralSource"
                    class="cursor-pointer block w-full rounded-md bg-white px-3 py-2 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple"
                  >
                    <option value="">Select an option</option>
                    <option value="website">School Website</option>
                    <option value="social">Social Media</option>
                    <option value="friend">Friend/Family</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500"
                    >Any special needs or requirements?</label
                  >
                  <textarea
                    v-model="form.specialNeeds"
                    rows="3"
                    class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-center">
              <button
                type="submit"
                class="inline-block bg-indigo-600 text-eduSky px-8 py-3 rounded-md font-semibold hover:bg-indigo-500 hover:shadow-lg"
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
import AdmissionsHero from "../../components/admissionsComponents/admissionsHero.vue";
import ApplicationTimeline from "../../components/admissionsComponents/applicationTimeline.vue";
import Requirements from "../../components/admissionsComponents/requirements.vue";

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
