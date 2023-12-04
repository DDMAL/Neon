import NeonView from './NeonView';
import { ModalWindowView } from './utils/ModalWindow';

const schemaResponse = fetch(__ASSET_PREFIX__ + 'assets/mei-all.rng');
let worker: Worker, schema: string, statusField: HTMLSpanElement;

/**
 * Update the UI with the validation results. Called when the WebWorker finishes validating.
 */
function updateUI (message: { data: string[] }): void {
  const errors = message.data;
  if (errors === null) {
    statusField.textContent = 'VALID';
    statusField.style.color = '#4bc14b';
    for (const child of statusField.children) {
      child.remove();
    }
  } else {
    let log = '';
    errors.forEach(line => {
      log += line + '\n';
    });
    statusField.textContent = '';
    statusField.style.color = 'red';
    const status = document.createElement('div');
    //link.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(log)}`);
    //link.setAttribute('download', 'validation.log');
    status.textContent = 'INVALID';
    status.style.cursor = 'pointer';
    statusField.appendChild(status);

    status.addEventListener('click', statusOnClick.bind(this, log));
  }
}

function statusOnClick(log: string) {
  this.modal.setModalWindowView(ModalWindowView.VALIDATION_STATUS, log);
  this.modal.openModalWindow();
}

/**
 * Add the validation information to the display and create the WebWorker
 * for validation MEI.
 */
export async function init (neonView: NeonView): Promise<void> {
  const fileStatusDiv = document.getElementById('file-status');
  if (fileStatusDiv !== null) {
    const statusTitle = document.createElement('div');
    statusTitle.textContent = 'MEI Status:';
    statusTitle.id = 'validation_status_title';
    const status = document.createElement('span');
    status.id = 'validation_status';
    status.textContent = 'unknown';
    fileStatusDiv.appendChild(statusTitle);
    fileStatusDiv.appendChild(status);
    statusField = document.getElementById('validation_status');
    worker = new Worker(__ASSET_PREFIX__ + 'workers/Worker.js');
    worker.onmessage = updateUI.bind(neonView);
  }
}

/**
 * Send the contents of an MEI file to the WebWorker for validation.
 * @param {string} meiData
 */
export async function sendForValidation (meiData: string): Promise<void> {
  if (statusField === undefined) {
    return;
  }
  if (schema === undefined) {
    const response = await schemaResponse;
    schema = await response.text();
  }
  statusField.textContent = 'checking...';
  statusField.style.color = 'gray';
  worker.postMessage({
    mei: meiData,
    schema: schema
  });
}

/**
 * Update the message on a blank page when there is no MEI.
 */
export function blankPage (): void {
  for (const child of statusField.children) {
    child.remove();
  }
  statusField.textContent = 'No MEI';
  statusField.style.color = 'color:gray';
}
