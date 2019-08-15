import { getStaffBBox, selectBBox, selectStaff } from './SelectTools';
import NeonView from '../NeonView';
import DragHandler from './DragHandler';

import * as d3 from 'd3';

type Point = { x: number; y: number; name: number };

/**
 * The points you can click and drag to resize
 */
const PointNames = {
  TopLeft: 0,
  Top: 1,
  TopRight: 2,
  Right: 3,
  BottomRight: 4,
  Bottom: 5,
  BottomLeft: 6,
  Left: 7
};

/** Handle resizing of staves and text bounding boxes. */
class Resize {
  /** The element being resized. */
  element: SVGGElement;
  /** The upper-left x-coordinate of the element. */
  ulx: number;
  /** The upper-left y-coordinate of the element. */
  uly: number;
  /** The lower-right x-coordinate of the element. */
  lrx: number;
  /** The lower-right y-coordinate of the element. */
  lry: number;
  /** The skew of the bounding box in radians. */
  skew: number;

  neonView: NeonView;
  dragHandler: DragHandler;

  constructor (elementId: string, neonView: NeonView, dragHandler: DragHandler) {
    this.element = document.getElementById(elementId) as unknown as SVGGElement;
    this.neonView = neonView;
    this.dragHandler = dragHandler;
  }

  /** Draw the initial rectangle around the element and add resizing listeners. */
  drawInitialRect (): void {
    if (this.element === null) return;

    // If it's a bounding box just get the coordinates.
    if (this.element.classList.contains('syl')) {
      const rect = this.element.querySelector('.sylTextRect-display');
      if (rect === null) {
        console.warn('Tried to draw resize rect for a sylTextRect that doesn\'t exist (or isn\'t displaying)');
        return;
      }
      this.ulx = Number(rect.getAttribute('x'));
      this.uly = Number(rect.getAttribute('y'));
      this.lrx = this.ulx + Number(rect.getAttribute('width'));
      this.lry = this.uly + Number(rect.getAttribute('height'));

      this.skew = 0;
    }

    // Use paths to get bounding box in the case of a staff.
    if (this.element.classList.contains('staff')) {
      const bbox = getStaffBBox(this.element);
      this.ulx = bbox.ulx;
      this.uly = bbox.uly;
      this.lrx = bbox.lrx;
      this.lry = bbox.lry;

      const coordinates: number[] = this.element.querySelector('path')
        .getAttribute('d')
        .match(/\d+/g)
        .map(element => Number(element));
      this.skew = Math.atan((coordinates[3] - coordinates[1]) /
        (coordinates[2] - coordinates[0]));
    }

    let whichPoint: string;
    const points: Array<Point> = [
      { x: this.ulx, y: this.uly, name: PointNames.TopLeft },
      { x: (this.ulx + this.lrx) / 2, y: this.uly + (this.lrx - this.ulx) / 2 * Math.sin(this.skew), name: PointNames.Top },
      { x: this.lrx, y: this.uly + (this.lrx - this.ulx) * Math.sin(this.skew), name: PointNames.TopRight },
      { x: this.lrx, y: (this.uly + this.lry + (this.lrx - this.ulx) * Math.sin(this.skew)) / 2, name: PointNames.Right },
      { x: this.lrx, y: this.lry, name: PointNames.BottomRight },
      { x: (this.ulx + this.lrx) / 2, y: this.lry - (this.lrx - this.ulx) / 2 * Math.sin(this.skew), name: PointNames.Bottom },
      { x: this.ulx, y: this.lry - (this.lrx - this.ulx) * Math.sin(this.skew), name: PointNames.BottomLeft },
      { x: this.ulx, y: (this.uly + this.lry - (this.lrx - this.ulx) * Math.sin(this.skew)) / 2, name: PointNames.Left }
    ];

    const polyLen = points[2].x - points[0].x;

    const pointString = points.filter((_elem, index) => { return index % 2 === 0; })
      .map(elem => elem.x + ',' + elem.y)
      .join(' ');

    d3.select('#' + this.element.id).append('polygon')
      .attr('points', pointString)
      .attr('id', 'resizeRect')
      .attr('stroke', 'black')
      .attr('stroke-width', 10)
      .attr('fill', 'none')
      .style('cursor', 'move')
      .style('stroke-dasharray', '20 10');

    for (const pointName in PointNames) {
      const point: Point = points[PointNames[pointName]];
      d3.select(this.element.viewportElement).append('circle')
        .attr('cx', point.x)
        .attr('cy', point.y)
        .attr('r', 25)
        .attr('stroke', 'black')
        .attr('stroke-width', 4)
        .attr('fill', '#0099ff')
        .attr('class', 'resizePoint')
        .attr('id', 'p-' + pointName);
    }

    // do it as a loop instead of selectAll so that you can easily know which point was
    for (const name in PointNames) {
      d3.select('#p-' + name).filter('.resizePoint').call(
        d3.drag()
          .on('start', () => { resizeStart.bind(this)(name); })
          .on('drag', resizeDrag.bind(this))
          .on('end', resizeEnd.bind(this))
      );
    }

    if (this.element.classList.contains('staff')) {
      let x = points[3].x;
      let y = points[3].y;
      const pointStringRight = (x + 100) + ',' + (y + 85) + ' ' +
        (x + 70) + ',' + (y + 50) + ' ' + (x + 100) + ',' + (y + 15) + ' ' + (x + 130) + ',' + (y + 50);
      x = points[7].x;
      y = points[7].y;
      const pointStringLeft = (x - 100) + ',' + (y - 15) + ' ' +
        (x - 130) + ',' + (y - 50) + ' ' + (x - 100) + ',' + (y - 85) + ' ' + (x - 70) + ',' + (y - 50);

      d3.select('#' + this.element.id).append('polygon')
        .attr('points', pointStringRight)
        .attr('id', 'skewRight')
        .attr('stroke', 'black')
        .attr('stroke-width', 7)
        .attr('fill', '#0099ff')
        .attr('class', 'skewPoint');

      d3.select('#' + this.element.id).append('polygon')
        .attr('points', pointStringLeft)
        .attr('id', 'skewLeft')
        .attr('stroke', 'black')
        .attr('stroke-width', 7)
        .attr('fill', '#0099ff')
        .attr('class', 'skewPoint');

      d3.select('#skewLeft').call(
        d3.drag()
          .on('start', () => { skewStart.bind(this)('skewLeft'); })
          .on('drag', skewDragLeft.bind(this))
          .on('end', skewEnd.bind(this)));

      d3.select('#skewRight').call(
        d3.drag()
          .on('start', () => { skewStart.bind(this)('skewRight'); })
          .on('drag', skewDragRight.bind(this))
          .on('end', skewEnd.bind(this)));
    }

    let whichSkewPoint: string,
      initialRectY: number,
      initialY: number,
      initialSkew: number,
      dy: number,
      initialPoint: number[],
      initialUly: number,
      initialLry: number;

    function skewStart (which: string): void {
      const polygon = d3.select('#' + which);
      const points = polygon.attr('points');
      whichSkewPoint = which;
      initialY = Number(points.split(' ')[0].split(',')[1]);
      initialRectY = (which === 'skewRight' ? this.lry : this.uly);
      initialSkew = this.skew;
    }

    function skewDragLeft (): void {
      const currentY = d3.mouse(d3.event.sourceEvent.target)[1];
      dy = currentY - initialY;
      const tempSkew = initialSkew - Math.atan(dy / polyLen);
      if (tempSkew > -0.2 && tempSkew < 0.2) {
        this.uly = initialRectY + dy;
        this.skew = tempSkew;
      }
      this.redraw();
    }

    function skewDragRight (): void {
      const currentY = d3.mouse(d3.event.sourceEvent.target)[1];
      dy = currentY - initialY;
      const tempSkew = initialSkew + Math.atan(dy / polyLen);
      if (tempSkew > -0.2 && tempSkew < 0.2) {
        this.skew = tempSkew;
        this.lry = initialRectY + dy;
      }
      this.redraw();
    }

    function skewEnd (): void {
      const editorAction = {
        'action': 'changeSkew',
        'param': {
          'elementId': this.element.id,
          'dy': dy,
          'rightSide': (whichSkewPoint === 'skewRight')
        }
      };
      this.neonView.edit(editorAction, this.neonView.view.getCurrentPageURI()).then(async (result) => {
        if (result) {
          await this.neonView.updateForCurrentPagePromise();
        }
        this.element = document.getElementById(this.element.id);
        this.ulx = undefined;
        this.uly = undefined;
        this.lrx = undefined;
        this.lry = undefined;
        this.drawInitialRect();
        if (this.element.classList.contains('syl')) {
          selectBBox(this.element.querySelector('.sylTextRect-display'), this.dragHandler, this);
        } else {
          selectStaff(this.element, this.dragHandler);
        }
      });
    }

    function resizeStart (name: string): void {
      whichPoint = name;
      const point = points.find(point => { return point.name === PointNames[name]; });
      initialPoint = [point.x, point.y];
      initialUly = this.uly;
      initialLry = this.lry;
    }

    function resizeDrag (): void {
      const currentPoint = d3.mouse(d3.event.sourceEvent.target);
      switch (PointNames[whichPoint]) {
        case PointNames.TopLeft:
          this.ulx = currentPoint[0];
          this.uly = currentPoint[1];
          break;
        case PointNames.Top:
          this.uly = currentPoint[1] - (this.lrx - this.ulx) * Math.tan(this.skew) / 2;
          break;
        case PointNames.TopRight:
          this.lrx = currentPoint[0];
          this.uly = currentPoint[1] - (this.lrx - this.ulx) * Math.tan(this.skew);
          break;
        case PointNames.Right:
          this.lrx = currentPoint[0];
          this.lry = initialLry + (currentPoint[0] - initialPoint[0]) * Math.tan(this.skew);
          break;
        case PointNames.BottomRight:
          this.lrx = currentPoint[0];
          this.lry = currentPoint[1];
          break;
        case PointNames.Bottom:
          this.lry = currentPoint[1] + (this.lrx - this.ulx) * Math.tan(this.skew) / 2;
          break;
        case PointNames.BottomLeft:
          this.ulx = currentPoint[0];
          this.lry = currentPoint[1] + (this.lrx - this.ulx) * Math.tan(this.skew);
          break;
        case PointNames.Left:
          this.ulx = currentPoint[0];
          this.uly = initialUly + (currentPoint[0] - initialPoint[0]) * Math.tan(this.skew);
          break;
        default:
          console.error('Something that wasn\'t a side of the rectangle was dragged. This shouldn\'t happen.');
      }
      this.redraw();
    }

    function resizeEnd (): void {
      const editorAction = {
        'action': 'resize',
        'param': {
          'elementId': this.element.id,
          'ulx': this.ulx,
          'uly': this.uly,
          'lrx': this.lrx,
          'lry': this.lry
        }
      };
      this.neonView.edit(editorAction, this.neonView.view.getCurrentPageURI()).then(async (result) => {
        if (result) {
          await this.neonView.updateForCurrentPagePromise();
        }
        this.element = document.getElementById(this.element.id);
        this.ulx = undefined;
        this.uly = undefined;
        this.lrx = undefined;
        this.lry = undefined;
        if (this.element.classList.contains('syl')) {
          selectBBox(this.element.querySelector('.sylTextRect-display'), this.dragHandler, this);
        } else {
          selectStaff(this.element, this.dragHandler);
        }
        d3.selectAll('.resizePoint').remove();
        d3.selectAll('#resizeRect').remove();
        d3.selectAll('.skewPoint').remove();
        this.drawInitialRect();
      });
    }
  }

  /** Redraw the rectangle with new bounds. */
  redraw (): void {
    const points: Point[] = [
      { x: this.ulx, y: this.uly, name: PointNames.TopLeft },
      { x: (this.ulx + this.lrx) / 2, y: this.uly + (this.lrx - this.ulx) / 2 * Math.sin(this.skew), name: PointNames.Top },
      { x: this.lrx, y: this.uly + (this.lrx - this.ulx) * Math.sin(this.skew), name: PointNames.TopRight },
      { x: this.lrx, y: (this.uly + this.lry + (this.lrx - this.ulx) * Math.sin(this.skew)) / 2, name: PointNames.Right },
      { x: this.lrx, y: this.lry, name: PointNames.BottomRight },
      { x: (this.ulx + this.lrx) / 2, y: this.lry - (this.lrx - this.ulx) / 2 * Math.sin(this.skew), name: PointNames.Bottom },
      { x: this.ulx, y: this.lry - (this.lrx - this.ulx) * Math.sin(this.skew), name: PointNames.BottomLeft },
      { x: this.ulx, y: (this.uly + this.lry - (this.lrx - this.ulx) * Math.sin(this.skew)) / 2, name: PointNames.Left }
    ];

    const pointString: string = points.filter((_elem, index) => { return index % 2 === 0; })
      .map(elem => elem.x + ',' + elem.y)
      .join(' ');

    d3.select('#resizeRect').attr('points', pointString);

    for (const pointName in PointNames) {
      const point: Point = points[PointNames[pointName]];
      d3.select('#p-' + pointName).filter('.resizePoint')
        .attr('cx', point.x)
        .attr('cy', point.y);
    }

    let x = points[3].x;
    let y = points[3].y;
    const pointStringRight = (x + 100) + ',' + (y + 85) + ' ' +
      (x + 70) + ',' + (y + 50) + ' ' + (x + 100) + ',' + (y + 15) + ' ' + (x + 130) + ',' + (y + 50);
    x = points[7].x;
    y = points[7].y;
    const pointStringLeft = (x - 100) + ',' + (y - 15) + ' ' +
      (x - 130) + ',' + (y - 50) + ' ' + (x - 100) + ',' + (y - 85) + ' ' + (x - 70) + ',' + (y - 50);

    d3.select('#skewLeft').attr('points', pointStringLeft);
    d3.select('#skewRight').attr('points', pointStringRight);
  }
}
export { Resize };
