import { ref } from "vue";

export default ref({
  model:
    "The OpenAI API is powered by a diverse set of models with different capabilities and price points. https://platform.openai.com/docs/models/overview",
  temperature:
    "Temperature is a value between 0 and 1 that essentially lets you control how confident the model should be when making these predictions.",
  max_tokens:
    "Tokens can be thought of as pieces of words. Before the API processes the prompts, the input is broken down into tokens.",
  top_p:
    "top_p computes the cumulative probability distribution, and cut off as soon as that distribution exceeds the value of top_p. For example, a top_p of 0.3 means that only the tokens comprising the top 30% probability mass are considered.",
  stop_sequence:
    "Stop Sequences are used to make the model stop at a desired point, such as the end of a sentence or a list. Generally, the return key will work well as a Stop Sequence for single line completions.",
  start_text:
    "Text to append after the user's input to format the model for a response",
  number_of_images: "The number of images requested.",
  image_size: "Size of images returned.",
  mode: "Given a prompt, the model will return one or more predicted completions.",
  previous: "previous",
  next: "next",
});
