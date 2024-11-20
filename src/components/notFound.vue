<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-yellow-400">
    <div class="flex items-center">
      <p class="text-2xl font-semibold mr-2">404</p>
      <p class="text-2xl font-semibold mr-2">|</p>
      <p class="ml-2 text-center">The page you're looking for doesn't exist.</p>
    </div>

    <!--  -->
    <router-link to="/">
      <div class="container mt-20">
        <div class="center">
          <button class="btn">
            <svg
              width="180px"
              height="60px"
              viewBox="0 0 180 60"
              class="border"
            >
              <polyline points="179,1 179,59 1,59 1,1 179,1" class="bg-line" />
              <polyline points="179,1 179,59 1,59 1,1 179,1" class="hl-line" />
            </svg>
            <span> Go Home</span>
          </button>
        </div>
      </div>
    </router-link>
  </div>
</template>
<script setup></script>

<style scoped>
/* @import url("https://fonts.googleapis.com/css?family=Lato:100&display=swap"); */

body,
html {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: #5ca4ea;
  overflow: hidden;
  font-family: "Lato", sans-serif;
}

.container {
  width: 400px;
  height: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.center {
  width: 180px;
  height: 60px;
  position: absolute;
}

.btn {
  width: 180px;
  height: 60px;
  cursor: pointer;
  background: transparent;
  border: 1px solid #91c9ff;
  outline: none;
  transition: 1s ease-in-out;
}

svg {
  position: absolute;
  left: 0;
  top: 0;
  fill: none;
  stroke: #fff;
  stroke-dasharray: 150 480;
  stroke-dashoffset: 150;
  transition: 1s ease-in-out;
}

.btn:hover {
  transition: 1s ease-in-out;
  background: #4f95da;
}

.btn:hover svg {
  stroke-dashoffset: -480;
}

.btn span {
  font-size: 18px;
  font-weight: 100;
}
</style>
