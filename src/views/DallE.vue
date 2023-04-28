<template>
    <h1>DALL-E Image Generator</h1>
    <div class="container">
        <p class="description">Start with a detailed decription</p>
        <input type="text" class="input" placeholder="An Impressionist oil painting of sunflowers in a purple vase"
            v-model="dalleQuery" clear />
        <button @click="fetchImages" class="btn--image-query">Query</button>
        <p class="loading" v-if="loading">Retrieving images...</p>

        <div v-if="retrievedImages" class="img-container">
            <img v-for="(item, index) in retrievedImages.data" :src="item.url" alt="A Picture" :key="index">
            {{ introText }}
        </div>
        <p v-if="error">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { doFetch, error } from "@/modules/usefetch.js";

// ========= Vars ========================== //
const dalleURL = `https://api.openai.com/v1/images/generations`;
const dalleQuery = ref("");
let retrievedImages = ref(null);
let loading = ref(false);
const introText = ref("✅ The images will be displayed here.");


// ============== Methods ======================== //
// ==== Fetch images ==== //
const fetchImages = async () => {
    retrievedImages.value = null;
    loading.value = true;
    retrievedImages.value = await doFetch(dalleURL, dalleQuery.value);
    loading.value = false;
    introText.value = "";

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
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-around;
    gap: 5px;
    font-size: 1.2rem;
    font-weight: 550;
    font-family: var(--letter-font);
    color: var(--letter-ai-color);
    margin: 40px 0;
}

.loading {
    font-size: 1.3rem;
    font-weight: 600;
}

.description {
    text-align: left;
    margin-left: 12%;
}
</style>