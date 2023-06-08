import { ref } from "vue";

/**
 * @Description -  Vue composable imports prompts.json and converts
 *  to a table of golden prompts
 * */

// Vars
let goldenPromptsTable = ref(null);

const useFetchFile = async () => {
  // Fetch JSON file //
  fetch("@/assets/prompts.json")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      console.log(data);
      goldenPromptsTable.value = data;
    })
    .catch((e) => console.log(e));
};
// ============== Exports ============================ //

export { useFetchFile, goldenPromptsTable };
