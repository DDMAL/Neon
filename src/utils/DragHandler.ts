import NeonView from '../NeonView';
import * as d3 from 'd3';

class DragHandler {
  dragStartCoords: Array<number>;
  dragEndCoords: Array<number>;
  resetToAction: (selection: d3.Selection<d3.BaseType, {}, HTMLElement, any>, args: any[]) => void;
  neonView: NeonView;
  selector: string;
  selection;

  constructor (neonView: NeonView, selector: string) {
    this.neonView = neonView;
    this.selector = selector;
  }

  /**
   * Initialize the dragging action and handler for selected elements.
   */
  dragInit () {
    // Adding listeners
    var dragBehaviour = d3.drag()
      .on('start', dragStarted.bind(this))
      .on('drag', this.dragging.bind(this))
      .on('end', this.dragEnded.bind(this));

    var activeNc = d3.selectAll('.selected');
    var selection = Array.from(document.getElementsByClassName('selected'));
    this.selection = selection.concat(Array.from(document.getElementsByClassName('resizePoint')));

    this.dragStartCoords = new Array(activeNc.size());
    this.dragEndCoords = new Array(activeNc.size());

    activeNc.call(dragBehaviour);

    // Drag effects
    function dragStarted () {
      let target = d3.event.sourceEvent.target;
      this.dragStartCoords = d3.mouse(target);
      if (target.classList.contains('staff')) {
        d3.select(this.selector).call(dragBehaviour);
      }
    }
  }

  dragging () {
    var relativeY = d3.event.y - this.dragStartCoords[1];
    var relativeX = d3.event.x - this.dragStartCoords[0];
    this.selection.forEach((el) => {
      d3.select(el).attr('transform', function () {
        return 'translate(' + [relativeX, relativeY] + ')';
      });
    });
    /*
     * if we're dragging a syllable (or neume etc) then there won't be a syl selected
     * then we don't want the bounding box (if it is displayed) to move when dragging the neumes
     * it will be a child of the element in selection, so it will get moved in the above loop
     * so we cancel that movement out here
     */
    if (this.selection.filter((element: HTMLElement) => element.classList.contains('syl')).length === 0) {
      d3.selectAll('.syllable.selected').selectAll('.sylTextRect-display').attr('transform', function () {
        return 'translate(' + [-1 * relativeX, -1 * relativeY] + ')';
      });
    }
  }

  dragEnded () {
    this.dragEndCoords = [d3.event.x, d3.event.y];
    let paramArray = [];
    this.selection.filter((el: SVGElement) => !el.classList.contains('resizePoint')).forEach((el: SVGElement) => {
      let id = (el.tagName === 'rect') ? el.closest('.syl').id : el.id;
      let singleAction = { action: 'drag',
        param: { elementId: id,
          x: this.dragEndCoords[0] - this.dragStartCoords[0],
          y: (this.dragEndCoords[1] - this.dragStartCoords[1]) * -1 }
      };
      paramArray.push(singleAction);
    });
    let editorAction = {
      'action': 'chain',
      'param': paramArray
    };

    var xDiff = Math.abs(this.dragStartCoords[0] - this.dragEndCoords[0]);
    var yDiff = Math.abs(this.dragStartCoords[1] - this.dragEndCoords[1]);

    if (xDiff > 5 || yDiff > 5) {
      this.neonView.edit(editorAction, this.neonView.view.getCurrentPageURI()).then(() => {
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

  resetTo (reset: (selection: d3.Selection<d3.BaseType, {}, HTMLElement, any>, args: any[]) => void) {
    this.resetToAction = reset;
  }

  reset () {
    if (this.resetToAction !== undefined) {
      d3.select(this.selector).call(this.resetToAction);
    }
  }

  endOptionsSelection () {
    try {
      document.getElementById('moreEdit').innerHTML = '';
      document.getElementById('moreEdit').classList.add('is-invisible');
    } catch (e) {}
  }
}

export { DragHandler as default };
