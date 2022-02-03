<template>
  <Toast />
  <div v-if="!loading">
    <div>
      <ToolBar>
        <template #start>
          <div v-if="!store.store.isSorted">
            <Button
              label="Start Rounds"
              class="p-button-sm p-button-info"
              @click="store.roundStart"
            ></Button>
          </div>
          <div v-else class="btn-cage">
            <Button
              label="Sort"
              class="p-button-sm p-button-info"
              @click="store.reSort"
            />
            <Button
              label="Previous"
              class="p-button-sm p-button-info"
              @click="store.previousTurn"
            />
            <Button
              label="Next"
              class="p-button-sm p-button-info"
              @click="store.nextTurn"
            />
          </div>
        </template>
        <template #end>
          <Button
            type="button"
            label="Add Initiative"
            @click="toggle"
            class="p-button-sm"
          />
          <OverlayPanel ref="op" :showCloseIcon="true" :dismissable="true">
            <AddInitiative :addCharacter="addCharacter" />
          </OverlayPanel>
        </template>
      </ToolBar>
      <SortableList :initiativeList="store.store.initiativeList">
        <template v-slot:default="record">
          <InitiativeRecordHeader
            :reRoll="store.reRoll"
            :record="record.item"
            :updateCharacter="store.updateCharacterItem"
            :removeCharacter="store.removeCharacter"
            :index="record.index"
            :isCurrent="store.setCurrent"
          ></InitiativeRecordHeader>
        </template>
      </SortableList>
    </div>
  </div>
  <div class="record" v-else>
    <Skeleton width="100%" height="2rem" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, inject, watch } from "vue";
import InitiativeRecordHeader from "./InitiativeRecordHeader.vue";
import OverlayPanel from "primevue/overlaypanel";
import AddInitiative from "./AddInitiative.vue";
import ToolBar from "primevue/toolbar";
import Button from "primevue/button";
import Skeleton from "primevue/skeleton";
import { IStore, Character } from "../../../data/types";
import SortableList from "./SortableList.vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import serverLogger from "../../../Utils/LoggingClass";
import { LoggingTypes, ComponentEnums } from "../../../Interfaces/LoggingTypes";

export default defineComponent({
  name: "InitiativeState",
  components: {
    AddInitiative,
    OverlayPanel,
    ToolBar,
    Button,
    Skeleton,
    SortableList,
    InitiativeRecordHeader,
    Toast,
  },
  setup() {
    const store = inject<IStore>("store");
    const loading = ref(true);
    const isSorted = ref();
    const toast = useToast();
    let op = ref(null);
    if (store === undefined) {
      serverLogger(
        LoggingTypes.alert,
        `Failed to inject store`,
        ComponentEnums.INITIATIVESTATE
      );
      throw new Error("Failed to inject store");
    }

    onMounted(() => {
      store.getInitial();
      isSorted.value = store.store.isSorted;
      serverLogger(
        LoggingTypes.info,
        `retrieved initial init state`,
        ComponentEnums.INITIATIVESTATE
      );
      setTimeout(() => {
        loading.value = false;
        serverLogger(
          LoggingTypes.info,
          `loading complete`,
          ComponentEnums.INITIATIVESTATE
        );
      }, 500);
    });

    watch(
      () => store.store.isSorted,
      () => {
        serverLogger(
          LoggingTypes.debug,
          `watch triggered: issorted`,
          ComponentEnums.INITIATIVESTATE
        );
        isSorted.value = store.store.isSorted;
      },
      { deep: true }
    );

    function toggle(event: any) {
      (op.value as any).toggle(event);
    }

    function addCharacter(
      e: any,
      data: Character,
      roll: boolean,
      npc: boolean
    ) {
      // toggle add menu off
      toggle(e);
      serverLogger(
        LoggingTypes.info,
        `adding toast and adding character`,
        ComponentEnums.INITIATIVESTATE
      );
      toast.add({
        severity: "info",
        summary: "Info Message",
        detail: `Adding ${data.characterName} to the list.`,
        life: 3000,
      });
      try {
        store?.addCharacter(data, roll, npc);
        serverLogger(
          LoggingTypes.info,
          `adding toast and adding character`,
          ComponentEnums.INITIATIVESTATE
        );
      } catch (error) {
        if (error instanceof Error) {
          serverLogger(
            LoggingTypes.alert,
            error.message,
            ComponentEnums.INITIATIVESTATE
          );
        }
      }
    }
    return {
      loading,
      store,
      toggle,
      op,
      addCharacter,
    };
  },
});
</script>

<style scoped>
.record {
  width: 100%;
  border: 2px solid black;
}
.current {
  box-shadow: inset 0 1px 4px 0 rgba(0, 255, 21, 0.596);
}
.btn-cage {
  display: flex;
  justify-content: space-between;
}
</style>
