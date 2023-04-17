/*
  Store the calculated ciphertext here, so we can decrypt the message later.
  */
let ciphertext;

/**
  @Description - Fetch the contents of the localStorage ai-key, and encode it
  in a form we can use for the encrypt operation.
  @return {UTF-8 encoded string}
  */
function getMessageEncoding() {
  const messageBox = document.querySelector(".api-input");
  let message = messageBox.value;
  let enc = new TextEncoder();
  return enc.encode(message);
}

/** 
  @Description - Encrypt the localstorage API key
  @params - {object} - keyPair object. Uses the keyPair.public.key property
  @returns - {encoded text} -
  */
async function encryptMessage(key) {
  let encoded = getMessageEncoding();
  ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    key,
    encoded
  );

  console.log(ciphertext);
  return ciphertext;
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
 *  @Return - {object} - Returns values keyPair.publicKey(used with encryptMessage) &
 *            keypair.privateKey(used with decryptMessage)
 */

async function generateKey() {
  await window.crypto.subtle
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
    .then((keyPair) => {
      return keyPair;
    });
}

export { encryptMessage, decryptMessage, generateKey };
