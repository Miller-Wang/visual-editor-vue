export interface VisualEditorBlockData {
  top: number;
  left: number;
}

export interface VisualEditorModelValue {
  container: {
    width: number;
    height: number;
  };
  blocks: VisualEditorBlockData[];
}
