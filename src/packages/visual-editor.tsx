import { computed, defineComponent, PropType, ref } from "vue";
import { useModel } from "./utils/useModel";
import { VisualEditorBlock } from "./visual-editor-block";
import "./visual-editor.scss";
import {
  createNewBlock,
  VisualEditorBlockData,
  VisualEditorComponent,
  VisualEditorConfig,
  VisualEditorModelValue,
} from "./visual-editor.utils";

export const VisualEditor = defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<VisualEditorModelValue>,
      require: true,
    },
    config: {
      type: Object as PropType<VisualEditorConfig>,
      require: true,
    },
  },
  emits: {
    "update:modelValue": (val?: VisualEditorModelValue) => true,
  },
  setup(props, ctx) {
    // 双向数据绑定
    const dataModel = useModel(
      () => props.modelValue,
      (val) => ctx.emit("update:modelValue", val)
    );
    // container样式
    const containerStyles = computed(() => ({
      width: `${props.modelValue?.container.width}px`,
      height: `${props.modelValue?.container.height}px`,
    }));
    // container dom引用
    const containerRef = ref({} as HTMLElement);

    // 计算选中与未选中的block数据
    const focusData = computed(() => {
      const focus: VisualEditorBlockData[] =
        dataModel.value?.blocks.filter((v) => v.focus) || [];
      const unfocus: VisualEditorBlockData[] =
        dataModel.value?.blocks.filter((v) => !v.focus) || [];
      return {
        focus, // 此时选中的数据
        unfocus, // 此时未选中的数据
      };
    });

    // 对外暴露的一些方法
    const methods = {
      clearFocus: (block?: VisualEditorBlockData) => {
        let blocks = dataModel.value?.blocks || [];
        if (blocks.length === 0) return;

        if (block) {
          blocks = blocks.filter((v) => v !== block);
        }
        blocks.forEach((block) => (block.focus = false));
      },
    };

    // 处理菜单拖拽进容器
    const menuDragger = (() => {
      let component = null as null | VisualEditorComponent;

      const containerHandler = {
        /**
         * 拖拽组件进入容器，设置鼠标可放置状态
         */
        dragenter: (e: DragEvent) => {
          e.dataTransfer!.dropEffect = "move";
        },
        dragover: (e: DragEvent) => {
          e.preventDefault();
        },
        /**
         * 拖拽组件离开容器，设置鼠标禁用状态
         */
        dragleave: (e: DragEvent) => {
          e.dataTransfer!.dropEffect = "none";
        },
        /**
         * 在容器中放置组件
         */
        drop: (e: DragEvent) => {
          console.log("drop", component);
          const blocks = dataModel.value?.blocks || [];
          blocks.push(
            createNewBlock({
              component: component!,
              top: e.offsetY,
              left: e.offsetX,
            })
          );
          console.log("x", e.offsetX);
          console.log("y", e.offsetY);
          dataModel.value = {
            ...dataModel.value,
            blocks,
          } as VisualEditorModelValue;
        },
      };

      const blockHandler = {
        dragstart: (e: DragEvent, current: VisualEditorComponent) => {
          containerRef.value.addEventListener(
            "dragenter",
            containerHandler.dragenter
          );
          containerRef.value.addEventListener(
            "dragover",
            containerHandler.dragover
          );
          containerRef.value.addEventListener(
            "dragleave",
            containerHandler.dragleave
          );
          containerRef.value.addEventListener("drop", containerHandler.drop);
          component = current;
        },
        dragend: (e: DragEvent) => {
          containerRef.value.removeEventListener(
            "dragenter",
            containerHandler.dragenter
          );
          containerRef.value.removeEventListener(
            "dragover",
            containerHandler.dragover
          );
          containerRef.value.removeEventListener(
            "dragleave",
            containerHandler.dragleave
          );
          containerRef.value.removeEventListener("drop", containerHandler.drop);
          component = null;
        },
      };

      return blockHandler;
    })();

    // 处理组件在画布上他拖拽
    const blockDragger = (() => {
      let dragState = {
        startX: 0,
        startY: 0,
        startPos: [] as { left: number; top: number }[],
      };

      const mousemove = (e: MouseEvent) => {
        let durX = e.clientX - dragState.startX;
        let durY = e.clientY - dragState.startY;

        // 按下shift键时，组件只能横向或纵向移动
        if (e.shiftKey) {
          // 当鼠标横向移动的距离 大于 纵向移动的距离，将纵向的偏移置为0
          if (Math.abs(durX) > Math.abs(durY)) {
            durY = 0;
          } else {
            durX = 0;
          }
        }
        focusData.value.focus.forEach((block, i) => {
          block.top = dragState.startPos[i].top + durY;
          block.left = dragState.startPos[i].left + durX;
        });
      };
      const mouseup = (e: MouseEvent) => {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
      };

      const mousedown = (e: MouseEvent) => {
        dragState = {
          startX: e.clientX,
          startY: e.clientY,
          startPos: focusData.value.focus.map(({ top, left }) => ({
            top,
            left,
          })),
        };
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);
      };

      return { mousedown };
    })();

    // 处理组件的选中状态
    const focusHandler = (() => {
      return {
        container: {
          onMousedown: (e: MouseEvent) => {
            e.stopPropagation();
            methods.clearFocus();
          },
        },
        block: {
          onMousedown: (e: MouseEvent, block: VisualEditorBlockData) => {
            e.stopPropagation();
            // e.preventDefault();
            // 只有元素未选中状态下， 才去处理
            if (!block.focus) {
              if (!e.shiftKey) {
                block.focus = !block.focus;
                methods.clearFocus(block);
              } else {
                block.focus = true;
              }
            }
            // 处理组件的选中移动
            blockDragger.mousedown(e);
          },
        },
      };
    })();

    const toolButtons = [
      {
        label: "撤销",
        icon: "icon-back",
        tip: "ctrl+z",
      },
      {
        label: "重做",
        icon: "icon-forward",
        tip: "ctrl+y, ctrl+shift+z",
      },
      {
        label: "删除",
        icon: "icon-delete",
        handler: () => {
          // 删除选中状态的 block
          dataModel.value!.blocks = [
            ...focusData.value.unfocus,
          ] as VisualEditorBlockData[];
        },
        tip: "ctrl+d, backspance, delete,",
      },
    ];

    return () => (
      <div class="visual-editor">
        <div class="menu">
          {props.config?.componentList.map((component) => (
            <div
              class="menu-item"
              draggable
              onDragend={menuDragger.dragend}
              onDragstart={(e) => menuDragger.dragstart(e, component)}
            >
              <span class="menu-item-label">{component.label}</span>
              {component.preview()}
            </div>
          ))}
        </div>
        <div class="head">
          {toolButtons.map((btn, index) => (
            <div key={index} class="head-btn" onClick={btn.handler}>
              <i class={`iconfont ${btn.icon}`}></i>
              <span>{btn.label}</span>
            </div>
          ))}
        </div>
        <div class="operator">operator</div>
        <div class="body">
          <div class="content">
            <div
              class="container"
              ref={containerRef}
              style={containerStyles.value}
              {...focusHandler.container}
            >
              {(dataModel.value?.blocks || []).map((block, index: number) => (
                <VisualEditorBlock
                  block={block}
                  key={index}
                  config={props.config}
                  {...{
                    onMousedown: (e: MouseEvent) =>
                      focusHandler.block.onMousedown(e, block),
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
