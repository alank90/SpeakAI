<template>
    <div class="container--header">
        <h1>DALL-E Image Generation</h1>
        <h2>Given a prompt, the model will generate a new image.</h2>
    </div>


    <div class="container--body">
        <div class="container--query">
            <p class="description">Start with a detailed decription</p>
            <div class="container--btn">
                <input type="text" class="input" placeholder="An Impressionist oil painting of sunflowers in a purple vase"
                    v-model="dalleQuery" clear />
                <button @click="fetchImages" class="btn--image-query">Query</button>
            </div>

            <p v-if="loading" class="loading">Retrieving images...</p>
        </div>



        <div @click="swapOutRetrievedImages" v-if="retrievedImages" class="container--img">
            <img v-for="(item, index) in retrievedImages.data" :src="item.url" alt="A Picture" :key="index">
            {{ introText }}

            <p v-if="retrievedImages.error"> {{ retrievedImages.error.message }}</p>
        </div>

        <div class="container--options">
            <label for="options"># of Images: {{ imagesToGenerate }}</label>
            <input type="range" id="options" name="options" min="1" max="10" step="1" v-model="imagesToGenerate"
                v-tooltip="tooltip.number_of_images" />

            <label for="picture-size">Picture Size</label>
            <div class="select" v-tooltip="tooltip.image_size">
                <select id="picture-size" v-model="pictureSize">
                    <option value="256x256">256x256</option>
                    <option value="512x512">512x512</option>
                    <option value="1024x1024">1024x1024</option>
                </select>
                <span class="focus"></span>
            </div>
        </div>


        <div class="container--history">
            <div @click="imagesHistoryVisibility" class="arrow">test</div>
            <div v-for="(item, index) in imagesHistory" class="container--history-img" :key="index">
                <img v-for="(picturesArray, index) in item" :src="picturesArray.url" alt="A Picture" :key="index">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { doFetch } from "@/modules/doFetch.js";
import tooltip from "@/modules/useTooltip.js";


// ========= Vars ========================== //
const dalleURL = `https://api.openai.com/v1/images/generations`;
const dalleQuery = ref("");
let retrievedImages = ref(null);
const imagesHistory = ref([]);
let imagesToGenerate = ref(1);
let pictureSize = ref("256x256");
let loading = ref(false);
const introText = ref("✅ The images will be displayed here.");
let queryOptions = ref({
    query: dalleQuery,
    n: imagesToGenerate,
    size: pictureSize,
});

// ============ End of Vars declarations ======== //

// ============== Methods ======================== //
// ==== Fetch images ==== //
const fetchImages = async () => {
    loading.value = true;

    // Check if there was a previous query
    if (retrievedImages.value !== null) {
        // push the results onto imagesHistory array
        imagesHistory.value.push(retrievedImages.value.data);

        // delete previous results
        retrievedImages.value = null;
    }
    // do fetch to openAI endpoint
    retrievedImages.value = await doFetch(dalleURL, queryOptions);


    loading.value = false;
    introText.value = "";

};

// ======= Toggle display of History column ============ //
/**
 * @Description - Function to hide/show the previous pictures queried
 */
const imagesHistoryVisibility = () => {
    const el = document.querySelector(".container--body");
    const elArrow = document.querySelector(".arrow");
    el.classList.toggle("container--body-history-visibility");
    elArrow.classList.toggle("arrow-rotate");
};

// ============ End Toggle function ================ //

// ---------------------------------------------------------------------- 

// ========== Swap Function ============================= //
/**
 * @Description - Function to swap out selected container--history 
 *  element into container--img element
 */
const swapOutRetrievedImages = () => {
    console.log("You clicked me!");
};

// =================== End Swap Function =================== //

</script>

<style scoped>
h1 {
    font-family: var(--heading-font);
    margin-bottom: 10px;
}

h2 {
    font-size: 1.4rem;
    margin-bottom: 45px;
    width: 100%;
    margin: 0 auto;
}

/* ====== Grid Container ============== */
.container--body {
    display: grid;
    grid-template-columns: repeat(3, 25%) minmax(0, auto);
    grid-template-rows: auto;
    grid-template-areas:
        "query query options history"
        "results results results .";
    gap: 20px 10px;
    justify-items: stretch;
    align-items: start;
    transition: grid-template-columns 0.4s ease-in;
}

.container--body-history-visibility {
    grid-template-columns: repeat(3, 33%) minmax(0, 0);

}

.container--query {
    grid-area: query;
    border-right: 0.5px solid var(--main-ai-color);
    padding-right: 10px;
}


.container--options {
    grid-area: options;
}

.container--img {
    display: grid;
    grid-area: results;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    justify-items: center;
    gap: 5px;
    font-size: 1.2rem;
    font-weight: 550;
    font-family: var(--letter-font);
    color: var(--letter-ai-color);
    margin: 40px 0;
}

.container--history {
    display: flex;
    grid-area: history;
    position: relative;
}

.container--history-img {
    display: flex;
    flex-flow: row nowrap;
    flex-basis: 25%;
    gap: 5px;
    width: 0;
    /* takes effect when grid-template-column is changed*/
}

.container--history-img>img {
    object-fit: cover;
    max-width: 100%;
    height: auto;
    vertical-align: middle;
    border-radius: 5px;
}

/* ====== End Grid Container ========== */


/* ======== Arrow Stylings ====== */
.arrow {
    background: #ac51b5;
    width: 17px;
    height: 17px;
    margin-right: 15px;
    -moz-transform: rotate(135deg);
    transform: rotate(135deg);
    -o-transform: rotate(135deg);
    z-index: 999;
    transition: transform 0.4s ease-in;
}

.arrow:after {
    content: '';
    position: absolute;
    left: 2px;
    top: 2px;
    width: 30px;
    height: 30px;
    background: var(--color-light);
}

.arrow-rotate {
    -moz-transform: rotate(315deg);
    transform: rotate(315deg);
    -o-transform: rotate(315deg);
}

/* ==== End arrow stylings ===== */



label {
    display: block;
    color: var(--letter-ai-color);
    font-family: var(--letter-font);
    font-size: 1.1rem;
    font-weight: 550;
}

.input {
    width: calc(85% - 20px);
    max-height: 9%;
    padding: 12px;
    border: none;
    border-radius: 16px 0 0 16px;
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

.btn--image-query {
    max-height: 9%;
    padding: 12px;
    border: none;
    border-radius: 0 16px 16px 0;
    background-color: #fff;
    box-shadow: 2px 2px 7px 0 rgb(0, 0, 0, 0.2);
    outline: none;
    font-size: 1.3rem;
    font-weight: 550;
    font-family: var(--letter-font);

}

.btn--image-query:hover {
    background-color: #faecfbb7;
}

.container--btn {
    display: flex;
    flex-flow: row nowrap;
    margin: 0 0 0 5px;

}





.loading {
    font-size: 1.3rem;
    font-weight: 600;
    margin-top: 50px;
}

.description {
    text-align: left;
    margin-left: 12%;
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
    font-weight: 500;
}

.select+label {
    margin-top: 2rem;
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
</style>