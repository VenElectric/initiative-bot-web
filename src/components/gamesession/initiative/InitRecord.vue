<template>
  <Card class="p-d-flex p-flex-column">
    <template #content>
      <div>
        <span
          v-tooltip.top="
            'Enter the d20 roll for your initiative. Do not add your modifier'
          "
        >
          <InputNumber
            id="initiative"
            :model-value="data.record.initiative"
            @update:model-value="
              (e) => handleChange(e, InitiativeObjectEnums.initiative)
            "
          />
        </span>
        <label for="initiative">Initiative Total</label>
      </div>
      <div>
        <span v-tooltip.top="'Enter your initiative modifier. Integers only.'">
          <InputNumber
            id="initiativeModifier"
            :model-value="data.record.initiativeModifier"
            @update:model-value="
              (e) => handleChange(e, InitiativeObjectEnums.initiativeModifier)
            "
          />
        </span>
        <label for="initiativeModifier">Initiative Modifier</label>
      </div>
    </template>
    <template #footer>
      <Button icon="pi pi-replay" label="Re-Roll Initiative" />
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from "vue";
import { InitiativeObject } from "../../../Interfaces/initiative";
import { InitiativeObjectEnums } from "../../../Interfaces/ContextEnums";
import Card from "primevue/card";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";

export default defineComponent({
  name: "InitRecord",
  components: { Card, InputNumber, Button },
  props: {
    initiative: { type: Object as PropType<InitiativeObject>, required: true },
    updateCharacter: { type: Function, required: true },
  },
  setup(props) {
    const data = reactive({ record: props.initiative });

    function handleChange(e: number | undefined, valueName: string) {
      if (e !== undefined) {
        switch (valueName) {
          case InitiativeObjectEnums.initiative:
            data.record.initiative = Number(e);
            props.updateCharacter(
              InitiativeObjectEnums.initiative,
              data.record.initiative,
              data.record.id
            );
            break;
          case InitiativeObjectEnums.initiativeModifier:
            data.record.initiativeModifier = Number(e);
            props.updateCharacter(
              InitiativeObjectEnums.initiativeModifier,
              data.record.initiativeModifier,
              data.record.id
            );
            break;
        }
      }
    }

    return { data, handleChange, InitiativeObjectEnums };
  },
});
</script>

<style>
.pi-pencil {
  font-size: 0.5em !important;
}
</style>
