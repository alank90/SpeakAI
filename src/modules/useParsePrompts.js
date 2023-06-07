import { reactive } from "vue";
import prompts from "@/assets/prompts.json";

/**
 * @Description -  Vue composable imports prompts.json and converts
 *  to a table of golden prompts
 * */

// --- Vars --------- //
let promptsJSON = reactive({});

console.log(prompts);

// ============== Exports ============================ //

export { promptsJSON };
