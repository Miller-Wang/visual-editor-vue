import { defineComponent } from "vue";
import "./visual-editor.scss";
export const VisualEditor = defineComponent({
  props: {},
  setup(props) {
    return () => (
      <div class="visual-editor">
        <div class="menu">menu</div>
        <div class="head">head</div>
        <div class="operator">operator</div>
        <div class="body">
          <div class="content">body</div>
        </div>
      </div>
    );
  },
});
