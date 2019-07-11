/** @module utils/Cursor */

const $ = require('jquery');

/**
 * Update the cursor to a crosshair.
 */
export function updateCursor () {
  $('#bgimg').css('cursor', 'crosshair');
  $('#mei_output').css('cursor', 'crosshair');
}

/**
 * Reset the cursor to the typical pointer.
 */
export function resetCursor () {
  $('#bgimg').css('cursor', 'default');
  $('#mei_output').css('cursor', 'default');
}

/**
 * Update to specified cursor type.
 * @param {string} type - The CSS cursor property value.
 */
export function updateCursorTo (type) {
  $('#svg_group').css('cursor', type);
  $('#bgimg').css('cursor', type);
  $('#mei_output').css('cursor', type);
}
