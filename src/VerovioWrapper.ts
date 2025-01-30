import { VerovioMessage } from './Types';

/**
 * A wrapper around the verovio web worker to permit mocking in tests.
 */
export default class VerovioWrapper {
  verovioWorker: Worker;
  private ready: Promise<void>;

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.verovioWorker = new Worker(
        __ASSET_PREFIX__ + 'workers/VerovioWorker.js',
      );
    } else {
      this.verovioWorker = new Worker(
        __ASSET_PREFIX__ + 'workers/VerovioWorker-dev.js',
      );
    }

    this.ready = new Promise((resolve) => {
      this.verovioWorker.addEventListener('message', (event) => {
        if (event.data === 'ready') {
          console.log('VerovioWrapper: verovioWorker READY');
          resolve();
        }
      });
    });
  }

  /**
   * Set an event listener onto the actual web worker.
   */
  addEventListener(
    type: string,
    handler: EventListenerOrEventListenerObject,
  ): void {
    return this.verovioWorker.addEventListener(type, handler);
  }

  /**
   * Send a message to the actual web worker.
   */
  async postMessage(message: VerovioMessage): Promise<void> {
    await this.ready;
    return this.verovioWorker.postMessage(message);
  }
}
