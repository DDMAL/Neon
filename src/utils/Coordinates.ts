import { getStaffBBox } from './SelectTools';

export interface Point {
  x: number;
  y: number;
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