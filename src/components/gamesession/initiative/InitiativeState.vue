<template>
  <div v-if="!loading">
    <div>
      <ToolBar>
        <template #start>
          <Button label="Sort" class="p-button-sm p-button-info" />
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
      <Accordion>
        <AccordionTab v-for="item in initiativeList.initiative" :key="item.id">
          <template #header>
            <InitiativeRecordHeader
              :name="item.characterName"
              :id="item.id"
              :updateCharacter="updateCharacter"
            ></InitiativeRecordHeader>
          </template>
          <InitRecord :updateCharacter="updateCharacter" :initiative="item" />
        </AccordionTab>
      </Accordion>
    </div>
  </div>
  <div v-else>
    <Skeleton width="100%" height="2rem" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, inject, Ref } from "vue";
import { Socket } from "socket.io-client";
import { EmitTypes } from "../../../Interfaces/EmitTypes";
import { CollectionTypes } from "../../../Interfaces/ContextEnums";
import { InitiativeObject } from "../../../Interfaces/initiative";
import InitRecord from "./InitRecord.vue";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import InitiativeRecordHeader from "./InitiativeRecordHeader.vue";
import OverlayPanel from "primevue/overlaypanel";
import AddInitiative from "./AddInitiative.vue";
import ToolBar from "primevue/toolbar";
import Button from "primevue/button";
import Skeleton from "primevue/skeleton";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require("uuid");

export default defineComponent({
  name: "InitiativeState",
  components: {
    InitRecord,
    Accordion,
    AccordionTab,
    InitiativeRecordHeader,
    AddInitiative,
    OverlayPanel,
    ToolBar,
    Button,
    Skeleton,
  },
  setup() {
    const sessionId = inject("sessionId");
    const initiativeList = reactive({ initiative: [] as InitiativeObject[] });
    const isSorted = ref(false);
    const loading = ref(true);
    const socket = inject("socket") as Socket;
    let op = ref(null);

    function updateCharacter(ObjectType: string, toUpdate: any, docId: string) {
      let options = {
        ObjectType: ObjectType,
        toUpdate: toUpdate,
        CollectionType: CollectionTypes.INITIATIVE,
        sessionId: sessionId,
        id: docId,
      };
      console.log(options);
      socket.emit(EmitTypes.UPDATE_ONE, options, (data: any) => {
        console.info(data);
      });
    }

    function toggle(event: any) {
      (op.value as any).toggle(event);
    }

    function addCharacter(e: any, data: any, roll: boolean) {
      console.info(data.characterName);
      toggle(e);
      let characterId = String(uuidv4());
      console.log(characterId);
      // let initiative = 0;
      console.log(roll);
      if (roll) {
        let diceroll = new DiceRoll(`d20+${data.initiativeModifier}`);
        //data.initiative needs to be reset to 0
        console.log(diceroll.total);
      }

      // // roll a dice if the user wants the bot to do it for them
      // if (e.target[3].value === "0") {
      //   initiative = Number(e.target[2].value);
      // }
      // if (e.target[3].value === "1") {
      //   // this could cause issues if the person enters in a non-integer value for initiative modifier?
      //   let diceroll = new DiceRoll(`d20+${e.target[4].value}`);
      //   initiative = diceroll.total;
      // }
      // // construct the object
      // let newData = {
      //   id: characterId,
      //   characterName: e.target[0].value,
      //   initiative: Number(initiative),
      //   initiativeModifier: Number(e.target[4].value),
      //   isCurrent: false,
      //   roundOrder: 0,
      //   isNpc: e.target[1].value,
      //   statusEffects: [],
      // };
    }

    onMounted(() => {
      if (sessionId) {
        socket?.emit(
          "GET_INITIAL",
          {
            sessionId: sessionId,
            collectionType: CollectionTypes.INITIATIVE,
          },
          (data: any) => {
            initiativeList.initiative = [...data.initiativeList];
            isSorted.value = data.isSorted;
            loading.value = false;
          }
        );
      }
    });

    return {
      loading,
      isSorted,
      initiativeList,
      updateCharacter,
      toggle,
      op,
      addCharacter,
    };
  },
});
</script>
