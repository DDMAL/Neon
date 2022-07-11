import { getStaffBBox } from './SelectTools';

export interface Point {
  x: number;
  y: number;
}

export interface BBox {
  ulx: number;
  uly: number;
  lrx: number;
  lry: number;
}

/**
 * Get SVG relative coordinates given clientX and clientY
 * Source: https://stackoverflow.com/questions/29261304
 */
export function getSVGRelCoords (clientX: number, clientY: number): Point {
  const pt = new DOMPoint(clientX, clientY);
  const svg = document.querySelector<SVGSVGElement>('.active-page > .definition-scale');
  const system = svg.querySelector<SVGGElement>('.system');

  const { x, y } = pt.matrixTransform(system.getScreenCTM().inverse());
  return { x, y };

  // If there is some issue with coordinates, this may fix the issue:
  // const svg = document.querySelector<SVGSVGElement>('#svg_group');
  // const { x, y } = pt.matrixTransform(svg.getScreenCTM().inverse());
}

/**
 * Get ID of staff by client's x-y coordinates.
 * This function considers the *visual* bounding box of the staff
 * based on its staff lines, instead of the SVG element itself.
 */
export function getStaffIdByCoords (clientX: number, clientY: number): string {
  const staves = Array.from(document.querySelectorAll<SVGGElement>('.staff'));
  const staffBBoxes = staves.map(staff => getStaffBBox(staff));

  // find the staff that the cursor is inside
  const { x, y } = getSVGRelCoords(clientX, clientY);
  const staff = staffBBoxes.find(
    (bbox) => x <= bbox.lrx && x >= bbox.ulx && y <= bbox.lry && y >= bbox.uly
  ); 

  // If there is issues with finding the staff, this may be more accurate:
  // return (pt.x > ulx && pt.x < lrx) &&
  //   (pt.y > (uly + (pt.x - ulx) * Math.tan(rotate))) &&
  //   (pt.y < (lry - (lrx - pt.x) * Math.tan(rotate)));

  // if the cursor is not inside any staff, then explicitly return null
  return staff ? staff.id : null;
}

/**
 * Get staff by client's x-y coordinates; wrapper for getStaffIdByCoords, but
 *   returns the element, not the ID
 */
export function getStaffByCoords (clientX: number, clientY: number): SVGGElement | null {
  const staffId = getStaffIdByCoords(clientX, clientY);
  return document.querySelector(`#${staffId}`);
}

export function isOutOfSVGBounds (x: number, y: number): boolean {
  const bgImg = document.querySelector<SVGImageElement>('#bgimg');
  
  return (
    x <= 0 || x >= Number(bgImg.getAttribute('width')) ||
    y <= 0 || y >= Number(bgImg.getAttribute('height'))
  );
}

/**
 * Check whether the bounding box of an element is within the rectangle defined
 * by the upper left and lower right points `ul` and `lr`
 */
export function isBBoxInRect (bbox: BBox, ulPoint: Point, lrPoint: Point): boolean {
  const isXRange = (bbox.ulx >= ulPoint.x) && (bbox.lrx <= lrPoint.x);
  const isYRange = (bbox.uly >= ulPoint.y) && (bbox.lry <= lrPoint.y);
  return isXRange && isYRange;
}

/**
 * Get bounding box (lrx, lry, ulx, uly) of a glyph, which
 * is a <use> element in the SVG
 */
export function getGlyphBBox (use: SVGUseElement): BBox {
  const rect = (use.parentNode as SVGGElement).getBBox();

  return {
    ulx: rect.x,
    uly: rect.y,
    lrx: rect.x + rect.width,
    lry: rect.y + rect.height
  };
}

