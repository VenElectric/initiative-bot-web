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
              {{ record.item.characterName }}
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
          ></AddSpell
        ></OverlayPanel>
      </div>
    </div>
    <hr />
  </div>
</template>

<script lang="ts">
import { CharacterStatus, SpellObject } from "../../../Interfaces/initiative";
import { IStore } from "../../../data/types";
import {
  defineComponent,
  ref,
  PropType,
  inject,
  reactive,
  onMounted,
} from "vue";
import Divider from "primevue/divider";
import Button from "primevue/button";
import OverlayPanel from "primevue/overlaypanel";
import PickList, { PickListMoveAllToSourceEvent } from "primevue/picklist";
import AddSpell from "./AddSpell.vue";

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
    console.info(props.index);
    const multiRef = ref(null);
    const store = inject<IStore>("store");
    const spellModel = ref(props.spell.characterIds);
    const op = ref(null);
    const updateRef = ref(null);

    console.log(props.spell);

    if (store === undefined) {
      throw new Error("Failed to inject store");
    }

    function toggle(event: any) {
      (op.value as any).toggle(event);
    }

    function toggleUpdate(event: any) {
      (updateRef.value as any).toggle(event);
    }

    function handleClose(event: any, data: any) {
      toggleUpdate(event);
      store?.updateSpell(data);
    }
    return {
      multiRef,
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
