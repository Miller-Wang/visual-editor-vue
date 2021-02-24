import { VisualEditorProps } from "./visual-editor.props";

export interface VisualEditorBlockData {
  top: number;
  left: number;
  componentKey: string;
  adjustPosition: boolean; // 是否需要调整位置
  focus: boolean; // 是否是选中状态
  width: number;
  height: number;
  hasResize: boolean; // 是否调整过宽高
  props?: object;
}

export interface VisualEditorModelValue {
  container: {
    width: number;
    height: number;
  };
  blocks: VisualEditorBlockData[];
}

export interface VisualEditorComponent {
  key: string;
  label: string;
  preview: () => JSX.Element;
  render: (data: {
    size: { width?: number; height?: number };
    props: any;
  }) => JSX.Element;
  resize?: { width?: boolean; height?: boolean };
  props?: Record<string, VisualEditorProps>;
}

export function createNewBlock(data: {
  component: VisualEditorComponent;
  top: number;
  left: number;
}): VisualEditorBlockData {
  return {
    componentKey: data.component!.key,
    top: data.top,
    left: data.left,
    adjustPosition: true,
    focus: false,
    width: 0,
    height: 0,
    hasResize: false,
    props: {},
  };
}

export function createVisualEditorConfig() {
  const componentList: VisualEditorComponent[] = [];
  const componentMap: Record<string, VisualEditorComponent> = {};

  return {
    componentList,
    componentMap,
    registry: (key: string, component: Omit<VisualEditorComponent, "key">) => {
      const comp = { ...component, key };
      componentList.push(comp);
      componentMap[key] = comp;
    },
  };
}

// 配置类型
export type VisualEditorConfig = ReturnType<typeof createVisualEditorConfig>;

// 辅助线的数据类型
export interface VisualEditorMarkLine {
  x: { left: number; showLeft: number }[];
  y: { top: number; showTop: number }[];
}
