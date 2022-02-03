<template>
  <ul>
    <li
      v-for="(item, index) in data.initiativeList"
      :key="item.id"
      @dragstart="(e:any) => store.startDrag(e, index)"
      @dragover="store.dragOver"
      @dragenter="store.dragEnter"
      @drop="(e:any) => store.onDrop(e, index)"
      draggable="true"
    >
      <fieldset class="record" :class="item.isCurrent ? `current` : ``">
        <legend>
          <em class="pi pi-arrows-v legend"></em>
        </legend>
        <slot :item="item" :index="index"></slot>
      </fieldset>
      <span style="width: 100% !important"
        ><EffectContainer :statusEffects="item.statusEffects"></EffectContainer
      ></span>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType, inject, watch, reactive } from "vue";
import { InitiativeObject } from "../../../Interfaces/initiative";
import { IStore, Character } from "../../../data/types";
import Fieldset from "primevue/fieldset";
import EffectContainer from "./EffectContainer.vue";
import serverLogger from "../../../Utils/LoggingClass";
import { LoggingTypes, ComponentEnums } from "../../../Interfaces/LoggingTypes";

export default defineComponent({
  name: "SortableList",
  components: { EffectContainer },
  setup() {
    const store = inject<IStore>("store");
    const data = reactive({ initiativeList: store?.store.initiativeList });
    serverLogger(
      LoggingTypes.debug,
      `sortable list component created`,
      ComponentEnums.SORTABLELIST
    );
    watch(
      () => store?.store.initiativeList,
      () => {
        serverLogger(
          LoggingTypes.debug,
          `watch triggered`,
          ComponentEnums.SORTABLELIST
        );
        data.initiativeList = store?.store.initiativeList;
      },
      { deep: true }
    );
    if (store === undefined) {
      serverLogger(
        LoggingTypes.alert,
        `Failed to inject store`,
        ComponentEnums.SORTABLELIST
      );
      throw new Error("Failed to inject store");
    }

    return { store, data };
  },
});
</script>

<style scoped>
.drag-element {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 5px;
}
ul {
  list-style: none;
  padding-left: 0;
  width: 100%;
}
li {
  margin-top: 1em;
  margin-bottom: 1em;
}
.record {
  padding: 1em;
  width: 100% !important;
  display: flex !important;
  flex-direction: row !important;
  justify-content: space-evenly !important;
  align-items: center !important;
}
.current {
  box-shadow: 0 2px 4px 4px rgba(0, 255, 21, 0.596);
}
.p-fieldset .p-fieldset-content .p-toggleable-content {
  padding: 0 !important;
  width: 100% !important;
  display: flex !important;
  flex-direction: row !important;
  justify-content: space-evenly !important;
  align-items: center !important;
}
.legend {
  border: 1px solid black;
}
fieldset {
  padding: 0;
}
</style>
