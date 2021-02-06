<template>
  <div class="app">
    <visual-editor v-model="editorData" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { VisualEditor } from "../src/packages/visual-editor";

export default defineComponent({
  name: "App",
  components: { VisualEditor },
  data() {
    return {
      editorData: {
        container: {
          height: 500,
          width: 800,
        },
        blocks: [
          { top: 100, left: 100 },
          { top: 200, left: 200 },
        ],
      },
    };
  },
});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
</style>
