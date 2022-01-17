<template>
  <div>X</div>
  <Inplace
    :closable="true"
    @close="
      () =>
        updateCharacter(
          InitiativeObjectEnums.characterName,
          characterName.name,
          id
        )
    "
  >
    <template #display>
      <span v-tooltip.top="'Click to Edit'">{{ characterName.name }}</span>
    </template>
    <template #content>
      <InputText
        type="text"
        :model-value="characterName.name"
        @update:model-value="handleChange"
        class="character-input"
      />
    </template>
  </Inplace>
  <Button label="Primary" class="p-button-raised p-button-rounded">
    Current
  </Button>
</template>

<script lang="ts">
import { InitiativeObjectEnums } from "../../../interfaces/initiative";
import Button from "primevue/button";
import Inplace from "primevue/inplace";
import InputText from "primevue/inputtext";
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "InitiativeRecordHeader",
  components: { InputText, Inplace, Button },
  props: {
    name: { type: String, required: true },
    id: { type: String, required: true },
    updateCharacter: { type: Function, required: true },
  },
  setup(props) {
    const characterName = reactive({ name: props.name });

    function handleChange(e: string | undefined) {
      if (e !== undefined) {
        characterName.name = e;
      }
    }

    return { characterName, handleChange, InitiativeObjectEnums };
  },
});
</script>

<style></style>
