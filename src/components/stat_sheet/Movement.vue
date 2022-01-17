<template>
  <div class="main">
    <div class="inputgroup">
      <input id="text" type="text" class="text-bubble" />
      <label for="text">Land</label>
    </div>
    <div class="inputgroup">
      <input id="text" type="text" class="text-bubble" />
      <label for="text">Fly</label>
    </div>
    <div class="inputgroup">
      <input id="text" type="text" class="text-bubble" />
      <label for="text">Swim</label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Movement",
});
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  justify-content: center;
  border: 3px double black;
  max-width: 25%;
  flex-wrap: wrap;
}
.text-bubble {
  height: 3rem;
  width: 3rem;
  border: 4px groove black;
  text-align: center;
  font-size: 1.2rem;
}
.inputgroup {
  display: flex;
  flex-flow: column;
  padding: 2rem;
}
label {
  margin-top: 0.5rem;
}
</style>
