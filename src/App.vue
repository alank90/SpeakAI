<template>
  <app-navbar></app-navbar>
  <img alt="AI picture" src="./assets/images/ai_image_xs.webp" />
  <div class="flow">
    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <router-view :key="componentKey"></router-view>
  </div>
</template>

<script setup>
import appNavbar from "./components/app-navbar.vue";
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
}

img[alt="AI picture"] {
  max-width: 750px;
  margin: 0 auto;
  border-radius: 6px;
}
</style>
