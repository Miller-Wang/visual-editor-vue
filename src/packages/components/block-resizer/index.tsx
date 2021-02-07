import {
  VisualEditorBlockData,
  VisualEditorComponent,
  VisualEditorConfig,
} from "@/packages/visual-editor.utils";
import { defineComponent, PropType } from "vue";
import "./style.scss";

enum Direction {
  start = "start",
  center = "center",
  end = "end",
}

export const BlockResizer = defineComponent({
  props: {
    block: { type: Object as PropType<VisualEditorBlockData>, required: true },
    component: {
      type: Object as PropType<VisualEditorComponent>,
      required: true,
    },
  },
  setup(props) {
    const { width, height } = props.component.resize || {};

    const onMousedown = (() => {
      let data = {
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        startLeft: 0,
        startTop: 0,
        direction: {} as { horizontal: Direction; vertical: Direction },
      };

      const mousemove = (e: MouseEvent) => {
        const {
          startX,
          startY,
          startWidth,
          startHeight,
          direction,
          startLeft,
          startTop,
        } = data;
        let { clientX: moveX, clientY: moveY } = e;
        if (direction.horizontal === Direction.center) {
          moveX = startX;
        }
        if (direction.vertical === Direction.center) {
          moveY = startY;
        }

        let durX = moveX - startX;
        let durY = moveY - startY;
        const block = props.block as VisualEditorBlockData;

        if (direction.vertical === Direction.start) {
          durY = -durY;
          block.top = startTop - durY;
        }
        if (direction.horizontal === Direction.start) {
          durX = -durX;
          block.left = startLeft - durX;
        }

        const width = startWidth + durX;
        const height = startHeight + durY;

        block.width = width;
        block.height = height;
        block.hasResize = true;
      };

      const mouseup = (e: MouseEvent) => {
        console.log(e);
        document.body.removeEventListener("mousemove", mousemove);
        document.body.removeEventListener("mouseup", mouseup);
      };
      const mousedown = (
        e: MouseEvent,
        direction: { horizontal: Direction; vertical: Direction }
      ) => {
        e.stopPropagation();
        document.body.addEventListener("mousemove", mousemove);
        document.body.addEventListener("mouseup", mouseup);
        data = {
          startX: e.clientX,
          startY: e.clientY,
          direction,
          startWidth: props.block.width,
          startHeight: props.block.height,
          startLeft: props.block.left,
          startTop: props.block.top,
        };
      };

      return mousedown;
    })();

    return () => (
      <>
        {height && (
          <>
            <div
              class="block-resize block-resize-top"
              onMousedown={(e) =>
                onMousedown(e, {
                  horizontal: Direction.center,
                  vertical: Direction.start,
                })
              }
            ></div>
            <div
              class="block-resize block-resize-bottom"
              onMousedown={(e) =>
                onMousedown(e, {
                  horizontal: Direction.center,
                  vertical: Direction.end,
                })
              }
            ></div>
          </>
        )}

        {width && (
          <>
            <div
              class="block-resize block-resize-left"
              onMousedown={(e) =>
                onMousedown(e, {
                  horizontal: Direction.start,
                  vertical: Direction.center,
                })
              }
            ></div>
            <div
              class="block-resize block-resize-right"
              onMousedown={(e) =>
                onMousedown(e, {
                  horizontal: Direction.end,
                  vertical: Direction.center,
                })
              }
            ></div>
          </>
        )}

        {width && height && (
          <>
            <div
              class="block-resize block-resize-top-left"
              onMousedown={(e) =>
                onMousedown(e, {
                  horizontal: Direction.start,
                  vertical: Direction.start,
                })
              }
            ></div>
            <div
              class="block-resize block-resize-top-right"
              onMousedown={(e) =>
                onMousedown(e, {
                  horizontal: Direction.end,
                  vertical: Direction.start,
                })
              }
            ></div>

            <div
              class="block-resize block-resize-bottom-left"
              onMousedown={(e) =>
                onMousedown(e, {
                  horizontal: Direction.start,
                  vertical: Direction.end,
                })
              }
            ></div>
            <div
              class="block-resize block-resize-bottom-right"
              onMousedown={(e) =>
                onMousedown(e, {
                  horizontal: Direction.end,
                  vertical: Direction.end,
                })
              }
            ></div>
          </>
        )}
      </>
    );
  },
});
