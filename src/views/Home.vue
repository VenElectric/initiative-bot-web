<template>
  <div class="home">
    <h2>Game Sessions</h2>
    <h2>Characters</h2>
  </div>
  <GameSession></GameSession>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import GameSession from "../views/GameSession.vue";
import SortableList from "../components/gamesession/initiative/SortableList.vue";

export default defineComponent({
  name: "Home",
  components: {
    GameSession,
  },
  setup() {
    const data = reactive({
      items: [
        {
          id: "1234",
          title: "A",
        },
        { id: "5678", title: "B" },
        { id: "0564", title: "C" },
      ],
    });
    return { data };
  },
});
</script>
