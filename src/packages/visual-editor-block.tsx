import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import {
  VisualEditorBlockData,
  VisualEditorConfig,
} from "./visual-editor.utils";

import { BlockResizer } from "./components/block-resizer";

export const VisualEditorBlock = defineComponent({
  props: {
    block: {
      type: Object as PropType<VisualEditorBlockData>,
    },
    config: {
      type: Object as PropType<VisualEditorConfig>,
    },
  },
  setup(props) {
    const el = ref({} as HTMLDivElement);
    const styles = computed(() => ({
      top: `${props.block?.top}px`,
      left: `${props.block?.left}px`,
    }));

    const classes = computed(() => [
      "visual-editor-block",
      {
        "visual-editor-block-focus": props.block?.focus,
      },
    ]);

    onMounted(() => {
      // 放置block时，让组件居中，对准鼠标点
      const block = props.block;
      if (block?.adjustPosition) {
        const { offsetWidth, offsetHeight } = el.value;
        block.left -= offsetWidth / 2;
        block.top -= offsetHeight / 2;
        block.adjustPosition = false;
        block.width = offsetWidth;
        block.height = offsetHeight;
      }
    });

    return () => {
      const component = props.config?.componentMap[props.block!.componentKey];
      const { width, height } = component?.resize || {};
      const renderProps = {
        size: props.block?.hasResize
          ? {
              width: props.block.width,
              height: props.block.height,
            }
          : {},
        props: props.block?.props || {},
      };
      const Render = component?.render(renderProps);
      return (
        <div class={classes.value} style={styles.value} ref={el}>
          {Render}
          {props.block?.focus && (width || height) && (
            <BlockResizer
              block={props.block!}
              component={component!}
            ></BlockResizer>
          )}
        </div>
      );
    };
  },
});
