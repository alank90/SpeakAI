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
  const storeNames = db.objectStoreNames;
  console.log("storeExists", storeNames);
  if (storeNames.includes("store1")) {
    // Get all values stored in IndexedDB
    const dbItems = await db
      .transaction(storeName)
      .objectStore(storeName)
      .getAll();

    return dbItems;
  } else {
    alert(
      "It doesn't look like you have any API key's registered. Please  1.Refresh your browser and then add an API key."
    );

    return null;
  }
}

/**
 * @Description - creates a reference to the IndexedDB db.
 * @returns a pointer to the particular indexedDB requested
 */
async function getDBHandle() {
  const userAgentString = navigator.userAgent;
  console.log(userAgentString);
  // Check for userAgent Chrome. If the browser then can use window.indexedDB.databases
  if (
    userAgentString.indexOf("Chrome") > -1 ||
    userAgentString.indexOf("Edge") > -1
  ) {
    const dbExists = (await window.indexedDB.databases())
      .map((db) => db.name)
      .includes(dbName);
    console.log(dbExists);

    if (dbExists) {
      const db = await openDB(dbName, version);

      return db;
    } else {
      return false;
    }
  } else if (userAgentString.indexOf("Firefox") > -1) {
    // Else is Firefox and cant use window.indexedDB.databases
    const db = await openDB(dbName, version);
    console.log("db value for Firefox", db);
    const storeNames = db.objectStoreNames;
    console.log(storeNames);
    const dbItems = await getDBItems(db);
    console.log("dbItems length", dbItems.length);
    if (dbItems.length >= 2) {
      return db;
    } else {
      removeDB(db);
      alert("No Database found. Try adding your API key.");

      return false;
    }
  } else {
    const db = await openDB(dbName, version);

    return db;
  }
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
      console.log("Database deleted successfully!");
    }

    DBDeleteRequest.onerror = (event) => {
      console.log(event);
      alert("Error deleting database. Try closing browser and trying again.");
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
