<template>
  <div id="app">
    <Navbar />

    <main class="mt-3">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Navbar,
    Footer
  }
};
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
}

main {
  flex: 1; /* pousse le footer vers le bas */
}

body {
  background: #7893d1;
}
</style>

