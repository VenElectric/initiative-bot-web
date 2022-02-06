<template>
  <div v-if="!loading">
    <Toast />
    <ConfirmPopup></ConfirmPopup>
    <ToolBar>
      <template #start>
        <Button
          type="button"
          label="Clear Spells"
          @click="(e) => confirm1(e)"
          class="p-button-sm"
        />
      </template>
      <template #end>
        <Button
          type="button"
          label="Add Spell"
          @click="toggle"
          class="p-button-sm"
        />
        <OverlayPanel ref="op" :showCloseIcon="true" :dismissable="true">
          <AddSpell :spellFunction="addSpell" :isUpdate="false" />
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
import { defineComponent, inject, ref, onMounted, reactive } from "vue";
import AddSpell from "./AddSpell.vue";
import { IStore } from "../../../data/types";
import Button from "primevue/button";
import OverlayPanel from "primevue/overlaypanel";
import ToolBar from "primevue/toolbar";
import SpellRecord from "./SpellRecord.vue";
import serverLogger from "../../../Utils/LoggingClass";
import { LoggingTypes, ComponentEnums } from "../../../Interfaces/LoggingTypes";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import ConfirmPopup from "primevue/confirmpopup";
import Toast from "primevue/toast";

export default defineComponent({
  name: "SpellList",
  components: {
    AddSpell,
    Button,
    OverlayPanel,
    ToolBar,
    SpellRecord,
    Toast,
    ConfirmPopup,
  },
  setup() {
    interface CharacterInterface {
      characterId: string;
      characterName: string;
    }
    const store = inject<IStore>("store");
    const loading = ref(true);
    const op = ref(null);
    const data = reactive({
      characterIds: [] as CharacterInterface[],
    });
    const confirm = useConfirm();
    const toast = useToast();

    if (store === undefined) {
      serverLogger(
        LoggingTypes.alert,
        `Failed to inject store`,
        ComponentEnums.SPELLSTATE
      );
      throw new Error("Failed to inject store");
    }
    onMounted(() => {
      store.getInitialSpells();
      serverLogger(
        LoggingTypes.info,
        `spells retrieved`,
        ComponentEnums.SPELLSTATE
      );
      setTimeout(() => {
        loading.value = false;
        serverLogger(
          LoggingTypes.info,
          `adding characterids`,
          ComponentEnums.SPELLSTATE
        );
        for (let record of store.store.initiativeList) {
          data.characterIds.push({
            characterId: record.id,
            characterName: record.characterName,
          });
        }
      }, 500);
    });

    function toggle(event: any) {
      (op.value as any).toggle(event);
    }

    function addSpell(event: any, data: any) {
      toggle(event);
      serverLogger(
        LoggingTypes.info,
        `adding new spell`,
        ComponentEnums.SPELLSTATE
      );
      store?.addSpell(data);
    }

    const confirm1 = (event: any) => {
      confirm.require({
        target: event.currentTarget,
        message: "Are you sure you want to proceed?",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          serverLogger(
            LoggingTypes.debug,
            `Adding toast and resetting spells`,
            ComponentEnums.SPELLSTATE
          );
          store.resetSpells(true);
          toast.add({
            severity: "info",
            summary: "Confirmed",
            detail: "Spell Reset Accepted",
            life: 3000,
          });
        },
        reject: () => {
          serverLogger(
            LoggingTypes.debug,
            `Adding toast, rejected confirmation to reset spells`,
            ComponentEnums.SPELLSTATE
          );
          toast.add({
            severity: "error",
            summary: "Rejected",
            detail: "Spells Not Reset",
            life: 3000,
          });
        },
      });
    };
    return {
      store,
      loading,
      op,
      toggle,
      addSpell,
      data,
      confirm1,
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
