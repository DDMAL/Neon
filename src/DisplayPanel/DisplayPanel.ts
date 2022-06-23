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
    <div class="panel-heading" id="displayHeader">
      <div class="panel-heading-title">DISPLAY</div>
      <svg class="icon is-pulled-right">
        <use id="toggleDisplay" class="panel-dropdown-icon" xlink:href="${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-down"></use>
      </svg>
    </div>
    <div id="displayContents" class="panel-contents">
      <div class="panel-content-subsection first-subsection">
  `;

  if (handleZoom !== undefined) {
    contents += `
        <div class="slider-container display-panel" style="cursor: default">
          <button class="side-panel-btn slider-btn" id="reset-zoom">Zoom</button>
          <input type="range"
            step="5" min="25" max="400" value="100"
            aria-labelledby="reset-zoom"
            class="slider is-fullwidth is-large"
            id="zoomSlider"
            style="padding-left: 1rem; padding-right: 1rem;"
            disabled="disabled"
          />
          <output id="zoomOutput" for="zoomSlider">100</output>
        </div>`;
  }
  contents += `
        <div class="slider-container display-panel" style="cursor: default">
          <button class="side-panel-btn slider-btn" id="reset-opacity">Glyph Opacity</button>
          <input type="range"
            step="5" min="0" max="100" value="100"
            aria-labelledby="reset-opacity"
            class="slider is-fullwidth is-large"
            id="opacitySlider"
            style="padding-left: 1rem; padding-right: 1rem;"
            disabled="disabled"
          />
          <output id="opacityOutput" for="opacitySlider">100</output>
        </div>
        
        <div class="slider-container display-panel" style="cursor: default">
          <button class="side-panel-btn slider-btn" id="reset-bg-opacity">Image Opacity</button>
          <input type="range"
            step="5" min="0" max="100" value="100"
            aria-labelledby="reset-bg-opacity"
            class="slider is-fullwidth is-large"
            id="bgOpacitySlider"
            style="padding-left: 1rem; padding-right: 1rem;"
            disabled="disabled"
          />
          <output id="bgOpacityOutput" for="bgOpacitySlider">100</output>
        </div>
      </div>
      
      <div class="panel-content-subsection">

        <div id="highlight-options-title" class="panel-sub-title">Highlight Options:</div>
        <div class="dropdown" id="highlight-dropdown">
          <div class="dropdown-trigger">
            <button class="side-panel-btn" id="highlight-button" aria-haspopup="true" aria-controls="highlight-menu" style="width: auto">
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

      <div class="panel-content-subsection">
        <div id="display-options-container">
          <div id="display-options-title" class="panel-sub-title">Display Options:</div>

          <div id="display-options-items">

            <div id="checkbox-display-options">

              <div id="display-single-container"></div>

              <div id="display-all-container">
                <div id="display-options-separator">
                <div class="side-panel-btn" id="display-all-btn">Display All</div>
              </div>
            </div>

          </div>

        </div>
      </div>
      
    </div>`;

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
