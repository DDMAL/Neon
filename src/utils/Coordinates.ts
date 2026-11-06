import { getStaffBBox } from './SelectTools';
import { isHandle } from './EditHandles';

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
export function getSVGRelCoords(clientX: number, clientY: number): Point {
  const pt = new DOMPoint(clientX, clientY);
  const svg = document.querySelector<SVGSVGElement>(
    '.active-page > .definition-scale',
  );
  const pageMargin = svg.querySelector<SVGGElement>('.page-margin');

  const { x, y } = pt.matrixTransform(pageMargin.getScreenCTM().inverse());
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
export function getStaffIdByCoords(clientX: number, clientY: number): string {
  const staves = Array.from(document.querySelectorAll<SVGGElement>('.staff'));
  const staffBBoxes = staves.map((staff) => getStaffBBox(staff));

  // find the staff that the cursor is inside
  const { x, y } = getSVGRelCoords(clientX, clientY);
  const staff = staffBBoxes.find(
    (bbox) => x <= bbox.lrx && x >= bbox.ulx && y <= bbox.lry && y >= bbox.uly,
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
export function getStaffByCoords(
  clientX: number,
  clientY: number,
): SVGGElement | null {
  const staffId = getStaffIdByCoords(clientX, clientY);
  return document.querySelector(`#${staffId}`);
}

/**
 * Size of the page in content (MEI zone) coordinates.
 *
 * SingleView draws the page over `#bgimg`. DivaView has no such image; use
 * the viewBox of the page's Verovio SVG (`svg.definition-scale`), which spans
 * the same page. With a `context` element, that is the page the element is
 * on; otherwise the active page. In SingleView `.active-page` is the page SVG
 * itself; in DivaView it is the page's container <div>, two levels up, hence
 * the descendant selector.
 */
function getPageSize(context?: Element): { width: number; height: number } | null {
  const bgImg = document.querySelector<SVGImageElement>('#bgimg');
  if (bgImg) {
    return {
      width: Number(bgImg.getAttribute('width')),
      height: Number(bgImg.getAttribute('height')),
    };
  }
  const page =
    context?.closest<SVGSVGElement>('svg.definition-scale') ??
    document.querySelector<SVGSVGElement>('.active-page .definition-scale');
  const viewBox = page?.viewBox?.baseVal;
  if (viewBox && viewBox.width > 0 && viewBox.height > 0) {
    return { width: viewBox.x + viewBox.width, height: viewBox.y + viewBox.height };
  }
  return null;
}

/**
 * Whether a point (content coordinates) lies outside the page.
 * @param context - An element on the page in question (DivaView shows
 *   several pages); defaults to the active page.
 *
 * If the page size cannot be determined the point is reported as out of
 * bounds: an edit that cannot be checked must not be written to the MEI.
 */
export function isOutOfSVGBounds(x: number, y: number, context?: Element): boolean {
  const page = getPageSize(context);
  if (page === null) {
    console.warn('Page bounds unknown; refusing the edit.');
    return true;
  }

  return x <= 0 || x >= page.width || y <= 0 || y >= page.height;
}

/**
 * Content elements of a selection whose position is written back to the MEI
 * when it moves. Editing handles (resize circles, rotate diamonds, the dashed
 * frame) are UI only and are never part of the content.
 *
 * - staff: its staff lines (`path`), every glyph that moves with it (`use`,
 *   including stray neumes far from the lines) and its syllables' text
 *   boxes (`rect`), whether or not the text boxes are currently shown.
 * - anything else: its glyphs (`use`), plus text boxes only while they are
 *   shown (the existing behaviour for syllable / neume / nc drags).
 */
function getContentElements(el: Element, bboxShown: boolean): SVGGraphicsElement[] {
  let selector = bboxShown ? 'use, rect' : 'use';
  if (el.classList.contains('staff')) selector = 'path, use, rect';

  const found = Array.from(el.querySelectorAll<SVGGraphicsElement>(selector));
  if (el.matches(selector)) found.unshift(el as SVGGraphicsElement);
  return found.filter((child) => !isHandle(child));
}

/**
 * Local (own user space) box of a content element, or null when it has no
 * position to check.
 *
 * Text boxes (`rect`) are read from their attributes: a hidden text box has
 * `display: none`, for which getBBox() reports 0x0, but it still moves with
 * the staff and its zone must stay on the page. A text box without a positive
 * width and height comes from an incomplete zone and has no position.
 *
 * Other elements use getBBox(). A glyph with neither width nor height, such
 * as the Hufnagel connector glyphs (E9B4-E9B8), has no outline and is
 * skipped; a staff line has zero height but real width, and is kept.
 */
function getLocalBox(
  el: SVGGraphicsElement,
): { x: number; y: number; width: number; height: number } | null {
  if (el instanceof SVGRectElement) {
    const x = el.x.baseVal.value;
    const y = el.y.baseVal.value;
    const width = el.width.baseVal.value;
    const height = el.height.baseVal.value;
    if (!(width > 0 && height > 0) || !Number.isFinite(x + y + width + height)) {
      return null;
    }
    return { x, y, width, height };
  }

  let box: DOMRect;
  try {
    box = el.getBBox();
  } catch (e) {
    return null;
  }
  if (box.width === 0 && box.height === 0) return null;
  return box;
}

/**
 * Bounding box of `el` in the coordinate system of `reference`, including
 * every transform between them (in particular the `translate(dx,dy)` a drag
 * preview puts on the selection). Null when `el` has no position to check.
 */
function getBBoxIn(el: SVGGraphicsElement, reference: SVGGraphicsElement): BBox | null {
  const box = getLocalBox(el);
  if (box === null) return null;

  const elCTM = el.getCTM();
  const refCTM = reference.getCTM();
  if (!elCTM || !refCTM) return null;
  const toRef = refCTM.inverse().multiply(elCTM);

  const corners = [
    new DOMPoint(box.x, box.y),
    new DOMPoint(box.x + box.width, box.y),
    new DOMPoint(box.x, box.y + box.height),
    new DOMPoint(box.x + box.width, box.y + box.height),
  ].map((p) => p.matrixTransform(toRef));

  return {
    ulx: Math.min(...corners.map((p) => p.x)),
    uly: Math.min(...corners.map((p) => p.y)),
    lrx: Math.max(...corners.map((p) => p.x)),
    lry: Math.max(...corners.map((p) => p.y)),
  };
}

/**
 * Bounding box of the *content* of `selection`, in page (MEI zone)
 * coordinates, as currently drawn, i.e. including any drag-preview
 * translation already applied to the selection. Do not add the drag offset
 * to the result again.
 *
 * Returns null when nothing measurable was found.
 */
export function getContentBounds(selection: Element[]): BBox | null {
  const bboxShown =
    document.querySelector<HTMLInputElement>('#displayBBox')?.checked ?? false;

  let bounds: BBox | null = null;
  for (const el of selection) {
    if (!el) continue;
    const reference =
      el.closest<SVGGraphicsElement>('.page-margin') ??
      ((el as SVGGraphicsElement).viewportElement as SVGGraphicsElement);
    if (!reference) continue;

    for (const content of getContentElements(el, bboxShown)) {
      const box = getBBoxIn(content, reference);
      if (box === null) continue;
      if (bounds === null) {
        bounds = box;
      } else {
        bounds.ulx = Math.min(bounds.ulx, box.ulx);
        bounds.uly = Math.min(bounds.uly, box.uly);
        bounds.lrx = Math.max(bounds.lrx, box.lrx);
        bounds.lry = Math.max(bounds.lry, box.lry);
      }
    }
  }
  return bounds;
}

/**
 * Get bounding box (lrx, lry, ulx, uly) of a glyph, which
 * is a <use> element in the SVG
 */
export function getGlyphBBox(g: SVGRectElement | SVGUseElement): BBox {
  const rect =
    g.tagName == 'rect' ? g.getBBox() : (g.parentNode as SVGGElement).getBBox();

  return {
    ulx: rect.x,
    uly: rect.y,
    lrx: rect.x + rect.width,
    lry: rect.y + rect.height,
  };
}
