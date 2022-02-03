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
      <Button
        icon="pi pi-replay"
        label="Re-Roll Initiative"
        @click="() => reRoll(index)"
      />
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, watch } from "vue";
import { InitiativeObject } from "../../../Interfaces/initiative";
import { InitiativeObjectEnums } from "../../../Interfaces/ContextEnums";
import Card from "primevue/card";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import serverLogger from "../../../Utils/LoggingClass";
import { LoggingTypes, ComponentEnums } from "../../../Interfaces/LoggingTypes";

export default defineComponent({
  name: "InitRecord",
  components: { Card, InputNumber, Button },
  props: {
    initiative: { type: Object as PropType<InitiativeObject>, required: true },
    updateCharacter: { type: Function, required: true },
    reRoll: { type: Function, required: true },
    index: { type: Number, required: true },
  },
  setup(props) {
    const data = reactive({ record: props.initiative });

    watch(
      () => props.initiative,
      () => {
        serverLogger(
          LoggingTypes.debug,
          `watch triggered`,
          ComponentEnums.INITRECORD
        );
        data.record = props.initiative;
      },
      { deep: true }
    );

    function handleChange(e: number | undefined, valueName: string) {
      if (e !== undefined) {
        serverLogger(
          LoggingTypes.info,
          `updating character info`,
          ComponentEnums.SORTABLELIST,
          data.record.id
        );
        switch (valueName) {
          case InitiativeObjectEnums.initiative:
            data.record.initiative = Number(e);
            props.updateCharacter(
              InitiativeObjectEnums.initiative,
              data.record.initiative,
              props.index,
              true,
              data.record.id
            );
            serverLogger(
              LoggingTypes.debug,
              `${valueName} updated`,
              ComponentEnums.SORTABLELIST,
              data.record.id
            );
            break;
          case InitiativeObjectEnums.initiativeModifier:
            data.record.initiativeModifier = Number(e);
            props.updateCharacter(
              InitiativeObjectEnums.initiativeModifier,
              data.record.initiativeModifier,
              props.index,
              true,
              data.record.id
            );
            serverLogger(
              LoggingTypes.debug,
              `${valueName} updated`,
              ComponentEnums.SORTABLELIST,
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
