<template>
  <div class="app">
    <visual-editor />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { VisualEditor } from "../src/packages/visual-editor";

export default defineComponent({
  name: "App",
  components: { VisualEditor },
});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
</style>
