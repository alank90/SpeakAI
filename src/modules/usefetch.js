import { ref, isRef, unref, watchEffect } from "vue";

/**
 * @Description - Vue  composable function to fetch data
 * @param {string} url
 * @returns {object} - Reactive variables
 * @importedBy - DallE.vue
 */
export function useFetch(url, fetchOptions) {
  // ======= Variable Declarations ============ //
  const data = ref(null);
  const error = ref(null);

  console.log(`${fetchOptions.headers} ${url} ${fetchOptions.method}`);

  async function doFetch() {
    // reset state before fetching ..
    data.value = null;
    error.value = null;

    // resolve the url value synchrously so it's tracked as a
    // dependency by watchEffect()
    const urlValue = unref(url);

    try {
      // unref() will return the ref value if it's a ref
      // otherwise the value will be returned as-is
      const res = await fetch(url, fetchOptions);
      data.value = await res.json();
    } catch (e) {
      error.value = e;
    }
  }

  // Will refetch data if input url changes when url is a ref
  if (isRef(url)) {
    // setup reactive re-fetch if input URL is a ref
    watchEffect(doFetch);
  } else {
    // otherwise, just fetch once
    doFetch();
  }
  return { data, error };
}
