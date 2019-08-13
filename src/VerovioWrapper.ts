const VerovioWorker = require('./VerovioWorker.js');

/**
 * A wrapper around the verovio web worker to permit mocking in tests.
 */
export default class VerovioWrapper {
  verovioWorker: any;
  constructor () {
    this.verovioWorker = new VerovioWorker();
  }

  /**
   * Set an event listener onto the actual web worker.
   * @param {string} type - The event to listen to.
   * @param {function} handler - The function to be called when the event occurs.
   */
  addEventListener (type: string, handler: Function) {
    return this.verovioWorker.addEventListener(type, handler);
  }

  /**
   * Send a message to the actual web worker.
   * @param {object} message - The message to be sent.
   */
  postMessage (message: object) {
    return this.verovioWorker.postMessage(message);
  }
}
