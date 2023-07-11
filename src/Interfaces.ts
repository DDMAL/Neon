import { NeonManifest, UserType } from './Types';
import NeonView from './NeonView';
import ZoomHandler from './SingleView/Zoom';
import { ModalWindowView } from './utils/ModalWindow';

export interface DisplayConstructable {
  new (a: ViewInterface, b: string, c: string, d?: ZoomHandler): DisplayInterface;
}

export interface DisplayInterface {
  view: ViewInterface;
  meiClass: string;
  background: string;
  zoomHandler: ZoomHandler;
  setDisplayListeners (): void;
  updateVisualization (): void;
  loadSettings (): void;
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
  onSVGLoad? (): void;
}

export interface NeumeEditConstructable {
  new (a: NeonView): NeumeEditInterface;
}

export interface NeumeEditInterface {
  initEditMode (): void;
  getUserMode (): UserType;
  setSelectListeners (): void;
}

export interface TextEditConstructable {
  new (a: NeonView): TextEditInterface;
}

export interface TextEditInterface {
  initTextEdit (): void;
  initSelectByBBoxButton (): void;
}

export interface ModalWindowInterface {
  setModalWindowView(view: ModalWindowView): void;
  openModalWindow(): void;
  hideModalWindow(): void;
}

export interface TextViewConstructable {
  new (a: NeonView): TextViewInterface;
}

export interface TextViewInterface {
  updateBBoxVisibility (): void;
  getSylText (): string;
}

export interface InfoConstructable {
  new (a: NeonView): InfoInterface;
}

export interface InfoInterface {
  getContour (ncs: Iterable<SVGGraphicsElement>): Promise<string>;
  getPitches (ncs: Iterable<SVGGraphicsElement>): Promise<string>;
  pitchNameToNum (pname: string): number;
  getContourByValue (value: string): string;
  updateInfoModule (body: string): void;
  infoListeners (): void;
  stopListeners (): void;
  resetInfoListeners (): void;
  updateInfo (evt: MouseEvent): Promise<void>;
}

export interface NeonViewParams {
  manifest: NeonManifest;
  View: ViewConstructable;
  Display: DisplayConstructable;
  Info: InfoConstructable;
  NeumeEdit?: NeumeEditConstructable;
  TextView?: TextViewConstructable;
  TextEdit?: TextEditConstructable;
}
