// Sample Router config. Need to add About and NotFound components.
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  {
    path: "/dalle",
    name: "DallE",
    component: () => import("@/views/DallE.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/views/About.vue"), // Lazy loading this route
  },
  {
    path: "/intro",
    name: "Intro",
    component: () => import("@/views/IntroChatGPT.vue")
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

export default router;
