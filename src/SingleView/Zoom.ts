/** @module SingleView/Zoom */

import * as d3 from 'd3';

export class ZoomHandler {
  dragCoordinates: DOMPoint;
  viewBox: ViewBox;
  matrix: DOMMatrix;

  /**
   * reset the zoom and pan of the SVG viewbox
   */
  resetZoomAndPan () {
    let bgimg = <HTMLImageElement>document.getElementById('bgimg');
    this.viewBox = new ViewBox(parseInt(bgimg.getAttribute('width')), parseInt(bgimg.getAttribute('height')));

    this.updateViewBox();
  }

  /**
   * Zoom to a certain factor.
   */
  zoomTo (k: number) {
    this.getViewBox();
    this.viewBox.zoomTo(k);
    this.updateViewBox();
  }

  /**
   * Translate the view box by relative coordinates.
   */
  translate (xDiff: number, yDiff: number) {
    this.getViewBox();
    this.viewBox.translate(xDiff, yDiff);
    this.updateViewBox();
  }

  /**
   * Restore the view box to its position before the editor action.
   */
  restoreTransformation () {
    if (this.viewBox === undefined) {
      this.resetZoomAndPan();
    } else {
      this.updateViewBox();
    }
  }

  /**
   * Get the view box from the SVG in the page.
   */
  getViewBox () {
    if (this.viewBox === undefined) {
      let bgimg = <HTMLImageElement>document.getElementById('bgimg');
      this.viewBox = new ViewBox(parseInt(bgimg.getAttribute('width')), parseInt(bgimg.getAttribute('height')));
    }
    let rawViewBox = document.getElementById('svg_group')
      .getAttribute('viewBox')
      .split(' ');
    this.viewBox.set(
      parseInt(rawViewBox[0]),
      parseInt(rawViewBox[1]),
      parseInt(rawViewBox[2]),
      parseInt(rawViewBox[3])
    );
  }

  /**
   * Update the viewBox attribute of svg_group
   */
  updateViewBox () {
    document.getElementById('svg_group').setAttribute('viewBox', this.viewBox.get());
  }

  startDrag () {
    let group = <SVGSVGElement><unknown>document.getElementById('svg_group');
    this.dragCoordinates = group.createSVGPoint();
    if (d3.event.type === 'touchstart') {
      // If drag is triggered by a touch event
      this.dragCoordinates.x = d3.event.touches[0].screenX;
      this.dragCoordinates.y = d3.event.touches[0].screenY;
    } else {
      // Otherwise triggered by a mouse click
      this.dragCoordinates.x = d3.event.x;
      this.dragCoordinates.y = d3.event.y;
    }

    this.matrix = group.getScreenCTM().inverse();
  }

  dragging () {
    let group = <SVGSVGElement><unknown>document.getElementById('svg_group');
    var newCoordinates = group.createSVGPoint();
    // Same kind of checking as in startDrag
    if (d3.event.type === 'touchmove') {
      newCoordinates.x = d3.event.touches[0].screenX;
      newCoordinates.y = d3.event.touches[0].screenY;
    } else if (d3.event.type === 'wheel' && d3.event.shiftKey === false) {
      if (this.matrix === undefined) {
        this.matrix = group.getScreenCTM().inverse();
      }
      if (this.dragCoordinates === undefined) {
        this.dragCoordinates = group.createSVGPoint();
      }
      this.dragCoordinates.x = d3.event.x;
      this.dragCoordinates.y = d3.event.y;
      newCoordinates.x = this.dragCoordinates.x - d3.event.deltaX;
      newCoordinates.y = this.dragCoordinates.y - d3.event.deltaY;
      d3.event.preventDefault();
    } else {
      newCoordinates.x = d3.event.x;
      newCoordinates.y = d3.event.y;
    }
    let newTransform = newCoordinates.matrixTransform(this.matrix);
    let dragTransform = this.dragCoordinates.matrixTransform(this.matrix);
    this.translate(-newTransform.x + dragTransform.x, -newTransform.y + dragTransform.y);
    this.dragCoordinates = newCoordinates;
  }

  scrollZoom () {
    if (d3.event.type !== 'wheel') return;
    if (!d3.event.shiftKey) {
      this.dragging();
      return;
    }
    let slider = <HTMLInputElement>document.getElementById('zoomSlider');
    this.getViewBox();
    let k = this.viewBox.getZoom();
    let newK = k - d3.event.deltaX / 100;
    if (newK < parseInt(slider.getAttribute('min')) / 100) newK = 0.25;
    if (newK > parseInt(slider.getAttribute('max')) / 100) newK = 4;
    this.zoomTo(newK);

    // Update zoom slider
    slider.value = (newK * 100).toString();
    (<HTMLOutputElement>document.getElementById('zoomOutput')).value = String(newK * 100);
  }
}

export class ViewBox {
  a: number;
  b: number;
  c: number;
  d: number;

  imageHeight: number;
  imageWidth: number;

  constructor (imageWidth: number, imageHeight: number) {
    this.a = 0;
    this.b = 0;
    this.c = imageWidth;
    this.d = imageHeight;

    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
  }

  set (w: number, x: number, y: number, z: number) {
    this.a = w;
    this.b = x;
    this.c = y;
    this.d = z;
  }

  get (): string {
    return this.a.toString() + ' ' + this.b.toString() + ' ' +
      this.c + ' ' + this.d;
  }

  zoomTo (k: number) {
    let zoomHeight = (this.imageHeight / k);
    let zoomWidth = (this.imageWidth / k);

    this.c = zoomWidth;
    this.d = zoomHeight;
  }

  getZoom (): number {
    return this.imageWidth / this.c;
  }

  translate (xDiff: number, yDiff: number) {
    this.a += xDiff;
    this.b += yDiff;
  }
}

export { ZoomHandler as default };
