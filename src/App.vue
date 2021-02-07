<template>
  <div class="app">
    <visual-editor v-model="jsonData" :config="visualConfig" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { VisualEditor } from "../src/packages/visual-editor";
// import { TestUseModel } from "../src/packages/utils/useModel";
import visualConfig from "./packages/visual.config";

export default defineComponent({
  name: "App",
  components: { VisualEditor },
  data() {
    return {
      visualConfig,
      jsonData: {
        container: {
          height: 500,
          width: 800,
        },
        blocks: [
          {
            componentKey: "button",
            top: 100,
            left: 100,
            focus: false,
          },
          {
            componentKey: "input",
            top: 200,
            left: 200,
            focus: false,
          },
        ],
      },
    };
  },
});
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
}
</style>
