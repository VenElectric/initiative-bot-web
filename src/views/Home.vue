<template>
  <div class="home">
    <h2>Game Sessions</h2>
    <h2>Characters</h2>
  </div>
  <GameSession></GameSession>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GameSession from "../views/GameSession.vue";

export default defineComponent({
  name: "Home",
  components: {
    GameSession,
  },
});
</script>
