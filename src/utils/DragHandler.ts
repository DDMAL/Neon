import NeonView from '../NeonView';
import { ChangeStaffToAction, DragAction, EditorAction } from '../Types';
import * as d3 from 'd3';
import { BBox, isOutOfSVGBounds, getGlyphBBox, getStaffIdByCoords } from './Coordinates';
import { queueNotification } from './Notification';
import { selectAll, selectBBox, selectStaff } from './SelectTools';

class DragHandler {
  readonly neonView: NeonView;
  private selector: string;
  private selection: SVGGraphicsElement[];

  private dragStartCoords: [number, number] = [-1, -1];
  private resetToAction: (selection: d3.Selection<d3.BaseType, unknown, HTMLElement, unknown>, args: unknown[]) => void;

  private dx: number;
  private dy: number;

  /**
   * @param selector - CSS selector of element to apply drag handler to.
   */
  constructor (neonView: NeonView, selector: string) {
    this.neonView = neonView;
    this.selector = selector;
  }

  /**
   * Initialize the dragging action and handler for selected elements.
   */
  dragInit (): void {
    // Drag effects
    function dragStarted (): void {
      this.dragStartCoords = [d3.event.x, d3.event.y];
      this.dx = 0;
      this.dy = 0;
      const target = d3.event.sourceEvent.target;
      if (target.classList.contains('staff')) {
        d3.select(this.selector).call(dragBehaviour);
      }
    }

    // Adding listeners
    const dragBehaviour = d3.drag()
      .on('start', dragStarted.bind(this))
      .on('drag', this.dragging.bind(this))
      .on('end', this.dragEnded.bind(this));

    const activeNc = d3.selectAll('.selected');
    activeNc.call(dragBehaviour);

    const selection = Array.from(document.querySelectorAll<SVGGraphicsElement>('.selected'));
    this.selection = selection.concat(Array.from(document.querySelectorAll<SVGGraphicsElement>('.resizePoint')));
  }

  dragging (): void {
    this.dx = d3.event.x - this.dragStartCoords[0];
    this.dy = d3.event.y - this.dragStartCoords[1];

    this.moveElements(this.selection, this.dx, this.dy);

    /*
     * if we're dragging a syllable (or neume etc) then there won't be a syl selected
     * then we don't want the bounding box (if it is displayed) to move when dragging the neumes
     * it will be a child of the element in selection, so it will get moved in the above loop
     * so we cancel that movement out here
     */
    const syls = this.selection.filter((el) => el.classList.contains('syl'));
    if (syls.length === 0) {
      const bboxes = Array.from(document.querySelectorAll('.syllable.selected'))
        .map(el => el.querySelector('.sylTextRect-display'));
      this.moveElements(bboxes, -this.dx, -this.dy);
    }
  }


  dragEnded (): void {
    // If the selection has not been moved more than 5 pixels in any direction,
    // do not do any action
    const xDiff = Math.abs(this.dx), yDiff = Math.abs(this.dy);
    if (xDiff <= 5 && yDiff <= 5) {
      this.reset();
      this.dragInit();
      return;
    }

    // Filter selection for draggable elements
    const selection = this.selection.filter((el) => !el.classList.contains('resizePoint'));

    // If the cursor is out of bounds or the selection array is out of bounds,
    // drag actions should not happen. Return an error notification and reset
    // the drag handler
    if (this.isCursorOutOfBounds() || this.isDragOutOfBounds(selection)) {
      // Return the selection back to normal state
      this.returnElements(this.selection);

      // Return the bounding boxes as well
      const bboxes = Array.from(document.querySelectorAll('.syllable.selected'))
        .map(el => el.querySelector('.sylTextRect-display'));
      this.returnElements(bboxes);

      this.reset();
      this.dragInit();
      return queueNotification('[FAIL] Glyphs were placed out of bounds! Drag action failed.', 'error');
    }

    // Create the chain editor action for selection
    const paramArray: EditorAction[] = [];
    selection.forEach((el) => {
      const id = el.tagName === 'rect' ? el.closest('.syl').id : el.id;

      const dragAction: DragAction = {
        action: 'drag',
        param: {
          elementId: id,
          x: this.dx,
          y: -this.dy,
        }
      };

      paramArray.push(dragAction);

      if (el.classList.contains('divLine') || el.classList.contains('accid') || el.classList.contains('custos')) {
        // Else, also add the ChangeStaffAction (for divline, accid, or custo)
        const { clientX, clientY } = d3.event.sourceEvent;
        const newStaff = getStaffIdByCoords(clientX, clientY);
        const staffAction: ChangeStaffToAction = {
          action: 'changeStaffTo',
          param: {
            elementId: id,
            // if divline is moved to the background (and not a staff),
            // set the staffId to the original staff
            staffId: newStaff || el.closest('.staff').id,
          }
        };

        paramArray.push(staffAction);
      }
    });
    const editorAction: EditorAction = {
      action: 'chain',
      param: paramArray
    };

    // Send editor action
    this.neonView
      .edit(editorAction, this.neonView.view.getCurrentPageURI())
      .then(async () => {
        // Neon re-renders the entire SVG, and hence, before we do so,
        // we need to store all the elements (IDs) we need to select again
        // Then, we need to reselect them by calling `this.reselect()`
        const toReselect = Array.from(document.querySelectorAll('.selected')).map(el => el.id);

        // CAUTION: `updateForCurrentPage()` is an asynchronous function!
        // It requires an `await` keyword.
        await this.neonView.updateForCurrentPage();
        this.endOptionsSelection();
        this.reset();

        // Reselect the elements and reinitialize drag
        await this.reselect(toReselect);
        this.dragInit();
      });
  }

  async reselect (toReselect: string[]): Promise<void> {
    const reselected = toReselect.map(id => document.querySelector<SVGGraphicsElement>(`#${id}`));
    await selectAll(reselected, this.neonView, this);

    // Bounding boxes must be explicitly selected using `selectBBox()`
    reselected
      .filter(el => el.classList.contains('syl'))
      .forEach(
        el => selectBBox(el.querySelector('.sylTextRect-display'), this, this.neonView)
      );

    // Staves must be explicitly selected using `selectStaff()`
    reselected
      .filter(el => el.classList.contains('staff'))
      .forEach(el => selectStaff(el, this));
  }

  /** Set the d3 action to use for [[reset]]. */
  resetTo (reset: (selection: d3.Selection<d3.BaseType, unknown, HTMLElement, unknown>, args: unknown[]) => void): void {
    this.resetToAction = reset;
  }

  /** Reset to a previous d3 action for [[this.selector]]. */
  reset (): void {
    if (this.resetToAction !== undefined) {
      d3.select(this.selector).call(this.resetToAction);
    }
  }

  endOptionsSelection (): void {
    const moreEdit = document.getElementById('moreEdit');
    const extraEdit = document.getElementById('extraEdit');
    if (moreEdit) {
      moreEdit.innerHTML = '';
      moreEdit.parentElement.classList.add('hidden');
    }
    if (extraEdit) {
      extraEdit.innerHTML = '';
      extraEdit.parentElement.classList.add('hidden');
    }
  }

  /**
   * Visually move the selected elements by `dx` and `dy`; (not using d3)
   */
  moveElements (selection: Element[], dx: number, dy: number): void {
    selection.filter(el => el !== null).forEach((el) => {
      el.setAttribute('transform', `translate(${dx},${dy})`);
    });
  }

  /**
   * Visually return selected elements to their original positions
   * by removing the transform attribute
   */
  returnElements (selection: Element[]): void {
    selection.filter(el => el !== null).forEach((el) => {
      el.removeAttribute('transform');
    });
  }

  isCursorOutOfBounds (): boolean {
    const endX = this.dragStartCoords[0] + this.dx;
    const endY = this.dragStartCoords[1] + this.dy;

    return isOutOfSVGBounds(endX, endY);
  }

  /**
   * Returns whether the selection array is within the bounds of the SVG
   * @param {SVGGraphicsElement[]} selection
   * @returns {boolean} Is selection out of bounds
   */
  isDragOutOfBounds (selection: SVGGraphicsElement[]): boolean {
    // Get the bounding boxes of all glyphs (<use> elements) within the selection array
    const isBBoxDisplayed = document.querySelector<HTMLInputElement>('#displayBBox').checked;
    const glyphSelector = isBBoxDisplayed ? 'use, rect' : 'use';

    const glyphs: SVGUseElement[] = selection.reduce(
      (acc, el) => acc.concat(...el.querySelectorAll(glyphSelector)), []
    );
    const glyphBBoxes: BBox[] = glyphs.map(getGlyphBBox);

    // Get the surrounding bounding box of the selected elements
    const selectionBBox: BBox = glyphBBoxes.reduce(
      (bbox, curr) => {
        return {
          ulx: Math.min(bbox.ulx, curr.ulx),
          uly: Math.min(bbox.uly, curr.uly),
          lrx: Math.max(bbox.lrx, curr.lrx),
          lry: Math.max(bbox.lry, curr.lry),
        };
      },
      {
        ulx: Number.MAX_VALUE,
        uly: Number.MAX_VALUE,
        lrx: Number.MIN_VALUE,
        lry: Number.MIN_VALUE,
      }
    );

    const { ulx, uly, lrx, lry } = selectionBBox;
    return isOutOfSVGBounds(ulx + this.dx, uly + this.dy) || isOutOfSVGBounds(lrx + this.dx, lry + this.dy);
  }
}

export { DragHandler as default };
