<template>
  <h1>Welcome to SpeakAI</h1>
  <div class="grid-container">
    <div class="chat">

      <span>System:</span><textarea type="text" rows="6" cols="70" class="input" v-model="systemPrompt" clear></textarea>
      <span>User:</span><textarea type="text" rows="2" cols="70" class="input" placeholder="Ask me about ...🧑🏻‍💻"
        v-model="content" clear></textarea>


      <div class="button-block">
        <button type="button" @click="serpAPIAgentOn = !serpAPIAgentOn" class="btn--serpAPI"
          :class="{ 'btn--serpAPI--active': serpAPIAgentOn }"> Use serpAPI</button>
        <button type="button" @click="cancelRequest" v-show="cancelButtonVisible" class="btn--cancel">Cancel</button>
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

      <span>AI Assistant:</span>
      <div class="card">
        <div class="ai-query">{{ introText }} {{ aiQuery }}</div>
        <div class="ai-response"> {{ aiResponse }}</div>
        <div class="ai-conversation"> {{ aiConversation }} </div>
      </div>

      <button @click="clearConversation" v-if="aiConversation" class="btn--clear-block">Clear Chat</button>
    </div>


    <div class="chat-options">
      <div @click="toggleApiOptionsVisibility" class="arrow"></div>

      <div class="options">
        <div v-if="tokensUsed > 0" class="tokens">Tokens Used: {{ tokensUsed }}</div>

        <input type="text" class="input api-input" placeholder="API Key here..." v-model="apiKey" clear />
        <button @click="addAPIKey(apiKey, apiKeyType = 'openAIAPIString')" class="btn--api-key" id="add-key">
          Store API Key
        </button>
        <button @click="clearAPIKey('openAIAPIString')" class="btn--api-key" id="clear-key">
          Clear API Key
        </button>

        <input type="text" class="input api-input" placeholder="SerpAPI Key here..." v-model="serpAPIKey" clear />
        <button @click="addAPIKey(serpAPIKey, apiKeyType = 'serpAPIString')" class="btn--api-key" id="add-serp-key">
          Store SerpAPI Key
        </button>
        <button @click="clearAPIKey('serpAPIString')" class="btn--api-key" id="clear-serp-key">
          Clear API Key
        </button>

        <label for="model">Model</label>
        <div class="select" v-tooltip="tooltip.model">
          <select id="model" v-model="chatModel">
            <option value="gpt-3.5-turbo">GPT-3.5-Turbo</option>
            <option value="text-davinci-003">Text-davinci-003</option>
            <option value="text-curie-001">Text-Curie-001</option>
            <option value="text-babbage-001">Text-Babbage-001</option>
            <option value="text-Ada-001">Text-Ada-001</option>
          </select>
          <span class="focus"></span>
        </div>

        <label for="temperature">Temperature: {{ temperatureValue }}</label>
        <input type="range" id="temperature" name="temperature" min="0" max="1" step=".01" v-model="temperatureValue"
          v-tooltip="tooltip.temperature" />

        <label for="top_P">Top P: {{ topP }}</label>
        <input type="range" id="top_P" name="top_P" min="0" max="1" step=".01" v-model="topP" v-tooltip="tooltip.top_p" />

        <label for="max_tokens">Maximum Length: {{ maxTokens }}</label>
        <input type="range" id="max_tokens" name="max_tokens" min="0" max="2048" step="5" v-model="maxTokens"
          v-tooltip="tooltip.max_tokens" />

        <label for="stop_sequences">Stop sequences: {{ stopSequences }} </label>
        <p class="stop-sequence-note">Add sequence then hit Enter</p>
        <textarea id="stop_sequences" name="stop_sequences" placeholder="i.e., a . or \n" rows="4" cols="20"
          @keyup="checkKey" v-tooltip="tooltip.stop_sequence">
      </textarea>

        <label for="start_text">Inject start text</label>
        <textarea name="start_text" id="start_text" cols="20" rows="2" v-tooltip="tooltip.start_text"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
// ========= Imports ================= //
import { ref } from "vue";
import tooltip from "@/modules/useTooltip.js";
import { encryptString, decryptString } from "@/modules/subtleCrypto.js";
// eslint-disable-next-line no-unused-vars
import { createDB, addDBEntry, getDBItems, getDBHandle, removeDB, removeKey, dbName } from "@/modules/indexedDBStorage.js";

// ===== LangChain Imports  ========== //
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
//import { BufferMemory } from "langchain/memory";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { SerpAPI } from "langchain/tools";
// ===== End LangChain Imports ========= //

// ===== End of Imports ================ //

// ======= Vars ========================================= // 
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

let apiKey = ref("");
let serpAPIKey = ref("");
let apiKeyType = ref("");
let tokensUsed = ref(0);
let serpAPIAgentOn = ref(false);
let chatModel = ref("gpt-3.5-turbo");
let openAIDecryptedString = null;
let SerpAPIDecryptedString = null;
let temperatureValue = ref(0.5);
let topP = ref(0);
let maxTokens = ref(300);
let stopSequences = ref([]);
let theStopSequence = "";
let askedAiCalledPreviously = false;
let cancelButtonVisible = ref(false);

const BTN_TEXT = "Submit 🚀";
const systemPrompt = ref("The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.\n");
const content = ref("");
const aiQuery = ref("");
const aiResponse = ref("");
const aiConversation = ref("");
const introText = ref("📖 The answer will be displayed here.");
const btnText = ref(BTN_TEXT);
let componentKey = ref(0);

// Create a new AbortController instance
let controller = new AbortController();
let signal = controller.signal;

// ========================================================= //
// ========= End of Variable declarations ================== //
// ========================================================= //

// ------------------------------------------------------------------------------- //

// ========================================================= //
// ================== Methods ============================== //
// ========================================================= //
/**
 * @Description - The function constructs & executes an LLMChain
 *  request to OpenAI.
 */
const askAi = async () => {
  // Alert the user if no prompt value
  if (!content.value) {
    alert("Please enter a prompt.");
    return;
  }

  btnText.value = "Thinking...🤔";
  // Clear query box
  introText.value = "";
  cancelButtonVisible.value = true;

  // Let's fetch ai-key & key from indexedDB db and decrypt it if first chat request
  if (!openAIDecryptedString) {
    const db = await getDBHandle();
    let dbItems = await getDBItems(db);

    // Check if db retrieval successful
    if (!dbItems) {
      alert("Failed IndexedDB getItems action.");
      btnText.value = BTN_TEXT;

      return;
    }
    // else, continue
    // Note: We assume here that openAI API was stored first in indexDB storage
    //  and serpAPI was stored afterwards. If not the case then will be sending 
    //  serpAPI to openAI server and thus will fetch fails. This should be refactored
    //  in the future....
    let openAIEncryptedString = dbItems[0];
    let keyPair = dbItems[1];
    let SerpAPIEncryptedString = dbItems[2];
    let keyPair1 = dbItems[3];

    // Decrypt the string's. 
    openAIDecryptedString = await decryptString(openAIEncryptedString, keyPair);
    SerpAPIDecryptedString = await decryptString(SerpAPIEncryptedString, keyPair1);

    // Append new authorization header onto myHeaders if initial chat request for session.
    myHeaders.append(
      "Authorization",
      `Bearer ${openAIDecryptedString}`
    );
  } // end !openAIDecryptedString if block


  // ========================================================================================= //
  // ============= Use LangChain to send request to OpenAi API =============================== //
  // ========================================================================================= //


  // ======== Vars ===================== //
  const openAILLMOptions = {
    modelName: chatModel.value,
    openAIApiKey: openAIDecryptedString,
    temperature: parseFloat(temperatureValue.value),
    topP: parseFloat(topP.value),
    maxTokens: parseInt(maxTokens.value),
    stop: stopSequences.value.length > 0 ? stopSequences.value : null,
    streaming: true,
  };


  if (!serpAPIAgentOn.value) {
    const model = new ChatOpenAI(openAILLMOptions);
    //const memory = new BufferMemory();
    //const chain = new ConversationChain({ llm: model, memory: memory });

    // Construct the response box
    let insertStarterText = starterText();

    try {
      // ==== First check if the request is a normal one with no need to use an agent
      if (askedAiCalledPreviously) {
        aiConversation.value = `${aiQuery.value} \n ${aiResponse.value} \n ${aiConversation.value} \n`;
      } else {
        askedAiCalledPreviously = true;
      }

      aiQuery.value = `🧑 ${content.value}`;
      aiResponse.value = `🤖 ${insertStarterText} `;


      await model.call([
        new SystemMessage(`${systemPrompt.value}`),
        new HumanMessage(`${aiQuery.value}`)
      ], {
        signal: signal,
        callbacks: [
          {
            handleLLMNewToken(token) {
              aiResponse.value += token;
            }
          }
        ]

      });

      // Clear the prompt
      content.value = "";
      // --------- End construct the response box ----------------- //
    } catch (error) {
      // Handle .call() request errors
      if (controller.signal.aborted) {
        aiResponse.value = "Request aborted.";
      } else {
        aiConversation.value =
          `I'm sorry. There was a problem with your request at this time.`;
        console.error(
          "There has been a problem with your request operation:",
          error
        );
      }
    } finally {
      btnText.value = BTN_TEXT;
      cancelButtonVisible.value = false;
    }

  } // === Else check if we want to use a LangChain agent(SerpAPI) for the request ==== //
  else if (serpAPIAgentOn.value) {
    const tools = [
      new SerpAPI(SerpAPIDecryptedString, {
        hl: "en",
        gl: "us"
      })
    ];
    const prefix = systemPrompt.value;
    const model = new ChatOpenAI(openAILLMOptions);

    // Construct the response box
    let insertStarterText = starterText();

    try {
      if (askedAiCalledPreviously) {
        aiConversation.value = `${aiQuery.value} \n ${aiResponse.value} \n ${aiConversation.value} \n`;
      } else {
        askedAiCalledPreviously = true;
      }

      aiQuery.value = `🧑 ${content.value}`;
      aiResponse.value = `🤖 ${insertStarterText} `;


      const executor = await initializeAgentExecutorWithOptions(tools, model, {
        agentType: "openai-functions",
        verbose: true,
        agentArgs: {
          prefix,
        },
      });

      await executor.call({
        input: content.value,
        signal: signal,
        callbacks: [
          {
            handleLLMNewToken(token) {
              aiResponse.value += token;
            }
          }
        ],
      });

      // Clear the prompt
      content.value = "";

    } catch (error) {
      // Handle .call() request errors
      if (controller.signal.aborted) {
        aiResponse.value = "Request aborted.";
      } else {
        aiConversation.value =
          `I'm sorry. There was a problem with your request at this time.`;
        console.error(
          "There has been a problem with your request operation:",
          error
        );
      }
    } finally {
      btnText.value = BTN_TEXT;
      cancelButtonVisible.value = false;
    }
  } // End of else if
  else {
    alert("Error in fetching your answer. Try checking if you have the proper API keys stored in your browser's storage.");
  }

};

// -------------------------------------------------------------------- //
// ----------------- End of askAI() ----------------------------------- //
// -------------------------------------------------------------------- //

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
  if (startText) {
    return startText;
  }
  else { return ""; }
};

/**
 * @Description - Event listener to store API key in indexedDB store.
 * @Calls - { Function } - encryptString() which returns an  {object} w/
 *  encrypted API string and the encryption key as properties.
 */

const addAPIKey = async (key, keyType) => {
  // Generate a key pair and encrypt the openAI API key  in localstorage
  const { encryptedText, keyPair } = await encryptString(key);

  // Create the indexDB database
  const db = await createDB();

  // Store the data in the DB.
  await addDBEntry(db, encryptedText, keyPair, keyType);

  document.querySelector(".api-input").value = "";
};

/**
 * @Description - Remove the API key from IndexDB storage.
 */

const clearAPIKey = async (apiKeyToClear) => {
  await removeKey(dbName, apiKeyToClear);

};

/**
 * @Description - Toggle visibility of the options on page
 */

const toggleApiOptionsVisibility = () => {
  const el = document.querySelector(".options");
  const elGridContainer = document.querySelector(".grid-container");
  const elArrowRotate = document.querySelector(".arrow");
  elGridContainer.classList.toggle("el-col-width");
  el.classList.toggle("el-height");
  elArrowRotate.classList.toggle("el-rotate");

};

/**
 * @Description - Clear the Conversation box
 */

const clearConversation = () => {
  aiQuery.value = "";
  aiResponse.value = "";
  aiConversation.value = "";
};

/**
 * @Description - Cancels the pending fetch request via 
 *  the AbortController instance
 */

const cancelRequest = () => {
  // Cancel the ConversationChain.call() request by calling abort() on
  // the AbortController instance passed to it.
  if (controller) {
    console.log("In abortController.", controller);

    controller.abort();
    aiResponse.value = `🤖 ${controller.signal.reason}`;
    // Reset AbortController
    controller = new AbortController();
    signal = controller.signal;

    componentKey.value += 1;
  }
};

// -------------------------------------------------------------------------------------- //
// ----------------------- End of Methods ----------------------------------------------- //
// -------------------------------------------------------------------------------------- //
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
  width: 80vw;
  max-width: 1200px;
  margin: 0 auto;
  transition: all .4s ease-out;
}

.chat {
  grid-area: chat;
  border-right: 0.5px solid var(--main-ai-color);
  padding-right: 10px;
}

.chat span {
  display: block;
  color: var(--letter-ai-color);
  font-family: var(--letter-font);
  font-size: 1.3rem;
  font-weight: 650;
}

textarea:first-of-type {
  margin-bottom: 15px;
}

.chat-options {
  grid-area: options;
  transition: all .6s ease-in;
}

.options {
  transition: all .5s ease-out;
}

.el-col-width {
  grid-template-columns: 90% 10%;
}

.el-height {
  opacity: 0;
  /* disables :hover so no tooltip effects */
  pointer-events: none;
}

.arrow {
  width: 25px;
  height: 25px;
  border-width: 0 3px 3px 0;
  border-color: var(--main-theme-color);
  border-style: solid;
  margin: 0 auto 15px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  transform: rotate(45deg);
}

.arrow.el-rotate {
  transform: rotate(225deg);
}

.tokens {
  color: var(--main-theme-color);
  font-weight: 550;
  margin-bottom: 10px;
}


.input {
  width: calc(85% - 20px);
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

.api-input[placeholder="SerpAPI Key here..."] {
  margin-top: 30px;
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
  width: 100%;
  max-width: 200px;
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
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
  border: 1px solid var(--select-border);
  border-radius: 0.25em;
  padding: 0.25em 0.5em;
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1.1;
  background-color: #fff;
  background-image: linear-gradient(to top, #f9f9f9, var(--main-theme-color) 33%);
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

select:focus+.focus {
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
  font-weight: 550;
}


.select+label {
  margin-top: 1.2rem;
}

/* === End Select Option Input stylings ===== */

/* ========= Range Input stylings ========== */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  margin: 10px 0;
  width: 100%;
  max-width: 200px;
}

input[type="range"]:focus {
  outline: none;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 12.8px;
  cursor: pointer;
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  background: var(--main-theme-color);
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
  background: var(--main-theme-color);
}

input[type="range"]::-moz-range-track {
  width: 100%;
  height: 12.8px;
  cursor: pointer;
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  background: var(--main-theme-color);
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
  background: var(--main-theme-color);
  border: 0px solid #000101;
  border-radius: 50px;
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
}

input[type="range"]::-ms-fill-upper {
  background: var(--main-theme-color);
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
  background: var(--main-theme-color);
}

input[type="range"]:focus::-ms-fill-upper {
  background: var(--main-theme-color);
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
  background: var(--main-theme-color);
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

.btn--clear-block {
  display: inline;
  width: 100%;
  max-width: 200px;
  margin: 3px 0 5px;
  padding: 0;
  font-size: 0.9rem;
  background-color: var(--main-theme-color);
}

.btn--clear-block:hover {
  background-color: #ad51b5c4;
}

.btn--cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100px;
  margin: 0 10px;
  padding: 20px;
  font-size: 1rem;
  background-color: var(--main-theme-color);
  align-self: flex-end;
}

.btn--cancel:hover {
  background-color: #ad51b5c4;
}

.btn--api-key {
  display: inline;
  width: 100%;
  max-width: 200px;
  margin: 3px 0 5px;
  padding: 0;
  font-size: 1rem;
  background-color: var(--main-theme-color);
}

.btn--serpAPI {
  display: inline;
  width: 100%;
  max-width: 125px;
  margin-right: 25px;
  padding: 0;
  font-size: 1rem;
  background-color: rgba(173, 81, 181, .5)
}

.btn--serpAPI--active {
  background-color: rgba(173, 81, 181, 1);
}

.btn--api-key:hover {
  background-color: #ad51b5c4;
}


#add-key,
add-serp-key {
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
  flex-direction: column;
  align-items: start;
  overflow: hidden;
  border-radius: 16px;
  margin: 5px auto 32px;
  max-width: 65vw;
  min-height: 20%;
}

.ai-query,
.ai-response,
.ai-conversation {
  z-index: 1;
  font-size: 1.2rem;
  font-family: var(--letter-font);
  font-weight: 525;
  color: var(--letter-ai-color);
  padding: 4px;
  margin: 4px;
  white-space: pre-wrap;
  text-align: start;
  overflow-y: auto;
}


.ai-response:nth-child(2) {
  background-color: #ebdbf4;
}

.card::before {
  content: "";
  position: absolute;
  width: 100%;
  background-image: linear-gradient(180deg,
      rgb(0, 183, 255),
      rgb(255, 48, 255));
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
    linear-gradient(137.48deg,
      #ffdb3b 10%,
      #fe53bb 45%,
      #8f51ea 67%,
      #0044ff 87%);
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
