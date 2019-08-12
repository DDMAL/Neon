/** @module utils/Cursor */

/**
 * Update the cursor to a crosshair.
 */
export function updateCursor () {
  document.getElementById('bgimg').style.cursor = 'crosshair';
  document.getElementById('mei_output').style.cursor = 'crosshair';
}

/**
 * Reset the cursor to the typical pointer.
 */
export function resetCursor () {
  document.getElementById('bgimg').style.cursor = '';
  document.getElementById('mei_output').style.cursor = '';
}

/**
 * Update to specified cursor type.
 * @param {string} type - The CSS cursor property value.
 */
export function updateCursorTo (type) {
  document.getElementById('svg_group').style.cursor = type;
  document.getElementById('mei_output').style.cursor = type;
  document.getElementById('bgimg').style.cursor = type;
}
