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
        <pre id="ai_response">{{ aiResponse }}</pre>
      </div>
    </div>

    <div class="chat-options">
      <input
        type="text"
        class="input api-input"
        placeholder="API Key here..."
        v-model="apiKey"
        clear
      />
      <button @click="addAPIKey" class="btn--api-key" id="add-key">
        Store API Key
      </button>
      <button @click="clearAPIKey" class="btn--api-key" id="clear-key">
        Clear API Key
      </button>

      <label for="modelt">Model</label>
      <div class="select" v-tooltip="tooltip.model">
        <select id="model">
          <option value="gpt-3.5-turbo">GPT-3.5-Turbo</option>
          <option value="text-davinci-003">Text-davinci-003</option>
          <option value="text-curie-001">Text-Curie-001</option>
          <option value="text-babbage-001">Text-Babbage-001</option>
          <option value="text-Ada-001">Text-Ada-001</option>
        </select>
        <span class="focus"></span>
      </div>

      <label for="temperature">Temperature: {{ temperatureValue }}</label>
      <input
        type="range"
        id="temperature"
        name="temperature"
        min="0"
        max="1"
        step=".01"
        v-model="temperatureValue"
        v-tooltip="tooltip.temperature"
      />

      <label for="top_P">Top P: {{ topP }}</label>
      <input
        type="range"
        id="top_P"
        name="top_P"
        min="0"
        max="1"
        step=".01"
        v-model="topP"
        v-tooltip="tooltip.top_p"
      />

      <label for="max_tokens">Maximum Length: {{ maxTokens }}</label>
      <input
        type="range"
        id="max_tokens"
        name="max_tokens"
        min="0"
        max="2048"
        step="5"
        v-model="maxTokens"
        v-tooltip="tooltip.max_tokens"
      />

      <label for="stop_sequences">Stop sequences: {{ stopSequences }} </label>
      <p class="stop-sequence-note">Add sequence then hit Enter</p>
      <textarea
        id="stop_sequences"
        name="stop_sequences"
        placeholder="i.e., a . or \n"
        rows="4"
        cols="20"
        @keyup="checkKey"
        v-tooltip="tooltip.stop_sequence"
      >
      </textarea>

      <label for="start_text">Inject start text</label>
      <textarea
        name="start_text"
        id="start_text"
        cols="20"
        rows="2"
        v-tooltip="tooltip.start_text"
      >
      </textarea>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import tooltip from "@/modules/useTooltip.js";

const openAIURL = "https://api.openai.com/v1/chat/completions";
const myAPIKey = localStorage.getItem("ai-key");
console.log(myAPIKey);

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append(
  "Authorization",
  `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
);
myHeaders.append("OpenAI-Organization", `${import.meta.env.VITE_ORG_ID}`);

let apiKey = ref("");
const content = ref("");
let temperatureValue = ref(0.5);
let topP = ref(0);
let maxTokens = ref(100);
let stopSequences = ref([]);
let theStopSequence = "";

const BTN_TEXT = "Submit 🚀";
const aiResponse = ref("✅ The answer will be displayed here.");
const btnText = ref(BTN_TEXT);

/* ================== Methods =============================== */
/**
 * @Description - The function constructs & executes the Fetch API call
 *  to the OpenAI /completions endpoint.
 */
const askAi = async () => {
  // Vars
  const fetchOptions = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: content.value }],
    temperature: parseFloat(temperatureValue.value),
    top_p: parseFloat(topP.value),
    max_tokens: parseInt(maxTokens.value),
    stop: stopSequences.value.length > 0 ? stopSequences.value : null,
  };
  btnText.value = "Thinking...🤔";

  // API call
  await fetch(openAIURL, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(fetchOptions),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      return response.json();
    })
    .then((data) => {
      const insertStarterText = starterText();
      aiResponse.value = `${insertStarterText} ${data.choices[0].message.content}`;
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

/**
 * @Description - Called every time character typed in the <textarea>
 *  The function builds an array of strings representing the stop sequences
 * @param {*} e - The event object
 */
const checkKey = (e) => {
  let key = e.key;
  if (key === "Enter") {
    stopSequences.value.push(theStopSequence);
    theStopSequence = "";
  } else {
    if (key === "Shift") return; // Do nothing if shift key
    theStopSequence += key;
  }
};

/**
 * @Description - Insert starter text into AI response if provided
 * @Calledby - answerAI
 * @Returns - any text in the starter text box.
 */

const starterText = () => {
  const startText = document.getElementById("start_text").value;
  return startText;
};

/**
 * @description - Event listener to store API key in localstorage
 */

const addAPIKey = () => {
  localStorage.setItem("ai-key", apiKey.value);
  console.log("In setstorage", apiKey);
};

/**
 * @Description - Remove the API key
 */

const clearAPIKey = () => {
  localStorage.removeItem("ai-key");
  console.log("In removestorage");
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
  column-gap: 25px;
  justify-content: center;
}

.chat {
  grid-area: chat;
  border-right: 0.5px solid var(--main-ai-color);
  padding-right: 10px;
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

.api-input {
  height: 24px;
  font-size: 1.1rem;
  margin: 0 0 15px 0;
  padding: 6px;
}

label {
  display: block;
  color: var(--letter-ai-color);
  font-family: var(--letter-font);
  font-size: 1.1rem;
  font-weight: 550;
}

#stop_sequences,
#start_text {
  font-family: var(--letter-font);
  font-size: 1.1rem;
  letter-spacing: 1px;
  padding: 10px;
  max-width: 100%;
  line-height: 1.5;
  border-radius: 5px;
  border: 1px solid var(--select-border);
  box-shadow: 1px 1px 1px #272626;
  resize: none;
}

.stop-sequence-note {
  margin: -7px 0 0 0;
  font-size: 0.9rem;
}

/* ==== Select Option Input Stylings ====== */

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  border: none;
  padding: 0 1em 0 0;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;
  z-index: 1;
  outline: none;
}
select::-ms-expand {
  display: none;
}

.select {
  display: grid;
  grid-template-areas: "select";
  align-items: center;
  position: relative;
  min-width: 15ch;
  max-width: 30ch;
  border: 1px solid var(--select-border);
  border-radius: 0.25em;
  padding: 0.25em 0.5em;
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1.1;
  background-color: #fff;
  background-image: linear-gradient(to top, #f9f9f9, #ac51b5 33%);
}
.select select,
.select::after {
  grid-area: select;
}
.select:not(.select--multiple)::after {
  content: "";
  justify-self: end;
  width: 0.8em;
  height: 0.5em;
  background-color: var(--select-arrow);
  -webkit-clip-path: polygon(100% 0%, 0 0%, 50% 100%);
  clip-path: polygon(100% 0%, 0 0%, 50% 100%);
}

select:focus + .focus {
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border: 2px solid var(--select-focus);
  border-radius: inherit;
}

select[multiple] {
  padding-right: 0;
  /*
   * Safari will not reveal an option
   * unless the select height has room to 
   * show all of it
   * Firefox and Chrome allow showing 
   * a partial option
   */
  height: 6rem;
  /* 
   * Experimental - styling of selected options
   * in the multiselect
   * Not supported crossbrowser
   */
}
select[multiple] option {
  white-space: normal;
  outline-color: var(--select-focus);
}

.select--disabled {
  cursor: not-allowed;
  background-color: #eee;
  background-image: linear-gradient(to top, #ddd, #eee 33%);
}

label {
  font-size: 1.125rem;
  font-weight: 500;
}

.select + label {
  margin-top: 2rem;
}
/* === End Select Option Input stylings ===== */

/* ========= Range Input stylings ========== */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
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

/* ====== End Range input stylings =============== */

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

.btn--api-key {
  display: inline;
  width: 45%;
  margin: 3px 0 5px;
  padding: 0;
  font-size: 0.9rem;
  background-color: #ac51b5;
}

#add-key {
  margin-right: 5px;
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
  font-size: 1.1rem;
  background: #f9f1fd;
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
  font-size: 1.2rem;
  font-family: var(--letter-font);
  font-weight: 525;
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
  background: #f9f1fd;
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

.v-popper__popper {
  z-index: 10000;
  top: 0;
  left: 0;
  outline: none;
  width: 150px;
}
</style>
