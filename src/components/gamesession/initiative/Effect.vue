<template>
  <Tag :value="effect?.spellName"></Tag>
</template>

<script lang="ts">
import { StatusEffect } from "../../../interfaces/initiative";
import { defineComponent, onUnmounted, PropType } from "vue";
import Chip from "primevue/chip";
import Tag from "primevue/tag";
import serverLogger from "../../../Utils/LoggingClass";
import { LoggingTypes, ComponentEnums } from "../../../Interfaces/LoggingTypes";

export default defineComponent({
  name: "Effect",
  components: { Tag },
  props: { effect: { type: Object as PropType<StatusEffect>, required: true } },
  setup(props) {
    serverLogger(
      LoggingTypes.debug,
      `effect created`,
      ComponentEnums.EFFECT,
      props.effect.id
    );
  },
});
</script>
