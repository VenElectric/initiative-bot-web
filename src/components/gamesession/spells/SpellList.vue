<template>
  <div><PickList></PickList></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PickList from "primevue/picklist";

export default defineComponent({
  name: "SpellList",
  components: { PickList },
});
</script>
