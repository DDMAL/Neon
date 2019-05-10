import * as Controls from './Controls.js';

export default class SingleView {
  constructor (DisplayPanel, image) {
    this.container = document.getElementById('container');
    this.updateCallbacks = new Array(0);
    // Group will contain the image and the rendered SVG
    this.group = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.group.id = 'svg_group';
    this.group.setAttribute('height', window.innerHeight);
    this.group.setAttribute('width', '100%');

    this.bg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    this.bg.id = 'bgimg';
    this.bg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', image);
    this.bg.setAttribute('x', 0);
    this.bg.setAttribute('y', 0);

    this.mei = document.createElementNS('http://www.w3.org/svg', 'svg');
    this.mei.id = 'mei_output';

    this.group.appendChild(this.bg);
    this.group.appendChild(this.mei);
    this.container.appendChild(this.group);

    this.displayPanel = new DisplayPanel(this, this.mei.id, this.bg.id, true);

    document.getElementById('loading').style.display = 'none';
  }

  updateSVG (svg/*, pageNo */) {
    this.group.replaceChild(svg, this.mei);
    this.mei = svg;
    let height = parseInt(this.mei.getAttribute('height'));
    let width = parseInt(this.mei.getAttribute('width'));

    this.bg.setAttribute('height', height);
    this.bg.setAttribute('width', width);
    this.group.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    Controls.updateHighlight();
    this.resetTransformations();
    this.updateCallbacks.forEach(callback => callback());
  }

  addUpdateCallback (cb) {
    this.updateCallbacks.push(cb);
  }

  removeUpdateCallback (cb) {
    let index = this.updateCallbacks.findIndex((elem) => {
      return elem === cb;
    });
    if (index !== -1) {
      this.updateCallbacks.splice(index, 1);
    }
  }

  resetTransformations () {
    this.displayPanel.zoomHandler.restoreTransformation();
    Controls.setOpacityFromSlider();
  }

  getCurrentPage () {
    return 0;
  }
}
