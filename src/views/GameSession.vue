<template>
  <Toolbar>
    <template #start>
      <Button label="Initiative" class="p-button-sm p-button-info" />
      <Button label="Spell" class="p-button-sm p-button-info" />
      <Button label="Sort" class="p-button-sm p-button-info" />
    </template>

    <template #end>
      <SplitButton label="Discord" :model="buttonItems" class="p-button-info" />
      <Button label="Clear Session" class="p-button p-button-info" />
    </template>
  </Toolbar>

  <div class="flex flex-row justify-content-evenly">
    <!-- Initiative List -->
    <div class="flex flex-column column-container">
      <h1>Initiative List</h1>
      <InitiativeState></InitiativeState>
    </div>
    <!-- Spell List -->

    <div class="flex flex-column column-container">
      <h1>Spell List</h1>
      <SpellState></SpellState>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  computed,
  onMounted,
  inject,
  provide,
} from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";
import InitiativeState from "../components/gamesession/initiative/InitiativeState.vue";
import Toolbar from "primevue/toolbar";
import SplitButton from "primevue/splitbutton";
import Button from "primevue/button";
import InputEditor from "../components/InputEditor.vue";
import { IStore } from "../data/types";
import SpellState from "../components/gamesession/spells/SpellState.vue";

// css to make columns instead of rows for each item (init, spell, info)
export default defineComponent({
  name: "GameSession",
  components: {
    Toolbar,
    SplitButton,
    Button,
    InitiativeState,
    SpellState,
  },
  setup() {
    const route = useRoute();
    const socket = io("localhost:8000");
    const store = inject<IStore>("store");
    provide("socket", socket);
    // const sessionId = String(route.params.id);
    let paramsId = "731278337917452380";
    if (store) {
      store.updateId(paramsId);
    }
    let op = ref(null);
    const buttonItems = [
      {
        label: "Initiative",
      },
      {
        label: "Spells",
      },
    ];

    // onMounted(() => {
    //   if (sessionId !== undefined) {
    //     socket.emit("create", sessionId);
    //   }
    // });

    return { buttonItems };
  },
});
</script>

<style scoped>
.column-container {
  width: 30%;
}
.p-tooltip-text {
  font-size: 0.8em;
}
</style>
