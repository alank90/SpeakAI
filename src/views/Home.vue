<template>
  <h1>Welcome to SpeakAI</h1>
</template>

<script setup>
import { ref } from "vue";
console.log(import.meta.env);

const openAIURL = "https://api.openai.com/v1/chat";

fetch(openAIURL, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`,
    "OpenAI-Organization": import.meta.env.VITE_ORG_ID,
  },
}).then((response) => {
  return response.text();
});

const content = ref("");
const BTN_TEXT = "Submit 🚀";
const res = ref("✅ The answer will be displayed here.");
const btnText = ref(BTN_TEXT);

/* ==== Methods ========== */
const askAi = () => {
  btnText.value = "Thinking...🤔";
};
</script>

<style scoped>
h1 {
  font-family: var(--heading-font);
}
</style>
