<template>
  <Toast />
  <Dialog v-model:visible="display" header="Turn Status" :closable="true">
    <h3>Current Turn: {{ currentName }}</h3>
    <div v-if="isArray" class="status-container">
      <div class="flex justify-content-evenly align-items-center">
        <h4>Spell name</h4>
        |
        <h4>Spell Effect</h4>
      </div>
      <hr />
      <div>
        <div v-for="status in statuses" :key="status.id">
          <div class="flex justify-content-evenly align-items-center">
            {{ status.spellName }} | {{ status.effectDescription }}
          </div>

          <hr />
        </div>
      </div>
    </div>
    <div v-else>No Status Effects</div>
  </Dialog>
</template>

<script lang="ts">
import { IStore } from "../../data/types";
import { defineComponent, inject, onMounted, ref } from "vue";
import { EmitTypes } from "../../Interfaces/EmitTypes";
import {
  CollectionTypes,
  InitiativeObjectEnums,
  SpellObjectEnums,
} from "../../Interfaces/ContextEnums";
import {
  CharacterStatusFirestore,
  InitiativeObject,
  ServerSpellObject,
  SpellObject,
} from "../../Interfaces/initiative";
import {
  isInitiativeObjectArray,
  isInitiativeObject,
  isSpellObject,
  isSpellObjectArray,
  isServerSpellObject,
  isServerObjectArray,
} from "../../Utils/TypeChecking";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import serverLogger from "../../Utils/LoggingClass";
import { LoggingTypes, ComponentEnums } from "../../Interfaces/LoggingTypes";

export default defineComponent({
  name: "SocketReceiver",
  components: { Dialog, Toast },
  setup() {
    const store = inject<IStore>("store");
    const socket = store?.store.socket;
    const display = ref(false);
    const currentName = ref();
    const statuses = ref();
    const isArray = ref();
    const toast = useToast();

    serverLogger(
      LoggingTypes.info,
      `Created, starting component`,
      ComponentEnums.SOCKETRECEIVER
    );

    if (store === undefined) {
      serverLogger(
        LoggingTypes.alert,
        `Failed to inject store`,
        ComponentEnums.SOCKETRECEIVER
      );
      throw new Error('Failed to inject "updateScore"');
    }
    onMounted(() => {
      serverLogger(
        LoggingTypes.info,
        `OnMounted, sockets`,
        ComponentEnums.SOCKETRECEIVER
      );
      socket?.on(EmitTypes.UPDATE_SESSION, (isSorted: boolean) => {
        serverLogger(
          LoggingTypes.debug,
          `${EmitTypes.UPDATE_SESSION} Updating isSorted: ${isSorted}`,
          ComponentEnums.SOCKETRECEIVER
        );
        try {
          store.updateSorted(isSorted);
        } catch (error) {
          if (error instanceof Error) {
            serverLogger(
              LoggingTypes.alert,
              error.message,
              ComponentEnums.SOCKETRECEIVER
            );
          }
        }
      });
      socket?.on(EmitTypes.CREATE_NEW_INITIATIVE, (data: InitiativeObject) => {
        serverLogger(
          LoggingTypes.info,
          `${EmitTypes.CREATE_NEW_INITIATIVE} Adding initiative`,
          ComponentEnums.SOCKETRECEIVER,
          data.id
        );
        serverLogger(
          LoggingTypes.debug,
          `${EmitTypes.CREATE_NEW_INITIATIVE} creating initiative object`,
          ComponentEnums.SOCKETRECEIVER,
          data.id
        );
        if (store.store.isSorted) {
          toast.add({
            severity: "warn",
            summary: "Warning Message",
            detail:
              "Initiative has been reset. Please click Round Start to resort.",
            life: 3000,
          });
        }
        serverLogger(
          LoggingTypes.info,
          `${EmitTypes.CREATE_NEW_INITIATIVE} toast added`,
          ComponentEnums.SOCKETRECEIVER,
          data.id
        );
        if (isInitiativeObject(data)) {
          serverLogger(
            LoggingTypes.debug,
            `${EmitTypes.CREATE_NEW_INITIATIVE} changing isCurrent to false for all initiative`,
            ComponentEnums.SOCKETRECEIVER,
            data.id
          );
          try {
            store.alltoFalse();
            store.store.initiativeList.push(data);
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.CREATE_NEW_INITIATIVE} added initiative to list`,
              ComponentEnums.SOCKETRECEIVER,
              data.id
            );
          } catch (error) {
            if (error instanceof Error) {
              serverLogger(
                LoggingTypes.alert,
                `${error.message} at ${EmitTypes.CREATE_NEW_INITIATIVE}`,
                ComponentEnums.SOCKETRECEIVER
              );
            }
          }
        }
      });
      socket?.on(EmitTypes.CREATE_NEW_SPELL, (data: ServerSpellObject) => {
        if (isServerSpellObject(data)) {
          serverLogger(
            LoggingTypes.debug,
            `${EmitTypes.CREATE_NEW_SPELL} creating spell object`,
            ComponentEnums.SOCKETRECEIVER,
            data.id
          );
          try {
            const serverObject: SpellObject = {
              effectName: data.effectName,
              effectDescription: data.effectDescription,
              id: data.id,
              durationTime: data.durationTime,
              durationType: data.durationType,
              characterIds: [],
            };
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.CREATE_NEW_SPELL} changing characterids to double array`,
              ComponentEnums.SOCKETRECEIVER,
              data.id
            );
            serverObject.characterIds = store.spellsDoubleArray(
              data.characterIds
            );
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.CREATE_NEW_SPELL} adding spell object to store`,
              ComponentEnums.SOCKETRECEIVER,
              data.id
            );
            store.store.spells.push(serverObject);
            serverLogger(
              LoggingTypes.info,
              `${EmitTypes.CREATE_NEW_SPELL} spell object added`,
              ComponentEnums.SOCKETRECEIVER,
              data.id
            );
            return;
          } catch (error) {
            if (error instanceof Error) {
              serverLogger(
                LoggingTypes.alert,
                `${error.message} at ${EmitTypes.CREATE_NEW_SPELL}`,
                ComponentEnums.SOCKETRECEIVER
              );
            }
          }
        }
      });
      socket?.on(
        EmitTypes.UPDATE_ALL_INITIATIVE,
        (data: { payload: InitiativeObject[]; isSorted: boolean }) => {
          if (data.payload.length < 1) {
            return;
          }
          serverLogger(
            LoggingTypes.info,
            `${EmitTypes.UPDATE_ALL_INITIATIVE} updating all initiative`,
            ComponentEnums.SOCKETRECEIVER,
            data.payload[0].id
          );
          try {
            if (isInitiativeObjectArray(data)) {
              store.updateAll(CollectionTypes.INITIATIVE, data.payload);
              serverLogger(
                LoggingTypes.info,
                `${EmitTypes.UPDATE_ALL_INITIATIVE} update complete`,
                ComponentEnums.SOCKETRECEIVER,
                data.payload[0].id
              );
            }
            if (data.isSorted !== undefined) {
              serverLogger(
                LoggingTypes.info,
                `${EmitTypes.UPDATE_ALL_INITIATIVE} updating isSorted`,
                ComponentEnums.SOCKETRECEIVER,
                data.payload[0].id
              );
              serverLogger(
                LoggingTypes.info,
                `${EmitTypes.UPDATE_ALL_INITIATIVE} store.isSorted ${store.store.isSorted}`,
                ComponentEnums.SOCKETRECEIVER,
                data.payload[0].id
              );
              store.updateSorted(data.isSorted);
              serverLogger(
                LoggingTypes.info,
                `${EmitTypes.UPDATE_ALL_INITIATIVE} isSorted updated: ${data.isSorted}`,
                ComponentEnums.SOCKETRECEIVER,
                data.payload[0].id
              );
              return;
            }
          } catch (error) {
            if (error instanceof Error) {
              serverLogger(
                LoggingTypes.alert,
                `${error.message} at ${EmitTypes.UPDATE_ALL_INITIATIVE}`,
                ComponentEnums.SOCKETRECEIVER
              );
            }
          }
        }
      );
      socket?.on(EmitTypes.UPDATE_ALL_SPELL, (data: ServerSpellObject[]) => {
        if (data.length < 1) {
          return;
        }
        if (isServerObjectArray(data)) {
          serverLogger(
            LoggingTypes.debug,
            `${EmitTypes.UPDATE_ALL_SPELL} creating spell object`,
            ComponentEnums.SOCKETRECEIVER,
            data[0].id
          );
          try {
            let spellsArray = [] as SpellObject[];
            data.forEach((item: ServerSpellObject, index) => {
              let characterIds = store.spellsDoubleArray(item.characterIds);
              spellsArray.push({
                effectName: item.effectName,
                effectDescription: item.effectDescription,
                characterIds: characterIds,
                id: item.id,
                durationTime: item.durationTime,
                durationType: item.durationType,
              });
              serverLogger(
                LoggingTypes.debug,
                `${EmitTypes.UPDATE_ALL_SPELL} spell object added`,
                ComponentEnums.SOCKETRECEIVER,
                item.id
              );
            });
            store.updateAll(CollectionTypes.SPELLS, spellsArray);
            serverLogger(
              LoggingTypes.info,
              `${EmitTypes.UPDATE_ALL_SPELL} update complete`,
              ComponentEnums.SOCKETRECEIVER,
              data[0].id
            );
            return;
          } catch (error) {
            if (error instanceof Error) {
              serverLogger(
                LoggingTypes.alert,
                `${error.message} at ${EmitTypes.UPDATE_ALL_SPELL}`,
                ComponentEnums.SOCKETRECEIVER
              );
            }
          }
        }
      });
      socket?.on(
        EmitTypes.UPDATE_RECORD_INITIATIVE,
        (data: InitiativeObject) => {
          serverLogger(
            LoggingTypes.info,
            `${EmitTypes.UPDATE_RECORD_INITIATIVE} updating`,
            ComponentEnums.SOCKETRECEIVER,
            data.id
          );
          try {
            if (isInitiativeObject(data)) {
              serverLogger(
                LoggingTypes.debug,
                `${EmitTypes.UPDATE_RECORD_INITIATIVE} updating initiative`,
                ComponentEnums.SOCKETRECEIVER,
                data.id
              );
              store.updateCharacterRecord(data, false);
              serverLogger(
                LoggingTypes.debug,
                `${EmitTypes.UPDATE_RECORD_INITIATIVE}  update complete`,
                ComponentEnums.SOCKETRECEIVER
              );
              return;
            }
          } catch (error) {
            if (error instanceof Error) {
              serverLogger(
                LoggingTypes.alert,
                `${error.message} at ${EmitTypes.UPDATE_RECORD_INITIATIVE}`,
                ComponentEnums.SOCKETRECEIVER
              );
            }
          }
        }
      );
      socket?.on(EmitTypes.UPDATE_RECORD_SPELL, (data: SpellObject) => {
        try {
          if (isServerSpellObject(data)) {
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.UPDATE_RECORD_SPELL} creating spell object`,
              ComponentEnums.SOCKETRECEIVER,
              data.id
            );
            const characterIds = store.spellsDoubleArray(data.characterIds);
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.UPDATE_RECORD_SPELL} characterIds complete`,
              ComponentEnums.SOCKETRECEIVER,
              data.id
            );
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.UPDATE_RECORD_SPELL} updating spells`,
              ComponentEnums.SOCKETRECEIVER,
              data.id
            );
            const spellIndex = store.store.spells
              .map((spell: SpellObject) => spell.id)
              .indexOf(data.id);
            store.updateSpell(
              data.effectName,
              data.effectDescription,
              data.durationTime,
              data.durationType,
              spellIndex,
              false,
              characterIds
            );
            serverLogger(
              LoggingTypes.info,
              `${EmitTypes.UPDATE_RECORD_SPELL} update complete`,
              ComponentEnums.SOCKETRECEIVER,
              data.id
            );
          }
        } catch (error) {
          if (error instanceof Error) {
            serverLogger(
              LoggingTypes.alert,
              `${error.message} at ${EmitTypes.UPDATE_RECORD_SPELL}`,
              ComponentEnums.SOCKETRECEIVER
            );
          }
        }
      });
      socket?.on(
        EmitTypes.UPDATE_ITEM_INITIATIVE,
        (data: {
          toUpdate: any;
          ObjectType: InitiativeObjectEnums;
          docId: string;
        }) => {
          serverLogger(
            LoggingTypes.info,
            `${EmitTypes.UPDATE_ITEM_INITIATIVE} updating`,
            ComponentEnums.SOCKETRECEIVER,
            data.docId
          );
          try {
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.UPDATE_ITEM_INITIATIVE} item to update: ${data.ObjectType} value: ${data.toUpdate}`,
              ComponentEnums.SOCKETRECEIVER,
              data.docId
            );
            const initIndex = store.store.initiativeList
              .map((record: InitiativeObject) => record.id)
              .indexOf(data.docId);
            store.updateCharacterItem(
              data.ObjectType,
              data.toUpdate,
              initIndex,
              false
            );
            serverLogger(
              LoggingTypes.info,
              `${EmitTypes.UPDATE_ITEM_INITIATIVE} update complete`,
              ComponentEnums.SOCKETRECEIVER,
              data.docId
            );
            return;
          } catch (error) {
            if (error instanceof Error) {
              serverLogger(
                LoggingTypes.alert,
                `${error.message} at ${EmitTypes.UPDATE_ITEM_INITIATIVE}`,
                ComponentEnums.SOCKETRECEIVER
              );
            }
          }
        }
      );
      socket?.on(
        EmitTypes.UPDATE_ITEM_SPELL,
        (data: {
          toUpdate: any;
          ObjectType: SpellObjectEnums;
          docId: string;
        }) => {
          try {
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.UPDATE_ITEM_SPELL} item to update: ${data.ObjectType} value: ${data.toUpdate}`,
              ComponentEnums.SOCKETRECEIVER,
              data.docId
            );
            const spellIndex = store.store.spells
              .map((spell: SpellObject) => spell.id)
              .indexOf(data.docId);
            store.updateSpellItem(data.ObjectType, data.toUpdate, spellIndex);
            serverLogger(
              LoggingTypes.info,
              `${EmitTypes.UPDATE_ITEM_SPELL} update complete`,
              ComponentEnums.SOCKETRECEIVER,
              data.docId
            );
          } catch (error) {
            if (error instanceof Error) {
              serverLogger(
                LoggingTypes.alert,
                `${error.message} at ${EmitTypes.UPDATE_ITEM_SPELL}`,
                ComponentEnums.SOCKETRECEIVER
              );
            }
          }
        }
      );
      socket?.on(EmitTypes.DELETE_ONE_INITIATIVE, (docId: string) => {
        serverLogger(
          LoggingTypes.info,
          `${EmitTypes.DELETE_ONE_INITIATIVE} deleting`,
          ComponentEnums.SOCKETRECEIVER,
          docId
        );

        try {
          serverLogger(
            LoggingTypes.debug,
            `${EmitTypes.DELETE_ONE_INITIATIVE} deleting initiative`,
            ComponentEnums.SOCKETRECEIVER,
            docId
          );
          const initIndex = store.store.initiativeList
            .map((record: InitiativeObject) => record.id)
            .indexOf(docId);
          store.removeCharacter(initIndex, docId, false);
          toast.add({
            severity: "warn",
            summary: "Warning Message",
            detail:
              "Initiative has been reset. Please click Round Start to Resort.",
            life: 3000,
          });
          serverLogger(
            LoggingTypes.info,
            `${EmitTypes.DELETE_ONE_INITIATIVE} toast added, init deletion completed`,
            ComponentEnums.SOCKETRECEIVER,
            docId
          );
          return;
        } catch (error) {
          if (error instanceof Error) {
            serverLogger(
              LoggingTypes.alert,
              `${error.message} at ${EmitTypes.DELETE_ONE_INITIATIVE}`,
              ComponentEnums.SOCKETRECEIVER
            );
          }
        }
      });
      socket?.on(EmitTypes.DELETE_ONE_SPELL, (docId: string) => {
        try {
          const spellIndex = store.store.spells
            .map((spell: SpellObject) => spell.id)
            .indexOf(docId);
          if (spellIndex < 0) {
            serverLogger(
              LoggingTypes.warning,
              `${EmitTypes.DELETE_ONE_SPELL} Doc ID not found. Most likely sending over a deleted object or initiative object ${docId}`,
              ComponentEnums.SOCKETRECEIVER,
              docId
            );
          }
          store.removeSpell(spellIndex, docId, false);
          serverLogger(
            LoggingTypes.info,
            `${EmitTypes.DELETE_ONE_SPELL} spell deletion completed`,
            ComponentEnums.SOCKETRECEIVER,
            docId
          );
        } catch (error) {
          if (error instanceof Error) {
            serverLogger(
              LoggingTypes.alert,
              `${error.message} at ${EmitTypes.DELETE_ONE_SPELL}`,
              ComponentEnums.SOCKETRECEIVER
            );
          }
        }
      });
      socket?.on(EmitTypes.DELETE_ALL_INITIATIVE, () => {
        try {
          store.resetInitiative(false);
          toast.add({
            severity: "warn",
            summary: "Warning Message",
            detail: "Rounds have been reset.",
            life: 3000,
          });
          serverLogger(
            LoggingTypes.info,
            `${EmitTypes.DELETE_ALL_INITIATIVE} reset complete`,
            ComponentEnums.SOCKETRECEIVER
          );
        } catch (error) {
          if (error instanceof Error) {
            serverLogger(
              LoggingTypes.alert,
              `${error.message} at ${EmitTypes.DELETE_ALL_INITIATIVE}`,
              ComponentEnums.SOCKETRECEIVER
            );
          }
        }
      });
      socket?.on(EmitTypes.DELETE_ALL_SPELL, () => {
        try {
          store.resetSpells(false);
          toast.add({
            severity: "warn",
            summary: "Warning Message",
            detail: "Spells have been reset.",
            life: 3000,
          });
          serverLogger(
            LoggingTypes.info,
            `${EmitTypes.DELETE_ALL_SPELL} reset complete`,
            ComponentEnums.SOCKETRECEIVER
          );
        } catch (error) {
          if (error instanceof Error) {
            serverLogger(
              LoggingTypes.alert,
              `${error.message} at ${EmitTypes.DELETE_ALL_SPELL}`,
              ComponentEnums.SOCKETRECEIVER
            );
          }
        }
      });
      socket?.on(EmitTypes.NEXT, (record: InitiativeObject) => {
        try {
          serverLogger(
            LoggingTypes.info,
            `${EmitTypes.NEXT} next initiated`,
            ComponentEnums.SOCKETRECEIVER,
            record.id
          );
          store.updateCharacterRecord(record, true);
          serverLogger(
            LoggingTypes.debug,
            `${EmitTypes.NEXT} update record complete`,
            ComponentEnums.SOCKETRECEIVER,
            record.id
          );
          currentName.value = record.characterName;
          if (record.statusEffects.length >= 1) {
            statuses.value = record.statusEffects;
            isArray.value = true;
          } else {
            isArray.value = false;
          }
          display.value = true;
          serverLogger(
            LoggingTypes.info,
            `${EmitTypes.NEXT} modal launched`,
            ComponentEnums.SOCKETRECEIVER,
            record.id
          );
        } catch (error) {
          if (error instanceof Error) {
            serverLogger(
              LoggingTypes.alert,
              `${error.message} at ${EmitTypes.NEXT}`,
              ComponentEnums.SOCKETRECEIVER
            );
          }
        }
      });
      socket?.on(EmitTypes.PREVIOUS, (record: InitiativeObject) => {
        try {
          serverLogger(
            LoggingTypes.info,
            `${EmitTypes.PREVIOUS} previous initiated`,
            ComponentEnums.SOCKETRECEIVER,
            record.id
          );
          store.updateCharacterRecord(record, true);
          serverLogger(
            LoggingTypes.info,
            `${EmitTypes.PREVIOUS} update complete`,
            ComponentEnums.SOCKETRECEIVER,
            record.id
          );
          currentName.value = record.characterName;
          if (record.statusEffects.length >= 1) {
            statuses.value = record.statusEffects;
            isArray.value = true;
          } else {
            isArray.value = false;
          }
          display.value = true;
          serverLogger(
            LoggingTypes.info,
            `${EmitTypes.PREVIOUS} modal launched`,
            ComponentEnums.SOCKETRECEIVER,
            record.id
          );
        } catch (error) {
          if (error instanceof Error) {
            serverLogger(
              LoggingTypes.alert,
              `${error.message} at ${EmitTypes.PREVIOUS}`,
              ComponentEnums.SOCKETRECEIVER
            );
          }
        }
      });
    });
    socket?.on(EmitTypes.ROUND_START, () => {
      toast.add({
        severity: "info",
        summary: "Round Start",
        detail: "Initiative has been sorted. Rounds have started.",
        life: 3000,
      });
    });
    return { display, currentName, statuses, isArray };
  },
});
</script>

<style scoped>
.status-container {
  display: flex;
  flex-direction: column;
  align-content: center;
  width: 10vw;
}
</style>
