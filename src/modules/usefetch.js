import { ref, isRef, unref, watchEffect } from "vue";

/**
 * @Description - Vue  composable function to fetch data
 * @param {string} url
 * @returns {object} - Reactive variables
 * @importedBy - DallE.vue
 */
export function useFetch(url, fetchOptions) {
  // ======= Variable Declarations ============ //
  const imagesURL = ref(null);
  const error = ref(null);

  async function doFetch() {
    // reset state before fetching ..
    imagesURL.value = null;
    error.value = null;

    // resolve the url value synchrously so it's tracked as a
    // dependency by watchEffect()
    const urlValue = unref(url);

    try {
      // unref() will return the ref value if it's a ref
      // otherwise the value will be returned as-is
      const res = await fetch(urlValue, fetchOptions);
      imagesURL.value = await res.json();
      console.log(imagesURL.value.data[0].url);
    } catch (e) {
      error.value = e;
    }
  }
  doFetch();
  // Will refetch data if input url changes when url is a ref
  if (isRef(url)) {
    // setup reactive re-fetch if input URL is a ref
    watchEffect(doFetch);
  } else {
    // otherwise, just fetch once
    doFetch();
  }
  return { imagesURL, error };
}
