import { ref } from "vue";

/**
 * @Description - Vue composable function to encrypt/decrypt
 *  api key
 *
 */

export function useSubtleCrypto() {
  /* =========== Variables ============ */
  let ciphertext = ref(null);
  let encryptedText = ref(null);
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
    ciphertext.value = await window.crypto.subtle.encrypt(
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

  async function decryptString() {
    ciphertext.value = localStorage.getItem("ai-key");
    let keyPair = localStorage.getItem("keyPair");

    decryptedText.value = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      keyPair,
      ciphertext
    );

    let dec = new TextDecoder();
    decryptedText.value = dec.decode(decryptedText.value);
    return decryptedText.value;
  }

  /**
   * @Description - generate an encryption key for SubtleCrypto API
   * @Calls - encryptionFunction() with the generated keyPair.publicKey property value
   *
   */

  function encryptString(storedAPIKey) {
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
        localStorage.setItem("keyPair", keyPair);

        // call encryptionFunction() w/keypair & unencrypted API key
        encryptedText.value = await encryptionFunction(storedAPIKey, keyPair);
        return encryptedText.value;
      });
  }

  return { encryptString, decryptString };
}
