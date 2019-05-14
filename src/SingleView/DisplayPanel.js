import * as Contents from '../utils/Contents.js';
import * as Controls from '../utils/Controls.js';
import ZoomHandler from './Zoom.js';

/**
 * A class that sets up and manages the display panel in Neon.
 */
class DisplayPanel {
  /**
   * Constructor for a DisplayPanel.
   * @param {object} view - The parent View module.
   * @param {SVGSVGElement} mei - The DOM element for the MEI rendering.
   * @param {SVGImageElement} background - The DOM element for the background.
   * @param {boolean} - Whether or not the display panel should manage zooming.
   */
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

export { DisplayPanel as default };
