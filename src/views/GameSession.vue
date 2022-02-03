<template>
  <SocketReceiver />
  <Toolbar>
    <template #start>
      <Toast />
      <ConfirmPopup></ConfirmPopup>
      <!-- <ConfirmPopup group="demo">
        <template #message="slotProps">
          <div class="flex p-4">
            <em :class="slotProps.message.icon" style="font-size: 1.5rem"></em>
            <p class="pl-2">{{ slotProps.message.message }}</p>
          </div>
        </template>
      </ConfirmPopup> -->
      <Button
        label="Discord: Spells"
        class="p-button p-button-info"
        @click="spellMessage"
      />
      <Button
        label="Discord: Initiative"
        class="p-button p-button-info"
        @click="initiativeMessage"
      />
      <Button
        label="Clear Session"
        v-tooltip.top="'This will clear all Spells and Initiative'"
        @click="(e) => confirm1(e)"
        class="p-button p-button-info"
      />
    </template>
    <template #end>
      <Message class="message-container" v-if="display">{{ message }}</Message>
    </template>
  </Toolbar>

  <div class="flex flex-row justify-content-evenly">
    <!-- Initiative List -->
    <div class="flex flex-column column-container">
      <h1>Initiative List</h1>
      <InitiativeState></InitiativeState>
    </div>
    <!-- Spell List -->

    <div class="flex flex-column column-container">
      <h1>Spell List</h1>
      <SpellState></SpellState>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import InitiativeState from "../components/gamesession/initiative/InitiativeState.vue";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import { IStore } from "../data/types";
import SpellState from "../components/gamesession/spells/SpellState.vue";
import { CollectionTypes } from "../Interfaces/ContextEnums";
import Message from "primevue/message";
import SocketReceiver from "../components/gamesession/SocketReceiver.vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import ConfirmPopup from "primevue/confirmpopup";
import Toast from "primevue/toast";
import serverLogger from "../Utils/LoggingClass";
import { LoggingTypes, ComponentEnums } from "../Interfaces/LoggingTypes";

// css to make columns instead of rows for each item (init, spell, info)
export default defineComponent({
  name: "GameSession",
  components: {
    Toolbar,
    Button,
    InitiativeState,
    SpellState,
    Message,
    SocketReceiver,
    ConfirmPopup,
    Toast,
  },
  setup() {
    const route = useRoute();
    const store = inject<IStore>("store");
    const message = ref();
    const display = ref(false);
    const confirm = useConfirm();
    const toast = useToast();
    const paramsId = String(route.params.id);
    // let paramsId = "731278337917452380";
    if (store) {
      store.updateId(paramsId);
      serverLogger(
        LoggingTypes.debug,
        `updating session Id`,
        ComponentEnums.GAMESESSION,
        paramsId
      );
    }
    if (store === undefined) {
      serverLogger(
        LoggingTypes.alert,
        `Failed to inject store`,
        ComponentEnums.GAMESESSION
      );
      throw new Error('Failed to inject "updateScore"');
    }
    let op = ref(null);

    function spellMessage() {
      store?.toDiscord(CollectionTypes.SPELLS);
      toast.add({
        severity: "success",
        summary: "Success Message",
        detail: "Spells Sent to Discord",
        life: 3000,
      });
      serverLogger(
        LoggingTypes.info,
        `Adding toast and sending spells to discord`,
        ComponentEnums.GAMESESSION
      );
    }
    function initiativeMessage() {
      store?.toDiscord(CollectionTypes.INITIATIVE);
      toast.add({
        severity: "success",
        summary: "Success Message",
        detail: "Initiative Sent to Discord",
        life: 3000,
      });
      serverLogger(
        LoggingTypes.info,
        `Adding toast and sending initiative to discord`,
        ComponentEnums.GAMESESSION
      );
    }

    const confirm1 = (event: any) => {
      confirm.require({
        target: event.currentTarget,
        message: "Are you sure you want to proceed?",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          serverLogger(
            LoggingTypes.debug,
            `Adding toast and resetting game session`,
            ComponentEnums.GAMESESSION
          );
          store.resetAll(true);
          toast.add({
            severity: "info",
            summary: "Confirmed",
            detail: "Session Reset Accepted",
            life: 3000,
          });
        },
        reject: () => {
          serverLogger(
            LoggingTypes.debug,
            `Adding toast, rejected confirmation to reset game session`,
            ComponentEnums.GAMESESSION
          );
          toast.add({
            severity: "error",
            summary: "Rejected",
            detail: "Session Not Reset",
            life: 3000,
          });
        },
      });
    };

    onMounted(() => {
      store.roomSetup();
      serverLogger(
        LoggingTypes.info,
        `Onmounted, sending emit to create room`,
        ComponentEnums.GAMESESSION
      );
    });

    return {
      store,
      CollectionTypes,
      spellMessage,
      initiativeMessage,
      display,
      message,
      confirm1,
    };
  },
});
</script>

<style>
.column-container {
  width: 30%;
}
.p-tooltip-text {
  font-size: 0.8em;
}
.message-container {
  font-size: 1em !important;
}
.p-message-icon {
  font-size: 1em !important;
}
.p-message {
  font-size: 1em !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-left: 0.1em !important;
  padding-right: 0.2em !important;
  margin: 0 !important;
}
.p-message-wrapper {
  font-size: 1em !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-left: 0.1em !important;
  padding-right: 0.2em !important;
  margin: 0 !important;
}
</style>
