import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import FloatingVue from "floating-vue";

createApp(App).use(router).use(FloatingVue).mount("#app");

import "@/assets/css/main.css";
import 'floating-vue/dist/style.css'
