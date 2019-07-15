import * as Validation from './Validation.js';
import VerovioWrapper from './VerovioWrapper.js';
import PouchDb from 'pouchdb';
const uuid = require('uuid/v4');

/**
 * The core component of Neon. This manages the database,
 * the verovio toolkit, the cache, and undo/redo stacks.
 */
class NeonCore {
  /**
   * Constructor for NeonCore
   * @param {object} manifest - The manifest to load.
   * @returns {object} A NeonCore object.
   */
  constructor (manifest) {
    /**
     * A wrapper for the Verovio Web Worker.
     * @type {object}
     */
    this.verovioWrapper = new VerovioWrapper();
    Validation.init();

    /**
     * Stacks of previous MEI files representing actions that can be undone for each page.
     * @type {Map.<string, Array.<string>>}
     */
    this.undoStacks = new Map();

    /**
     * Stacks of previous MEI files representing actions that can be redone for each page.
     * @type {Map.<string, Array.<string>>}
     */
    this.redoStacks = new Map();

    /**
     * A cache entry.
     * @typedef {Object} CacheEntry
     * @property {boolean} dirty - If the entry has been modified since being fetched from the database.
     * @property {string} mei - The MEI data for the page.
     * @property {SVGSVGElement} svg - The rendered SVG for the page.
     */

    /**
     * A cache mapping a page URI to a {@link CacheEntry}.
     * @type {Map.<string, CacheEntry>}
     */
    this.neonCache = new Map();

    this.parser = new window.DOMParser();

    this.db = new PouchDb('Neon');

    this.blankPages = [];

    // Add each MEI to the database
    this.manifest = manifest;
    this.annotations = manifest.mei_annotations;
    this.lastPageLoaded = '';
  }

  /**
   * Initialize the PouchDb database based on the provided manifest.
   * If a newer version already exists in the database, this will
   * not update the database unless forced.
   * @param {boolean} force - If a database update should be forced.
   * @returns {boolean}
   */
  async initDb (force = false) {
    // Check for existing manifest
    let response = await new Promise((resolve, reject) => {
      this.db.get(this.manifest['@id']).catch(err => {
        if (err.name === 'not_found') {
          // This is a new document.
          let doc = {
            _id: this.manifest['@id'],
            timestamp: this.manifest.timestamp,
            image: this.manifest.image,
            title: this.manifest.title,
            annotations: []
          };
          this.annotations.forEach(annotation => {
            doc.annotations.push(annotation.id);
          });
          return doc;
        } else {
          console.error(err);
          return reject(err);
        }
      }).then(async doc => {
        // Check if doc timestamp is newer than manifest
        let docTime = (new Date(doc.timestamp)).getTime();
        let manTime = (new Date(this.manifest.timestamp)).getTime();
        if (docTime > manTime) {
          if (!force) {
            // Fill annotations list with db annotations
            this.annotations = [];
            doc.annotations.forEach(async id => {
              await this.db.get(id).then(annotation => {
                this.annotations.push({
                  id: annotation._id,
                  type: 'Annotation',
                  body: annotation.body,
                  target: annotation.target
                });
              }).catch(err => {
                console.error(err);
              });
            });
            return resolve(false);
          }
        }
        for (let annotation of this.annotations) {
          // Add annotations to database
          await this.db.get(annotation.id).catch(err => {
            if (err.name === 'not_found') {
              return {
                _id: annotation.id
              };
            } else {
              console.error(err);
              return reject(err);
            }
          }).then(newAnnotation => {
            newAnnotation.body = annotation.body;
            newAnnotation.target = annotation.target;
            return this.db.put(newAnnotation);
          }).catch(err => {
            reject(err);
            console.error(err);
          });
        }
        return this.db.put(doc);
      }).then(() => {
        return resolve(true);
      }).catch(err => {
        reject(err);
        console.error(err);
      });
    });

    return response;
  }

  /**
   * Load a page into the verovio toolkit. This will fetch the
   * page from the cache or from the database.
   * @param {string} pageURI - The URI of the selected page.
   * @returns {Promise} A promise that resolves to the cache entry.
   */
  loadPage (pageURI) {
    return new Promise((resolve, reject) => {
      if (this.lastPageLoaded === pageURI && this.neonCache.has(pageURI)) {
        resolve(this.neonCache.get(pageURI));
      } else if (this.neonCache.has(pageURI)) {
        this.loadData(pageURI, this.neonCache.get(pageURI).mei).then(() => {
          resolve(this.neonCache.get(pageURI));
        });
      } else if (this.blankPages.includes(pageURI)) {
        Validation.blankPage();
        let e = new Error('No MEI file for page ' + pageURI);
        e.name = 'missing_mei';
        reject(e);
      } else {
        // Find annotation
        let annotation = this.annotations.find(elem => {
          return elem.target === pageURI;
        });
        if (annotation) {
          window.fetch(annotation.body).then(response => {
            if (response.ok) {
              return response.text();
            } else {
              throw new Error(response.statusText);
            }
          }).then(data => {
            this.loadData(pageURI, data).then(() => {
              resolve(this.neonCache.get(pageURI));
            });
          }).catch(err => {
            reject(err);
          });
        } else {
          Validation.blankPage();
          this.blankPages.push(pageURI);
        }
      }
    });
  }

  /**
   * Load data into the verovio toolkit and update the cache.
   * @param {string} pageURI - The URI of the selected page.
   * @param {string} data - The MEI of the page as a string.
   * @param {boolean} [dirty] - If the cache entry should be marked as dirty. Defaults to false.
   * @returns {Promise} promise that resolves when this action is done
   */
  loadData (pageURI, data, dirty = false) {
    Validation.sendForValidation(data);
    this.lastPageLoaded = pageURI;
    /* A promise is returned that will resolve to the result of the action.
     * However the value that is must return comes from the Web Worker and
     * information passed between the worker and main context much be in a
     * message. So an event handler is put on verovioWrapper for when a message
     * is receieved from the worker. Then a message is sent to the worker to
     * take an action. A response is sent back and the previously mentioned
     * event handler handles the response. Since it is defined within the
     * promise it has access to the necessary resolve function.
     */
    return new Promise((resolve, reject) => {
      let message = {
        id: uuid(),
        action: 'renderData',
        mei: data
      };
      function handle (evt) {
        if (evt.data.id === message.id) {
          let svg = this.parser.parseFromString(
            evt.data.svg,
            'image/svg+xml'
          ).documentElement;
          this.neonCache.set(pageURI, {
            svg: svg,
            mei: data,
            dirty: dirty
          });
          evt.target.removeEventListener('message', handle);
          resolve();
        }
      }
      this.verovioWrapper.addEventListener('message', handle.bind(this));
      this.verovioWrapper.postMessage(message);
    });
  }

  /**
   * Get the SVG for a specific page number.
   * @param {string} pageURI - The URI of the selected page.
   * @returns {Promise} A promise that resolves to the SVG.
   */
  getSVG (pageURI) {
    return new Promise((resolve, reject) => {
      this.loadPage(pageURI).then((entry) => {
        resolve(entry.svg);
      }).catch((err) => { reject(err); });
    });
  }

  /**
   * Get the MEI for a specific page number.
   * @param {string} pageURI - The URI of the selected page.
   * @returns {Promise} A promise that resolves to the MEI as a string.
   */
  getMEI (pageURI) {
    return new Promise((resolve, reject) => {
      this.loadPage(pageURI).then((entry) => {
        resolve(entry.mei);
      }).catch((err) => { reject(err); });
    });
  }

  /**
   * Get musical element attributes from the verovio toolkit.
   * @param {string} elementId - The unique ID of the musical element.
   * @param {string} pageURI - The URI of the selected page.
   * @returns {Promise} A promise that resolves to the attributes in an object.
   */
  getElementAttr (elementId, pageURI) {
    return new Promise((resolve) => {
      this.loadPage(pageURI).then(() => {
        let message = {
          id: uuid(),
          action: 'getElementAttr',
          elementId: elementId
        };
        this.verovioWrapper.addEventListener('message', function handle (evt) {
          if (evt.data.id === message.id) {
            evt.target.removeEventListener('message', handle);
            resolve(evt.data.attributes);
          }
        });
        this.verovioWrapper.postMessage(message);
      });
    });
  }

  /**
   * Perform an editor action on a specific page.
   * @param {object} action - The editor toolkit action object.
   * @param {string} action.action - The name of the action to perform.
   * @param {object|array} action.param - The parameters of the action(s)
   * @param {string} pageURI - The URI of the selected page.
   * @returns {Promise} Resolves to boolean if the action succeeded or not.
   */
  edit (editorAction, pageURI) {
    let promise;
    if (this.lastPageLoaded === pageURI) {
      promise = Promise.resolve(this.neonCache.get(pageURI));
    } else {
      promise = this.loadPage(pageURI);
    }
    return new Promise((resolve, reject) => {
      promise.then(entry => {
        let currentMEI = entry.mei;
        let message = {
          id: uuid(),
          action: 'edit',
          editorAction: editorAction
        };
        function handle (evt) {
          if (evt.data.id === message.id) {
            if (evt.data.result) {
              if (!this.undoStacks.has(pageURI)) {
                this.undoStacks.set(pageURI, []);
              }
              this.undoStacks.get(pageURI).push(currentMEI);
              this.redoStacks.set(pageURI, []);
            }
            evt.target.removeEventListener('message', handle);
            this.updateCache(pageURI).then(() => { resolve(evt.data.result); });
          }
        }
        this.verovioWrapper.addEventListener('message', handle.bind(this));
        this.verovioWrapper.postMessage(message);
      });
    });
  }

  /**
   * Update contents of the cache using information in verovio toolkit.
   * @param {string} pageURI - Page to be updated in cache.
   * @param {boolean} dirty - If the entry should be marked as dirty
   * @returns {Promise}
   */
  updateCache (pageURI, dirty) {
    return new Promise((resolve, reject) => {
      // Must get MEI and then get SVG then finish.
      var mei, svgText;
      let meiPromise = new Promise((resolve, reject) => {
        let message = {
          id: uuid(),
          action: 'getMEI'
        };
        this.verovioWrapper.addEventListener('message', function handle (evt) {
          if (evt.data.id === message.id) {
            mei = evt.data.mei;
            evt.target.removeEventListener('message', handle);
            resolve();
          }
        });
        this.verovioWrapper.postMessage(message);
      });
      let svgPromise = new Promise((resolve, reject) => {
        let message = {
          id: uuid(),
          action: 'renderToSVG'
        };
        this.verovioWrapper.addEventListener('message', function handle (evt) {
          if (evt.data.id === message.id) {
            svgText = evt.data.svg;
            evt.target.removeEventListener('message', handle);
            resolve();
          }
        });
        this.verovioWrapper.postMessage(message);
      });

      meiPromise.then(() => { return svgPromise; }).then(() => {
        let svg = this.parser.parseFromString(
          svgText,
          'image/svg+xml'
        ).documentElement;
        this.neonCache.set(pageURI, {
          mei: mei,
          svg: svg,
          dirty: dirty
        });
        resolve();
      });
    });
  }

  /**
   * Get the edit info string from the verovio toolkit.
   * @returns {Promise} Promise that resolves to info string
   */
  info (pageURI) {
    let promise;
    if (this.lastPageLoaded === pageURI) {
      promise = Promise.resolve();
    } else {
      promise = this.loadPage(pageURI);
    }
    return new Promise((resolve, reject) => {
      promise.then(() => {
        let message = {
          id: uuid(),
          action: 'editInfo'
        };
        this.verovioWrapper.addEventListener('message', function handle (evt) {
          if (evt.data.id === message.id) {
            evt.target.removeEventListener('message', handle);
            resolve(evt.data.info);
          }
        });
        this.verovioWrapper.postMessage(message);
      });
    });
  }

  /**
   * Undo the last action performed on a specific page.
   * @param {string} pageURI - The URI of the selected page.
   * @returns {Promise} If an action undone.
   */
  undo (pageURI) {
    return new Promise((resolve, reject) => {
      if (this.undoStacks.has(pageURI)) {
        let state = this.undoStacks.get(pageURI).pop();
        if (state !== undefined) {
          this.getMEI(pageURI).then(mei => {
            this.redoStacks.get(pageURI).push(mei);
            return this.loadData(pageURI, state, true);
          }).then(() => {
            resolve(true);
          });
          return;
        }
      }
      resolve(false);
    });
  }

  /**
   * Redo the last action performed on a page.
   * @param {string} pageURI - The zero-indexed page number.
   * @returns {Promise} If an action was redone or not.
   */
  redo (pageURI) {
    return new Promise((resolve, reject) => {
      if (this.redoStacks.has(pageURI)) {
        let state = this.redoStacks.get(pageURI).pop();
        if (state !== undefined) {
          this.getMEI(pageURI).then((mei) => {
            this.undoStacks.get(pageURI).push(mei);
            return this.loadData(pageURI, state, true);
          }).then(() => {
            resolve(true);
          });
          return;
        }
      }
      resolve(false);
    });
  }

  /**
   * Update the PouchDb database stored in the browser.
   * This is based on the data stored in the cache. To save time,
   * only entries marked as dirty will be updated.
   */
  async updateDatabase () {
    let updateTimestamp = false;
    for (let pair of this.neonCache) {
      let key = pair[0];
      let value = pair[1];
      if (value.dirty) {
        updateTimestamp ^= true;
        let index = this.annotations.findIndex(elem => { return elem.target === key; });
        // try to update server with PUT (if applicable
        // only attempt if not a data URI
        let uri;
        if (!this.annotations[index].body.match(/^data:/)) {
          await window.fetch(this.annotations[index].body,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/mei+xml' },
              body: value.mei
            }
          ).then(response => {
            if (response.ok) {
              uri = this.annotations[index].body;
            } else {
              uri = 'data:application/mei+xml;base64,' + window.btoa(value.mei);
            }
          }).catch(err => {
            console.error(err);
            console.warn('Falling back to data URI');
            uri = 'data:application/mei+xml;base64,' + window.btoa(value.mei);
          });
        } else {
          uri = 'data:application/mei+xml;base64,' + window.btoa(value.mei);
        }
        // Update URI in annotations, database
        this.annotations[index].body = uri;
        await this.db.get(this.annotations[index].id).then(doc => {
          doc.body = uri;
          return this.db.put(doc);
        }).then(() => {
          value.dirty = false;
        }).catch(err => {
          console.error(err);
        });
      }
    }

    if (updateTimestamp) {
      await this.db.get(this.manifest['@id']).then(doc => {
        doc.timestamp = (new Date()).toISOString();
        return this.db.put(doc);
      }).catch(err => {
        console.error(err);
      });
    }
  }
}

export { NeonCore as default };
