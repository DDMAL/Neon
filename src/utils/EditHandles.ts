import { getSettings } from './LocalSettings';

/**
 * Editing handles are the UI markers drawn around a selected staff or text
 * bounding box: the resize circles, the rotate diamonds and the dashed frame.
 *
 * They are drawn in SVG content coordinates (the same space as the MEI
 * zones), but their *appearance* must stay a constant number of CSS pixels
 * whatever the image size, zoom level or window size. Everything here only
 * changes how the handles look; it never touches content coordinates and
 * never sends an editor action.
 *
 * Sizes are applied through plain attributes (`r`, `points`, `stroke-width`,
 * `stroke-dasharray`) and never through `transform`, because `DragHandler`
 * owns the `transform` attribute of dragged elements (it sets
 * `translate(dx,dy)` while dragging and removes it on reset).
 */

/** Class carried by every editing handle, so content measurement can skip it. */
export const HANDLE_CLASS = 'neon-edit-handle';

/** Handle size (resize-circle radius) in CSS pixels. */
export const HANDLE_SIZE_DEFAULT = 6;
export const HANDLE_SIZE_MIN = 2;
export const HANDLE_SIZE_MAX = 20;

/**
 * Proportions of every handle relative to the handle size `h`. They keep the
 * look of the original fixed SVG-unit design (circle r=25, stroke 4; diamond
 * 60x70 centred 100 right / 50 down of its anchor, stroke 7; frame stroke 10,
 * dashes 20 10), but in CSS pixels.
 */
const RATIO = {
  pointStroke: 4 / 25,
  rotateHalfWidth: 30 / 25,
  rotateHalfHeight: 35 / 25,
  rotateOffsetX: 100 / 25,
  rotateOffsetY: 50 / 25,
  rotateStroke: 7 / 25,
  frameStroke: 10 / 25,
  frameDash: 20 / 25,
  frameGap: 10 / 25,
};

/** Thinnest line a handle may be drawn with, in CSS pixels. */
const MIN_STROKE = 1;

export type HandleKind = 'point' | 'rotate' | 'frame';

/**
 * Clamp any stored or typed value to a usable handle size.
 * Non-numbers, NaN, 0 and negatives fall back to the default, so handles can
 * never disappear or produce invalid geometry; everything else is rounded
 * and clamped into [HANDLE_SIZE_MIN, HANDLE_SIZE_MAX].
 */
export function clampHandleSize(value: unknown): number {
  const n = typeof value === 'string' && value.trim() === '' ? NaN : Number(value);
  if (!Number.isFinite(n) || n <= 0) return HANDLE_SIZE_DEFAULT;
  return Math.min(HANDLE_SIZE_MAX, Math.max(HANDLE_SIZE_MIN, Math.round(n)));
}

/** Current handle size from the folio settings, in CSS pixels. */
export function getHandleSize(): number {
  return clampHandleSize(getSettings()?.handleSize);
}

/**
 * CSS pixels per SVG user unit for the coordinate system `el`'s attributes
 * are expressed in. Uses the element's own screen CTM: a translate added by
 * dragging does not change the scale, and each handle is measured in its
 * own parent's space (circles and diamonds do not share a parent).
 * Returns null while the element is detached or not rendered.
 */
function cssPxPerUnit(el: SVGGraphicsElement): number | null {
  const m = el.getScreenCTM?.();
  if (!m) return null;
  const scale = Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));
  return Number.isFinite(scale) && scale > 0 ? scale : null;
}

/** Mark an element as an editing handle of the given kind. */
export function markHandle(el: Element, kind: HandleKind): void {
  el.classList.add(HANDLE_CLASS);
  el.setAttribute('data-handle', kind);
}

/** Whether `el` is (or is inside) an editing handle. */
export function isHandle(el: Element): boolean {
  return el.closest(`.${HANDLE_CLASS}`) !== null;
}

/**
 * Set the content-coordinate anchor of a rotate diamond (the middle of the
 * left or right side of the staff). The diamond is drawn at a fixed CSS
 * offset from it; the anchor itself is never moved by sizing.
 */
export function setRotateAnchor(
  el: Element,
  x: number,
  y: number,
  side: 'left' | 'right',
): void {
  el.setAttribute('data-anchor-x', String(x));
  el.setAttribute('data-anchor-y', String(y));
  el.setAttribute('data-side', side);
  sizeHandle(el as SVGGraphicsElement, getHandleSize());
}

function rotatePoints(el: Element, h: number, unit: number): string | null {
  const x = Number(el.getAttribute('data-anchor-x'));
  const y = Number(el.getAttribute('data-anchor-y'));
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  const dir = el.getAttribute('data-side') === 'left' ? -1 : 1;

  const cx = x + dir * RATIO.rotateOffsetX * h * unit;
  const cy = y + dir * RATIO.rotateOffsetY * h * unit;
  const hw = RATIO.rotateHalfWidth * h * unit;
  const hh = RATIO.rotateHalfHeight * h * unit;

  return [
    [cx, cy + hh],
    [cx - hw, cy],
    [cx, cy - hh],
    [cx + hw, cy],
  ]
    .map(([px, py]) => `${px},${py}`)
    .join(' ');
}

/** Apply size `h` (CSS px) to one handle. */
function sizeHandle(el: SVGGraphicsElement, h: number): void {
  const k = cssPxPerUnit(el);
  if (k === null) return;
  const unit = 1 / k; // SVG units per CSS pixel
  const stroke = (ratio: number): string =>
    String(Math.max(MIN_STROKE, ratio * h) * unit);

  switch (el.getAttribute('data-handle') as HandleKind) {
    case 'point':
      el.setAttribute('r', String(h * unit));
      el.setAttribute('stroke-width', stroke(RATIO.pointStroke));
      break;
    case 'rotate': {
      const points = rotatePoints(el, h, unit);
      if (points !== null) el.setAttribute('points', points);
      el.setAttribute('stroke-width', stroke(RATIO.rotateStroke));
      break;
    }
    case 'frame': {
      el.setAttribute('stroke-width', stroke(RATIO.frameStroke));
      const dash = Math.max(2 * MIN_STROKE, RATIO.frameDash * h) * unit;
      const gap = Math.max(MIN_STROKE, RATIO.frameGap * h) * unit;
      el.style.strokeDasharray = `${dash} ${gap}`;
      break;
    }
  }
}

let observer: ResizeObserver | null = null;
// Observing an element again re-queues its initial notification, which would
// re-run applyHandleSizes every frame; observe each element only once.
const observed = new WeakSet<Element>();
let windowListenerAdded = false;
let frameRequested = false;

/** Coalesce many triggers (observer, resize, zoom) into one update per frame. */
export function scheduleHandleSizeUpdate(): void {
  if (frameRequested) return;
  frameRequested = true;
  window.requestAnimationFrame(() => {
    frameRequested = false;
    applyHandleSizes();
  });
}

/**
 * Watch whatever can change the CSS scale of the SVG without a zoom call:
 * window resizes and layout changes of the outermost SVG. Registration is
 * idempotent: one window listener, one observer, each element observed once.
 */
function watchViewport(el: SVGGraphicsElement): void {
  if (!windowListenerAdded) {
    window.addEventListener('resize', scheduleHandleSizeUpdate);
    windowListenerAdded = true;
  }
  if (typeof ResizeObserver === 'undefined') return;
  if (observer === null) observer = new ResizeObserver(scheduleHandleSizeUpdate);

  let outer: SVGSVGElement | null = el.ownerSVGElement;
  while (outer?.ownerSVGElement) outer = outer.ownerSVGElement;
  if (outer && !observed.has(outer)) {
    observed.add(outer);
    observer.observe(outer);
  }
}

/**
 * Resize every editing handle on the page to the current handle size.
 * Safe to call at any time: with no handles it does nothing.
 */
export function applyHandleSizes(): void {
  const handles = document.querySelectorAll<SVGGraphicsElement>(
    `.${HANDLE_CLASS}`,
  );
  if (handles.length === 0) return;
  const h = getHandleSize();
  handles.forEach((el) => {
    sizeHandle(el, h);
    watchViewport(el);
  });
}
