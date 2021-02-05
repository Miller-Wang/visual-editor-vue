import { defineComponent, PropType } from "vue";
import "./visual-editor.scss";
import { VisualEditorModelValue } from "./visual-editor.utils";

export const VisualEditor = defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<VisualEditorModelValue>,
    },
  },
  emits: {
    "update:modelValue": (val?: VisualEditorModelValue) => true,
  },
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
