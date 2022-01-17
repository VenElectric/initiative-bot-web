<template>
  <div v-for="effect of statusEffects" :key="effect.id">
    <Effect :effect="effect"></Effect>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { IStatus } from "@/src/interfaces/initiative";
import Effect from "./Effect.vue";

export default defineComponent({
  name: "EffectContainer",
  components: { Effect },
  props: { statusEffects: Array as PropType<IStatus[]> },
});
</script>
