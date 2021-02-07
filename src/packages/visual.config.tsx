import { createVisualEditorConfig } from "./visual-editor.utils";
import { ElButton, ElInput } from "element-plus";

const visualConfig = createVisualEditorConfig();

visualConfig.registry("text", {
  label: "文本",
  preview: () => "预览文本",
  render: () => "渲染文本",
});

visualConfig.registry("button", {
  label: "按钮",
  preview: () => <ElButton>按钮</ElButton>,
  render: ({ size }) => (
    <ElButton style={{ width: `${size.width}px`, height: `${size.height}px` }}>
      渲染按钮
    </ElButton>
  ),
  resize: { width: true, height: true },
});

visualConfig.registry("input", {
  label: "输入框",
  preview: () => <ElInput />,
  render: ({ size }) => <ElInput style={{ width: `${size.width}px` }} />,
  resize: { width: true },
});

export default visualConfig;
