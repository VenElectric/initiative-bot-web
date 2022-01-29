<template>
  <InputEditor
    class="inplace-initial"
    @close="
      (event) => {
        event.stopPropagation();
        updateCharacter(
          InitiativeObjectEnums.characterName,
          data.characterName,
          data.id
        );
      }
    "
    @open="
      (event) => {
        event.stopPropagation();
      }
    "
  >
    <template #display>
      <span v-tooltip.top="'Click to Edit'">{{ data.characterName }}</span>
    </template>
    <template #content>
      <InputText
        class="text-inplace p-inputtext-sm"
        type="text"
        :model-value="data.characterName"
        @update:model-value="handleChange"
        @click.prevent="(event) => event.stopPropagation()"
      />
    </template>
  </InputEditor>
  <Button
    label="Primary"
    class="p-button-raised p-button-rounded p-mr-3"
    @click.prevent="() => isCurrent(index)"
  >
    Current
  </Button>
  <Button @click="toggle" icon="pi pi-pencil" />
  <OverlayPanel ref="op" :showCloseIcon="true" :dismissable="true">
    <InitRecord :updateCharacter="updateCharacter" :initiative="record" />
  </OverlayPanel>
  <div>
    <span
      class="pi pi-trash p-mr-auto trash-icon"
      @click.prevent="
        (event) => {
          event.stopPropagation();
          removeCharacter(index, record.id);
        }
      "
    ></span>
  </div>
</template>

<script lang="ts">
import { InitiativeObjectEnums } from "../../../Interfaces/ContextEnums";
import Button from "primevue/button";
import Inplace from "primevue/inplace";
import InitRecord from "./InitRecord.vue";
import InputText from "primevue/inputtext";
import { defineComponent, PropType, reactive, ref } from "vue";
import InputEditor from "../../InputEditor.vue";
import OverlayPanel from "primevue/overlaypanel";
import { InitiativeObject } from "@/src/Interfaces/initiative";

export default defineComponent({
  name: "InitiativeRecordHeader",
  components: { InputEditor, Button, InputText, InitRecord, OverlayPanel },
  props: {
    record: { type: Object as PropType<InitiativeObject>, required: true },
    updateCharacter: { type: Function, required: true },
    removeCharacter: { type: Function, required: true },
    isCurrent: { type: Function, required: true },
    index: { type: Number, required: true },
  },
  setup(props) {
    const data = reactive({ ...props.record });
    let op = ref(null);

    function toggle(event: any) {
      (op.value as any).toggle(event);
    }

    function handleChange(e: string | undefined) {
      if (e !== undefined) {
        data.characterName = e;
      }
    }

    return { data, handleChange, InitiativeObjectEnums, toggle, op };
  },
});
</script>

<style scoped>
.trash-icon {
  margin-left: auto;
  margin-right: 0;
}
.text-inplace {
  width: 70%;
  margin-left: 0;
  margin-right: 1em;
}
.inplace-initial {
  width: 30%;
  margin-left: 0;
  margin-right: 0;
}
.p-button.p-button-icon-only {
  height: 1em !important;
  width: 1em !important;
}
</style>
