import NeonView from '../NeonView';
import { ChangeStaffToAction, DragAction, EditorAction } from '../Types';
import * as d3 from 'd3';
import { getStaffIdByCoords } from './Coordinates';

class DragHandler {
  readonly neonView: NeonView;
  private selector: string;
  private selection: Element[];

  private dragStartCoords: [number, number] = [-1, -1];
  private resetToAction: (selection: d3.Selection<d3.BaseType, {}, HTMLElement, any>, args: any[]) => void;

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

    const selection = Array.from(document.getElementsByClassName('selected'));
    this.selection = selection.concat(Array.from(document.getElementsByClassName('resizePoint')));
  }

  dragging (): void {
    this.dx = d3.event.x - this.dragStartCoords[0];
    this.dy = d3.event.y - this.dragStartCoords[1];
    this.selection.forEach((el) => {
      d3.select(el).attr('transform', () => {
        return 'translate(' + [this.dx, this.dy] + ')';
      });
    });
    /*
     * if we're dragging a syllable (or neume etc) then there won't be a syl selected
     * then we don't want the bounding box (if it is displayed) to move when dragging the neumes
     * it will be a child of the element in selection, so it will get moved in the above loop
     * so we cancel that movement out here
     */
    const syls = this.selection.filter((el) => el.classList.contains('syl'));
    if (syls.length === 0) {
      d3.selectAll('.syllable.selected')
        .selectAll('.sylTextRect-display')
        .attr(
          'transform',
          () => 'translate(' + [-1 * this.dx, -1 * this.dy] + ')'
        );
    }
  }


  dragEnded (): void {
    const paramArray: EditorAction[] = [];
    this.selection
      .filter((el) => !el.classList.contains('resizePoint'))
      .forEach((el) => {
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
          const { clientX, clientY } = d3.event.sourceEvent;
          const newStaff = getStaffIdByCoords(clientX, clientY);

          const staffAction: ChangeStaffToAction = {
            action: 'changeStaffTo',
            param: {
              elementId: id,
              // if divline is moved to the background (and not a staff),
              // set the staffId to the original staff
              staffId: newStaff ? newStaff : el.closest('.staff').id,
            }
          };

          paramArray.push(staffAction);
        }
      });

    const editorAction: EditorAction = {
      action: 'chain',
      param: paramArray
    };

    const xDiff = Math.abs(this.dx);
    const yDiff = Math.abs(this.dy);

    if (xDiff > 5 || yDiff > 5) {
      this.neonView
        .edit(editorAction, this.neonView.view.getCurrentPageURI())
        .then(() => {
          this.neonView.updateForCurrentPage();
          this.endOptionsSelection();
          this.reset();
          this.dragInit();
        });
    } else {
      this.reset();
      this.dragInit();
    }
  }

  /** Set the d3 action to use for [[reset]]. */
  resetTo (reset: (selection: d3.Selection<d3.BaseType, {}, HTMLElement, any>, args: any[]) => void): void {
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
    if (moreEdit) {
      moreEdit.innerHTML = '';
      moreEdit.parentElement.classList.add('hidden');
    }
  }
}

export { DragHandler as default };
