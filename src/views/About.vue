<template>
  <h1 class="page-header">SpeakAI</h1>

  <main class="page-body">
    <p>In order to use this site you must have an Open AI API key. You can go here to signup and get one:
      <a
        href="https://auth0.openai.com/u/signup/identifier?state=hKFo2SBHVG95Q0RVZmxrY2FSbDJCREp4MTR5TTk1UFU2YWs0WaFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIHpqdkZveE9QZEVqeGhzckxXS0xQTl9hNFVSeTh5UVhPo2NpZNkgRFJpdnNubTJNdTQyVDNLT3BxZHR3QjNOWXZpSFl6d0Q">Goto
        OpenAI to signup.</a>
    </p>
    <p>I designed this site to give people the opportunity to aquaint themselves with some of what AI is capable of.
      There is the main page which allows you to create what are called "prompts" to interact with Chat GPT service and
      tweak certain of the options available to you for the responses.</p>
    <p>DALL-E is an AI system that can create realistic images and art from a description in natural language.<a
        href="https://openai.com/research/dall-e">DALL-E info.</a></p>
    <p><em>Note</em> - Storing API keys, even though encrypted, in the browser is inherently insecure. This site is
      intended only
      to get you started designing prompts in chatGPT. Since most people will only be using the free account this
      mitigates your exposure somewhat. </p>
  </main>

  <footer class="page-footer">&copy; 2023 by <a href="https://alank-portfolio.netlify.app/" target="_blank">Alan
      Killian</a></footer>
</template>


<style scoped>
h1 {
  font-size: 1.5rem;
  color: #131313;
}

p {
  font-size: 1.5rem;
  max-width: 700px;
  margin: 20px auto;
  font-weight: 600;
  text-align: left;
  text-align-last: center;
  text-indent: 40px;
}

a {
  padding: 1em .2em;
  text-transform: uppercase;
  text-decoration: none;
  background-image: linear-gradient(#121211, #34302b);
  background-size: 0% 0.1em;
  background-position-y: 75%;
  background-position-x: 50%;
  background-repeat: no-repeat;
  transition: background-size 0.2s ease-in-out;
}

a:hover {
  text-decoration-color: var(--main-theme-color);
  background-size: 100% 0.1em;
}

a:active {
  color: black;
  background-size: 100% 0.1em;

}

a:visited {
  color: #dc31ec;
  background-size: 100% 0.1em;

}

a:focus {
  background-size: 100% 0.1em;
}

footer {
  color: #131313;
}
</style>