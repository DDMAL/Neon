/** @module SingleView/DisplayPanel */

import { setZoomHandler, initDisplayControls } from './DisplayControls.js';
import Icons from '../img/icons.svg';
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
    displayPanel.innerHTML = displayControlsPanel(handleZoom);
    if (handleZoom) {
      this.zoomHandler = new ZoomHandler();
      setZoomHandler(this.zoomHandler);
    }
    this.view.addUpdateCallback(this.setDisplayListeners);
  }

  setDisplayListeners () {
    initDisplayControls();
  }
}

/**
 * Return the HTML for the display panel.
 * @param {boolean} handleZoom - Whether or not to include zoom controls.
 * @returns {string}
 */
function displayControlsPanel (handleZoom) {
  let contents =
  "<p class='panel-heading' id='displayHeader'>Display" +
  "<svg class='icon is-pulled-right'><use id='toggleDisplay' xlink:href='" + Icons + "#dropdown-down'></use></svg></p>" +
  "<div id='displayContents'>";
  if (handleZoom) {
    contents +=
    "<a class='panel-block has-text-centered'><button class='button' id='reset-zoom'>Zoom</button>" +
    "<input class='slider is-fullwidth' id='zoomSlider' step='5' min='25' max='400' value='100' type='range'/>" +
    "<output id='zoomOutput' for='zoomSlider'>100</output></a>";
  }
  contents +=
  "<a class='panel-block has-text-centered'><button class='button' id='reset-opacity'>Glyph Opacity</button>" +
  "<input class='slider is-fullwidth' id='opacitySlider' step='5' min='0' max='100' value='100' type='range'/>" +
  "<output id='opacityOutput' for='opacitySlider'>100</output></a>" +
  "<a class='panel-block has-text-centered'><button class='button' id='reset-bg-opacity'>Image Opacity</button>" +
  "<input class='slider is-fullwidth' id='bgOpacitySlider' step='5' min='0' max='100' value='100' type='range'/>" +
  "<output id='bgOpacityOutput' for='bgOpacitySlider'>100</output></a>" +
  "<div class='panel-block' id='extensible-block'>" +
  "<div class='dropdown' id='highlight-dropdown'><div class='dropdown-trigger'>" +
  "<button class='button' id='highlight-button' aria-haspopup='true' aria-controls='highlight-menu'>" +
  "<span>Highlight</span><span id='highlight-type'>&nbsp;- Off</span>" +
  "<svg class='icon'><use id='toggleDisplay' xlink:href='" + Icons + "#dropdown-down'></use>" +
  "</svg></button></div><div class='dropdown-menu' id='highlight-menu' role='menu'>" +
  "<div class='dropdown-content'><a class='dropdown-item' id='highlight-staff'>Staff</a>" +
  "<a class='dropdown-item' id='highlight-syllable'>Syllable</a>" +
  "<a class='dropdown-item' id='highlight-neume'>Neume</a><hr class='dropdown-divider'/>" +
  "<a class='dropdown-item' id='highlight-none'>None</a></div></div></div></div></div>";
  return contents;
}

export { DisplayPanel as default };
