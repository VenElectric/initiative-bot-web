<template>
  <div class="p-grid p-field m-2">
    <div class="p-inputgroup p-col input-value">
      <Button
        icon="pi pi-info-circle"
        class="p-button-sm p-button-success"
        v-tooltip.top="'Enter a name for your spell or effect.'"
      />
      <InputText
        id="spellName"
        type="text"
        placeholder="Spell Effect Name"
        :model-value="data.effectName"
        @update:model-value="
          (e) => handleChange(e, SpellObjectEnums.effectName)
        "
      />
    </div>
  </div>
  <div class="p-grid p-field m-2">
    <div class="p-inputgroup p-col input-value">
      <Button
        icon="pi pi-info-circle"
        class="p-button-sm p-button-success"
        v-tooltip.top="'Enter a description for your spell or effect.'"
      />
      <textarea
        placeholder="Spell Description..."
        v-model="data.effectDescription"
        @update="(e:any) => handleChange(e, SpellObjectEnums.effectDescription)"
      >
      </textarea>
    </div>
  </div>
  <div class="p-grid p-field m-2">
    <div class="p-inputgroup p-col input-value">
      <Button
        icon="pi pi-info-circle"
        class="p-button-sm p-button-success"
        v-tooltip.top="'Select the effect duration number value.'"
      />
      <InputNumber
        :model-value="data.durationTime"
        @update:model-value="
          (e) => handleChange(e, SpellObjectEnums.durationTime)
        "
      />
    </div>
  </div>
  <div class="p-grid p-field m-2">
    <div class="p-inputgroup p-col input-value">
      <Button
        icon="pi pi-info-circle"
        class="p-button-sm p-button-success"
        v-tooltip.top="'Select the effect duration type.'"
      />
      <Dropdown
        v-model="data.durationType"
        :options="durationTypes"
        option-label="label"
        option-value="value"
        placeholder="Duration"
        @update:model-value="
          (e) => handleChange(e, SpellObjectEnums.durationType)
        "
      ></Dropdown>
    </div>
  </div>
  <Button
    label="Save"
    class="pi-button-primary m-2"
    v-if="!isUpdate"
    @click.prevent="
      (e) => {
        spellFunction(e, data);
      }
    "
  />
  <Button
    v-else
    label="Save"
    class="pi-button-primary m-2"
    @click.prevent="
      (e) => {
        spellFunction(e, data);
      }
    "
  />
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref } from "vue";
import { SpellObjectEnums } from "../../../Interfaces/ContextEnums";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { SpellObject } from "@/src/Interfaces/initiative";
import serverLogger from "../../../Utils/LoggingClass";
import { LoggingTypes, ComponentEnums } from "../../../Interfaces/LoggingTypes";

export default defineComponent({
  name: "AddSpell",
  components: { Dropdown, InputNumber, InputText, Button },
  props: {
    spellFunction: { type: Function, required: true },
    isUpdate: { type: Boolean, required: true },
    spell: { type: Object as PropType<SpellObject>, required: false },
    index: { type: Number, required: false },
  },
  setup(props) {
    let data = reactive({
      effectName: props.spell ? props.spell.effectName : "",
      effectDescription: props.spell ? props.spell.effectDescription : "",
      durationTime: props.spell ? props.spell.durationTime : 0,
      durationType: props.spell ? props.spell.durationType : "",
      index: props.index ? props.index : 0,
    });
    const durationTypes = ref([
      { label: "Rounds", value: "Rounds" },
      { label: "Minutes", value: "Minutes" },
      { label: "Hours", value: "Hours" },
      { label: "Days", value: "Days" },
    ]);

    serverLogger(
      LoggingTypes.info,
      `created. isUpdate? ${props.isUpdate}`,
      ComponentEnums.ADDSPELL,
      props?.spell?.id
    );

    function handleChange(e: any, ObjectType: SpellObjectEnums) {
      serverLogger(
        LoggingTypes.debug,
        `updating ${ObjectType} value: ${e}`,
        ComponentEnums.ADDSPELL,
        props?.spell?.id
      );
      switch (ObjectType) {
        case SpellObjectEnums.effectName:
          data.effectName = e;
          break;
        case SpellObjectEnums.effectDescription:
          data.effectDescription = e;
          break;
        case SpellObjectEnums.durationType:
          data.durationType = e;
          console.log(e);
          break;
        case SpellObjectEnums.durationTime:
          data.durationTime = e;
          break;
      }
    }
    return { data, handleChange, SpellObjectEnums, durationTypes };
  },
});
</script>
