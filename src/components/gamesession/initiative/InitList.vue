<template>
  <Accordion>
    <AccordionTab v-for="item in initiativeList" :key="item.id">
      <template #header>
        <div>X</div>

        <Inplace :closable="true">
          <template #display>
            <span v-tooltip.top="'Click to Edit'">{{
              item.characterName
            }}</span>
          </template>
          <template #content>
            <InputText
              id="characterName"
              type="text"
              :value="item.characterName"
              v-bind="character"
              class="character-input"
              autofocus
            />
          </template>
        </Inplace>
        <Button label="Primary" class="p-button-raised p-button-rounded">
          Current
        </Button>
      </template>
      <InitRecord :initiative="item" />
    </AccordionTab>
  </Accordion>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import InitRecord from "./InitRecord.vue";
import { InitiativeObject } from "@/src/interfaces/initiative";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import InputText from "primevue/inputtext";
import Inplace from "primevue/inplace";

export default defineComponent({
  name: "InitList",
  props: { initiativeList: Array as PropType<InitiativeObject[]> },
  data() {
    return {
      init_list: [1, 2, 3, 4, 5],
      character: "",
    };
  },
  components: {
    InitRecord,
    Accordion,
    AccordionTab,
    InputText,
    Inplace,
  },
  setup() {
    const startDrag = (evt: any, item: any) => {
      if (evt !== null) {
        evt.dataTransfer.dropEffect = "move";
        evt.dataTransfer.effectAllowed = "move";
        evt.dataTransfer.setData("itemID", item.id);
      }
    };
  },
});
</script>

<style lang="scss" scoped>
.init-container {
  width: 70%;
}
</style>
