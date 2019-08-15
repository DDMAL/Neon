/** Type definitions for Neon */

export type Attributes = { pname?: string; oct?: number; shape?: string; line?: number; ligated?: boolean };

export type EditorAction = { action: string; param: object | EditorAction[] };

export type VerovioMessage = {
  action: string;
  id: string;
  mei?: string;
  elementId?: string;
  editorAction?: EditorAction;
};
