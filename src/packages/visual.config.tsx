import { createVisualEditorConfig } from "./visual-editor.utils";
import { ElButton, ElInput } from "element-plus";
import {
  createEditorInputProps,
  createEditorSelectProps,
} from "./visual-editor.props";

const visualConfig = createVisualEditorConfig();

visualConfig.registry("text", {
  label: "文本",
  preview: () => "预览文本",
  render: () => "渲染文本",
});

visualConfig.registry("button", {
  label: "按钮",
  preview: () => <ElButton>按钮</ElButton>,
  render: ({ props, size }) => {
    return (
      <ElButton
        type={props.type}
        size={props.size}
        style={{
          width: size.width ? `${size.width}px` : undefined,
          height: size.height ? `${size.height}px` : undefined,
        }}
      >
        {props.text || "按钮"}
      </ElButton>
    );
  },
  resize: { width: true, height: true },
  props: {
    text: createEditorInputProps("显示文本"),
    type: createEditorSelectProps("按钮类型", [
      { label: "基础", val: "primary" },
      { label: "成功", val: "success" },
      { label: "警告", val: "warning" },
      { label: "危险", val: "danger" },
      { label: "提示", val: "info" },
      { label: "文本", val: "text" },
    ]),
    size: createEditorSelectProps("按钮大小", [
      { label: "默认", val: "" },
      { label: "中等", val: "medium" },
      { label: "小", val: "small" },
      { label: "极小", val: "mini" },
    ]),
  },
});

visualConfig.registry("input", {
  label: "输入框",
  preview: () => <ElInput />,
  render: ({ size }) => <ElInput style={{ width: `${size.width}px` }} />,
  resize: { width: true },
});

export default visualConfig;
