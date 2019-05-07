import * as Notification from './Notification.js';
const $ = require('jquery');

/**
 * Handler splitting a staff into two staves through Verovio.
 * @constructor
 * @param {NeonView} neonView - The NeonView parent.
 */
function SplitHandler (neonView) {
  function startSplit () {
    splitDisable();

    $('body').on('click', '#svg_output', handler);

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
      $('body').off('click', '#svg_output', handler);
    }
  }

  function clickawayHandler (evt) {
    if (evt.target.id !== 'svg_group' && $('#svg_group').find(evt.target).length === 0 && evt.target.tagName !== 'path' &&
            evt.target.id !== 'split-system') {
      splitDisable();
      $('body').off('click', '#svg_output', handler);
    }
  }

  function resetHandler (evt) {
    if (evt.key === 'Shift') {
      $('body').on('click', '#svg_output', handler);
    }
  }

  function handler (evt) {
    let id = $('.selected')[0].id;

    var container = document.getElementsByClassName('definition-scale')[0];
    var pt = container.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;

    // Transform to SVG coordinate system.
    var transformMatrix = container.getScreenCTM().inverse();
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

    if (neonView.edit(editorAction)) { neonView.refreshPage(); }
    splitDisable();
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
export { SplitHandler as default };
