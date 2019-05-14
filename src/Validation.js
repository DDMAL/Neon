/** @module Validation */

 const schemaPromise = import('./validation/mei-all.rng');

import Worker from './Worker.js';
var worker, schema, statusField;

/**
 * Add the validation information to the display and create the WebWorker
 * for validation MEI.
 */
export async function init () {
  let displayContents = document.getElementById('displayContents');
  displayContents.innerHTML +=
    '<div class="panel-block"><p>MEI Status:&nbsp;' +
    '<span id="validation_status">unknown</span></p></div>';
  statusField = document.getElementById('validation_status');
  worker = new Worker();
  worker.onmessage = updateUI;
}

/**
 * Send the contents of an MEI file to the WebWorker for validation.
 * @param {string} meiData
 */
export async function sendForValidation (meiData) {
  if (schema === undefined) {
    schema = await schemaPromise;
  }
  statusField.textContent = 'checking...';
  statusField.style = 'color:gray';
  worker.postMessage({
    mei: meiData,
    schema: schema.default
  });
}

/**
 * Update the UI with the validation results. Called when the WebWorker finishes validating.
 * @param {object} message - The message sent by the WebWorker.
 * @param {object} message.data - The errors object produced by XML.js
 */
function updateUI (message) {
  let errors = message.data;
  if (errors === null) {
    statusField.textContent = 'VALID';
    statusField.style = 'color:green';
    for (let child of statusField.children) {
      statusField.deleteChild(child);
    }
  } else {
    let log = '';
    errors.forEach(line => {
      log += line + '\n';
    });
    statusField.textContent = '';
    statusField.style = 'color:red';
    let link = document.createElement('a');
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' +
      encodeURIComponent(log));
    link.setAttribute('download', 'validation.log');
    link.textContent = 'INVALID';
    statusField.appendChild(link);
  }
}
