import { updateHighlight, setOpacityFromSlider } from '../DisplayPanel/DisplayControls.js';
import * as Cursor from '../utils/Cursor.js';
import ZoomHandler from './Zoom.js';

const d3 = require('d3');
const $ = require('jquery');

/**
 * A view module for displaying a single page of a manuscript.
 */
class SingleView {
  /**
   * Constructor for SingleView.
   * @param {NeonView} neonView - The NeonView parent.
   * @param {function} DisplayPanel - The constructor for a DisplayPanel.
   * @param {string} image - The link to the background image for the page.
   */
  constructor (neonView, DisplayPanel, image) {
    this.neonView = neonView;
    this.container = document.getElementById('container');
    this.updateCallbacks = new Array(0);
    // Group will contain the image and the rendered SVG
    this.group = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.group.id = 'svg_group';
    this.group.setAttribute('height', window.innerHeight);
    this.group.setAttribute('width', '100%');

    this.bg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    this.bg.id = 'bgimg';
    this.bg.classList.add('background');
    this.bg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', image);
    this.bg.setAttribute('x', 0);
    this.bg.setAttribute('y', 0);

    this.mei = document.createElementNS('http://www.w3.org/svg', 'svg');
    this.mei.id = 'mei_output';
    this.mei.classList.add('neon-container', 'active-page');

    this.group.appendChild(this.bg);
    this.group.appendChild(this.mei);
    this.container.appendChild(this.group);

    this.zoomHandler = new ZoomHandler();
    this.displayPanel = new DisplayPanel(this, 'neon-container', 'background', this.zoomHandler);

    this.setViewEventHandlers();
    this.displayPanel.setDisplayListeners();

    document.getElementById('loading').style.display = 'none';
  }

  /**
   * Update the SVG being displayed.
   * @param {SVGSVGElement} svg - The SVG to update to.
   */
  updateSVG (svg/*, pageNo */) {
    this.group.replaceChild(svg, this.mei);
    this.mei = svg;
    this.mei.id = 'mei_output';
    this.mei.classList.add('neon-container', 'active-page');
    let height = parseInt(this.mei.getAttribute('height'));
    let width = parseInt(this.mei.getAttribute('width'));

    this.bg.setAttribute('height', height);
    this.bg.setAttribute('width', width);
    this.group.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    updateHighlight();
    this.resetTransformations();
    this.updateCallbacks.forEach(callback => callback());
  }

  /**
   * Add a callback to the list of those be called when the page updates.
   * @param {function} cb - The callback function to add to the list.
   */
  addUpdateCallback (cb) {
    this.updateCallbacks.push(cb);
  }

  /**
   * Remove a callback from the list of callbacks if it is part of the list.
   * @param {function} cb - The callback to be removed.
   */
  removeUpdateCallback (cb) {
    let index = this.updateCallbacks.findIndex((elem) => {
      return elem === cb;
    });
    if (index !== -1) {
      this.updateCallbacks.splice(index, 1);
    }
  }

  /**
   * Reset the transformations that have been applied to the SVG upon update.
   */
  resetTransformations () {
    this.displayPanel.zoomHandler.restoreTransformation();
    setOpacityFromSlider();
  }

  /**
   * Returns the zero-indexed number of the current page. This will always be zero.
   * @returns {number}
   */
  getCurrentPage () {
    return 0;
  }

  /**
   * Set event handlers for the view and display panel.
   */
  setViewEventHandlers () {
    $('body').on('keydown keyup', (evt) => {
      if (evt.type === 'keydown') {
        switch (evt.key) {
          case 'Shift':
            d3.select('#svg_group').on('.drag', null);
            d3.select('#svg_group').call(
              d3.drag().on('start', this.displayPanel.zoomHandler.startDrag)
                .on('drag', this.displayPanel.zoomHandler.dragging)
            );
            Cursor.updateCursorTo('grab');
            break;
          case 'h':
            $('#mei_output').css('visibility', 'hidden');
            break;
          default: break;
        }
      } else {
        switch (evt.key) {
          case 'Shift':
            d3.select('#svg_group').on('.drag', null);
            Cursor.updateCursorTo('');
            if (this.neonView.getUserMode !== 'viewer') {
              this.neonView.SquareEdit.setSelectListeners();
            }
            if (this.neonView.getUserMode() === 'insert') {
              Cursor.updateCursor();
            }
            break;
          case 'h':
            $('#mei_output').css('visibility', 'visible');
            break;
          default: break;
        }
      }
    });

    d3.select('#container').on('touchstart', () => {
      if (d3.event.touches.length === 2) {
        this.displayPanel.zoomHandler.startDrag();
        d3.select('#container').on('touchmove', this.displayPanel.zoomHandler.dragging);
        d3.select('#container').on('touchend', () => {
          d3.select('#container').on('touchmove', null);
        });
      }
    });
    d3.select('#container').on('wheel', this.displayPanel.zoomHandler.scrollZoom, false);
    // Update height of container based on window
    $(window).on('resize', () => {
      let newHeight = window.innerHeight;
      if (newHeight > Number($('#container').attr('height'))) {
        $('#container').attr('height', newHeight);
      }
    });
  }

  /**
   * A human readable name for the page. Used for downloads.
   * @returns {string}
   */
  getPageName () {
    return this.neonView.name;
  }
}

export { SingleView as default };
