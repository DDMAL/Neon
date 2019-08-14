import NeonView from './NeonView';
import DisplayPanel from './DisplayPanel/DisplayPanel';
import { DisplayConstructable, ViewInterface } from './Interfaces';

declare var Diva: any;

/**
 * View module that uses the diva.js viewer to render the pages of a IIIF manifests
 * and then display the rendered MEI files over the proper pages.
 */
class DivaView implements ViewInterface {
  readonly neonView: NeonView;
  private updateCallbacks: Array<() => void>;
  divaReady: boolean;
  private diva: any;
  private indexMap: Map<number, string>;
  private displayPanel: DisplayPanel;
  private loadDelay: number;
  zoomHandler;

  /**
   * @param manifest - Link to the IIIF manifest.
   */
  constructor (neonView: NeonView, Display: DisplayConstructable, manifest: string) {
    this.neonView = neonView;
    this.updateCallbacks = [];
    this.divaReady = false;
    this.diva = new Diva('container', {
      objectData: manifest
    });
    document.getElementById('container').style.minHeight = '100%';
    this.indexMap = new Map();
    this.diva.disableDragScrollable();
    this.displayPanel = new Display(this, 'neon-container', 'diva-viewer-canvas');
    this.loadDelay = 500; // in milliseconds
    this.initDivaEvents();
    this.setViewEventHandlers();

    window.onresize = () => {
      let height = window.innerHeight;
      let width = window.innerWidth;

      window.setTimeout(() => {
        if ((height === window.innerHeight) && (width === window.innerWidth)) {
          this.changePage(this.getCurrentPage(), false);
        }
      }, this.loadDelay);
    };
  }

  /**
   * Set the listeners for certain events internal to diva.js
   */
  initDivaEvents () {
    Diva.Events.subscribe('ManifestDidLoad', this.parseManifest.bind(this), this.diva.settings.ID);
    Diva.Events.subscribe('ObjectDidLoad', this.didLoad.bind(this), this.diva.settings.ID);
    Diva.Events.subscribe('ActivePageDidChange', this.changePage.bind(this), this.diva.settings.ID);
    Diva.Events.subscribe('ZoomLevelDidChange', this.adjustZoom.bind(this), this.diva.settings.ID);
  }

  /**
   * Called when the visible page changes in the diva.js viewer.
   * @param pageIndex - The zero-indexed page that is most visible.
   * @param delay - Whether to delay the loading of the page so that neon doesn't lag while scrolling.
   */
  async changePage (pageIndex: number, delay: boolean = true): Promise<void> {
    let pageIndexes = [pageIndex];
    Array.from(document.getElementsByClassName('active-page')).forEach(elem => {
      elem.classList.remove('active-page');
    });
    for (let page of pageIndexes) {
      window.setTimeout(checkAndLoad.bind(this), (delay ? this.loadDelay : 0), page);
    }

    function checkAndLoad (page: number) {
      if (page === this.getCurrentPage()) {
        let pageURI = this.indexMap.get(page);
        this.neonView.getPageSVG(pageURI).then((svg: SVGSVGElement) => {
          this.updateSVG(svg, page);
          let containerId = 'neon-container-' + page;
          let container = document.getElementById(containerId);
          if (container !== null) {
            container.classList.add('active-page');
          }
          this.updateCallbacks.forEach((callback: Function) => callback());
        }).catch(err => {
          if (err.name !== 'not_found' && err.name !== 'missing_mei') {
            console.error(err);
          }
        });
      }
    }
  }

  /**
   * Get the active page in the diva.js viewer.
   */
  getCurrentPage (): number {
    return this.diva.getActivePageIndex();
  }

  /**
   * Get the active page URI in the diva.js viewer.
   */
  getCurrentPageURI (): string {
    return this.indexMap.get(this.getCurrentPage());
  }

  /**
   * Adjust the rendered SVG(s) to be the correct size after zooming.
   */
  adjustZoom () {
    (new Promise((resolve) => {
      Array.from(document.getElementsByClassName('neon-container'))
        .forEach((elem: HTMLElement) => { elem.style.display = 'none'; });
      setTimeout(resolve, this.diva.settings.zoomDuration + 100);
    })).then(() => {
      this.changePage(this.diva.getActivePageIndex(), true);
      Array.from(document.getElementsByClassName('neon-container'))
        .forEach((elem: HTMLElement) => {
          let svg = <SVGSVGElement>elem.firstChild;
          let pageNo = parseInt(elem.id.match(/\d+/)[0]);
          this.updateSVG(svg, pageNo);
          elem.style.display = '';
        });
    });
  }

  /**
   * Update the SVG being displayed for the specified page.
   * @param pageNo - The zero-indexed page number.
   */
  updateSVG (svg: SVGSVGElement, pageNo: number) {
    let inner = document.getElementById('diva-1-inner');
    let dimensions = this.diva.getPageDimensionsAtCurrentZoomLevel(pageNo);
    let offset = this.diva.settings.viewHandler._viewerCore.getPageRegion(pageNo, {
      includePadding: true,
      incorporateViewport: true
    });
    let marginLeft = window.getComputedStyle(inner, null)
      .getPropertyValue('margin-left');

    let containerId = 'neon-container-' + pageNo.toString();
    let container = document.getElementById(containerId);
    if (container === null) {
      container = document.createElement('div');
      container.id = containerId;
      container.classList.add('neon-container');
      inner.appendChild(container);
    }

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    svg.setAttribute('width', dimensions.width);
    svg.setAttribute('height', dimensions.height);
    container.style.position = 'absolute';
    container.style.top = `${offset.top}px`;
    container.style.left = `${offset.left - parseInt(marginLeft)}px`;

    container.appendChild(svg);
  }

  /**
   * Function called when diva.js finishes loading.
   */
  didLoad () {
    this.divaReady = true;
    this.displayPanel.setDisplayListeners();
    document.getElementById('loading').style.display = 'none';
    console.log(this.diva);
  }

  /**
   * Add a callback function that will be run whenever an SVG is updated.
   */
  addUpdateCallback (cb: () => void): void {
    this.updateCallbacks.push(cb);
  }

  /**
   * Remove a callback function previously added to the list of functions to call.
   */
  removeUpdateCallback (cb: () => void): void {
    let index = this.updateCallbacks.findIndex((elem) => {
      return elem === cb;
    });
    if (index !== -1) {
      this.updateCallbacks.splice(index, 1);
    }
  }

  /**
   * Set listeners on the body element for global events.
   */
  setViewEventHandlers () {
    document.body.addEventListener('keydown', (evt) => {
      switch (evt.key) {
        case 'h':
          for (let container of <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName('neon-container')) {
            container.style.visibility = 'hidden';
          }
          break;
        default: break;
      }
    });

    document.body.addEventListener('keyup', (evt) => {
      switch (evt.key) {
        case 'h':
          for (let container of <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName('neon-container')) {
            container.style.visibility = '';
          }
          break;
        default: break;
      }
    });
  }

  /**
   * Use the IIIF manifest to create a map between IIIF canvases and page indexes.
   * @param manifest - The IIIF manifest object.
   */
  parseManifest (manifest: any) {
    this.indexMap.clear();
    for (let sequence of manifest.sequences) {
      for (let canvas of sequence.canvases) {
        this.indexMap.set(sequence.canvases.indexOf(canvas), canvas['@id']);
      }
    }
  }

  /**
   * Get the name of the active page/canvas combined with the manuscript name.
   */
  getPageName (): string {
    let manuscriptName = this.diva.settings.manifest.itemTitle;
    let pageName = this.diva.settings.manifest.pages[this.getCurrentPage()].l;
    return manuscriptName + ' \u2014 ' + pageName;
  }
}

export { DivaView as default };
