<template>
  <div class="main">
    <div class="center">
      <div>
        <input class="text-main" type="text" placeholder="Character Name" />
        <input class="text-main" type="text" placeholder="Age" />
        <input class="text-main" type="text" placeholder="Race" />
        <input class="text-main" type="text" placeholder="Class" />
      </div>
      <div>
        <input class="text-main" type="text" placeholder="Level" />
        <input class="text-main" type="text" placeholder="Background" />
        <input class="text-main" type="text" placeholder="Alignment" />
        <input class="text-main" type="text" placeholder="Experience" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainStats",
});
</script>

<style scoped lang="scss">
$slate-color: rgb(16, 24, 50);
$blue-color: #00bcdd;
$pink-color: #ff00ff;
$space-cadet: #2b2d42;
$manatee: #8d99ae;
$alice-blue: #edf2f4;
$imperial-red: #ef233c;
$crimson: #d80032;
.main {
  display: flex;
  justify-content: center;
}
.center {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  flex-wrap: wrap;
  flex-direction: column;
  border-radius: 5px;
  border: 3px double $blue-color;
  outline: 1px solid $blue-color;
}
.text-main {
  margin: 1rem;
  padding: 0.5rem;
  border-radius: 4rem;
  text-align: center;
  font-size: 1.1rem;
  box-shadow: 5px 3px $manatee;
  border-color: black;
  background-color: $alice-blue;
}
</style>
