/**
 * @Description - Vue composable function to encrypt/decrypt
 *  api key
 * @Calledby - Home.vue
 *
 */

export function useSubtleCrypto() {
  /* =========== Variables ============ */
  let ciphertext = null;
  let encryptedText = {};
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
  async function encryptionFunction(data, key) {
    let encodedString = getMessageEncoding(data);
    // console.log(encodedString);
    ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      key.publicKey,
      encodedString
    );

    return ciphertext;

    /* let buffer = new Uint8Array(ciphertext, 0, 5);
  return buffer; */
  }

  /** 
  @Description - Fetch the ciphertext & keypair from localStorage, then decrypt it.
  @return - {string}- decrypted localStorage API key
  */

  async function decryptString(data, key) {
    console.log("Keypair is: ", key);

    decryptedText = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      key,
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

    encryptedText.key = keyPair;

    // call encryptionFunction() w/keypair & unencrypted API string
    encryptedText.str = await encryptionFunction(data, encryptedText.key);
    return encryptedText;
  }

  return { encryptString, decryptString };
}
