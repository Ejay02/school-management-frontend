<template>
  <section class="bg-gray-200 py-16">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-600 mb-4">
          Our Visionary Leadership
        </h2>
        <p class="text-gray-500 max-w-2xl mx-auto">
          Meet the innovative minds driving educational excellence and student
          success.
        </p>
      </div>
      <div class="grid md:grid-cols-4 gap-8">
        <div
          v-for="leader in leadership"
          :key="leader.name"
          class="bg-eduYellowLight cursor-pointer p-6 rounded-xl text-center hover:shadow-lg transition"
        >
          <img
            :src="leader.imageUrl"
            :alt="leader.name"
            class="w-32 h-32 mx-auto rounded-full object-cover mb-4 shadow-md"
          />
          <h3 class="text-xl font-semibold text-gray-600">
            {{ leader.name }}
          </h3>
          <p class="text-indigo-600 mb-2">{{ leader.role }}</p>
          <p class="text-gray-500 text-sm">{{ leader.bio }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const leadership = [
  {
    name: "Dr. Elena Rodriguez",
    role: "Founder & CEO",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Pioneering educational innovation with 20 years of experience in transformative learning strategies.",
  },
  {
    name: "Michael Chen",
    role: "Chief Academic Officer",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Dedicated to curriculum development and ensuring cutting-edge educational experiences.",
  },
  {
    name: "Sarah Thompson",
    role: "Student Success Director",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Passionate about student mentorship and creating supportive learning environments.",
  },
  {
    name: "David Kim",
    role: "Technology & Innovation Lead",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Driving digital transformation and integrating emerging technologies in education.",
  },
];
</script>

<style scoped></style>
