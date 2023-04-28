<template>
    <h1>DALL-E Image Generator</h1>
    <div class="container">
        <p class="description">Start with a detailed decription</p>
        <input type="text" class="input" placeholder="An Impressionist oil painting of sunflowers in a purple vase"
            v-model="dalleQuery" clear />
        <button @click="fetchImages" class="btn--image-query">Query</button>
        <div class="img-container">
            {{ introText }} {{ retrievedImages }}
            <p v-if="error">{{ error }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { doFetch, error } from "@/modules/usefetch.js";

// ========= Vars ========================== //
const dalleURL = `https://api.openai.com/v1/images/generations`;
const dalleQuery = ref("");
let retrievedImages = ref(null);
const introText = ref("✅ The images will be displayed here.");


// ============== Methods ======================== //
// ==== Fetch images ==== //
const fetchImages = async () => {

    retrievedImages.value = await doFetch(dalleURL, dalleQuery);
    console.log(retrievedImages.value);

};
</script>

<style scoped>
h1 {
    font-family: var(--heading-font);
    margin-bottom: 64px;
}

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

.img-container {
    font-size: 1.2rem;
    font-weight: 550;
    font-family: var(--letter-font);
    color: var(--letter-ai-color);
    margin-top: 40px;
}

.description {
    text-align: left;
    margin-left: 12%;
}
</style>