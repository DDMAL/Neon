class DivaView {
  constructor (neonView, Display, manifest) {
    this.neonView = neonView;
    this.updateCallbacks = [];
    this.divaReady = false;
    this.diva = new Diva('container', {
      objectData: manifest
    });
    document.getElementById('container').style.minHeight = '100%';
    this.diva.disableDragScrollable();
    this.displayPanel = new Display(this, 'neon-container', 'diva-viewer-canvas');
    this.initDivaEvents();
    // this.setViewEventHandlers();
  }

  initDivaEvents () {
    Diva.Events.subscribe('ObjectDidLoad', this.didLoad.bind(this), this.diva.settings.ID)
    Diva.Events.subscribe('VisiblePageDidChange', this.changePage.bind(this), this.diva.settings.ID);
    Diva.Events.subscribe('ZoomLevelDidChange', this.adjustZoom.bind(this), this.diva.settings.ID);
  }

  /**
   * Called when the visible page changes in the diva.js viewer.
   * @param {number | number[]} pageIndexes - The zero-index or -indexes of the page(s) visible.
   */
  async changePage (pageIndexes) {
    if (typeof pageIndexes !== 'object') {
      pageIndexes = [pageIndexes];
    }
    Array.from(document.getElementsByClassName('active-page')).forEach(elem => {
      elem.classList.remove('active-page');
    });
    for (let page of pageIndexes) {
      try {
        let svg = await this.neonView.getPageSVG(page);
        this.updateSVG(svg, page);
      } 
      catch(err) {
        if (err.name !== 'not_found' && err.name !== 'missing_mei') {
          console.error(err);
        }
      }
    }
    let containerId = 'neon-container-' + this.getCurrentPage();
    let container = document.getElementById(containerId);
    if (container !== null) {
      container.classList.add('active-page');
    }
    this.updateCallbacks.forEach(callback => callback());
  }

  /**
   * Get the active page in the diva.js viewer.
   * @returns {number}
   */
  getCurrentPage () {
    return this.diva.getActivePageIndex();
  }

  /**
   * Adjust the rendered SVG(s) to be the correct size after zooming.
   * @param {number} zoomLevel - The new diva.js zoom level.
   */
  adjustZoom (zoomLevel) {
    (new Promise((resolve) => {
      Array.from(document.getElementsByClassName('neon-container'))
        .forEach(elem => { elem.style.display = 'none'; });
      setTimeout(resolve, this.diva.settings.zoomDuration + 100);
    })).then(() => {
      this.changePage(this.diva.getActivePageIndex());
      Array.from(document.getElementsByClassName('neon-container'))
        .forEach(elem => { elem.style.display = ''; });
    });
  }

  /**
   * Update the SVG being displayed for the specified page.
   * @param {SVGSVGElement} svg - The updated SVG.
   * @param {number} pageNo - The zero-indexed page number.
   */
  updateSVG (svg, pageNo) {
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

  addUpdateCallback (cb) {
    this.updateCallbacks.push(cb);
  }

  removeUpdateCallback (cb) {
    let index = this.updateCallbacks.findItem((elem) => {
      return elem === cb;
    });
    if (index !== -1) {
      this.updateCallbacks.splice(index, 1);
    }
  }

  setViewEventHandlers () {
    document.body.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'Shift':
          this.diva.enableDragScrollable();
          break;
        default:
          break;
      }
    });
    document.body.addEventListener('keyup', (event) => {
      switch (event.key) {
        case 'Shift':
          this.diva.disableDragScrollable();
          break;
        default:
          break;
      }
    });
  }

  getPageName () {
    let manuscriptName = this.diva.settings.manifest.itemTitle;
    let pageName = this.diva.settings.manifest.pages[this.getCurrentPage()].l;
    return manuscriptName + ' \u2014 ' + pageName;
  }
}

export { DivaView as default };
