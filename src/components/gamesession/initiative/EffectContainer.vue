<template>
  <div v-for="effect of statusEffects" :key="effect.id">
    <Effect :effect="effect"></Effect>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { StatusEffect } from "../../../Interfaces/initiative";
import Effect from "./Effect.vue";

export default defineComponent({
  name: "EffectContainer",
  components: { Effect },
  props: { statusEffects: Array as PropType<StatusEffect[]> },
});
</script>
