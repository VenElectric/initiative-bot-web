<template>
  <div v-if="!loading">
    <ToolBar>
      <template #end>
        <Button
          type="button"
          label="Add Spell"
          @click="toggle"
          class="p-button-sm"
        />
        <OverlayPanel ref="op" :showCloseIcon="true" :dismissable="true">
          <AddSpell :spellFunction="addSpell" />
        </OverlayPanel>
      </template>
    </ToolBar>
    <div class="spell-items">
      <h2>Spells</h2>
      <SpellRecord
        v-for="(item, index) in store.store.spells"
        :key="item.id"
        :spell="item"
        :index="index"
        :updateSpell="store.updateSpell"
        :characters="data.characterIds"
        class="my-2"
      ></SpellRecord>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, onMounted, reactive, Ref } from "vue";
import AddSpell from "./AddSpell.vue";
import { IStore } from "../../../data/types";
import { CharacterStatus } from "../../../Interfaces/initiative";
import Button from "primevue/button";
import OverlayPanel from "primevue/overlaypanel";
import ToolBar from "primevue/toolbar";
import SpellRecord from "./SpellRecord.vue";

export default defineComponent({
  name: "SpellList",
  components: {
    AddSpell,
    Button,
    OverlayPanel,
    ToolBar,
    SpellRecord,
  },
  setup() {
    const store = inject<IStore>("store");
    const loading = ref(true);
    const op = ref(null);
    const data = reactive({
      characterIds: [] as characterInterface[],
    });

    if (store === undefined) {
      throw new Error("Failed to inject store");
    }
    onMounted(() => {
      store.getInitialSpells();
      setTimeout(() => {
        loading.value = false;
        console.log(loading.value);
        for (let record of store.store.initiativeList) {
          data.characterIds.push({
            characterId: record.id,
            characterName: record.characterName,
          });
        }
      }, 500);
    });

    interface characterInterface {
      characterId: string;
      characterName: string;
    }

    function toggle(event: any) {
      (op.value as any).toggle(event);
    }

    function addSpell(event: any, data: any) {
      console.log(data);
      toggle(event);
      store?.addSpell(data);
    }
    return {
      store,
      loading,
      op,
      toggle,
      addSpell,
      data,
    };
  },
});
</script>

<style scoped>
.table-header {
  font-size: 2em;
}
.spell-items {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.spell-item {
  display: flex;
  justify-content: center;
  width: 100%;
  box-shadow: inset 0 1px 4px 0 rgba(77, 74, 74, 0.596),
    2px 1px 0 1px rgba(77, 74, 74, 0.247), -1px -1px 0 0 rgba(77, 74, 74, 0.247);
  border: 2px solid rgba(128, 128, 128, 0.555);
  background: linear-gradient(90deg, grey 0%, rgba(77, 74, 74, 0.247) 100%);
}
.spell-item:hover {
  border: 2px solid black;
}
.p-multiselect {
  width: 10vw;
}
</style>
