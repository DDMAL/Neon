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

export function resize (element: SVGGraphicsElement, neonView: NeonView, dragHandler: DragHandler): void {
  /**
   * The upper-left x-coordinate of the element.
   */
  let ulx: number;
  /**
   * The upper-left y-coordinate of the element.
   */
  let uly: number;
  /**
   * The lower-right x-coordinate of the element.
   */
  let lrx: number;
  /**
   * The lower-right y-coordinate of the element.
   */
  let lry: number;

  /**
   * The skew of the rect in radians.
   */
  let skew: number;

  let initialPoint: number[], initialUly: number, initialLry: number, whichSkewPoint: string,
    initialY: number, initialRectY: number, polyLen: number, dy: number, initialSkew: number;

  drawInitialRect();
  /**
   * Draw the initial rectangle around the element
   * and add the listeners to support dragging to resize.
   */
  function drawInitialRect (): void {
    if (element === null) return;

    // if it's a boundingbox just get the coordinates
    if (element.classList.contains('syl')) {
      const rect = element.querySelector('.sylTextRect-display');
      if (rect === null) {
        console.warn('Tried to draw resize rect for a sylTextRect that doesn\'t exist (or isn\'t displaying)');
        return;
      }
      ulx = Number(rect.getAttribute('x'));
      uly = Number(rect.getAttribute('y'));
      lrx = +ulx + +rect.getAttribute('width');
      lry = +uly + +rect.getAttribute('height');

      skew = 0;
    }

    // if it's a staff use the paths to get it's boundingbox
    if (element.classList.contains('staff')) {
      const bbox = getStaffBBox(element);
      ulx = bbox.ulx;
      uly = bbox.uly;
      lrx = bbox.lrx;
      lry = bbox.lry;

      const segments: any = element.querySelector('path').pathSegList;
      skew = Math.atan((segments[segments.length - 1].y - segments[0].y) /
        (segments[segments.length - 1].x - segments[0].x));
    }

    let whichPoint: string;

    const points: Array<Point> = [
      { x: ulx, y: uly, name: PointNames.TopLeft },
      { x: (ulx + lrx) / 2, y: uly + (lrx - ulx) / 2 * Math.sin(skew), name: PointNames.Top },
      { x: lrx, y: uly + (lrx - ulx) * Math.sin(skew), name: PointNames.TopRight },
      { x: lrx, y: (uly + lry + (lrx - ulx) * Math.sin(skew)) / 2, name: PointNames.Right },
      { x: lrx, y: lry, name: PointNames.BottomRight },
      { x: (ulx + lrx) / 2, y: lry - (lrx - ulx) / 2 * Math.sin(skew), name: PointNames.Bottom },
      { x: ulx, y: lry - (lrx - ulx) * Math.sin(skew), name: PointNames.BottomLeft },
      { x: ulx, y: (uly + lry - (lrx - ulx) * Math.sin(skew)) / 2, name: PointNames.Left }
    ];

    polyLen = points[2].x - points[0].x;

    const pointString = points.filter((_elem, index) => { return index % 2 === 0; })
      .map(elem => elem.x + ',' + elem.y)
      .join(' ');

    d3.select('#' + element.id).append('polygon')
      .attr('points', pointString)
      .attr('id', 'resizeRect')
      .attr('stroke', 'black')
      .attr('stroke-width', 10)
      .attr('fill', 'none')
      .style('cursor', 'move')
      .style('stroke-dasharray', '20 10');

    for (const pointName in PointNames) {
      const point: Point = points[PointNames[pointName]];
      d3.select(element.viewportElement).append('circle')
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
          .on('start', () => { resizeStart(name); })
          .on('drag', resizeDrag)
          .on('end', resizeEnd.bind(this)));
    }

    if (element.classList.contains('staff')) {
      let x = points[3].x;
      let y = points[3].y;
      const pointStringRight = (x + 100) + ',' + (y + 85) + ' ' +
        (x + 70) + ',' + (y + 50) + ' ' + (x + 100) + ',' + (y + 15) + ' ' + (x + 130) + ',' + (y + 50);
      x = points[7].x;
      y = points[7].y;
      const pointStringLeft = (x - 100) + ',' + (y - 15) + ' ' +
        (x - 130) + ',' + (y - 50) + ' ' + (x - 100) + ',' + (y - 85) + ' ' + (x - 70) + ',' + (y - 50);

      d3.select('#' + element.id).append('polygon')
        .attr('points', pointStringRight)
        .attr('id', 'skewRight')
        .attr('stroke', 'black')
        .attr('stroke-width', 7)
        .attr('fill', '#0099ff')
        .attr('class', 'skewPoint');

      d3.select('#' + element.id).append('polygon')
        .attr('points', pointStringLeft)
        .attr('id', 'skewLeft')
        .attr('stroke', 'black')
        .attr('stroke-width', 7)
        .attr('fill', '#0099ff')
        .attr('class', 'skewPoint');

      d3.select('#skewLeft').call(
        d3.drag()
          .on('start', () => { skewStart('skewLeft'); })
          .on('drag', skewDragLeft)
          .on('end', skewEnd));

      d3.select('#skewRight').call(
        d3.drag()
          .on('start', () => { skewStart('skewRight'); })
          .on('drag', skewDragRight)
          .on('end', skewEnd));
    }

    function skewStart (which: string): void {
      const polygon = d3.select('#' + which);
      const points = polygon.attr('points');
      whichSkewPoint = which;
      initialY = Number(points.split(' ')[0].split(',')[1]);
      initialRectY = (which === 'skewRight' ? lry : uly);
      initialSkew = skew;
    }

    function skewDragLeft (): void {
      const currentY = d3.mouse(this)[1];
      dy = currentY - initialY;
      const tempSkew = initialSkew - Math.atan(dy / polyLen);
      if (tempSkew > -0.2 && tempSkew < 0.2) {
        uly = initialRectY + dy;
        skew = tempSkew;
      }
      redraw();
    }

    function skewDragRight (): void {
      const currentY = d3.mouse(this)[1];
      dy = currentY - initialY;
      const tempSkew = initialSkew + Math.atan(dy / polyLen);
      if (tempSkew > -0.2 && tempSkew < 0.2) {
        skew = tempSkew;
        lry = initialRectY + dy;
      }
      redraw();
    }

    function skewEnd (): void {
      const editorAction = {
        'action': 'changeSkew',
        'param': {
          'elementId': element.id,
          'dy': dy,
          'rightSide': (whichSkewPoint === 'skewRight')
        }
      };
      neonView.edit(editorAction, neonView.view.getCurrentPageURI()).then(async (result) => {
        if (result) {
          await neonView.updateForCurrentPagePromise();
        }
        element = document.getElementById(element.id) as unknown as SVGGraphicsElement;
        ulx = undefined;
        uly = undefined;
        lrx = undefined;
        lry = undefined;
        drawInitialRect();
        if (element.classList.contains('syl')) {
          selectBBox(element.querySelector('.sylTextRect-display'), dragHandler, this);
        } else {
          selectStaff(element, dragHandler);
        }
      });
    }

    function resizeStart (name: string): void {
      whichPoint = name;
      const point = points.find(point => { return point.name === PointNames[name]; });
      initialPoint = [point.x, point.y];
      initialUly = uly;
      initialLry = lry;
    }

    function resizeDrag (): void {
      const currentPoint = d3.mouse(this);
      switch (PointNames[whichPoint]) {
        case PointNames.TopLeft:
          ulx = currentPoint[0];
          uly = currentPoint[1];
          break;
        case PointNames.Top:
          uly = currentPoint[1] - (lrx - ulx) * Math.tan(skew) / 2;
          break;
        case PointNames.TopRight:
          lrx = currentPoint[0];
          uly = currentPoint[1] - (lrx - ulx) * Math.tan(skew);
          break;
        case PointNames.Right:
          lrx = currentPoint[0];
          lry = initialLry + (currentPoint[0] - initialPoint[0]) * Math.tan(skew);
          break;
        case PointNames.BottomRight:
          lrx = currentPoint[0];
          lry = currentPoint[1];
          break;
        case PointNames.Bottom:
          lry = currentPoint[1] + (lrx - ulx) * Math.tan(skew) / 2;
          break;
        case PointNames.BottomLeft:
          ulx = currentPoint[0];
          lry = currentPoint[1] + (lrx - ulx) * Math.tan(skew);
          break;
        case PointNames.Left:
          ulx = currentPoint[0];
          uly = initialUly + (currentPoint[0] - initialPoint[0]) * Math.tan(skew);
          break;
        default:
          console.error('Something that wasn\'t a side of the rectangle was dragged. This shouldn\'t happen.');
      }
      redraw();
    }

    function resizeEnd (): void {
      const editorAction = {
        'action': 'resize',
        'param': {
          'elementId': element.id,
          'ulx': ulx,
          'uly': uly,
          'lrx': lrx,
          'lry': lry
        }
      };
      neonView.edit(editorAction, neonView.view.getCurrentPageURI()).then(async (result) => {
        if (result) {
          await neonView.updateForCurrentPagePromise();
        }
        element = document.getElementById(element.id) as unknown as SVGGraphicsElement;
        ulx = undefined;
        uly = undefined;
        lrx = undefined;
        lry = undefined;
        if (element.classList.contains('syl')) {
          selectBBox(element.querySelector('.sylTextRect-display'), dragHandler, this);
        } else {
          selectStaff(element, dragHandler);
        }
        d3.selectAll('.resizePoint').remove();
        d3.selectAll('#resizeRect').remove();
        d3.selectAll('.skewPoint').remove();
        drawInitialRect();
      });
    }
  }

  /**
   * Redraw the rectangle with the new bounds
   */
  function redraw (): void {
    const points: Point[] = [
      { x: ulx, y: uly, name: PointNames.TopLeft },
      { x: (ulx + lrx) / 2, y: uly + (lrx - ulx) / 2 * Math.sin(skew), name: PointNames.Top },
      { x: lrx, y: uly + (lrx - ulx) * Math.sin(skew), name: PointNames.TopRight },
      { x: lrx, y: (uly + lry + (lrx - ulx) * Math.sin(skew)) / 2, name: PointNames.Right },
      { x: lrx, y: lry, name: PointNames.BottomRight },
      { x: (ulx + lrx) / 2, y: lry - (lrx - ulx) / 2 * Math.sin(skew), name: PointNames.Bottom },
      { x: ulx, y: lry - (lrx - ulx) * Math.sin(skew), name: PointNames.BottomLeft },
      { x: ulx, y: (uly + lry - (lrx - ulx) * Math.sin(skew)) / 2, name: PointNames.Left }
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
