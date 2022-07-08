/** @module utils/Select */

import { unselect, getStaffBBox, selectStaff, selectAll, getSelectionType } from './SelectTools';
import { resize } from './Resize';
import NeonView from '../NeonView';
import DragHandler from './DragHandler';
import { InfoInterface } from '../Interfaces';
import ZoomHandler from '../SingleView/Zoom';

import * as d3 from 'd3';
import { BBox, getStaffByCoords, isInside, Point } from './Coordinates';

let dragHandler: DragHandler, neonView: NeonView, info: InfoInterface, zoomHandler: ZoomHandler;
let strokeWidth = 7;

/**
 * Set stroke width on drag select box.
 * @param width - Stroke width in pixels.
 */
export function setSelectStrokeWidth (width: number): void {
  strokeWidth = width;
}

/**
 * Set the objects for this module.
 */
export function setSelectHelperObjects (nv: NeonView, dh: DragHandler): void {
  dragHandler = dh;
  neonView = nv;
  info = neonView.info;
  zoomHandler = neonView.view.zoomHandler;
}

function escapeKeyListener (evt: KeyboardEvent): void {
  if (evt.key === 'Escape') {
    if (document.getElementsByClassName('selected').length > 0) {
      info.infoListeners();
    }
    unselect();
  }
}

// ENTER KEY: when a BBox is selected, pressing enter will
//   trigger the edit syllable text function.
function enterKeyListener (evt: KeyboardEvent): void {
  // check if 'enter' is pressed with the correct conditions
  if (getSelectionType() !== 'selByBBox'
    || !(document.getElementById('displayText') as HTMLInputElement).checked
    || evt.key !== 'Enter'
  )
    return;

  const selected = document.querySelector('.syllable-highlighted');

  // check if there is a syllable selected
  if (selected) {
    const span = document.querySelector('span.' + selected.id) as HTMLElement;

    // we simulate a click because the method `updateSylText()` is only
    // accessible inside TextEditMode; the span has an event listener for
    // clicks.
    span.click();
  }
}

function arrowKeyListener (evt: KeyboardEvent): void {
  if (getSelectionType() !== 'selByBBox' || (evt.key !== 'ArrowLeft' && evt.key !== 'ArrowRight'))
    return;

  const selected = document.querySelector('.syllable-highlighted');
  const syllables = Array.from(document.querySelectorAll('.syllable'));

  // not all syllables have BBoxes; we must filter them out
  const bboxSyllables = syllables.filter(syl => syl.querySelector('.sylTextRect-display') !== null);
  const ind = bboxSyllables.indexOf(selected);

  if (evt.key === 'ArrowLeft' && ind > 0) {
    unselect();

    const bbox = bboxSyllables[ind - 1].querySelector('.sylTextRect-display');
    selectAll([bbox as SVGGraphicsElement], neonView, dragHandler);
  } else if (evt.key === 'ArrowRight' && ind < bboxSyllables.length - 1) {
    unselect();

    const bbox = bboxSyllables[ind + 1].querySelector('.sylTextRect-display');
    selectAll([bbox as SVGGraphicsElement], neonView, dragHandler);
  }
}

function isSelByBBox (): boolean {
  const selByBBox = document.getElementById('selByBBox');
  if (selByBBox) {
    return selByBBox.classList.contains('is-active');
  }
  return false;
}

function stopPropHandler (evt: Event): void { evt.stopPropagation(); }

/**
 * Get bounding box of an element
 */
function getBBoxCoords (el: SVGGraphicsElement): BBox {
  if (isSelByBBox()) {
    const ulx = Number(el.getAttribute('x')), uly = Number(el.getAttribute('y'));
    // What is the math here???
    const lrx = ulx + Number((el.getAttribute('width').slice(0, -2)));
    const lry = uly + Number((el.getAttribute('height').slice(0, -2)));

    return { ulx, uly, lrx, lry };
  }

  if (el.tagName === 'use') {
    const rect = (el.parentNode as SVGGElement).getBBox();

    return {
      ulx: rect.x,
      uly: rect.y,
      lrx: rect.x + rect.width,
      lry: rect.y + rect.height
    };
  }

  return getStaffBBox(el);
}


/**
 * Checks whether an element is within the drag selection rectangle.
 * Returns true if the element is within the bounds of `ul` (upper left) and `lr` (lower right)
 */
function isWithinRect(d: SVGGraphicsElement, ul: Point, lr: Point): boolean {
  if (isSelByBBox()) return isInside(getBBoxCoords(d), ul, lr);
  if (d.tagName === 'use') return isInside(getBBoxCoords(d), ul, lr);

  // TODO: Simplify
  const box = getStaffBBox(d);
  return !((ul.x < box.ulx && lr.x < box.ulx) || (ul.x > box.lrx && lr.x > box.lrx) ||
          (ul.y < (box.uly + Math.abs(box.ulx - ul.x) * Math.tan(box.rotate)) &&
            lr.y < (box.uly + Math.abs(box.ulx - ul.x) * Math.tan(box.rotate))) ||
          (ul.y > (box.lry + Math.abs(box.lry - lr.y) * Math.tan(box.rotate)) &&
            lr.y > (box.lry + Math.abs(box.lry - lr.y) * Math.tan(box.rotate))));
}

/**
 * Apply listeners for click selection.
 * @param selector - The CSS selector used to choose where listeners are applied.
 */
export function clickSelect (selector: string): void {
  document.querySelectorAll(selector).forEach(sel => {
    sel.removeEventListener('mousedown', clickHandler);
    sel.addEventListener('mousedown', clickHandler);
  });

  // Click away listeners
  document.body.removeEventListener('keydown', escapeKeyListener);
  document.body.addEventListener('keydown', escapeKeyListener);

  document.body.removeEventListener('keydown', enterKeyListener);
  document.body.addEventListener('keydown', enterKeyListener);

  document.body.removeEventListener('keydown', arrowKeyListener);
  document.body.addEventListener('keydown', arrowKeyListener);

  document.getElementById('container')
    .addEventListener('contextmenu', (evt) => { evt.preventDefault(); });

  document.querySelectorAll('use,rect,#moreEdit').forEach(sel => {
    sel.removeEventListener('click', stopPropHandler);
    sel.addEventListener('click', stopPropHandler);
  });
}

/**
 * Handle click events related to element selection.
 */

// The `this` keyword can be "passed" as a fake parameter so that we can type it correctly
// https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function
function clickHandler (this: SVGGraphicsElement, evt: MouseEvent): void {
  // Return if user is in insert mode or panning is active from shift key
  if (!neonView || neonView.getUserMode() === 'insert' || evt.shiftKey)
    return;

  // Helper function to check if the ctrl/cmd key has been selected
  function isMultiSelect (): boolean {
    return window.navigator.userAgent.match(/Mac/) ? evt.metaKey : evt.ctrlKey;
  }

  // If user has clicked a layer element
  if (this.tagName === 'use' && getSelectionType() !== 'selByBBox') {
    if (this.closest('.selected') === null) {
      let selection: SVGGraphicsElement[] = [this];

      // Check if this is part of a ligature and, if so, add all of it to the selection.
      const firstLigatureHalf = /E9B[45678]/;
      const secondLigatureHalf = /E9B[9ABC]/;
      if (this.getAttribute('xlink:href').match(secondLigatureHalf)) {
        // This is the second part of a ligature
        const nc = this.closest('.nc');
        const neume = this.closest('.neume');
        const ncIndex = Array.from(neume.children).indexOf(nc);
        const firstUse = neume.children[ncIndex - 1].children[0] as SVGGraphicsElement;
        console.assert(firstUse.getAttribute('xlink:href').match(firstLigatureHalf), 'First glyph of ligature unexpected!');

        if (firstUse.closest('.selected') === null) {
          selection.unshift(firstUse);
        }
      } else if (this.getAttribute('xlink:href').match(firstLigatureHalf)) {
        // This is the first part of a ligature
        const nc = this.closest('.nc');
        const neume = this.closest('.neume');
        const ncIndex = Array.from(neume.children).indexOf(nc);
        const secondUse = neume.children[ncIndex + 1].children[0] as SVGGraphicsElement;
        console.assert(secondUse.getAttribute('xlink:href').match(secondLigatureHalf), 'Second glyph of ligature unexpected!');

        if (secondUse.closest('.selected') === null) {
          selection.push(secondUse);
        }
      }

      if (isMultiSelect()) {
        selection = selection.concat(Array.from(document.querySelectorAll('.selected')));
      }

      selectAll(selection, neonView, dragHandler);

      if (dragHandler) {
        dragHandler.dragInit();
      }
    }
    else {
      if (isMultiSelect()) {
        const selectionMode = document.querySelector('.sel-by .is-active').id;
        const modeToClass = {
          selByStaff: '.staff',
          selByNeume: '.neume',
          selByNc: '.nc',
          selByLayerElement: '.accid',
        };
        const selectedClass = modeToClass[selectionMode] || '.syllable';
        const remove = [this.closest(selectedClass)];

        let selection = [];
        selection = Array.from(document.getElementsByClassName('selected'));
        selection = selection.filter((el) => !remove.includes(el));

        selectAll(selection, neonView, dragHandler);

        if (dragHandler) {
          dragHandler.dragInit();
        }
      }
    }
  } else if ((evt.target as HTMLElement).tagName === 'rect' && getSelectionType() === 'selByBBox') {
    if (this.closest('.selected') === null) {
      let selection = [evt.target] as SVGGElement[];
      if (isMultiSelect()) {
        selection = selection.concat(Array.from(document.getElementsByClassName('selected')) as SVGGElement[]);
        selection = selection.map( (el) => {
          if (el.tagName == 'rect') {
            return el;
          }
          return el.querySelector('.sylTextRect-Display');
        });
      }
      selectAll(selection, neonView, dragHandler);
      if (dragHandler) {
        dragHandler.dragInit();
      }
    } else {
      let selection = [];
      if (isMultiSelect()) {
        const remove = [this];
        selection = Array.from(document.getElementsByClassName('selected'));
        selection = selection.map( (el) => {
          if (el.tagName == 'rect') {
            return el;
          }
          return el.querySelector('.sylTextRect-Display');
        });
        selection = selection.filter( (el) => {
          return !remove.includes(el);
        });
        selectAll(selection, neonView, dragHandler);
        if (dragHandler) {
          dragHandler.dragInit();
        }
      }
    }
  } else {
    if (getSelectionType() !== 'selByStaff') {
      info.infoListeners();
      return;
    }

    // Check if the point is in a staff.
    if (!isMultiSelect())
      unselect();

    // Select a staff
    const staff = getStaffByCoords(evt.clientX, evt.clientY);
    
    if (!staff) return;

    if (!staff.classList.contains('selected')) {
      // Select previously unselected staff
      selectStaff(staff, dragHandler);
      resize(staff, neonView, dragHandler);
      if (dragHandler) {
        dragHandler.dragInit();
      }
    }
    // Trigger mousedown event on the staff
    staff.dispatchEvent(new MouseEvent('mousedown', {
      screenX: evt.screenX,
      screenY: evt.screenY,
      clientX: evt.clientX,
      clientY: evt.clientY,
      ctrlKey: evt.ctrlKey,
      shiftKey: evt.shiftKey,
      altKey: evt.altKey,
      metaKey: evt.metaKey,
      view: evt.view
    }));
  }
}

/**
 * Apply listeners for drag selection.
 * @param selector - The CSS selector used to choose where listeners are applied.
 */
export function dragSelect (selector: string): void {
  let initialX = 0;
  let initialY = 0;
  let panning = false;
  let dragSelecting = false;
  // var canvas = d3.select('#svg_group');

  const canvas = d3.select(selector);

  /**
   * Check if a point is in the bounds of a staff element.
   * Rotate is not taken into account.
   */
  function pointNotInStaff (pt: number[]): boolean {
    const staves = Array.from(document.getElementsByClassName('staff'));
    const filtered = staves.filter((staff: SVGGElement) => {
      const bbox = getStaffBBox(staff);
      const ulx = bbox.ulx;
      const uly = bbox.uly;
      const lrx = bbox.lrx;
      const lry = bbox.lry;
      const rotate = bbox.rotate;

      return (pt[0] > ulx && pt[0] < lrx) &&
        (pt[1] > (uly + (pt[0] - ulx) * Math.tan(rotate))) &&
        (pt[1] < (lry - (lrx - pt[0]) * Math.tan(rotate)));
    });
    return (filtered.length === 0);
  }

  /**
     * Create an initial dragging rectangle.
     * @param ulx - The upper left x-position of the new rectangle.
     * @param uly - The upper left y-position of the new rectangle.
     */
  function initRect (ulx: number, uly: number): void {
    canvas.append('rect')
      .attr('x', ulx)
      .attr('y', uly)
      .attr('width', 0)
      .attr('height', 0)
      .attr('id', 'selectRect')
      .attr('stroke', 'black')
      .attr('stroke-width', strokeWidth)
      .attr('fill', 'none');
  }

  function selStart (): void {
    if (!neonView) return;
    const userMode = neonView.getUserMode();
    if (d3.event.sourceEvent.target.nodeName !== 'use' && userMode !== 'insert' && d3.event.sourceEvent.target.nodeName !== 'rect') {
      if (!d3.event.sourceEvent.shiftKey) { // If not holding down shift key to pan
        if (!document.getElementById('selByStaff').classList.contains('is-active') ||
          pointNotInStaff(d3.mouse(this))) {
          unselect();
          dragSelecting = true;
          const initialP = d3.mouse(this);
          initialX = initialP[0];
          initialY = initialP[1];
          initRect(initialX, initialY);
        }
      } else {
        panning = true;
        if (zoomHandler !== undefined) {
          zoomHandler.startDrag();
        }
      }
    } else if (d3.event.sourceEvent.shiftKey) {
      panning = true;
      if (zoomHandler !== undefined) {
        zoomHandler.startDrag();
      }
    }
  }

  /**
     * Update the dragging rectangle.
     * @param newX - The new ulx.
     * @param newY - The new uly.
     * @param currentWidth - The width of the rectangle in pixels.
     * @param currentHeight - The height of the rectangle in pixels.
     */
  function updateRect (newX: number, newY: number, currentWidth: number, currentHeight: number): void {
    d3.select('#selectRect')
      .attr('x', newX)
      .attr('y', newY)
      .attr('width', currentWidth)
      .attr('height', currentHeight);
  }

  function getElementsBySelector (selector: string): SVGGraphicsElement[] {
    if (document.getElementById('selByStaff').classList.contains('is-active'))
      return Array.from(document.querySelectorAll(selector + ' use, ' + selector + ' .staff'));

    if (isSelByBBox())
      return Array.from(document.querySelectorAll(selector + ' .sylTextRect-display'));

    return Array.from(document.querySelectorAll(selector + ' use'));
  }

  function selecting (): void {
    if (!panning && dragSelecting) {
      const currentPt = d3.mouse(this);
      const curX = currentPt[0];
      const curY = currentPt[1];

      const newX = curX < initialX ? curX : initialX;
      const newY = curY < initialY ? curY : initialY;
      const width = curX < initialX ? initialX - curX : curX - initialX;
      const height = curY < initialY ? initialY - curY : curY - initialY;

      updateRect(newX, newY, width, height);
    } else if (panning) {
      if (zoomHandler !== undefined) {
        zoomHandler.dragging();
      }
    }
  }

  function selEnd (): void {
    if (!panning && dragSelecting) {
      const selectRect = document.getElementById('selectRect');
      const rx = parseInt(selectRect.getAttribute('x'));
      const ry = parseInt(selectRect.getAttribute('y'));
      const lx = rx + parseInt(selectRect.getAttribute('width'));
      const ly = ry + parseInt(selectRect.getAttribute('height'));

      // Transform to the correct coordinate system
      const node = canvas.node() as SVGSVGElement;
      let ul = new DOMPoint(rx, ry), lr = new DOMPoint(lx, ly);
      const transform = node.getScreenCTM().inverse()
        .multiply((canvas.select('.system').node() as SVGGraphicsElement).getScreenCTM())
        .inverse();
      ul = ul.matrixTransform(transform);
      lr = lr.matrixTransform(transform);

      // Get all elements corresponding to the selector
      const elements = getElementsBySelector(selector);
      // Get the elements within the selection rectangle
      const selectedElements = elements.filter(el => isWithinRect(el, ul, lr));

      // Get other halves of ligatures if only one is selected
      selectedElements.forEach((element: SVGElement) => {
        if (element.tagName === 'use' && element.getAttribute('xlink:href').match(/E9B[456789ABC]/)) {
          const neume = element.closest('.neume');
          const ncIndex = Array.from(neume.children).indexOf(element.closest('.nc'));
          if (element.getAttribute('xlink:href').match(/E9B[45678]/)) {
            // Add second half of ligature to selected list if not already present
            const secondNc = neume.children[ncIndex + 1];
            const secondUse = secondNc.querySelector('use');
            if (selectedElements.indexOf(secondUse) < 0) {
              selectedElements.push(secondUse);
            }
          } else {
            // Add first half of ligature to selected list if not already present
            const firstNc = neume.children[ncIndex - 1];
            const firstUse = firstNc.querySelector('use');
            if (selectedElements.indexOf(firstUse) < 0) {
              selectedElements.push(firstUse);
            }
          }
        }
      });
      selectAll(selectedElements, neonView, dragHandler);

      if (dragHandler) {
        dragHandler.dragInit();
      }
      d3.selectAll('#selectRect').remove();
      dragSelecting = false;
    }
    panning = false;
  }

  d3.selectAll(selector.replace('.active-page', '').trim())
    .on('.drag', null);
  const dragSelectAction = d3.drag()
    .on('start', selStart)
    .on('drag', selecting)
    .on('end', selEnd);
  canvas.call(dragSelectAction);
  if (dragHandler) {
    dragHandler.resetTo(dragSelectAction);
  }
}
