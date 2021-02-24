import deepcopy from "deepcopy";
import {
  ElButton,
  ElColorPicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElOption,
  ElSelect,
} from "element-plus";
import { defineComponent, PropType, reactive, watch } from "vue";
import {
  VisualEditorProps,
  VisualEditorPropsType,
} from "./visual-editor.props";
import {
  VisualEditorBlockData,
  VisualEditorConfig,
  VisualEditorModelValue,
} from "./visual-editor.utils";

export const VisualOperatorEditor = defineComponent({
  props: {
    block: { type: Object as PropType<VisualEditorBlockData> },
    config: { type: Object as PropType<VisualEditorConfig> },
    dataModel: {
      type: Object as PropType<VisualEditorModelValue>,
      required: true,
    },
    updateBlock: {
      type: Function as PropType<
        (
          newBlock: VisualEditorBlockData,
          oldBlock: VisualEditorBlockData
        ) => void
      >,
      required: true,
    },
    updateModelValue: {
      type: Function as PropType<(...args: any[]) => void>,
      required: true,
    },
  },

  setup(props) {
    const state = reactive({
      editData: {} as any,
    });

    const methods = {
      apply: () => {
        if (!props.block) {
          // 当前编辑容器属性
          props.updateModelValue({
            ...(props.dataModel as any).value,
            container: state.editData,
          });
        } else {
          // 当前编辑block数据属性
          const newBlock = state.editData;
          props.updateBlock(newBlock, props.block);
        }
      },
      reset: () => {
        if (!props.block) {
          state.editData = deepcopy((props.dataModel as any).value.container);
        } else {
          state.editData = deepcopy(props.block);
        }
      },
    };

    watch(
      () => props.block,
      () => {
        methods.reset();
      },
      {
        immediate: true,
      }
    );

    const renderEditor = (propName: string, propConfig: VisualEditorProps) => {
      return {
        [VisualEditorPropsType.input]: () => (
          <ElInput v-model={state.editData.props[propName]} />
        ),
        [VisualEditorPropsType.color]: () => (
          <ElColorPicker v-model={state.editData.props[propName]} />
        ),
        [VisualEditorPropsType.select]: () => (
          <ElSelect
            placeholder="请选择"
            v-model={state.editData.props[propName]}
          >
            {(() => {
              return propConfig.options!.map((opt, i) => (
                <ElOption key={i} label={opt.label} value={opt.val} />
              ));
            })()}
          </ElSelect>
        ),
      }[propConfig.type]();
    };

    return () => {
      let content: JSX.Element[] = [];
      if (!props.block) {
        content.push(
          <>
            <ElFormItem label="容器宽度">
              <ElInputNumber
                v-model={state.editData.width}
                {...{ step: 100 }}
              />
            </ElFormItem>
            <ElFormItem label="容器高度">
              <ElInputNumber
                v-model={state.editData.height}
                {...{ step: 100 }}
              />
            </ElFormItem>
          </>
        );
      } else {
        const { componentKey } = props.block;
        const component = props.config?.componentMap[componentKey];

        if (component) {
          content.push(
            <ElFormItem label="组件标识">
              <ElInput v-model={state.editData.slotName} />
            </ElFormItem>
          );
          if (component.props) {
            content.push(
              <>
                {Object.entries(component.props).map(
                  ([propName, propConfig]) => (
                    <ElFormItem
                      {...{ labelPosition: "top" }}
                      label={propConfig.label}
                      key={propName}
                    >
                      {renderEditor(propName, propConfig)}
                    </ElFormItem>
                  )
                )}
              </>
            );
          }
        }
      }
      return (
        <div class="operator">
          <ElForm>
            {content.map((el) => el)}
            <ElFormItem>
              <ElButton type="primary" {...({ onClick: methods.apply } as any)}>
                应用
              </ElButton>
              <ElButton {...({ onClick: methods.reset } as any)}>重置</ElButton>
            </ElFormItem>
          </ElForm>
        </div>
      );
    };
  },
});
