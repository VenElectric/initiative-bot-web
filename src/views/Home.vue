<template>
  <div class="home">Under Construction.....</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "Home",
  setup() {
    const data = reactive({
      items: [
        {
          id: "1234",
          title: "A",
        },
        { id: "5678", title: "B" },
        { id: "0564", title: "C" },
      ],
    });
    return { data };
  },
});
</script>
