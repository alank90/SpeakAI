<template>
  <nav id="nav-container">
    <img class="navbar-item-one" src="../assets/images/ai_navbar_image_sm.webp" alt="Image of an AI person" />

    <ul class="navbar-item-two">
      <li class="menu-item"><router-link to="/">Home</router-link></li>
      <li class="menu-item">
        <router-link to="/dalle">DALL-E</router-link>
      </li>
      <li class="menu-item" title="Goto GPTZero to check if text was AI generated"><a
          href="https://app.gptzero.me/app/welcome" target="_blank">GPTZero</a></li>
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
  margin: 0 0 5px 2px;
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
  background-image: linear-gradient(#121211, #070707);
  background-size: 0 0.1em;
  background-position-y: 85%;
  background-position-x: 50%;
  background-repeat: no-repeat;
  transition: background-size 0.2s ease-in-out;
}

li:hover {
  text-decoration-color: var(--main-theme-color);
  background-size: 75% 0.1em;
}
</style>
