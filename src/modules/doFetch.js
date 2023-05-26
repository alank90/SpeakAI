import { getDBHandle, getDBItems } from "@/modules/indexedDBStorage.js";
import { decryptString } from "@/modules/subtleCrypto.js";

/**
 * @Description - Javascript module to fetch data
 * @param {string} url
 * @returns {object} - Images and error object
 * @importedBy - DallE.vue
 */
// ======= Variable Declarations ============ //
let imagesURL = null;
let decryptedString = null;
let error = "Im happy";
let fetchOptions = null;

let controller = {
  instance: null, // Store the AbortController instance
};
// Create a new AbortController instance
controller.instance = new AbortController();
const signal = controller.instance.signal;

// ================ Methods ======================================== //
/**
 * @Description - Retrieves encrypted API string from IndexedDB and decrypts
 *  string. Checks for decrypted string from previous calls.
 * @returns {string} - Decrypted API string
 */
const decryptFunction = async () => {
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
    const decryptedString = await decryptString(encryptedString, keyPair);
    return decryptedString;
  } else {
    return decryptedString;
  }
};

/**
 * @Description - Construct fetch options for DALL-E endpoint
 * @returns - Fetched images from DALL-E endpoint
 */
const constructFetchOptions = async (optionsForQuery) => {
  decryptedString = await decryptFunction();

  // Create headers
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  // Append new authorization header onto myHeaders if initial chat request for session.
  myHeaders.append("Authorization", `Bearer ${decryptedString}`);

  // Fetch scores
  const dalleOptions = {
    prompt: optionsForQuery.value.query,
    n: parseInt(optionsForQuery.value.n),
    size: optionsForQuery.value.size,
  };

  const options = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(dalleOptions),
    signal, // Pass the signal to the fetch request
  };

  return options;
};

/**
 * @Description - procedure to fetch response from openAI using native Fetch API
 * @param {*} url - The fetch url
 * @param {*} options - fetch options passed along w/api call
 * @returns { object } - response from openAI server to your prompt
 */

async function doFetch(url, options) {
  // reset before fetching ..
  imagesURL = null;

  fetchOptions = await constructFetchOptions(options);

  try {
    const res = await fetch(url, fetchOptions);
    imagesURL = await res.json();
    return imagesURL;
  } catch (e) {
    error = e;
    // Handle fetch request errors
    if (signal.aborted) {
      error = "Request aborted.";
    } else {
      error = "Error occurred while generating.";
    }
  }
}

// ============== Exports ============================ //

export { doFetch, error, controller };
