<template>
  <div class="p-grid p-field">
    <div class="p-inputgroup p-col input-value">
      <Button icon="pi pi-info-circle" class="p-button-sm p-button-success" />
      <InputText
        id="characterName"
        type="text"
        placeholder="Character Name"
        :model-value="data.characterName"
        @update:model-value="
          (e) => handleChange(e, InitiativeObjectEnums.characterName)
        "
      />
      <Button
        id="NPC"
        class="p-button-sm p-button-help"
        lable="NPC?"
        v-tooltip.top="'Character is NPC? ' + String(npc)"
        @click.stop="updateNPC"
        ><ClickIcon></ClickIcon>
      </Button>
    </div>
  </div>
  <div class="p-grid p-field">
    <div class="p-inputgroup p-col input-value">
      <Button
        icon="pi pi-info-circle"
        class="p-button-sm p-button-success"
        v-tooltip.top="
          'Enter the d20 roll for your initiative. Do not add your modifier. Integers only'
        "
      />
      <InputNumber
        id="initiative"
        placeholder="Initiative Roll"
        :model-value="data.initiative"
        @update:model-value="
          (e) => handleChange(e, InitiativeObjectEnums.initiative)
        "
        :disabled="roll"
      />
      <Button
        id="roll"
        class="p-button-sm p-button-help"
        v-tooltip.top="
          'Roll For Me: ' +
          String(roll) +
          '\nInitiative value will be reset to 0 if set to true.'
        "
        @click.stop="updateRollForMe"
      >
        <ClickIcon></ClickIcon>
      </Button>
    </div>
  </div>
  <div class="p-grid p-field">
    <div class="p-inputgroup p-col input-value">
      <Button
        icon="pi pi-info-circle"
        class="p-button-sm p-button-success"
        v-tooltip.top="'Enter your initiative modifier. Integers only.'"
      />
      <InputNumber
        id="modifier"
        placeholder="Initiative Modifier"
        :model-value="data.initiativeModifier"
        @update:model-value="
          (e) => handleChange(e, InitiativeObjectEnums.initiativeModifier)
        "
      />
    </div>
  </div>
  <Button
    label="Save"
    class="pi-button-primary"
    @click.prevent="
      (e) => {
        addCharacter(e, data, roll, npc);
      }
    "
  />
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import ClickIcon from "../../ClickIcon.vue";
import { InitiativeObjectEnums } from "../../../Interfaces/Enums";

export default defineComponent({
  name: "AddInitiative",
  components: { InputText, InputNumber, Button, ClickIcon },
  props: {
    addCharacter: { type: Function, required: true },
  },
  setup() {
    let data = reactive({
      characterName: "",
      initiativeModifier: 0,
      initiative: 0,
    });
    let roll = ref(false);
    let npc = ref(false);

    function handleChange(e: any, ObjectType: InitiativeObjectEnums) {
      switch (ObjectType) {
        case InitiativeObjectEnums.characterName:
          data.characterName = e;
          break;
        case InitiativeObjectEnums.initiative:
          data.initiative = e;
          break;
        case InitiativeObjectEnums.initiativeModifier:
          data.initiativeModifier = e;
          break;
      }
    }
    function updateRollForMe() {
      let rollElement = document.getElementById("roll");
      if (rollElement !== null) {
        if (rollElement.classList.contains("p-button-success")) {
          rollElement.classList.remove("p-button-success");
          rollElement.classList.add("p-button-help");
          roll.value = false;
        } else {
          rollElement.classList.add("p-button-success");
          rollElement.classList.remove("p-button-help");
          roll.value = true;
        }
      }
    }
    function updateNPC() {
      let NPCElement = document.getElementById("NPC");
      if (NPCElement !== null) {
        if (NPCElement.classList.contains("p-button-success")) {
          NPCElement.classList.remove("p-button-success");
          NPCElement.classList.add("p-button-help");
          npc.value = false;
        } else {
          NPCElement.classList.add("p-button-success");
          NPCElement.classList.remove("p-button-help");
          npc.value = true;
        }
      }
    }
    return {
      updateRollForMe,
      roll,
      data,
      InitiativeObjectEnums,
      handleChange,
      npc,
      updateNPC,
    };
  },
});
</script>

<style scoped>
.input-value {
  width: 15em;
  height: 2em;
}
</style>
