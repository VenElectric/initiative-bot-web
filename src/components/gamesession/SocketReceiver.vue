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

    type ReceiveDataArray = {
      collectionType: CollectionTypes;
      payload: InitiativeObject[] | ServerSpellObject[];
      isSorted?: boolean;
    };

    type ReceiveDataObject = {
      collectionType: CollectionTypes;
      payload: InitiativeObject | SpellObject | ServerSpellObject;
    };
    type UpdateItemObject = {
      collectionType: CollectionTypes;
      payload: {
        toUpdate: any;
        ObjectType: SpellObjectEnums | InitiativeObjectEnums;
        docId: string;
      };
    };
    type DeleteOneObject = {
      collectionType: CollectionTypes;
      id: string;
    };

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
        store.updateSorted(isSorted);
      });
      socket?.on(EmitTypes.CREATE_NEW, (data: ReceiveDataObject) => {
        serverLogger(
          LoggingTypes.info,
          `${EmitTypes.CREATE_NEW} Adding ${data.collectionType}`,
          ComponentEnums.SOCKETRECEIVER,
          data.payload.id
        );
        if (data.collectionType === CollectionTypes.SPELLS) {
          if (isServerSpellObject(data.payload)) {
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.CREATE_NEW} creating spell object`,
              ComponentEnums.SOCKETRECEIVER,
              data.payload.id
            );
            const serverObject: SpellObject = {
              effectName: data.payload.effectName,
              effectDescription: data.payload.effectDescription,
              id: data.payload.id,
              durationTime: data.payload.durationTime,
              durationType: data.payload.durationType,
              characterIds: [],
            };
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.CREATE_NEW} changing characterids to double array`,
              ComponentEnums.SOCKETRECEIVER,
              data.payload.id
            );
            serverObject.characterIds = store.spellsDoubleArray(
              data.payload.characterIds
            );
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.CREATE_NEW} adding spell object to store`,
              ComponentEnums.SOCKETRECEIVER,
              data.payload.id
            );
            store.store.spells.push(serverObject);
            serverLogger(
              LoggingTypes.info,
              `${EmitTypes.CREATE_NEW} spell object added`,
              ComponentEnums.SOCKETRECEIVER,
              data.payload.id
            );
            return;
          }
        }
        if (data.collectionType === CollectionTypes.INITIATIVE) {
          serverLogger(
            LoggingTypes.debug,
            `${EmitTypes.CREATE_NEW} creating initiative object`,
            ComponentEnums.SOCKETRECEIVER,
            data.payload.id
          );
          toast.add({
            severity: "warn",
            summary: "Warning Message",
            detail:
              "Initiative has been reset. Please click Round Start to Resort.",
            life: 3000,
          });
          serverLogger(
            LoggingTypes.info,
            `${EmitTypes.CREATE_NEW} toast added`,
            ComponentEnums.SOCKETRECEIVER,
            data.payload.id
          );
          if (isInitiativeObject(data.payload)) {
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.CREATE_NEW} changing isCurrent to false for all initiative`,
              ComponentEnums.SOCKETRECEIVER,
              data.payload.id
            );
            store.alltoFalse();
            store.store.initiativeList.push(data.payload);
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.CREATE_NEW} added initiative to list`,
              ComponentEnums.SOCKETRECEIVER,
              data.payload.id
            );
          }
        }
      });
      socket?.on(EmitTypes.UPDATE_ALL, (data: ReceiveDataArray) => {
        if (data.payload.length < 1) {
          return;
        }
        serverLogger(
          LoggingTypes.info,
          `${EmitTypes.UPDATE_ALL} updating all ${data.collectionType}`,
          ComponentEnums.SOCKETRECEIVER,
          data.payload[0].id
        );
        if (data.collectionType === CollectionTypes.INITIATIVE) {
          if (isInitiativeObjectArray(data.payload)) {
            store.updateAll(CollectionTypes.INITIATIVE, data.payload);
            serverLogger(
              LoggingTypes.info,
              `${EmitTypes.UPDATE_ALL} update complete ${data.collectionType}`,
              ComponentEnums.SOCKETRECEIVER,
              data.payload[0].id
            );
          }
          if (data.isSorted !== undefined) {
            serverLogger(
              LoggingTypes.info,
              `${EmitTypes.UPDATE_ALL} updating isSorted ${data.collectionType}`,
              ComponentEnums.SOCKETRECEIVER,
              data.payload[0].id
            );
            serverLogger(
              LoggingTypes.info,
              `${EmitTypes.UPDATE_ALL} store.isSorted ${store.store.isSorted}`,
              ComponentEnums.SOCKETRECEIVER,
              data.payload[0].id
            );
            store.updateSorted(data.isSorted);
            serverLogger(
              LoggingTypes.info,
              `${EmitTypes.UPDATE_ALL} isSorted updated: ${data.isSorted}`,
              ComponentEnums.SOCKETRECEIVER,
              data.payload[0].id
            );
          }
          return;
        }
        if (data.collectionType === CollectionTypes.SPELLS) {
          if (isServerObjectArray(data.payload)) {
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.UPDATE_ALL} creating spell object`,
              ComponentEnums.SOCKETRECEIVER,
              data.payload[0].id
            );
            let spellsArray = [] as SpellObject[];
            data.payload.forEach((item: ServerSpellObject, index) => {
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
                `${EmitTypes.UPDATE_ALL} spell object added`,
                ComponentEnums.SOCKETRECEIVER,
                item.id
              );
            });
            store.updateAll(CollectionTypes.SPELLS, spellsArray);
            serverLogger(
              LoggingTypes.info,
              `${EmitTypes.UPDATE_ALL} update complete ${data.collectionType}`,
              ComponentEnums.SOCKETRECEIVER,
              data.payload[0].id
            );
            return;
          }
        }
      });
      socket?.on(EmitTypes.UPDATE_RECORD, (data: ReceiveDataObject) => {
        serverLogger(
          LoggingTypes.info,
          `${EmitTypes.UPDATE_ALL} updating ${data.collectionType}`,
          ComponentEnums.SOCKETRECEIVER,
          data.payload.id
        );
        if (data.collectionType === CollectionTypes.INITIATIVE) {
          if (isInitiativeObject(data.payload)) {
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.UPDATE_ALL} updating initiative`,
              ComponentEnums.SOCKETRECEIVER,
              data.payload.id
            );
            store.updateCharacterRecord(data.payload, false);
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.UPDATE_ALL}  update complete ${data.collectionType}`,
              ComponentEnums.SOCKETRECEIVER
            );
            return;
          }
        }
        if (data.collectionType === CollectionTypes.SPELLS) {
          if (isServerSpellObject(data.payload)) {
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.UPDATE_ALL} creating spell object`,
              ComponentEnums.SOCKETRECEIVER,
              data.payload.id
            );
            const characterIds = store.spellsDoubleArray(
              data.payload.characterIds
            );
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.UPDATE_ALL} characterIds complete`,
              ComponentEnums.SOCKETRECEIVER,
              data.payload.id
            );
            serverLogger(
              LoggingTypes.debug,
              `${EmitTypes.UPDATE_ALL} updating spells`,
              ComponentEnums.SOCKETRECEIVER,
              data.payload.id
            );
            const spellIndex = store.store.spells
              .map((spell: SpellObject) => spell.id)
              .indexOf(data.payload.id);
            store.updateSpell(
              data.payload.effectName,
              data.payload.effectDescription,
              data.payload.durationTime,
              data.payload.durationType,
              spellIndex,
              false,
              characterIds
            );
            serverLogger(
              LoggingTypes.info,
              `${EmitTypes.UPDATE_ALL} update complete ${data.collectionType}`,
              ComponentEnums.SOCKETRECEIVER,
              data.payload.id
            );
          }
        }
      });
      socket?.on(EmitTypes.UPDATE_ITEM, (data: UpdateItemObject) => {
        serverLogger(
          LoggingTypes.info,
          `${EmitTypes.UPDATE_ITEM} updating: ${data.collectionType}`,
          ComponentEnums.SOCKETRECEIVER,
          data.payload.docId
        );
        if (data.collectionType === CollectionTypes.INITIATIVE) {
          serverLogger(
            LoggingTypes.debug,
            `${EmitTypes.UPDATE_ITEM} item to update: ${data.payload.ObjectType} value: ${data.payload.toUpdate}`,
            ComponentEnums.SOCKETRECEIVER,
            data.payload.docId
          );
          const initIndex = store.store.initiativeList
            .map((record: InitiativeObject) => record.id)
            .indexOf(data.payload.docId);
          store.updateCharacterItem(
            data.payload.ObjectType as InitiativeObjectEnums,
            data.payload.toUpdate,
            initIndex,
            false
          );
          serverLogger(
            LoggingTypes.info,
            `${EmitTypes.UPDATE_ITEM} update complete ${data.collectionType}`,
            ComponentEnums.SOCKETRECEIVER,
            data.payload.docId
          );
          return;
        }
        if (data.collectionType === CollectionTypes.SPELLS) {
          serverLogger(
            LoggingTypes.debug,
            `${EmitTypes.UPDATE_ITEM} item to update: ${data.payload.ObjectType} value: ${data.payload.toUpdate}`,
            ComponentEnums.SOCKETRECEIVER,
            data.payload.docId
          );
          const spellIndex = store.store.spells
            .map((spell: SpellObject) => spell.id)
            .indexOf(data.payload.docId);
          store.updateSpellItem(
            data.payload.ObjectType as SpellObjectEnums,
            data.payload.toUpdate,
            spellIndex
          );
          serverLogger(
            LoggingTypes.info,
            `${EmitTypes.UPDATE_ITEM} update complete ${data.collectionType}`,
            ComponentEnums.SOCKETRECEIVER,
            data.payload.docId
          );
        }
      });

      socket?.on(EmitTypes.DELETE_ONE, (data: DeleteOneObject) => {
        serverLogger(
          LoggingTypes.info,
          `${EmitTypes.DELETE_ONE} deleting ${data.collectionType}`,
          ComponentEnums.SOCKETRECEIVER,
          data.id
        );
        if (data.collectionType === CollectionTypes.INITIATIVE) {
          serverLogger(
            LoggingTypes.debug,
            `${EmitTypes.DELETE_ONE} deleting initiative`,
            ComponentEnums.SOCKETRECEIVER,
            data.id
          );
          const initIndex = store.store.initiativeList
            .map((record: InitiativeObject) => record.id)
            .indexOf(data.id);
          store.removeCharacter(initIndex, data.id, false);
          toast.add({
            severity: "warn",
            summary: "Warning Message",
            detail:
              "Initiative has been reset. Please click Round Start to Resort.",
            life: 3000,
          });
          serverLogger(
            LoggingTypes.info,
            `${EmitTypes.DELETE_ONE} toast added, init deletion completed`,
            ComponentEnums.SOCKETRECEIVER,
            data.id
          );
          return;
        }
        if (data.collectionType === CollectionTypes.SPELLS) {
          const spellIndex = store.store.spells
            .map((spell: SpellObject) => spell.id)
            .indexOf(data.id);
          store.removeSpell(spellIndex, data.id, false);
          serverLogger(
            LoggingTypes.info,
            `${EmitTypes.DELETE_ONE} spell deletion completed`,
            ComponentEnums.SOCKETRECEIVER,
            data.id
          );
        }
      });
      socket?.on(EmitTypes.DELETE_ALL, () => {
        store.resetAll(false);
        serverLogger(
          LoggingTypes.info,
          `${EmitTypes.DELETE_ALL} reset complete`,
          ComponentEnums.SOCKETRECEIVER
        );
      });
      socket?.on(EmitTypes.NEXT, (record: InitiativeObject) => {
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
      });
      socket?.on(EmitTypes.PREVIOUS, (record: InitiativeObject) => {
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
