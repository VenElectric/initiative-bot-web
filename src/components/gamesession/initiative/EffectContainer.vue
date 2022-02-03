<template>
  <div class="effect-cage">
    <Effect
      v-for="effect of data.statusEffects"
      :key="effect.id"
      :effect="effect"
    ></Effect>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, watch } from "vue";
import { StatusEffect } from "../../../Interfaces/initiative";
import Effect from "./Effect.vue";
import serverLogger from "../../../Utils/LoggingClass";
import { LoggingTypes, ComponentEnums } from "../../../Interfaces/LoggingTypes";

export default defineComponent({
  name: "EffectContainer",
  components: { Effect },
  props: {
    statusEffects: { type: Array as PropType<StatusEffect[]>, required: true },
  },
  setup(props) {
    const data = reactive({ statusEffects: props.statusEffects });
    serverLogger(
      LoggingTypes.debug,
      `container created`,
      ComponentEnums.EFFECTCONTAINER
    );
    watch(
      () => props.statusEffects,
      () => {
        serverLogger(
          LoggingTypes.debug,
          `watch triggered`,
          ComponentEnums.EFFECTCONTAINER
        );
        data.statusEffects = props.statusEffects;
      },
      { deep: true }
    );

    return { data };
  },
});
</script>

<style scoped>
.effect-cage {
  display: flex;
  justify-content: space-around;
}
</style>
