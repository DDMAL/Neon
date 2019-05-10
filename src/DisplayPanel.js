import * as Contents from './Contents.js';
import * as Controls from './Controls.js';
import ZoomHandler from './Zoom.js';

export default class DisplayPanel {
  constructor (view, mei, background, handleZoom) {
    this.mei = mei;
    this.background = background;
    this.handleZoom = handleZoom;
    this.view = view;

    let displayPanel = document.getElementById('display_controls');
    displayPanel.innerHTML = Contents.displayControlsPanel(handleZoom);
    if (handleZoom) {
      this.zoomHandler = new ZoomHandler();
      Controls.setZoomHandler(this.zoomHandler);
    }
    this.view.addUpdateCallback(this.setDisplayListeners);
  }

  setDisplayListeners () {
    Controls.initDisplayControls();
  }
}
