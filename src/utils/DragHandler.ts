import NeonView from '../NeonView';
import { DragAction, EditorAction } from '../Types';
import * as d3 from 'd3';
import { isOutOfSVGBounds, getContentBounds } from './Coordinates';
import { queueNotification } from './Notification';
import { selectAll, selectBBox, selectStaff } from './SelectTools';

class DragHandler {
  readonly neonView: NeonView;
  private selector: string;
  private selection: SVGGraphicsElement[];
  private noMovePrecedes: SVGGraphicsElement[];

  private dragStartCoords: [number, number] = [-1, -1];
  private resetToAction: (
    selection: d3.Selection<d3.BaseType, unknown, HTMLElement, unknown>,
    args: unknown[],
  ) => void;

  private dx: number;
  private dy: number;

  /**
   * @param selector - CSS selector of element to apply drag handler to.
   */
  constructor(neonView: NeonView, selector: string) {
    this.neonView = neonView;
    this.selector = selector;
  }

  /**
   * Initialize the dragging action and handler for selected elements.
   */
  dragInit(): void {
    // Drag effects
    function dragStarted(): void {
      this.dragStartCoords = [d3.event.x, d3.event.y];
      this.dx = 0;
      this.dy = 0;
      const target = d3.event.sourceEvent.target;
      if (target.classList.contains('staff')) {
        d3.select(this.selector).call(dragBehaviour);
      }
    }

    // Adding listeners
    const dragBehaviour = d3
      .drag()
      .on('start', dragStarted.bind(this))
      .on('drag', this.dragging.bind(this))
      .on('end', this.dragEnded.bind(this));

    const activeNc = d3.selectAll('.selected');
    activeNc.call(dragBehaviour);

    let selection = Array.from(
      document.querySelectorAll<SVGGraphicsElement>('.selected'),
    );

    // if the user drags the follows syllable in a toggle-linked syllable,
    // cancel the compensation for syl movement in dragging.
    this.noMovePrecedes = selection.filter(
      (el) =>
        el.classList.contains('no-moving') && el.hasAttribute('data-precedes'),
    );
    selection = selection.filter((el) => !el.classList.contains('no-moving'));

    this.selection = selection.concat(
      Array.from(document.querySelectorAll<SVGGraphicsElement>('.resizePoint')),
    );
  }

  dragging(): void {
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
    if (syls.length === 0 && this.noMovePrecedes.length === 0) {
      const bboxes = Array.from(
        document.querySelectorAll('.syllable.selected'),
      ).map((el) => el.querySelector('.sylTextRect-display'));
      this.moveElements(bboxes, -this.dx, -this.dy);
    }
  }

  dragEnded(): void {
    // If the selection has not been moved more than 5 pixels in any direction,
    // do not do any action
    const xDiff = Math.abs(this.dx),
      yDiff = Math.abs(this.dy);
    if (xDiff <= 5 && yDiff <= 5) {
      this.reset();
      this.dragInit();
      return;
    }

    // Filter selection for draggable elements
    const selection = this.selection.filter(
      (el) => !el.classList.contains('resizePoint'),
    );

    // If the cursor is out of bounds or the selection array is out of bounds,
    // drag actions should not happen. Return an error notification and reset
    // the drag handler
    if (this.isCursorOutOfBounds() || this.isDragOutOfBounds(selection)) {
      // Return the selection back to normal state
      this.returnElements(this.selection);

      // Return the bounding boxes as well
      const bboxes = Array.from(
        document.querySelectorAll('.syllable.selected'),
      ).map((el) => el.querySelector('.sylTextRect-display'));
      this.returnElements(bboxes);

      this.reset();
      this.dragInit();
      return queueNotification(
        '[FAIL] Glyphs were placed out of bounds! Drag action failed.',
        'error',
      );
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
        },
      };

      paramArray.push(dragAction);
    });
    const editorAction: EditorAction = {
      action: 'chain',
      param: paramArray,
    };

    // Neon re-renders the entire SVG in response to the edit, which drops the
    // `selected` class from every node, so record what to reselect NOW --
    // while the nodes are still attached and still selected. Reading this
    // after the edit resolves is a race: anything else that replaces the SVG
    // in the meantime leaves us with an empty list and silently unselects
    // everything.
    const toReselect = Array.from(document.querySelectorAll('.selected'))
      .filter((el) => !el.classList.contains('no-moving'))
      .map((el) => el.id);

    // Send editor action
    this.neonView
      .edit(editorAction, this.neonView.view.getCurrentPageURI())
      .then(async () => {
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

  async reselect(toReselect: string[]): Promise<void> {
    // An id may be missing from the re-rendered SVG (Verovio can drop or
    // rename elements as a result of the edit). Drop those instead of letting
    // a null reach `classList` below, which would throw inside this promise
    // and skip both the reselection and the caller's `dragInit()`.
    const reselected = toReselect
      .map((id) => document.querySelector<SVGGraphicsElement>(`#${id}`))
      .filter((el): el is SVGGraphicsElement => el !== null);

    if (reselected.length === 0) return;

    // All glyphs except bouding boxes ('syl's) must be selected with
    // `selectAll()`. It takes the whole array, so call it once.
    if (reselected.some((el) => !el.classList.contains('syl'))) {
      await selectAll(reselected, this.neonView, this);
    }

    // Bounding boxes must be explicitly selected using `selectBBox()`
    reselected
      .filter((el) => el.classList.contains('syl'))
      .forEach((el) =>
        selectBBox(
          el.querySelector('.sylTextRect-display'),
          this,
          this.neonView,
        ),
      );

    // Staves must be explicitly selected using `selectStaff()`
    // AND must be selected with `selectAll()` for correct behavior (for some reason).
    reselected
      .filter((el) => el.classList.contains('staff'))
      .forEach((el) => selectStaff(el, this));
  }

  /** Set the d3 action to use for [[reset]]. */
  resetTo(
    reset: (
      selection: d3.Selection<d3.BaseType, unknown, HTMLElement, unknown>,
      args: unknown[],
    ) => void,
  ): void {
    this.resetToAction = reset;
  }

  /** Reset to a previous d3 action for [[this.selector]]. */
  reset(): void {
    if (this.resetToAction !== undefined) {
      d3.select(this.selector).call(this.resetToAction);
    }
  }

  endOptionsSelection(): void {
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
  moveElements(selection: Element[], dx: number, dy: number): void {
    selection
      .filter((el) => el !== null)
      .forEach((el) => {
        el.setAttribute('transform', `translate(${dx},${dy})`);
      });
  }

  /**
   * Visually return selected elements to their original positions
   * by removing the transform attribute
   */
  returnElements(selection: Element[]): void {
    selection
      .filter((el) => el !== null)
      .forEach((el) => {
        el.removeAttribute('transform');
      });
  }

  isCursorOutOfBounds(): boolean {
    const endX = this.dragStartCoords[0] + this.dx;
    const endY = this.dragStartCoords[1] + this.dy;

    return isOutOfSVGBounds(endX, endY);
  }

  /**
   * Returns whether the dragged content would land outside the page.
   *
   * Only real content counts (staff lines, glyphs, text boxes; see
   * `getContentBounds`): editing handles such as the rotate diamonds may
   * hang off the image without blocking a valid move (#1409).
   *
   * Must be called while the drag preview `translate(dx,dy)` is still on the
   * selection: the measured bounds already include it, so the offset is not
   * added a second time.
   * @param {SVGGraphicsElement[]} selection
   * @returns {boolean} Is selection out of bounds
   */
  isDragOutOfBounds(selection: SVGGraphicsElement[]): boolean {
    const bounds = getContentBounds(selection);

    // Nothing measurable (e.g. only zero-size connector glyphs): there is no
    // evidence the drag is invalid, so let it through rather than failing it.
    if (bounds === null) return false;

    const { ulx, uly, lrx, lry } = bounds;
    return isOutOfSVGBounds(ulx, uly) || isOutOfSVGBounds(lrx, lry);
  }
}

export { DragHandler as default };
