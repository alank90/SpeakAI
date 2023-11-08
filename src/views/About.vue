<template>
  <h1 class="page-header">SpeakAI</h1>

  <main class="page-body">
    <p>In order to use this site you must have an Open AI API key. You can go here to signup and get one:
      <a
        href="https://auth0.openai.com/u/signup/identifier?state=hKFo2SBHVG95Q0RVZmxrY2FSbDJCREp4MTR5TTk1UFU2YWs0WaFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIHpqdkZveE9QZEVqeGhzckxXS0xQTl9hNFVSeTh5UVhPo2NpZNkgRFJpdnNubTJNdTQyVDNLT3BxZHR3QjNOWXZpSFl6d0Q">Goto
        OpenAI to signup.</a>
      In addition, to address one of the LLM's shortcomings of no awareness of events after the date it was taught, I have
      implemented a search agent that allow's the
      LLM to forward requests to a Google search API that will then integrate a response with the LLM. <em>Important: Must
        keep the responses short when using the SERP agent. Any responses that take more then 10 secs will timeout </em>
      <a href="https://serpapi.com">Signup for SERP API key.</a>
    </p>
    <p>I designed this site to give people the opportunity to acquaint themselves with some of what AI is capable of.
      There is the main page which allows you to create what are called "prompts" to interact with Chat GPT service and
      tweak certain of the options available to you for the responses.</p>
    <p>DALL-E is an AI system that can create realistic images and art from a description in natural language.
      <a href="https://openai.com/research/dall-e">DALL-E info.</a>
    </p>

    <ul>Important!</ul>
    <p>
      - Storing API keys, even though encrypted, in the browser and sending the AI requests
      directly
      from
      the browser exposes your keys to the world and is inherently insecure. This site is
      intended only to get you started designing prompts in chatGPT. Since most people will only be using the free account
      this mitigates your exposure somewhat. If you decide to start paying a subscription fee for more usage I strongly
      urge you to
      to go to the <a href="https://platform.openai.com/account/limits">Usage limits page</a> and set some hard limits on
      your account usage like I do.
      <img src="../assets/images/usage_limits.png" alt="Image limits page">
    </p>
  </main>

  <footer class="page-footer">&copy; 2023 by <a href="https://alank-portfolio.netlify.app/" target="_blank">Alan
      Killian</a>
    <p>SpeakAI v.61</p>
  </footer>
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
  text-indent: 40px;
}

footer>p {
  width: 35%;
  margin: 0 auto;
  text-align: center;
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

ul {
  font-size: 1.6rem;
  font-weight: 700;
  text-decoration: underline;
  text-underline-position: above;
  margin-bottom: -30px;
}

img {
  margin: 0 auto;
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