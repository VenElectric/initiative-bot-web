<template>
  <div class="main">
    <div class="inputgroup" data-tool-tip="STR">
      <div>
        <input id="text" type="text" class="text-bubble" />
      </div>
      <div class="plus">
        <input id="mod" type="text" class="mod-bubble" />
      </div>
      <SkillRec :skill_item="test" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ability_scores } from "../../assets/static";
import SkillRec from "./SkillRec.vue";

export default defineComponent({
  name: "StatBox",
  components: { SkillRec },
  data() {
    return {
      ability: ability_scores,
      test: { prof: true, value: 3, name: "Medicine", ability: "WIS" },
    };
  },
});
</script>

<style lang="scss" scoped>
.main {
  border: 3px double black;
  max-width: 50%;
}
.saving {
  padding: 2rem;
  display: flex;
  flex-flow: row;
}
.saving::before {
  content: "Saving Throws";
}
.text-bubble {
  height: 2rem;
  width: 3rem;
  border: groove black;
  border-top-left-radius: 20px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 8px;
  text-align: center;
  font-size: 1.2rem;
}
.mod-bubble {
  height: 1rem;
  width: 3rem;
  border: groove black;
  border-top-left-radius: 8px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 8px;
  margin-top: 0.3rem;
  text-align: center;
  font-size: 1rem;
  padding: 0.2rem;
}
// .plus {
//   position: relative;
// }
.plus::before {
  content: "+";
  font-size: 1.5em;
  left: -5rem;
  //   position: absolute;
  //   left: -0.8em;
  //   top: 0.2em;
  //   display: flex;
  //   flex-flow: row;
  //   justify-content: center;
  //   align-items: center;
}
.inputgroup {
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: 2rem;
}
.inputgroup[data-tool-tip]::before {
  content: attr(data-tool-tip);
  font-size: 1em;
}
</style>
