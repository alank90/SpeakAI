<template>
  <nav id="nav-container">
    <img
      class="navbar-item-one"
      src="../assets/images/ai_navbar_image_sm.png"
      alt="Image of an AI person"
    />

    <ul class="navbar-item-two">
      <li class="menu-item"><router-link to="/">Home</router-link></li>
      <li class="menu-item"><router-link to="/about">About</router-link></li>
    </ul>
  </nav>
</template>

<style scoped>
#nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5%;
  max-height: 125px;
  margin: 0 0 25px 0;
  border-bottom: 1px solid var(--main-ai-color);
}

.navbar-item-one {
  margin: 0 5px 0;
  border-radius: 50%;
}
.navbar-item-two {
  display: inline-flex;
}

.menu-item > a {
  font-family: var(--letter-font);
  font-size: 1.3rem;
  font-weight: 500;
  padding: 8px;
  margin: 0 5px 0;
  text-decoration: none;
}
</style>
