<template>
  <div class="skill_border">
    <div v-for="ability in skills_keys" :key="ability">
      <SkillRec
        v-for="skill in skills_list[ability]"
        :skill_item="test"
        :key="ability + skill"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { skills } from "../../assets/static";
import SkillRec from "./SkillRec.vue";

export default defineComponent({
  name: "SkillList",
  components: { SkillRec },
  data() {
    return {
      skills_list: skills,
      skills_keys: Object.keys(skills),
      test: { prof: true, value: 3, name: "Medicine", ability: "WIS" },
    };
  },
});
</script>

<style>
.skill_border {
  border: 3px double black;
  display: flex;
  width: 15%;
  flex-direction: column;
  justify-content: center;
}
</style>
