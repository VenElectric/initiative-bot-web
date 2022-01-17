<template>
  <div v-for="item in ability" :key="item">
    <div class="inputgroup">
      <input id="text" type="text" class="text-bubble" />
      <label for="text"> {{ item }}</label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { ability_scores } from "../../assets/static";

export default defineComponent({
  name: "SavingThrows",
  data() {
    return {
      ability: ability_scores,
    };
  },
});
</script>

<style lang="scss" scoped>
.text-bubble {
  height: 3rem;
  width: 3rem;
  border: 4px groove black;
  text-align: center;
  font-size: 1.2rem;
}
.inputgroup {
  display: flex;
  flex-flow: row;
  padding: 2rem;
}
</style>
