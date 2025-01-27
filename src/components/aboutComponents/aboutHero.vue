<template>
  <section
    class="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center"
  >
    <div>
      <h2 class="text-4xl font-extrabold text-gray-600 mb-6">
        Transforming Education, Inspiring Futures
      </h2>
      <p class="text-xl text-gray-500 mb-8">
        We're not just teaching. We're empowering the next generation of
        innovators, thinkers, and leaders.
      </p>
      <div class="flex space-x-4">
        <button
          class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-400 transition"
        >
          Explore Programs
        </button>
        <button
          @click="openModal"
          class="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition"
        >
          Request Info
        </button>

        <!--  -->
      </div>
    </div>

    <div>
      <img
        src="/anatoliy-gromov-KP4ezcBNX44-unsplash.jpg"
        alt="Campus View"
        class="rounded-xl shadow-2xl"
      />
    </div>
  </section>

  <!-- request Modal -->
  <div
    v-if="isModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click="closeModal"
  >
    <div class="p-8 shadow-lg w-full max-w-2xl mx-4" @click.stop>
      <RequestInfoCard />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import RequestInfoCard from "../cards/requestInfoCard.vue";

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<style scoped></style>
