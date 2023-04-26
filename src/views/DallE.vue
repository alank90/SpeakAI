<template>
    <h1>DALL-E Image Generator</h1>
    <div class="container">
        <p class="description">Start with a detailed decription</p>
        <input type="text" class="input" placeholder="An Impressionist oil painting of sunflowers in a purple vase"
            v-model="content" clear />

        <div class="img-container">
            {{ introText }}
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useFetch } from "@/modules/usefetch.js";
import { getDBHandle, getDBItems } from "@/modules/indexedDBStorage.js";
import { decryptString } from "@/modules/subtleCrypto.js";

/** 
 * @Description - An IIFE to facilitate using async/await in the Vue component
*/
(async function () {
    // ========= Vars ========================== //
    const dalleURL = `https://api.openai.com/v1/images/generations`;
    const content = ref("");
    const introText = ref("✅ The images will be displayed here.");
    let decryptedString = null;

    // Create headers
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Let's fetch ai-key & key from indexedDB db and decrypt it if first chat request
    if (!decryptedString) {
        const db = await getDBHandle();
        let dbItems = await getDBItems(db);

        // Check if db retrieval successful
        if (!dbItems) {
            alert("Failed IndexedDB getItems action.");
        }
        // else, continue
        let encryptedString = dbItems[0];
        let keyPair = dbItems[1];

        // Decrypt the string. 
        decryptedString = await decryptString(encryptedString, keyPair);

        // Append new authorization header onto myHeaders if initial chat request for session.
        myHeaders.append(
            "Authorization",
            `Bearer ${decryptedString}`
        );
    } // end !decryptedString if block


    // Fetch scores
    const dalleOptions = {
        prompt: content.value,
        n: 1,
        size: "1024 x 1024"
    };

    const fetchOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(dalleOptions),
    };
    const { data: images, error } = useFetch(dalleURL, fetchOptions);

})();



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