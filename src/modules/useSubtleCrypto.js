import { ref } from "vue";

/*
  Store the calculated ciphertext here, so we can decrypt the message later.
  */
let ciphertext;
let encryptedKey = ref(Uint8Array);

/**
  @Description - Fetch the contents of the localStorage ai-key, and encode it
  in a form we can use for the encrypt operation.
  @return {UTF-8 encoded string}
  */
function getMessageEncoding(storedAPIKey) {
  let enc = new TextEncoder();
  return enc.encode(storedAPIKey);
}

/** 
  @Description - Encrypt the localstorage API key
  @params - {object} - keyPair object. Uses the keyPair.publicKey property
  @returns - {encrypted text} -
  */
async function encryptMessage(storedAPIKey, encryptionKey) {
  let encodedKey = getMessageEncoding(storedAPIKey);
  ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    encryptionKey,
    encodedKey
  );

  let buffer = new Uint8Array(ciphertext, 0, 5);
  return buffer;
}

/** 
  @Description - Fetch the ciphertext and decrypt it.
  @params - {object} - passed the property keypair.privateKey
  @return - {string}- decrypted localStorage API key
  */

async function decryptMessage(key) {
  ciphertext = localStorage.getItem("ai-key");

  let decrypted = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    key,
    ciphertext
  );

  let dec = new TextDecoder();
  const decryptedValue = dec.decode(decrypted);
  return decryptedValue;
}

/**
 * @Description - generate an encryption key for SubtleCrypto API
 * @Calls - encryptMessage() with the generated keyPair.publicKey property value
 *
 */

export function useEncryptKey(storedAPIKey) {
  // First generate a keypair
  window.crypto.subtle
    .generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    )
    .then(async (keyPair) => {
      // call encryptMessage() w/keypair
      encryptedKey.value = await encryptMessage(
        storedAPIKey,
        keyPair.publicKey
      );
      console.log(encryptedKey);
    });
  return { encryptedKey };
}
