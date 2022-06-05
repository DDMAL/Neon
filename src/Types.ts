/** Type definitions for Neon */

export type Attributes = { pname?: string; oct?: number; shape?: string; line?: number; ligated?: boolean; curve?: string; tilt?: string; form?: string };

/** Drag editing action sent to verovio as described [here](https://github.com/DDMAL/Neon/wiki/Toolkit-Actions). */
export type DragAction = {
  action: 'drag',
  param: {
    elementId: string,
    x: number,
    y: number
  }
};

/** Resize editing action sent to verovio as described [here](https://github.com/DDMAL/Neon/wiki/Toolkit-Actions). */
export type ResizeAction = {
  action: 'resize',
  param: {
    elementId: string,
    ulx: number,
    uly: number,
    lrx: number,
    lry: number
  }
};

export type ResizeRotateAction = {
  action: 'resizeRotate',
  param: {
    elementId: string,
    ulx: number,
    uly: number,
    lrx: number,
    lry: number,
    rotate: number
  }
};

export type InsertAction = {
  action: 'insert',
  param: {
    elementType: string,
    staffId: string | 'auto',
    ulx?: number,
    uly?: number,
    lrx?: number,
    lry?: number,
    // TODO: attributes are currently never used yet in Neon
    attributes?: {
      shape: string
    }
  }
};

export type InsertToSyllableAction = {
  action: 'insertToSyllable',
  param: {
    elementId: string
  }
};

export type MoveOuttaSyllableAction = {
  action: 'moveOuttaSyllable',
  param: {
    elementId: string
  }
};

export type RemoveAction = {
  action: 'remove',
  param: {
    elementId: string
  }
};

export type GroupingAction = {
  action: 'group',
  param: {
    groupType: 'neume' | 'nc',
    elementIds: string[]
  }
};

export type UngroupingAction = {
  action: 'ungroup',
  param: {
    groupType: 'neume' | 'nc',
    elementIds: string[]
  }
};

export type SetAction = {
  action: 'set',
  param: {
    elementId: string,
    attrType: string,
    attrValue: string
  }
};

export type MergeAction = {
  action: 'merge',
  param: {
    elementIds: string[]
  }
};

export type SplitAction = {
  action: 'split',
  param: {
    elementId: string,
    x: number
  }
};

export type SplitNeumeAction = {
  action: 'splitNeume',
  param: {
    elementId: string,
    ncId: string
  }
};

export type SetTextAction = {
  action: 'setText',
  param: {
    elementId: string,
    text: string
  }
};

export type SetClefAction = {
  action: 'setClef',
  param: {
    elementId: string,
    shape: string
  }
};

export type ToggleLigatureAction = {
  action: 'toggleLigature',
  param: {
    elementIds: string[]
  }
};

// MIGHT BE USELESS: does not exist in Verovio
export type ChangeSkewAction = {
  action: 'changeSkew',
  param: {
    elementId: string,
    dy: number,
    rightSide: boolean
  }
};

export type ChangeStaffAction = {
  action: 'changeStaff',
  param: {
    elementId: string
  }
};

export type ChangeGroupAction = {
  action: 'changeGroup',
  param: {
    elementId: string,
    contour: string
  }
};

/** An editing action sent to verovio as described [here](https://github.com/DDMAL/Neon/wiki/Toolkit-Actions). */
export type EditorAction =
  | DragAction 
  | ResizeAction
  | ResizeRotateAction
  | InsertAction
  | InsertToSyllableAction
  | MoveOuttaSyllableAction
  | RemoveAction
  | GroupingAction
  | UngroupingAction
  | SetAction
  | MergeAction
  | SplitAction
  | SplitNeumeAction
  | SetTextAction
  | SetClefAction
  | ToggleLigatureAction
  | ChangeSkewAction
  | ChangeStaffAction
  | ChangeGroupAction
  | ChainAction;

export type ChainAction = {
  action: 'chain',
  param: EditorAction[]
};

/** A message sent to the verovio web worker. */
export type VerovioMessage = {
  action: string,
  id: string,
  mei?: string,
  elementId?: string,
  editorAction?: EditorAction
};

export type VerovioResponse = {
  id: string,
  svg?: string,
  attributes?: Attributes,
  result?: boolean,
  mei?: string,
  info?: {
    status: string,
    message: string
  };
};

/** Modeled after the [W3 Web Annotation Data Model.](https://www.w3.org/TR/annotation-model/) */
export type WebAnnotation = {
  id: string,
  type: string,
  body: string,
  target: string
};

/** Required @context field in the JSON-LD Neon manifest;
 * see https://github.com/DDMAL/Neon/blob/gh-pages/contexts/1/manifest.JSON-LD
 */
export type NeonContext = {
  schema: string,
  title: string,
  timestamp: string,
  image: {
    '@id': string,
    '@type': string,
  },
  mei_annotations: {
    '@id': string,
    '@type': string,
    '@container': string
  }
};

/** Required fields in the JSON-LD Neon manifest. */
export type NeonManifest = {
  '@context': Array<string | NeonContext> | string,
  '@id': string,
  title: string,
  timestamp: string,
  image: string,
  mei_annotations: WebAnnotation[]
};

/** An <svg> element from any DOM queries */
export type HTMLSVGElement = HTMLElement & SVGSVGElement;

/** "Selection By" type */
export type SelectionType = 'selByStaff' | 'selByNeume' | 'selByNc' | 'selByLayerElement' | 'selBySyl' | 'selByBBox' | 'selByLayerElement';

/** Highlight grouping type  */
export type GroupingType = 'staff' | 'syllable' | 'neume' | 'layer' | 'selection' | 'none';

