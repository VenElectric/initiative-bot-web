<template>
  <div class="skillbox">
    <input type="checkbox" :checked="prof" class="pad" />
    <input id="item_value" type="text" class="skillinput" :value="total" />
    <label for="item_value" :data-ability="ability" class="pad">{{
      name
    }}</label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SkillRec",
  props: ["skill_item"],
  data() {
    return {
      ability: this.skill_item.ability,
      prof: this.skill_item.prof,
      total: this.skill_item.value,
      name: this.skill_item.name,
    };
  },
});
</script>

<style scoped>
[data-ability]::after {
  content: " (" attr(data-ability) ")";
  font-size: 0.8em;
}
.skillbox {
  margin: 1em;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.skillinput {
  width: 2em;
  height: 2em;
  text-align: center;
}
.pad {
  display: flex;
  flex-flow: column;
  align-content: center;
  flex-wrap: nowrap;
  margin-top: 0.5em;
}
.pad input {
  margin-right: 1em;
}
</style>
