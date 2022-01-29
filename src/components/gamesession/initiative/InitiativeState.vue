<template>
  <div v-if="!loading">
    <div>
      <ToolBar>
        <template #start>
          <Button
            v-if="!store.store.isSorted"
            label="Start Rounds"
            class="p-button-sm p-button-info"
            @click="store.roundStart"
          ></Button>
          <Button
            v-else
            label="Sort"
            class="p-button-sm p-button-info"
            @click="store.reSort"
          />
        </template>
        <template #end>
          <Button
            type="button"
            label="Add Initiative"
            @click="toggle"
            class="p-button-sm"
          />
          <OverlayPanel ref="op" :showCloseIcon="true" :dismissable="true">
            <AddInitiative :addCharacter="addCharacter" />
          </OverlayPanel>
        </template>
      </ToolBar>
      <SortableList :initiativeList="store.store.initiativeList">
        <template v-slot:default="record">
          <InitiativeRecordHeader
            :record="record.item"
            :updateCharacter="store.updateCharacter"
            :removeCharacter="store.removeCharacter"
            :index="record.index"
            :isCurrent="store.setCurrent"
          ></InitiativeRecordHeader>
        </template>
      </SortableList>
    </div>
  </div>
  <div class="record" v-else>
    <Skeleton width="100%" height="2rem" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, inject } from "vue";
import InitiativeRecordHeader from "./InitiativeRecordHeader.vue";
import OverlayPanel from "primevue/overlaypanel";
import AddInitiative from "./AddInitiative.vue";
import ToolBar from "primevue/toolbar";
import Button from "primevue/button";
import Skeleton from "primevue/skeleton";
import { IStore, Character } from "../../../data/types";
import SortableList from "./SortableList.vue";
import { InitiativeObject } from "@/src/Interfaces/initiative";
import Panel from "primevue/panel";

export default defineComponent({
  name: "InitiativeState",
  components: {
    AddInitiative,
    OverlayPanel,
    ToolBar,
    Button,
    Skeleton,
    SortableList,
    InitiativeRecordHeader,
  },
  setup() {
    const store = inject<IStore>("store");
    const loading = ref(true);
    let op = ref(null);
    if (store === undefined) {
      throw new Error('Failed to inject "updateScore"');
    }

    onMounted(() => {
      console.info("onMounted");
      store.getInitial();

      setTimeout(() => {
        loading.value = false;
      }, 500);
    });

    function toggle(event: any) {
      (op.value as any).toggle(event);
    }

    function addCharacter(
      e: any,
      data: Character,
      roll: boolean,
      npc: boolean
    ) {
      // toggle add menu off
      toggle(e);
      store?.addCharacter(data, roll, npc);
    }
    return {
      loading,
      store,
      toggle,
      op,
      addCharacter,
    };
  },
});
</script>

<style scoped>
.record {
  width: 100%;
  border: 2px solid black;
}
.current {
  box-shadow: inset 0 1px 4px 0 rgba(0, 255, 21, 0.596);
}
</style>
