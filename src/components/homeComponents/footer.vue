<template>
  <footer class="bg-gray-600 text-gray-300 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-white font-semibold mb-4">Contact Us</h3>
          <p class="hover:text-eduSky cursor-pointer">
            <i class="fa-solid fa-map-location-dot"></i> 123 School Street,
          </p>
          <p class="hover:text-eduSky cursor-pointer">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;City, State 12345
          </p>
          <!-- &emsp; -->
          <p class="hover:text-eduSky cursor-pointer">
            <i class="fa-solid fa-phone"></i>&nbsp; (555) 123-4567
          </p>
          <p class="hover:text-eduSky cursor-pointer">
            <i class="fa-regular fa-envelope"></i>&nbsp; info@school.com
          </p>
        </div>
        <div>
          <h3 class="text-white font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/about" class="hover:text-eduSky"
                >About Us</router-link
              >
            </li>
            <li>
              <router-link to="/academics" class="hover:text-eduSky"
                >Academics</router-link
              >
            </li>
            <li>
              <router-link to="/admissions" class="hover:text-eduSky"
                >Admissions</router-link
              >
            </li>
            <li>
              <router-link to="/calender" class="hover:text-eduSky"
                >Calendar</router-link
              >
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-white font-semibold mb-4">Programs</h3>
          <ul class="space-y-2">
            <li><a href="#" class="hover:text-eduSky">Primary School</a></li>
            <li>
              <a href="#" class="hover:text-eduSky">Secondary School</a>
            </li>
            <li><a href="#" class="hover:text-eduSky">After School</a></li>
            <li>
              <a href="#" class="hover:text-eduSky">Summer Programs</a>
            </li>
          </ul>
        </div>
        <!-- socials -->
        <div>
          <h3 class="text-white font-semibold mb-4">Follow Us</h3>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-eduSky">
              <span class="sr-only">Facebook</span>
              <i class="fa-brands fa-square-facebook"></i>
            </a>
            <a href="#" class="hover:text-eduSky">
              <span class="sr-only">Twitter</span>
              <i class="fa-brands fa-square-x-twitter"></i>
            </a>
            <a href="#" class="hover:text-eduSky">
              <span class="sr-only">Instagram</span>
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="#" class="hover:text-eduSky">
              <span class="sr-only">Tiktok</span>
              <i class="fa-brands fa-tiktok"></i>
            </a>
            <a href="#" class="hover:text-eduSky">
              <span class="sr-only">YouTube</span>
              <i class="fa-brands fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
      <div class="mt-4 border-t border-gray-700 pt-2 text-center">
        <p>
          Copyright &copy; {{ currentYear }} Eduhub Portal | All rights
          reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped></style>
