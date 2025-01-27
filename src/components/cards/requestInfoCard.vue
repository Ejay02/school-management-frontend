<template>
  <div class="bg-white p-6 rounded-lg shadow-lg max-w-md">
    <h3 class="text-lg font-semibold text-gray-600 mb-4">
      Request Information
    </h3>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Parent's Name"
          class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurpleLight sm:text-sm/6"
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Email Address"
          class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurpleLight sm:text-sm/6"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md focus-visible:outline-indigo-600 hover:bg-indigo-500 transition-colors"
      >
        Get Started
      </button>
    </form>
  </div>
</template>

<script setup></script>

<style scoped></style>
