<template>
  <nav id="nav-container">
    <a href="https://platform.openai.com/docs/introduction" target="_blank" title="Goto OpenAI Documentation">
      <img class="navbar-item-one" src="../assets/images/ai_navbar_image_sm.webp" alt="Image of an AI person" />
    </a>
    <ul class="navbar-item-two">
      <li class="menu-item"><router-link to="/">Home</router-link></li>
      <li class="menu-item">
        <router-link to="/dalle">DALL-E</router-link>
      </li>
      <li class="menu-item">
        <router-link to="/intro">Primer to ChatGPT</router-link>
      </li>
      <li class="menu-item"><router-link to="/about">About</router-link></li>
    </ul>
  </nav>
</template>

<style scoped>
#nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: auto;
  height: 5%;
  max-height: 125px;
  margin: 0 0 25px 0;
  border-bottom: 1px solid var(--main-ai-color);
}

.navbar-item-one {
  margin: 2px 0 5px 2px;
  border-radius: 50%;
  width: 4rem;
}

.navbar-item-two {
  display: inline-flex;
}

.menu-item>a {
  font-family: var(--letter-font);
  font-size: 1.3rem;
  font-weight: 500;
  padding: 8px;
  margin: 0 5px 0;
  text-decoration: none;
}

li {
  padding: 1em .2em;
  text-decoration: none;
  background-image: linear-gradient(#121211, #34302b);
  background-size: 0 0.1em;
  background-position-y: 70%;
  background-position-x: 50%;
  background-repeat: no-repeat;
  transition: background-size 0.2s ease-in-out;
}

li:hover {
  text-decoration-color: var(--main-theme-color);
  background-size: 100% 0.1em;
}
</style>
