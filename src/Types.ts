/** Type definitions for Neon */

export type Attributes = { pname?: string; oct?: number; shape?: string; line?: number; ligated?: boolean };

/** An editing action sent to verovio as described [here](https://github.com/DDMAL/Neon/wiki/Toolkit-Actions). */
export type EditorAction = {
  action: string;
  param: object | EditorAction[];
};

/** A message sent to the verovio web worker. */
export type VerovioMessage = {
  action: string;
  id: string;
  mei?: string;
  elementId?: string;
  editorAction?: EditorAction;
};
