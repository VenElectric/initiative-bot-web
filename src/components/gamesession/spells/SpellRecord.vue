<template>
  <div class="include-hr my-2">
    <div class="spell-row">
      <div>{{ spell.effectName }}</div>
      <div>|</div>
      <div>{{ `${spell.durationTime} ${spell.durationType}` }}</div>
      <div>|</div>
      <div>
        <Button
          type="button"
          label="Targets"
          @click="toggle"
          class="p-button-sm"
        />
        <OverlayPanel ref="op" :showCloseIcon="true" :dismissable="true">
          <PickList
            v-model="spellModel"
            dataKey="characterId"
            @move-all-to-source="
              () => store.changeAllCharacterStatus(index, `source`)
            "
            @move-all-to-target="
              () => store.changeAllCharacterStatus(index, `target`)
            "
            @move-to-source="
              (e) => store.changeOneCharacterStatus(e, index, `source`)
            "
            @move-to-target="
              (e) => store.changeOneCharacterStatus(e, index, `target`)
            "
            :responsive="true"
            style="font-size: 0.8em"
          >
            <template #sourceheader> Characters Not Affected </template>
            <template #targetheader> Affected Characters </template>
            <template #item="record">
              <div :key="record.index">{{ record.item.characterName }}</div>
            </template>
          </PickList>
        </OverlayPanel>
      </div>
      <div>|</div>
      <div>
        <Button icon="pi pi-pencil" @click="toggleUpdate" />
        <OverlayPanel ref="updateRef" :showCloseIcon="true" :dismissable="true"
          ><AddSpell
            :spellFunction="handleClose"
            :spell="spell"
            :index="index"
            :isUpdate="true"
          ></AddSpell
        ></OverlayPanel>
      </div>
      <div>|</div>
      <div>
        <span
          class="pi pi-trash p-mr-auto trash-icon"
          @click.prevent="
            (event) => {
              event.stopPropagation();
              store.removeSpell(index, spell.id, true);
            }
          "
        ></span>
      </div>
    </div>
    <hr />
  </div>
</template>

<script lang="ts">
import { SpellObject } from "../../../Interfaces/initiative";
import { IStore } from "../../../data/types";
import { defineComponent, ref, PropType, inject, watch } from "vue";
import Button from "primevue/button";
import OverlayPanel from "primevue/overlaypanel";
import PickList from "primevue/picklist";
import AddSpell from "./AddSpell.vue";
import serverLogger from "../../../Utils/LoggingClass";
import { LoggingTypes, ComponentEnums } from "../../../Interfaces/LoggingTypes";

export default defineComponent({
  name: "SpellRecord",
  components: { Button, OverlayPanel, PickList, AddSpell },
  props: {
    spell: { type: Object as PropType<SpellObject>, required: true },
    index: { type: Number, required: true },
    updateSpell: { type: Function, required: true },
    characters: {
      type: Array as PropType<{ characterId: string; characterName: string }[]>,
      required: true,
    },
  },
  setup(props) {
    const store = inject<IStore>("store");
    const spellModel = ref(props.spell.characterIds);
    const op = ref(null);
    const updateRef = ref(null);

    if (store === undefined) {
      serverLogger(
        LoggingTypes.alert,
        `failed to inject store`,
        ComponentEnums.SPELLRECORD
      );
      throw new Error("Failed to inject store");
    }

    watch(
      () => props.spell.characterIds,
      () => {
        serverLogger(
          LoggingTypes.debug,
          `watch triggered: characterIds`,
          ComponentEnums.SPELLRECORD
        );
        spellModel.value = props.spell.characterIds;
      },
      { deep: true }
    );

    function toggle(event: any) {
      (op.value as any).toggle(event);
    }

    function toggleUpdate(event: any) {
      (updateRef.value as any).toggle(event);
    }

    function handleClose(event: any, data: any) {
      serverLogger(
        LoggingTypes.info,
        `updating spell record`,
        ComponentEnums.SPELLRECORD,
        props.spell.id
      );
      toggleUpdate(event);
      store?.updateSpell(
        data.effectName,
        data.effectDescription,
        data.durationTime,
        data.durationType,
        data.index,
        true
      );
    }
    return {
      store,
      spellModel,
      op,
      toggle,
      toggleUpdate,
      updateRef,
      handleClose,
    };
  },
});
</script>

<style scoped>
.spell-row {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
}
.include-hr {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}
hr {
  width: 100%;
}
</style>
