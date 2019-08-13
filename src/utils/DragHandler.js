const d3 = require('d3');

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
    var dragBehaviour = d3.drag()
      .on('start', dragStarted)
      .on('drag', dragging)
      .on('end', dragEnded);

    var activeNc = d3.selectAll('.selected');
    var selection = Array.from(activeNc._groups[0]);
    selection = selection.concat(Array.from(document.getElementsByClassName('resizePoint')));

    dragStartCoords = new Array(activeNc.size());
    dragEndCoords = new Array(activeNc.size());

    activeNc.call(dragBehaviour);

    var editorAction;

    // Drag effects
    function dragStarted () {
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
       * if we're dragging a syllable (or neume etc) then there won't be a syl selected
       * then we don't want the bounding box (if it is displayed) to move when dragging the neumes
       * it will be a child of the element in selection, so it will get moved in the above loop
       * so we cancel that movement out here
       */
      if (selection.filter(element => element.classList.contains('syl')).length === 0) {
        d3.selectAll('.syllable.selected').selectAll('.sylTextRect-display').attr('transform', function () {
          return 'translate(' + [-1 * relativeX, -1 * relativeY] + ')';
        });
      }
    }

    function dragEnded () {
      dragEndCoords = [d3.event.x, d3.event.y];
      let paramArray = [];
      selection.filter(el => !el.classList.contains('resizePoint')).forEach((el) => {
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

  /**
   * A d3 action that should be put on the selector once the drag action finishes.
   * @param {oject} reset
   */
  function resetTo (reset) {
    resetToAction = reset;
  }

  /**
   * Reset the actino on the selector to the one set by resetTo.
   */
  function reset () {
    if (resetToAction !== undefined) {
      d3.select(selector).call(resetToAction);
    }
  }

  /**
   * Remove the additonal editor options that exist.
   */
  function endOptionsSelection () {
    try {
      document.getElementById('moreEdit').innerHTML = '';
      document.getElementById('moreEdit').classList.add('is-invisible');
    } catch (e) {}
  }

  DragHandler.prototype.dragInit = dragInit;
  DragHandler.prototype.resetTo = resetTo;
}

export { DragHandler as default };
