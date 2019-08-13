import { NeonManifest } from './utils/NeonManifest';
import NeonView from './NeonView';
import ZoomHandler from './SingleView/Zoom';

export interface DisplayConstructable {
  new (a: ViewInterface, b: string, c: string, d?: ZoomHandler): DisplayInterface;
}

export interface DisplayInterface {
  view: ViewInterface;
  className: string;
  background: string;
  zoomHandler: ZoomHandler;
  setDisplayListeners (): void;
  updateVisualization (): void;
}

export interface ViewConstructable {
  new (a: NeonView, b: DisplayConstructable, c: string): ViewInterface;
}

export interface ViewInterface {
  zoomHandler: ZoomHandler;
  changePage (pageIndex: number, delay: boolean): Promise<void>;
  addUpdateCallback(a: Function);
  getCurrentPage (): number;
  getCurrentPageURI (): string;
  getPageName (): string;
}

export interface SimpleConstructable {
  new (a: NeonView): any;
}

export interface NeonViewParams {
  manifest: NeonManifest,
  View: ViewConstructable,
  Display: DisplayConstructable,
  Info: SimpleConstructable,
  NeumeEdit?: SimpleConstructable,
  TextView?: SimpleConstructable,
  TextEdit?: SimpleConstructable
}