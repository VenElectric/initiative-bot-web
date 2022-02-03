<template>
  <div id="nav">
    <!-- <router-link to="/">Home</router-link> |
    <router-link to="/monsterlist">Monster List</router-link>
    <router-link to="/characterlist">Character List</router-link>
    <router-link to="/gamesessions">Game Sessions</router-link>
    <Toast></Toast> -->
  </div>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { io } from "socket.io-client";

export default defineComponent({
  provide() {
    return {
      socket: io("localhost:8000"),
    };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
