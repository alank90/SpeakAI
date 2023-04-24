/**
 * @Description - Vue composable function to store API string and
 *  encryption key in IndexedDB storage
 * @Calledby - Home.vue
 */
import { openDB, deleteDB } from "idb";

export function useIndexedDBStorage() {
  const dbName = "myStorage";
  const storeName = "store1";
  const version = 1; // initial version number.

  // Check if browser supports IndexedDB
  if (!("indexedDB" in window)) {
    console.warn("IndexedDB not supported");
    return;
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

  return { createDB, addDBEntry, getDBItems, getDBHandle, removeDB, dbName };
}
