<template>
      <h1 class="page-header">Intro to SpeakAI</h1>

      <main class="page-body">
            <div class="intro page" v-if="pageNumber === 1">
                  <p>The first prompt provides a starting point or direction for ChatGPT. The response follows the same tone,
                        context, and style as the prompt. Here are some general rules for writing prompts for ChatGPT-3.5:
                  </p>
                  <ul>
                        <li><strong>Start simple</strong> - start with a simple prompt and build on it</li>
                        <li><strong>Call to Action</strong> - start the prompt with an action word like "Write", "Create", or
                              "Summarize" instead of "Can you"</li>
                        <li><strong>Add Context</strong> - add specific and relevant context to the task you want to perform
                        </li>
                        <li><strong>Add Expectations</strong> - add clear and direct expectations for the content, like how
                              long it
                              should be and what to include.</li>
                  </ul>

                  <section>
                        <h2>Example</h2>

                        <p>With the following prompt:</p>
                        <code>
                                                                                                                                                                                                                                                                                                      Create a list of 10 fun and inexpensive toy gifts 
                                                                                                                                                                                                                                                                                                      to programmers based on the following criteria:
                                                                                                                                                                                                                                                                                                      - It should be useful
                                                                                                                                                                                                                                                                                                      - It should be silly
                                                                                                                                                                                                                                                                                                      - It should spark creativity 
                                    
                                                                                                                                                                                                                                                                                                </code>


                        <p>A response from Generative AI could be:</p>
                        <img src="@/assets/images/img_intro_toys.webp" alt="A ChatGPT response image">
                  </section>
            </div>

            <div class="roles page" v-if="pageNumber === 2">
                  <h2>ChatGPT-3.5 Role Prompting</h2>
                  <p>A simple way to add context to a prompt is to assign a role to ChatGPT. For example, your prompt can
                        start
                        with "You are a lawyer" or "You are a Poet", then ask your question</p>

                  <section>
                        <h3>Example</h3>
                        With the following prompt:
                        <code> You are a poet. Respond to the following:
                                     "Explain the most important way
                                      ChatGPT can help me. The answer 
                                      should be no more than 100 words." 
                              </code>
                        A response from ChatGPT-3.5 could be:
                        <img src="@/assets/images/img_roles_poet.webp" alt="A ChatGPT Response">
                  </section>
            </div>

            <div class="shot page" v-if="pageNumber === 3">
                  <h2>ChatGPT-3.5 Few Shot Prompting</h2>

                  <p>Use a few explicit examples (or shots) to guide the AI to respond in a specific way. This is called "Few
                        Shot" prompting. Few-shot prompting is helpful when you want a response to be structured in a specific
                        way.</p>
                  <section>
                        <h3>Example</h3>
                        <p>With the following prompt:</p>
                        <p>A conversation between Kai, the author of a GPT-3.5 tutorial, and a student:</p>
                        <code>
                                    Student: Why should I learn about Prompt Engineering?
                                    Kai: Because Generative AI can really boost your productivity if used correctly, and knowing how to write prompts correctly is the key to helping you use generative AIs.
                                    Student: What will I learn from this tutorial?
                                    Kai: This tutorial gives step-by-step guides on how to write AI prompts to get the best possible results from ChatGPT-3.5. You will learn to understand ChatGPT-3.5's capabilities and write prompts that minimize misinformation and biased results.
                                    Student: That sounds interesting. Can you give me an example of how Prompt Engineering can be used in real-world applications?
                                    Kai: Prompt Engineering can be used in a wide range of applications, such as content creation, customer service, and even scientific research. For example, let's say you're running a content creation platform and want to generate engaging article titles for your writers. Using Prompt Engineering techniques, you can write prompts that will help create article titles that are attention-grabbing and relevant to your readers. Another example is using generative AI to answer customer service inquiries. By writing well-crafted prompts, you can ensure that the AI responses are accurate and helpful, leading to higher customer satisfaction.
                                    Student:
                              </code>
                        <p>A response from ChatGPT-3.5 could be:</p>
                        <img src="@/assets/images/img_shot.webp" alt="ChatGPT Response">
                  </section>
            </div>

            <div class="prompts page" v-if="pageNumber === 4">
                  <h2>Golden Prompts</h2>
                  <p> Below is a table of examples of golden prompts that you can use.</p>

                  <table class="styled-table">
                        <thead>
                              <tr>
                                    <th>Action</th>
                                    <th>Golden Prompt</th>
                              </tr>
                        </thead>

                        <tbody>
                              <tr v-for="  item  in  goldenPrompts" class="active-row" :key="item.act">
                                    <td>{{ item.act }}</td>
                                    <td>{{ item.prompt }}</td>
                              </tr>
                        </tbody>

                  </table>
            </div>


      </main>

      <footer class="page-footer">
            <span @click="pageNumber > 2 ? pageNumber-- : pageNumber = 4" class="left">&lt;</span>{{ pageNumber }}<span
                  @click="pageNumber < 4 ? pageNumber++ : pageNumber = 1" class="right">&gt;</span>
      </footer>
</template>

<script setup>
import { ref } from "vue";
import prompts from "@/assets/prompts.json";

// Vars
let goldenPrompts = ref([]);
let pageNumber = ref(1);

goldenPrompts.value = prompts;

// --------------- Methods ------------------------------------- //


</script>

<style scoped>
* {
      line-height: 1.7rem;
}

h1 {
      font-size: 1.5rem;
      color: #131313;
}

h2 {
      font-size: 1.2rem;
      margin-left: 35px;
      max-width: 100%
}

p {
      font-size: 1.5rem;
      max-width: 700px;
      margin: 20px auto;
      font-weight: 600;
      text-align: left;
      text-indent: 40px;
}

ul {
      list-style: none;

}

li {
      font-family: var(--letter-font);
      color: var(--letter-ai-color);
      font-size: 1.5rem;
      max-width: 700px;
      margin: 20px auto;
      font-weight: 600;
      text-align: left;


}

li::before {
      content: "•";
      color: #000;
      display: inline-block;
      width: 1.1rem;
      margin-left: -1em;
}

strong {
      text-decoration: underline black 3px;
}

section {
      background: #d6d0d0;
      word-wrap: break-word;
      width: 75vw;
      margin: 0 auto;
      text-align: left;

}

section code {
      display: block;
      font-family: consolas;
      background: none;
      -webkit-overflow-scrolling: touch;
      overflow-x: scroll;
      max-width: 100%;
      min-width: 100px;
      padding: 0;
      white-space: normal;
      margin: 0 5px;
}

img {
      width: 95%;
      margin: 0 auto;
}

.page {
      margin-bottom: 5%;
}


/*----------- Table stylings --------------- */
.styled-table {
      border-collapse: collapse;
      margin: 25px auto;
      font-size: 1rem;
      font-family: var(--letter-font);
      min-width: 400px;
      max-width: 1100px;
      -webkit-box-shadow: 23px 16px 35px 4px rgba(168, 237, 216, 1);
      -moz-box-shadow: 23px 16px 35px 4px rgba(168, 237, 216, 1);
      box-shadow: 23px 16px 35px 4px rgba(168, 237, 216, 1);
}

.styled-table thead tr {
      background-color: #009879;
      color: #ffffff;
      text-align: left;
      font-size: 1.2rem;
}

.styled-table th,
.styled-table td {
      padding: 12px 15px;
}

.styled-table tbody tr {
      border-bottom: 1px solid #dddddd;
      font-size: .1.1rem;
}

.styled-table tbody tr:nth-of-type(even) {
      background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
      border-bottom: 2px solid #009879;
}

.styled-table tbody tr:nth-child(odd) {
      font-weight: bold;
      color: var(--letter-ai-color);
      background-color: #e5f4e9;
}

.styled-table tbody tr:nth-child(odd):hover {
      background-color: #91eca99a;
}

.styled-table tbody tr:nth-child(even) {
      font-weight: bold;
      color: var(--letter-ai-color);
      background-color: #cfebd7;
}

.styled-table tbody tr:nth-child(even):hover {
      background-color: #70ec93a4;

}

/* End table stylings */

.page-footer {
      font-size: 1.6rem;
}

.page-footer span {
      font-size: 1.6rem;
      padding: 0 35px;
      margin-bottom: 20px;
      cursor: pointer;
}
</style>