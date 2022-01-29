<template>
  <ul>
    <li
      v-for="(item, index) in store?.store.initiativeList"
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
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType, inject } from "vue";
import { InitiativeObject } from "../../../Interfaces/initiative";
import { IStore, Character } from "../../../data/types";
import Fieldset from "primevue/fieldset";

interface TestObject {
  id: string;
  title: string;
}

export default defineComponent({
  name: "SortableList",
  setup(props) {
    const store = inject<IStore>("store");
    if (store === undefined) {
      throw new Error('Failed to inject "updateScore"');
    }

    return { store };
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
