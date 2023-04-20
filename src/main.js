import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import FloatingVue from "floating-vue";

import "floating-vue/dist/style.css";
import "@/assets/css/main.css";

// Floating Vue options
FloatingVue.options.themes = {
  tooltip: {
    // Default tooltip placement relative to target element
    placement: "left",
    // Default events that trigger the tooltip
    triggers: ["hover", "focus", "touch"],
    // Close tooltip on click on tooltip target
    hideTriggers: (events) => [...events, "click"],
    // Delay (ms)
    delay: {
      show: 200,
      hide: 500,
    },
  },
};

FloatingVue.options.themes.tooltip.disabled = window.innerWidth <= 768;

createApp(App).use(router).use(FloatingVue).mount("#app");
