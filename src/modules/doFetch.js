import { getDBHandle, getDBItems } from "@/modules/indexedDBStorage.js";
import { decryptString } from "@/modules/subtleCrypto.js";

/**
 * @Description - Javascript module to fetch data
 * @param {string} url
 * @returns {object} - Reactive variables
 * @importedBy - DallE.vue
 */
// ======= Variable Declarations ============ //
let imagesURL = null;
let decryptedString = null;
let error = null;
let fetchOptions = null;

// ================ Methods ======================================== //
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
  } // end !decryptedString if block
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
  };

  return options;
};

async function doFetch(url, options) {
  // reset before fetching ..
  imagesURL = null;
  error = null;

  fetchOptions = await constructFetchOptions(options);

  try {
    const res = await fetch(url, fetchOptions);
    imagesURL = await res.json();
    return imagesURL;
  } catch (e) {
    error.value = e;
  }
}

// ============== Exports ============================ //

export { doFetch, error };