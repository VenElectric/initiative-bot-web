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
  <div>
    <div class="p-grid">
      <!-- Initiative List -->
      <div class="p-col-6 p-md-4 p-p-5">
        <h1>Initiative List</h1>
        <InitiativeState></InitiativeState>
      </div>
    </div>
    <!-- Spell List -->
    <div class="p-col-6 p-md-4 p-p-5">
      <div>
        <h1>Spell List</h1>
      </div>
    </div>
    <!-- Spell Info -->
    <div class="p-col-6 p-md-4 p-p-5">
      <div>
        <h1>Spell Info</h1>
      </div>
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

// css to make columns instead of rows for each item (init, spell, info)
export default defineComponent({
  name: "GameSession",
  components: {
    InitiativeState,
    Toolbar,
    SplitButton,
    Button,
  },
  setup() {
    const route = useRoute();
    const socket = io("localhost:8000");
    provide("socket", socket);
    // const sessionId = String(route.params.id);
    const sessionId = "731278337917452380";
    provide("sessionId", sessionId);
    let op = ref(null);
    const buttonItems = [
      {
        label: "Initiative",
      },
      {
        label: "Spells",
      },
    ];

    function toggle(event: any) {
      (op.value as any).toggle(event);
    }

    onMounted(() => {
      if (sessionId !== undefined) {
        socket.emit("create", sessionId);
      }
    });

    return { socket, sessionId, buttonItems, toggle, op };
  },
});
</script>

<style scoped>
.init-container {
  width: 70%;
}
</style>
