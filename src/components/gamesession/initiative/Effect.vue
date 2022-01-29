<template>
  <Chip :label="effect?.spellName"></Chip>
</template>

<script lang="ts">
import { StatusEffect } from "../../../interfaces/initiative";
import { defineComponent, PropType } from "vue";
import Chip from "primevue/chip";

export default defineComponent({
  name: "Effect",
  components: { Chip },
  props: { effect: Object as PropType<StatusEffect> },
});
</script>
