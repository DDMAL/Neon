import * as DisplayControls from './DisplayControls';
import ZoomHandler from '../SingleView/Zoom';
import { DisplayInterface, ViewInterface } from '../Interfaces';

/**
 * Return the HTML for the display panel.
 * @param {ZoomHandler} handleZoom - Includes zoom controls if defined.
 * @returns {string}
 */
function displayControlsPanel (handleZoom: ZoomHandler): string {
  let contents = `
    <p class="panel-heading" id="displayHeader">DISPLAY
      <svg class="icon is-pulled-right">
        <use id="toggleDisplay" xlink:href="${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-down"></use>
      </svg>
    </p>
    <div id="displayContents">
  `;

  if (handleZoom !== undefined) {
    contents += `
      <a class="panel-block has-text-centered" style="cursor: default">
        <button class="button" id="reset-zoom">Zoom</button>
        <input type="range"
          step="5" min="25" max="400" value="100"
          aria-labelledby="reset-zoom"
          class="slider is-fullwidth is-large"
          id="zoomSlider"
          style="padding-left: 1rem; padding-right: 1rem;"
          disabled="disabled"
        />
        <output id="zoomOutput" for="zoomSlider">100</output>
      </a>
    `;
  }
  contents += `
      <a class="panel-block has-text-centered" style="cursor: default">
        <button class="button" id="reset-opacity">Glyph Opacity</button>
        <input type="range"
          step="5" min="0" max="100" value="100"
          aria-labelledby="reset-opacity"
          class="slider is-fullwidth is-large"
          id="opacitySlider"
          style="padding-left: 1rem; padding-right: 1rem;"
          disabled="disabled"
        />
        <output id="opacityOutput" for="opacitySlider">100</output>
      </a>
      <a class="panel-block has-text-centered" style="cursor: default">
        <button class="button" id="reset-bg-opacity">Image Opacity</button>
        <input type="range"
          step="5" min="0" max="100" value="100"
          aria-labelledby="reset-bg-opacity"
          class="slider is-fullwidth is-large"
          id="bgOpacitySlider"
          style="padding-left: 1rem; padding-right: 1rem;"
          disabled="disabled"
        />
        <output id="bgOpacityOutput" for="bgOpacitySlider">100</output>
      </a>
      <div class="panel-block" id="extensible-block">
        <div class="dropdown" id="highlight-dropdown">
          <div class="dropdown-trigger">
            <button class="button" id="highlight-button" aria-haspopup="true" aria-controls="highlight-menu" style="width: auto">
              <span>Highlight</span>
              <span id="highlight-type">&nbsp;- Off</span>
              <svg class="icon">
                <use id="toggleDisplay" xlink:href="${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-down"></use>
              </svg>
            </button>
          </div>
          <div class="dropdown-menu" id="highlight-menu" role="menu">
            <div class="dropdown-content">
              <a aria-role="menuitem" class="dropdown-item" id="highlight-staff">Staff</a>
              <a aria-role="menuitem" class="dropdown-item" id="highlight-syllable">Syllable</a>
              <a aria-role="menuitem" class="dropdown-item" id="highlight-neume">Neume</a>
              <a aria-role="menuitem" class="dropdown-item" id="highlight-layerElement">LayerElement</a>
              <hr class="dropdown-divider"/>
              <a aria-role="menuitem" class="dropdown-item" id="highlight-none">None</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return contents;
}

/**
 * A class that sets the content of the display panel to the right and
 * manages controls for viewing.
 */
class DisplayPanel implements DisplayInterface {
  view: ViewInterface;
  meiClass: string;
  background: string;
  zoomHandler: ZoomHandler;

  /**
   * Constructor for DisplayPanel.
   * @param {SingleView | DivaView} view - The View parent.
   * @param {string} mei - The class name for the SVG-rendered MEI.
   * @param {string} background - The class name associated with the background.
   * @param {ZoomHandler} [zoomHandler] - The ZoomHandler object, if SingleView.
   */
  constructor (view: ViewInterface, mei: string,
    background: string, zoomHandler: ZoomHandler = undefined) {
    this.view = view;
    this.meiClass = mei;
    this.background = background;
    this.zoomHandler = zoomHandler;

    const displayPanel = document.getElementById('display_controls');
    displayPanel.innerHTML = displayControlsPanel(this.zoomHandler);
    this.view.addUpdateCallback(this.updateVisualization.bind(this));
  }

  /**
   * Apply event listeners related to the DisplayPanel.
   */
  setDisplayListeners (): void {
    if (this.zoomHandler) {
      // Zoom handler stuff
      DisplayControls.setZoomControls(this.zoomHandler);
    }
    DisplayControls.initDisplayControls(this.meiClass, this.background);
  }

  /**
   * Update SVG based on visualization settings
   */
  updateVisualization (): void {
    DisplayControls.setOpacityFromSlider(this.meiClass);
    DisplayControls.updateHighlight();
  }
}

export { DisplayPanel as default };
