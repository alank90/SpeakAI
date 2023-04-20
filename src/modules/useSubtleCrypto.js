/**
 * @Description - Vue composable function to encrypt/decrypt
 *  api key
 * @Calledby - Home.vue
 *
 */

export function useSubtleCrypto() {
  /* =========== Variables ============ */
  let ciphertext = null;
  let encryptedText = null;
  let decryptedText = null;

  /**
  @Description - Takes the data and converts it to a stream of UTF-8 bytes
  @params - { string } - API string
  @return {UTF-8 encoded string}
  */
  function getMessageEncoding(data) {
    let enc = new TextEncoder();
    return enc.encode(data);
  }

  /** 
  @Description - Encrypt the localstorage API key
  @params - {string, CryptoKey} - String data and the key to be used for encryption
  @returns - {A Promise that fulfills with an ArrayBuffer containing the "ciphertext".}
  */
  async function encryptionFunction(data, encryptionKeyPair) {
    // console.log("Keypair is: ", encryptionKeyPair, data);

    let encodedString = getMessageEncoding(data);
    // console.log(encodedString);
    ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      encryptionKeyPair.publicKey,
      encodedString
    );
    //console.log(ciphertext);

    return ciphertext;

    /* let buffer = new Uint8Array(ciphertext, 0, 5);
  return buffer; */
  }

  /** 
  @Description - Fetch the ciphertext & keypair from localStorage, then decrypt it.
  @return - {string}- decrypted localStorage API key
  */

  async function decryptString() {
    let data = localStorage.getItem("ai-key");
    let keyPair = localStorage.getItem("keyPair");

    decryptedText = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      keyPair,
      data
    );

    let dec = new TextDecoder();
    decryptedText = dec.decode(decryptedText);
    return decryptedText;
  }

  /**
   * @Description - generate an encryption key and encrypt the data
   * @params - {string} - The unencrypted API key
   * @Calls - encryptionFunction() with the generated keyPair.publicKey property value
   * @returns - An encrypted string and stores key in localStorage
   *
   */

  async function encryptString(data) {
    // First generate a keypair
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    // Store encryption key
    localStorage.setItem("keyPair", keyPair);

    // call encryptionFunction() w/keypair & unencrypted API string
    encryptedText = await encryptionFunction(data, keyPair);
    return encryptedText;
  }

  return { encryptString, decryptString };
}
