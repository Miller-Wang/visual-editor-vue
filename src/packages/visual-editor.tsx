import { computed, defineComponent, PropType } from "vue";
import { useModel } from "./utils/useModel";
import { VisualEditorBlock } from "./visual-editor-block";
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

  setup(props, ctx) {
    const dataModel = useModel(
      () => props.modelValue,
      (val) => ctx.emit("update:modelValue", val)
    );
    const containerStyles = computed(() => ({
      width: `${props.modelValue?.container.width}px`,
      height: `${props.modelValue?.container.height}px`,
    }));

    return () => (
      <div class="visual-editor">
        <div class="menu">menu</div>
        <div class="head">head</div>
        <div class="operator">operator</div>
        <div class="body">
          <div class="content">
            <div class="container" style={containerStyles.value}>
              {(dataModel.value?.blocks || []).map((block, index: number) => (
                <VisualEditorBlock block={block} key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
