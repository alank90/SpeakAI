import { ref } from "vue";

/* =========== Variables ============ */
let ciphertext;
let encryptedText = ref(null);
let encryptionKeyPair = ref(null);
let decryptedText = ref(null);

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
  @params - {objects} - keyPair object and unencrypted API key. Uses the keyPair.publicKey property
  @returns - {encrypted text} -
  */
async function encryptionFunction(storedAPIKey, encryptionKey) {
  console.log("Keypair is: ", encryptionKey, storedAPIKey);

  let encodedString = getMessageEncoding(storedAPIKey);
  console.log(encodedString);
  ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    encryptionKey.publicKey,
    encodedString
  );
  console.log(ciphertext);

  return ciphertext;

  /* let buffer = new Uint8Array(ciphertext, 0, 5);
  return buffer; */
}

/** 
  @Description - Fetch the ciphertext and decrypt it.
  @params - {object} - passed the property keypair.privateKey
  @return - {string}- decrypted localStorage API key
  */

export async function decryptString(keyPair) {
  ciphertext = localStorage.getItem("ai-key");

  let decrypted = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    keyPair,
    ciphertext
  );

  let dec = new TextDecoder();
  decryptedText.value = dec.decode(decrypted);
  return decryptedText.value;
}

/**
 * @Description - generate an encryption key for SubtleCrypto API
 * @Calls - encryptionFunction() with the generated keyPair.publicKey property value
 *
 */

export function encryptString(storedAPIKey) {
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
      // Store encryption key
      encryptionKeyPair.value = keyPair;
      // call encryptionFunction() w/keypair & unencrypted API key
      encryptedText.value = await encryptionFunction(storedAPIKey, keyPair);

      //console.log(encryptedText.value);
    });
  return { encryptedText, encryptionKeyPair };
}
