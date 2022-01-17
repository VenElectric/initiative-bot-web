<template>
  <Toolbar>
    <template #start>
      <Button label="Initiative" class="p-button-sm p-button-info" />
      <Button label="Spell" class="p-button-sm p-button-info" />
      <Button label="Sort" class="p-button-sm p-button-info" />
    </template>

    <template #end>
      <SplitButton label="Discord" class="p-button-info" />
      <Button label="Clear Session" class="p-button p-button-info" />
    </template>
  </Toolbar>
  <div>
    <div class="p-grid">
      <!-- Initiative List -->
      <div class="p-col-6 p-md-4 p-p-5">
        <div
          v-if="isLoaded"
          class="p-d-inline-flex p-flex-column p-jc-center init-container"
        >
          <h1>Initiative List</h1>
          <ToolBar>
            <Button
              type="button"
              label="Add Initiative"
              @click="toggle"
              class="p-button-sm"
            />
            <Button label="Sort" class="p-button-sm p-button-info" />
            <OverlayPanel ref="op" :showCloseIcon="true" :dismissable="true">
              <AddInitiative />
            </OverlayPanel>
          </ToolBar>
          <InitList :initiativeList="initiativeList" />
        </div>
        <div v-else>
          <Skeleton width="100%" height="2rem" />
        </div>
      </div>
      <!-- Spell List -->
      <div class="p-col-6 p-md-4 p-p-5">
        <div v-if="isLoaded">
          <h1>Spell List</h1>
        </div>
        <div v-else>
          <Skeleton width="100%" height="2rem" />
        </div>
      </div>
      <!-- Spell Info -->
      <div class="p-col-6 p-md-4 p-p-5">
        <div v-if="isLoaded">
          <h1>Spell Info</h1>
        </div>
        <div v-else>
          <Skeleton width="100%" height="2rem" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import InitList from "./gamesession/initiative/InitList.vue";
import Skeleton from "primevue/skeleton";
import Toolbar from "primevue/toolbar";
import SplitButton from "primevue/splitbutton";
import Button from "primevue/button";
import OverlayPanel from "primevue/overlaypanel";
import AddInitiative from "../components/gamesession/initiative/AddInitiative.vue";
import { InitiativeObject, SpellObject } from "../interfaces/initiative";

export default defineComponent({
  name: "SessionPage",
  props: ["initiativeList", "spellList"],
  components: {
    Skeleton,
    Toolbar,
    SplitButton,
    Button,
    AddInitiative,
    OverlayPanel,
  },
  setup() {
    const route = useRoute();
    const sessionId = String(route.params.id);
    const initiativeList = reactive({} as InitiativeObject[]);
    const spellList = reactive({} as SpellObject[]);
    let isLoaded = ref(false);
    let op = ref(null);

    function toggle(event: any) {
      (op.value as any).toggle(event);
    }

    return { toggle, op, isLoaded };
  },
});
</script>
