<template>
  <Header v-if="route.path != '/login'" />
  <router-view></router-view>

</template>

<script setup>
import { useRoute } from 'vue-router';
import Header from './components/header.vue';

const route = useRoute()


</script>

<style>
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  padding: 0;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
img {
  display: inline-block;
  margin: 0;
}
.card {
  padding: 2em;
}

.flex {
  display: flex;
}
.flex-wrap {
  flex-wrap: wrap;
}
.space-between {
  justify-content: space-between;
}
.space-around {
  justify-content: space-around;
}
.align-center {
  align-items: center;
}
.text-center {
  text-align: center;
}
#app {
  background: #222;
  height: 100vh;
}

/* #app > div >div {
  width: 100%;
  height: 100%;
} */
p {
  margin: 0;
}
.min {
  width: 20px;
  height: 20px;
  background: url(./assets/min.png) no-repeat center;
  background-size: contain;
  position: fixed;
  right: 50px;
  top: 10px;
  cursor: pointer;
}
.close {
  width: 20px;
  height: 20px;
  background: url(./assets/close.png) no-repeat center;
  background-size: contain;
  position: fixed;
  right: 10px;
  top: 10px;
  cursor: pointer;
}
.container {
  width: 1440px;
  padding: 0 20px;
  height: 100%;
  box-sizing: border-box ;
  margin: 0 auto;
  position: relative;
}
img {
  margin-right: 10px;
}
@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}

</style>
