const d3 = require('d3');
const $ = require('jquery');

/**
 * Handle the dragging of musical elements and communicate actions.
 * @constructor
 * @param {NeonView} neonView - The NeonView parent object.
 */
function DragHandler (neonView, selector) {
  var dragStartCoords;
  var dragEndCoords;
  var resetToAction;

  /**
   * Initialize the dragging action and handler for selected elements.
   */
  function dragInit () {
    // Adding listeners
    console.log('dragInit');
    var dragBehaviour = d3.drag().on('start', dragStarted)
      .on('drag', dragging)
      .on('end', dragEnded);

    var activeNc = d3.selectAll('.selected');
    var selection = Array.from(activeNc._groups[0]);

    dragStartCoords = new Array(activeNc.size());
    dragEndCoords = new Array(activeNc.size());

    activeNc.call(dragBehaviour);

    var editorAction;

    // Drag effects
    function dragStarted () {
      console.log('dragStarted');
      dragStartCoords = d3.mouse(this);
      if (this.classList.contains('staff')) {
        d3.select(selector).call(dragBehaviour);
      }
    }

    function dragging () {
      var relativeY = d3.event.y - dragStartCoords[1];
      var relativeX = d3.event.x - dragStartCoords[0];
      selection.forEach((el) => {
        d3.select(el).attr('transform', function () {
          return 'translate(' + [relativeX, relativeY] + ')';
        });
      });
      /*
       * We want to make sure that the rect drawn for resizing (with bboxes and staves) is dragged along when dragging
       * In the case of staves the resizeRect is a child of the staff, so it is done in the previous forEach loop
       * But in the bbox case it's not a child so we need to do it manually
       * so if we are in the sylTextRect case we get the resizeRect and animate its dragging
       * in the case where we're not dragging a syl boundingbox
       * we want to make sure that the bounding box for the thing we are moving
       * (if it exists and is displaying) doesn't move along with it
       * but the above forEach selects all children of the element we're dragging
       * including (potentially) it's syl bbox child
       * the below line cancels that dragging out
       * yes i realize this is very hacky
       */
      if (selection.filter(element => element.classList.contains('sylTextRect-select')).length !== 0) {
        d3.select('#resizeRect').attr('transform', function () {
          return 'translate(' + [relativeX, relativeY] + ')';
        });
      } else {
        d3.selectAll('.sylTextRect-select').attr('transform', function () {
          return 'translate(' + [-1 * relativeX, -1 * relativeY] + ')';
        });
      }
    }

    function dragEnded () {
      console.log('dragEnded');
      dragEndCoords = [d3.event.x, d3.event.y];
      let paramArray = [];
      selection.forEach((el) => {
        let id = (el.tagName === 'rect') ? el.closest('.syl').id : el.id;
        let singleAction = { action: 'drag',
          param: { elementId: id,
            x: parseInt(dragEndCoords[0] - dragStartCoords[0]),
            y: parseInt(dragEndCoords[1] - dragStartCoords[1]) * -1 }
        };
        paramArray.push(singleAction);
      });
      editorAction = {
        'action': 'chain',
        'param': paramArray
      };

      var xDiff = Math.abs(dragStartCoords[0] - dragEndCoords[0]);
      var yDiff = Math.abs(dragStartCoords[1] - dragEndCoords[1]);

      if (xDiff > 5 || yDiff > 5) {
        neonView.edit(editorAction, neonView.view.getCurrentPageURI()).then(() => {
          neonView.updateForCurrentPage();
          endOptionsSelection();
          reset();
          dragInit();
        });
      } else {
        reset();
        dragInit();
      }
    }
  }

  function resetTo (reset) {
    resetToAction = reset;
  }

  function reset () {
    if (resetToAction !== undefined) {
      d3.select(selector).call(resetToAction);
    }
  }

  function endOptionsSelection () {
    $('#moreEdit').empty();
    $('#moreEdit').addClass('is-invisible');
  }

  DragHandler.prototype.dragInit = dragInit;
  DragHandler.prototype.resetTo = resetTo;
}

export { DragHandler as default };
