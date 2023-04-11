<template>
  <h1>Welcome to SpeakAI</h1>
  <div class="grid-container">
    <div class="chat">
      <input
        type="text"
        class="input"
        placeholder="Ask me about ...🌽"
        v-model="content"
        clear
      />

      <div class="button-block">
        <button type="button" @click="askAi" class="btn">
          <strong>{{ btnText }}</strong>
          <div id="container-stars">
            <div id="stars"></div>
          </div>
          <div id="glow">
            <div class="circle"></div>
            <div class="circle"></div>
          </div>
        </button>
      </div>

      <div class="card">
        <pre>{{ aiResponse }}</pre>
      </div>
    </div>

    <div class="chat-options">
      <label for="temperature">Temperature: {{ temperatureValue }}</label>
      <input
        type="range"
        id="temperature"
        name="temperature"
        min="0"
        max="1"
        step=".1"
        v-model="temperatureValue"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const openAIURL = "https://api.openai.com/v1/chat/completions";

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append(
  "Authorization",
  `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
);
myHeaders.append("OpenAI-Organization", `${import.meta.env.VITE_ORG_ID}`);

const content = ref("");
let temperatureValue = ref(0.5);
const BTN_TEXT = "Submit 🚀";
const aiResponse = ref("✅ The answer will be displayed here.");
const btnText = ref(BTN_TEXT);

/* ================== Methods =============================== */
const askAi = async () => {
  btnText.value = "Thinking...🤔";
  await fetch(openAIURL, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: content.value }],
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      return response.json();
    })
    .then((data) => {
      aiResponse.value = data.choices[0].message.content;
    })
    .catch((error) => {
      aiResponse.value =
        "I'm sorry. There was a problem with your request at this time.";
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    })
    .finally(() => {
      btnText.value = BTN_TEXT;
    });
};
</script>

<style scoped>
h1 {
  font-family: var(--heading-font);
  margin-bottom: 64px;
}

.grid-container {
  display: grid;
  grid-template-columns: 75% 25%;
  grid-template-rows: auto;
  grid-template-areas: "chat options";
  column-gap: 15px;
}

.chat {
  grid-area: chat;
}

.chat-options {
  grid-area: options;
}

.input {
  width: calc(85% - 20px);
  height: 32px;
  padding: 12px;
  border: none;
  border-radius: 16px;
  box-shadow: 2px 2px 7px 0 rgb(0, 0, 0, 0.2);
  outline: none;
  font-size: 1.2rem;
  font-weight: 550;
  font-family: var(--letter-font);
}

.input:invalid {
  animation: justshake 0.3s forwards;
  color: red;
}

label {
  color: var(--letter-ai-color);
  font-family: var(--letter-font);
  font-size: 1.1rem;
  font-weight: 550;
}

/* Range Input stylings */
input[type="range"] {
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
}
input[type="range"]:focus {
  outline: none;
}
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 12.8px;
  cursor: pointer;
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  background: #ac51b5;
  border-radius: 25px;
  border: 0px solid #000101;
}
input[type="range"]::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  border: 0px solid #000000;
  height: 20px;
  width: 39px;
  border-radius: 7px;
  background: #65001c;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -3.6px;
}
input[type="range"]:focus::-webkit-slider-runnable-track {
  background: #ac51b5;
}
input[type="range"]::-moz-range-track {
  width: 100%;
  height: 12.8px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  background: #ac51b5;
  border-radius: 25px;
  border: 0px solid #000101;
}
input[type="range"]::-moz-range-thumb {
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  border: 0px solid #000000;
  height: 20px;
  width: 39px;
  border-radius: 7px;
  background: #65001c;
  cursor: pointer;
}
input[type="range"]::-ms-track {
  width: 100%;
  height: 12.8px;
  cursor: pointer;
  animate: 0.2s;
  background: transparent;
  border-color: transparent;
  border-width: 39px 0;
  color: transparent;
}
input[type="range"]::-ms-fill-lower {
  background: #ac51b5;
  border: 0px solid #000101;
  border-radius: 50px;
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
}
input[type="range"]::-ms-fill-upper {
  background: #ac51b5;
  border: 0px solid #000101;
  border-radius: 50px;
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
}
input[type="range"]::-ms-thumb {
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  border: 0px solid #000000;
  height: 20px;
  width: 39px;
  border-radius: 7px;
  background: #65001c;
  cursor: pointer;
}
input[type="range"]:focus::-ms-fill-lower {
  background: #ac51b5;
}
input[type="range"]:focus::-ms-fill-upper {
  background: #ac51b5;
}

@keyframes justshake {
  25% {
    transform: translateX(5px);
  }
  50% {
    transform: translateX(-5px);
  }

  75% {
    transform: translateX(5px);
  }

  100% {
    transform: translateX-(5px);
  }
}

button {
  cursor: pointer;
  height: 32px;
  font-size: 16px;
  margin-top: 24px;
  background: royalblue;
  color: white;
  padding: 0.7em 1em;
  padding-left: 0.9em;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.2s;
}

button span {
  display: block;
  margin-left: 0.3em;
  transition: all 0.3s ease-in-out;
}

button svg {
  display: block;
  transform-origin: center center;
  transition: transform 0.3s ease-in-out;
}

.card {
  font-family: var(--letter-font);
  background: #07182e;
  position: relative;
  display: flex;
  place-content: center;
  place-items: center;
  overflow: hidden;
  border-radius: 16px;
  margin: 32px auto;
  max-width: 85vw;
}

.card span,
.card pre {
  z-index: 1;
  font-size: 1.1rem;
  font-family: var(--letter-font);
  color: var(--letter-ai-color);
  white-space: pre-wrap;
  padding: 4px;
}

.card::before {
  content: "";
  position: absolute;
  width: 100%;
  background-image: linear-gradient(
    180deg,
    rgb(0, 183, 255),
    rgb(255, 48, 255)
  );
  height: 130%;
  animation: rotBGimg 3s linear infinite;
  transition: all 0.2s linear;
}

.card::after {
  content: "";
  position: absolute;
  background: var(--color-light);
  inset: 5px;
  border-radius: 16px;
}

.button-block {
  display: flex;
  align-items: center;
  justify-content: end;
  max-width: 85vw;
}
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 8rem;
  max-width: 13rem;
  height: 3rem;
  background-size: 300% 300%;
  backdrop-filter: blur(1rem);
  border-radius: 5rem;
  transition: 0.5s;
  animation: gradient_301 5s ease infinite;
  border: double 4px transparent;
  background-image: linear-gradient(#212121, #212121),
    linear-gradient(
      137.48deg,
      #ffdb3b 10%,
      #fe53bb 45%,
      #8f51ea 67%,
      #0044ff 87%
    );
  background-origin: border-box;
  background-clip: content-box, border-box;
}

#container-stars {
  position: fixed;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: 0.5s;
  backdrop-filter: blur(1rem);
  border-radius: 5rem;
}

strong {
  z-index: 2;
  font-size: 16px;
  color: #ffffff;
  text-shadow: 0 0 4px white;
}

#glow {
  position: absolute;
  display: flex;
  width: 12rem;
}

.circle {
  width: 100%;
  height: 30px;
  filter: blur(2rem);
  animation: pulse_3011 4s infinite;
  z-index: -1;
}

.circle:nth-of-type(1) {
  background: rgba(254, 83, 186, 0.636);
}

.circle:nth-of-type(2) {
  background: rgba(142, 81, 234, 0.704);
}

.btn:hover #container-stars {
  z-index: 1;
  background-color: #212121;
}

.btn:hover {
  transform: scale(1.1);
}

.btn:active {
  border: double 4px #fe53bb;
  background-origin: border-box;
  background-clip: content-box, border-box;
  animation: none;
}

.btn:active .circle {
  background: #fe53bb;
}

#stars {
  position: relative;
  background: transparent;
  width: 200rem;
  height: 200rem;
}

#stars::after {
  content: "";
  position: absolute;
  top: -10rem;
  left: -100rem;
  width: 100%;
  height: 100%;
  animation: animStarRotate 90s linear infinite;
}

#stars::after {
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
  background-size: 50px 50px;
}

#stars::before {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 170%;
  height: 500%;
  animation: animStar 60s linear infinite;
}

#stars::before {
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
  background-size: 50px 50px;
  opacity: 0.5;
}

@keyframes animStar {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-135rem);
  }
}

@keyframes animStarRotate {
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0);
  }
}

@keyframes gradient_301 {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes pulse_3011 {
  0% {
    transform: scale(0.75);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(0.75);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}
</style>