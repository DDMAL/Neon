import * as Notification from '../utils/Notification.js';
import { selectStaff } from '../utils/SelectTools.js';
import { Resize } from '../utils/Resize.js';

const $ = require('jquery');
const d3 = require('d3');

/**
 * Handler splitting a staff into two staves through Verovio.
 * @constructor
 * @param {NeonView} neonView - The NeonView parent.
 */
function SplitHandler (neonView, selector) {
  function startSplit () {
    splitDisable();

    $('body').on('click', selector, handler);

    // Handle keypresses
    $('body').on('keydown', keydownListener);
    $('body').on('keyup', resetHandler);
    $('body').on('click', clickawayHandler);

    Notification.queueNotification('Click Where to Split');
  }

  function keydownListener (evt) {
    if (evt.key === 'Escape') {
      splitDisable();
    } else if (evt.key === 'Shift') {
      $('body').off('click', selector, handler);
    }
  }

  function clickawayHandler (evt) {
    console.log(evt);
    if ($(evt.target).closest('.active-page').length === 0) {
      splitDisable();
      $('body').off('click', selector, handler);
    }
  }

  function resetHandler (evt) {
    if (evt.key === 'Shift') {
      $('body').on('click', selector, handler);
    }
  }

  function handler (evt) {
    let id = $('.selected')[0].id;

    var container = document.getElementsByClassName('active-page')[0]
      .getElementsByClassName('definition-scale')[0];
    var pt = container.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;

    // Transform to SVG coordinate system.
    var transformMatrix = container.getElementsByClassName('system')[0]
      .getScreenCTM().inverse();
    var cursorPt = pt.matrixTransform(transformMatrix);
    console.log(cursorPt.x);
    // Find staff point corresponds to if one exists
    // TODO

    let editorAction = {
      'action': 'split',
      'param': {
        'elementId': id,
        'x': parseInt(cursorPt.x)
      }
    };

    neonView.edit(editorAction, neonView.view.getCurrentPage()).then(async (result) => {
      if (result) {
        await neonView.updateForCurrentPagePromise();
      }
      splitDisable();
    });
  }

  function splitDisable () {
    $('body').off('keydown', keydownListener);
    $('body').off('keyup', resetHandler);
    $('body').off('click', clickawayHandler);
    $('body').off('click', handler);
  }

  SplitHandler.prototype.constructor = SplitHandler;
  SplitHandler.prototype.startSplit = startSplit;
}

export { SplitHandler };
