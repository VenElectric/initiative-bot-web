<template>
  <input type="text" />
  <input type="text" />
  <div id="myProgress">
    <div id="maxHP"><label>Max</label><input type="text" /></div>
    <div id="currentHP">
      <label>Current</label><input type="text" /><label v-if="temp > 0"
        >Temp: {{ temp }}</label
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Health",
  data() {
    return {
      temp: 0,
    };
  },
});
</script>

<style></style>
