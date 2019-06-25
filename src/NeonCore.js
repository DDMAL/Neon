import * as Validation from './Validation.js';
import PouchDb from 'pouchdb';

const verovio = require('verovio-dev');

/**
 * The core component of Neon. This manages the database,
 * the verovio toolkit, the cache, and undo/redo stacks.
 */
class NeonCore {
  /**
   * Constructor for NeonCore
   * @param {Array} annotations - An array of data annotations relating pages to MEI files.
   * @param {Promise} title - The title of the page or manuscript.
   * @returns {object} A NeonCore object.
   */
  constructor (annotations, title) {
    this.verovioOptions = {
      format: 'mei',
      noFooter: 1,
      noHeader: 1,
      pageMarginLeft: 0,
      pageMarginTop: 0,
      font: 'Bravura',
      useFacsimile: true
    };

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

    this.db = new PouchDb(title);

    /**
     * A map associating page URIs with their respective Verovio toolkit
     * instances. This is used to decrease latency in loading files.
     * @type {Map.<string, object>}
     */
    this.toolkits = new Map();

    this.blankPages = [];

    // Add each MEI to the database
    this.annotations = annotations;
  }

  /**
   * Initialize the PouchDb database based on the provided MEI.
   * This should only be run if previous data does not exist.
   */
  async initDb () {
    for (let annotation of this.annotations) {
      let value = annotation.body;
      let key = annotation.target;
      await this.db.get(key).catch((err) => {
        if (err.name === 'not_found') {
          // Create new document
          return {
            _id: key,
            data: ''
          };
        } else {
          throw err;
        }
      }).then((doc) => {
        doc.data = value;
        return this.db.put(doc);
      }).catch((err) => {
        console.error(err);
      });
    }
  }

  /**
   * Load a page into the verovio toolkit. This will fetch the
   * page from the cache or from the database.
   * @param {string} pageURI - The URI of the selected page.
   * @returns {Promise} A promise that resolves to the cache entry.
   */
  loadPage (pageURI) {
    return new Promise((resolve, reject) => {
      if (this.neonCache.has(pageURI)) {
        resolve(this.neonCache.get(pageURI));
      } else if (this.blankPages.includes(pageURI)) {
        let e = new Error('No MEI file for page ' + pageURI);
        e.name = 'missing_mei';
        reject(e);
      } else {
        this.db.get(pageURI).then(doc => {
          return window.fetch(doc.data);
        }).then(response => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error(response.statusText);
          }
        }).then(data => {
          this.loadData(pageURI, data);
          resolve(this.neonCache.get(pageURI));
        }).catch(err => {
          if (err.name === 'not_found') {
            this.blankPages.push(pageURI);
          }
          reject(err);
        });
      }
    });
  }

  /**
   * Load data into the verovio toolkit and update the cache.
   * @param {string} pageURI - The URI of the selected page.
   * @param {string} data - The MEI of the page as a string.
   * @param {boolean} [dirty] - If the cache entry should be marked as dirty. Defaults to false.
   */
  loadData (pageURI, data, dirty = false) {
    Validation.sendForValidation(data);
    let svg = this.parser.parseFromString(
      this.getToolkit(pageURI).renderData(data, {}),
      'image/svg+xml'
    ).documentElement;
    this.neonCache.set(pageURI, {
      svg: svg,
      mei: data,
      dirty: dirty
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
        resolve(this.getToolkit(pageURI).getElementAttr(elementId));
      });
    });
  }

  /**
   * Perform an editor action on a specific page.
   * @param {object} action - The editor toolkit action object.
   * @param {string} action.action - The name of the action to perform.
   * @param {object|array} action.param - The parameters of the action(s)
   * @param {string} pageURI - The URI of the selected page.
   * @returns {boolean} If the action succeeded or not.
   */
  async edit (editorAction, pageURI) {
    if (this.currentPage !== pageURI) {
      await this.loadPage(pageURI);
    }
    let currentMEI = this.getMEI(pageURI);
    let result = this.getToolkit(pageURI).edit(editorAction);
    if (result) {
      if (!this.undoStacks.has(pageURI)) {
        this.undoStacks.set(pageURI, []);
      }
      this.undoStacks.get(pageURI).push(await currentMEI);
      this.redoStacks.set(pageURI, []);

      // Update cache
      this.neonCache.set(pageURI, {
        mei: this.getToolkit(pageURI).getMEI(0, true),
        svg: this.parser.parseFromString(this.getToolkit(pageURI).renderToSVG(1),
          'image/svg+xml').documentElement,
        dirty: true
      });
    }
    return result;
  }

  /**
   * Get the edit info string from the verovio toolkit.
   * @returns {string}
   */
  info (pageURI) {
    return this.getToolkit(pageURI).editInfo();
  }

  /**
   * Undo the last action performed on a specific page.
   * @param {string} pageURI - The URI of the selected page.
   * @returns {boolean} If an action undone.
   */
  undo (pageURI) {
    if (this.undoStacks.has(pageURI)) {
      let state = this.undoStacks.get(pageURI).pop();
      if (state !== undefined) {
        this.getMEI(pageURI).then((mei) => {
          this.redoStacks.get(pageURI).push(mei);
        });
        this.loadData(pageURI, state, true);
        return true;
      }
    }
    return false;
  }

  /**
   * Redo the last action performed on a page.
   * @param {string} pageURI - The zero-indexed page number.
   * @returns {boolean} If an action was redone or not.
   */
  redo (pageURI) {
    if (this.redoStacks.has(pageURI)) {
      let state = this.redoStacks.get(pageURI).pop();
      if (state !== undefined) {
        this.getMEI(pageURI).then((mei) => {
          this.undoStacks.get(pageURI).push(mei);
        });
        this.loadData(pageURI, state, true);
        return true;
      }
    }
    return false;
  }

  // TODO fix updateDatabase
  /**
   * Update the PouchDb database stored in the browser.
   * This is based on the data stored in the cache. To save time,
   * only entries marked as dirty will be updated.
   */
  async updateDatabase () {
    /* for (let pair of this.neonCache) {
      let key = pair[0];
      let value = pair[1];
      if (value.dirty) {
        await this.db.get(key.toString()).then((doc) => {
          doc.data = value.mei;
          return this.db.put(doc);
        }).then(() => {
          console.log('done');
          value.dirty = false;
        }).catch((err) => {
          console.error(err);
        });
      }
    } */
  }

  getToolkit (pageURI) {
    if (!this.toolkits.has(pageURI)) {
      this.toolkits.set(pageURI, new verovio.toolkit());
      this.toolkits.get(pageURI).setOptions(this.verovioOptions);
    }
    return this.toolkits.get(pageURI);
  }
}

export { NeonCore as default };
