/**
 * @Description - Module of IndexedDb actions to 
 *  perform on an IndexedDB db(i.e.,CRUD) so we can encrypt and
 *  store API string w/key in IndexedDB storage.
 * @Calledby - Home.vue
 */
import { openDB, deleteDB } from "idb";

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
 * @param {*} apiText - encrypted API key
 * @param {*} encryptionKey - encryption key pair
 * @returns - the IndexedDB key names
 */

async function addDBEntry(db, apiText, encryptionKey) {
  // Check if store already exists from previous add key action and
  // if not add the store
  if (!db.objectStoreNames.contains(storeName)) {
    db.createObjectStore(storeName);
  }

  const tx = db.transaction(storeName, "readwrite");
  const store = await tx.objectStore(storeName);

  const dbKey = "apiString";
  const textValue = await store.put(apiText, dbKey);
  const key = "encryptionKey";
  const keyValue = await store.put(encryptionKey, key);

  await tx.done;
  console.log("Added item to indexDB storage!");

  return { textValue, keyValue };
}

/**
 * @description - function to get all items stored in a indexedDB db
 * @param {*} db - a pointer to the db entry object
 * @returns - the the IndexedDB items stored in browser
 */
async function getDBItems(db) {
  // First check if store exists
  if (!db.objectStoreNames.contains(storeName)) {
    alert(
      "It doesn't look like you have an API key registered. Please check and add one."
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
  await deleteDB(dbName);
  console.log(`indexedDB ${dbName} was deleted!`);
}

export { createDB, addDBEntry, getDBItems, getDBHandle, removeDB, dbName };
