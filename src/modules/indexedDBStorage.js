/**
 * @Description - Module of IndexedDb actions to
 *  perform on an IndexedDB db(i.e.,CRUD) so we can encrypt and
 *  store API string w/key in IndexedDB storage.
 * @Calledby - Home.vue
 */
import { openDB } from "idb";

const dbName = "myStorage";
const storeName = "store1";
let version = 1; // initial version number.

// Check if browser supports IndexedDB
if (!("indexedDB" in window)) {
  console.warn("IndexedDB not supported");
}

/**
 * @Description - create a new IndexedDB db.
 * @returns db - a reference to the indexedDB object.
 */
async function createDB() {
  const db = await openDB(dbName, version, {
    // Optional. Only called if a version mismatch
    /* eslint-disable no-unused-vars */
    upgrade(db, oldVersion, newVersion, transaction) {
      const store = db.createObjectStore(storeName);
    },
  });

  return db;
}

/**
 *
 * @param {*} db - reference to the indexedDB object
 * @param {*} encryptedText - encrypted API key
 * @param {*} encryptionKey - encryption key pair
 * @returns - the IndexedDB key names
 */

async function addDBEntry(db, encryptedText, encryptionKey, keyName) {
  // Check if store already exists from previous add key action and
  // if not add the store
  if (!db.objectStoreNames.contains(storeName)) {
    db.createObjectStore(storeName);
  }

  const tx = db.transaction(storeName, "readwrite");
  const store = await tx.objectStore(storeName);
  const dbAPIEncryptedKeyValueName = keyName;
  const textValue = await store.put(encryptedText, dbAPIEncryptedKeyValueName);
  const dbEncryptionKeyName = `${keyName}-encryptionKey`;
  const keyValue = await store.put(encryptionKey, dbEncryptionKeyName);

  await tx.done;
  alert(`${keyName} successfully added! Refresh your browser now.`);

  return { textValue, keyValue };
}

/**
 * @description - function to get all items stored in a indexedDB db
 * @param {*} db - a pointer to the db entry object
 * @returns - the the IndexedDB items stored in browser
 */
async function getDBItems(db) {
  // First check if store exists
  const openAIKeyPresent = await db.get(storeName, "openAIAPIString");
  if (!openAIKeyPresent) {
    alert(
      "It doesn't look like you have an API key registered. Please  1.refresh your browser, 2.click 'Clear API Key', and then 3.add a key."
    );

    return null;
  }

  // Get all values stored in IndexedDB
  const dbItems = await db
    .transaction(storeName)
    .objectStore(storeName)
    .getAll();

  return dbItems;
}

/**
 * @Description - creates a reference to the IndexedDB db.
 * @returns a pointer to the particular indexedDB requested
 */
async function getDBHandle() {
  const db = await openDB(dbName, version);

  return db;
}

/**
 * @Description - function to delete entire IndexedDB database
 * @param {*} dbName - db to delete
 */
async function removeDB(dbName) {
  const DBDeleteRequest = window.indexedDB.deleteDatabase(dbName);

  DBDeleteRequest.onsuccess = (event) => {
    // event,result will be undefined if delete successful
    if (event.result === undefined) {
      alert("Your API key was deleted successfully! Refresh your browser now.");
    }

    DBDeleteRequest.onerror = (event) => {
      console.log(event);
      alert("Error deleting API key. Try closing browser and trying again.");
    };
  };
}

/**
 * @Description - Remove a key from indexDB storage
 * @parameters - dbName(String) indexDB store name, apiKeyToClear(String) key name of
 *    API key to clear.
 *
 */

async function removeKey(dbName, apiKeyToClear) {
  const db = await openDB(dbName, version, {
    upgrade(db, oldVersion, newVersion, transaction) {
      const store = db.createObjectStore(storeName);
    },
  });

  const apiKeyPresent = await db.get(storeName, apiKeyToClear);

  if (apiKeyPresent) {
    const tx = await db.transaction(storeName, "readwrite");
    const store = await tx.objectStore(storeName);

    const key = apiKeyToClear;
    const key1 = `${apiKeyToClear}-encryptionKey`;
    await store.delete(key);
    await store.delete(key1);

    await tx.done;

    alert("Your API key was deleted successfully! Refresh your browser now.");
  } else {
    alert("Attention. No API key present.");
  }
}

/**
 * @Description - Checks for existence of a "serpAPIString" indexDB key in storage
 * @Returns - Boolean
 */

async function checkForSerpAPIKey() {
  const db = await openDB(dbName, version);
  const serpAPIKeyPresent = await db.get(storeName, "serpAPIString");

  if (serpAPIKeyPresent) {
    return true;
  } else {
    return false;
  }
}

export {
  createDB,
  addDBEntry,
  getDBItems,
  getDBHandle,
  removeDB,
  dbName,
  removeKey,
  checkForSerpAPIKey,
};
