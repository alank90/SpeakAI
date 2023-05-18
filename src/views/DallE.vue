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


        <div @click="swapOutRetrievedImages" v-if="currentImages" class="container--img">
            <a v-for="(item, index) in currentImages.data" :key="index">
                <img :src="item.url" alt="An AI Generated Picture">
                {{ introText }}
            </a>
            <p v-if="currentImages.error"> {{ currentImages.error.message }}</p>
        </div>

        <div class="container--history">
            <button v-if="imagesHistory.length > 0" @click="clearImagesHistory" class="btn btn-clear">Clear</button>
            <div v-for="(item, index) in imagesHistory" class="container--history-img" :data-image-array="index"
                :key="index" title="Click image(s) to swap out.">
                <img v-for="(picturesArray, index) in item" :src="picturesArray.url" alt="A Picture" :key="index">
            </div>
        </div>

        <div v-if="imagesHistory.length > 0" @click="optionsVisibility" class="arrow"></div>

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
    </div>
</template>

<script setup>
import { ref } from "vue";
import { doFetch } from "@/modules/doFetch.js";
import tooltip from "@/modules/useTooltip.js";


// ========= Vars ========================== //
const dalleURL = `https://api.openai.com/v1/images/generations`;
const dalleQuery = ref("");
let currentImages = ref(null);
let imagesHistory = ref([]);
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

    // Clear the currentImages array
    currentImages.value = null;

    // do fetch to openAI endpoint
    currentImages.value = await doFetch(dalleURL, queryOptions);
    // push the results onto start of the imagesHistory array
    imagesHistory.value.unshift(currentImages.value.data);

    loading.value = false;
    introText.value = "";

    // Reconfigure container--body grid for container--history being filled
    const elGrid = document.querySelector(".container--body");
    elGrid.style.gridTemplateColumns = "repeat(2, 25%) 25% 30px 20%";


    // Add event listener to container--history 
    // for inserting a history-image array into currentImages array
    // when user clicks on a row of images in the imagesHistory container
    const el = document.querySelector(".container--body");

    if (!el.classList.contains("click-handler")) {
        el.classList.add("click-handler");
        el.addEventListener("click", (e) => {
            const elClicked = e.target;
            const elParent = elClicked.parentElement;
            if (elParent.hasAttribute("data-image-array") || elParent.classList.contains("container--img")) {
                const index = elParent.dataset.imageArray;

                if (elParent.classList.contains("container--history-img")) {
                    console.log('in event if');
                    // Replace currentImages array elements w/contents 
                    // of the imagesHistoryItems array
                    currentImages.value.data = imagesHistory.value[index];
                } else if (elParent.classList.contains("container--img")) {
                    elClicked.classList.toggle("scale-element");
                }
            }
        });
    }
    // =================== End event listener =================== //

};


// ======= Toggle display of History column ============ //
/**
 * @Description - Function to hide/show the previous pictures queried
 *  column
 */
const optionsVisibility = () => {
    const el = document.querySelector(".container--body");
    const elArrow = document.querySelector(".arrow");

    // Reconfigure container--body grid to adapt to whether container--options
    // is visible
    el.style.gridTemplateColumns = "";
    el.classList.toggle("container--options-visibility");
    elArrow.classList.toggle("arrow-rotate");
    if (el.classList.contains("container--options-visibility")) {
        el.style.gridTemplateColumns = "repeat(2, 25%) 25% 30px 0";
    } else {
        el.style.gridTemplateColumns = "repeat(2, 25%) 25% 30px 20%";
    }
};

// ============ End Toggle function ================ //

/**
 * @Description - imagesHistory clear button
 */
const clearImagesHistory = () => {
    imagesHistory.value = [];
    currentImages.value = null;

    const el = document.querySelector(".container--body");
    el.style.gridTemplateColumns = "";
    el.style.gridTemplateColumns = "grid-template-columns: repeat(2, 25%) 0 30px 20%";
    dalleQuery.value = "";
};


// ----------------------------------------------------------------------------------------------  //

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

.btn {
    align-items: center;
    background-color: var(--main-theme-color);
    border: 0;
    border-radius: 100px;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    display: inline-flex;
    font-family: -apple-system, system-ui, system-ui, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif;
    font-size: 1.1rem;
    font-weight: 600;
    justify-content: center;
    line-height: 20px;
    max-width: 480px;
    min-height: 40px;
    min-width: 0px;
    overflow: hidden;
    padding: 0px;
    padding-left: 20px;
    padding-right: 20px;
    text-align: center;
    touch-action: manipulation;
    transition: background-color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s, box-shadow 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s, color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s;
    user-select: none;
    -webkit-user-select: none;
    vertical-align: middle;
}

.btn:hover,
.btn:focus {
    background-color: #b73ecc8a;
    color: #ffffff;
}

.btn:active {
    background: #690480;
    color: rgb(255, 255, 255, .7);
}

.btn:disabled {
    cursor: not-allowed;
    background: rgba(0, 0, 0, .08);
    color: rgba(0, 0, 0, .3);
}

.btn.btn-clear {
    margin: 10px 10px;
    width: 40%;
}


/* ====== Grid Container ============== */
.container--body {
    display: grid;
    grid-template-columns: repeat(2, 25%) 0 30px 20%;
    grid-template-rows: minmax(0, auto) auto;
    grid-template-areas:
        "query query history arrow options"
        "results results results results results";
    gap: 20px 10px;
    margin-top: 6%;
    justify-items: stretch;
    align-items: flex-start;
    transition: all 0.3s ease-in;
}

.container--query {
    grid-area: query;
    border-right: 0.5px solid var(--main-ai-color);
    padding-right: 10px;
}


.container--options {
    grid-area: options;
    overflow: hidden;
}

.container--img {
    display: flex;
    flex-flow: row wrap;
    grid-area: results;
    justify-items: center;
    gap: 5px 5px;
    font-size: 1.2rem;
    font-weight: 550;
    font-family: var(--letter-font);
    color: var(--letter-ai-color);
    margin: 30px 10px;
}

img[alt="An AI Generated Picture"] {
    transition: transform 0.4s;
}

img[alt="An AI Generated Picture"].scale-element {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    transform: scale(3);
    z-index: 9999;
}

.container--history {
    grid-area: history;
    position: relative;
}

.container--history-img {
    display: flex;
    flex-flow: row nowrap;
    gap: 5px;
    max-width: 25%;
    margin-bottom: 2px;
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
    grid-area: arrow;
    position: relative;
    top: -15px;
    background: var(--main-theme-color);
    width: 17px;
    height: 17px;
    cursor: pointer;
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

.visibility {
    display: none;
}
</style>