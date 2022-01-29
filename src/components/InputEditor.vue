<template>
  <div class="p-inplace p-component">
    <div class="p-inplace-display" @click="open" v-if="!active">
      <slot name="display"></slot>
    </div>
    <div class=".p-inplace-content" v-else>
      <slot name="content"></slot>
      <span class="pi pi-times-circle inplace-btn" @click="close"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "InputEditor",
  emits: ["open", "close"],
  setup(props, context) {
    const active = ref(false);

    function open(event: Event): void {
      context.emit("open", event);
      active.value = true;
    }
    function close(event: Event): void {
      context.emit("close", event);
      active.value = false;
    }
    return { open, close, active };
  },
});
</script>

<style scoped>
.inplace-btn {
  font-size: 1em;
  margin-left: 0.5em;
}
</style>
