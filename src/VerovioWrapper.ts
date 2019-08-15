import { VerovioMessage } from './Types';
const VerovioWorker: WorkerConstructable = require('./VerovioWorker.js');

interface WorkerConstructable {
  new (): Worker;
}

/**
 * A wrapper around the verovio web worker to permit mocking in tests.
 */
export default class VerovioWrapper {
  verovioWorker: Worker;
  constructor () {
    this.verovioWorker = new VerovioWorker();
  }

  /**
   * Set an event listener onto the actual web worker.
   */
  addEventListener (type: string, handler: EventListenerOrEventListenerObject): void {
    return this.verovioWorker.addEventListener(type, handler);
  }

  /**
   * Send a message to the actual web worker.
   */
  postMessage (message: VerovioMessage): void {
    return this.verovioWorker.postMessage(message);
  }
}
