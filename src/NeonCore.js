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
   * @param {Map<number, string>} meiMap - Map of zero-indexed page no to MEI.
   * @param {Promise} title - The title of the page or manuscript.
   * @returns {object} A NeonCore object.
   */
  constructor (meiMap, title) {
    this.verovioOptions = {
      inputFormat: 'mei',
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
     * @type {Map.<number, Array.<string>>}
     */
    this.undoStacks = new Map();

    /**
     * Stacks of previous MEI files representing actions that can be redone for each page.
     * @type {Map.<number, Array.<string>>}
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
     * A cache mapping a page number to a {@link CacheEntry}.
     * @type {Map.<number, CacheEntry>}
     */
    this.neonCache = new Map();

    this.parser = new DOMParser();

    this.db = new PouchDb(title);

    /**
     * A map associating page numbers with their respective Verovio toolkit
     * instances. This is used to decrease latency in loading files.
     * @type {Map.<number, object>}
     */
    this.toolkits = new Map();

    this.blankPages = [];

    // Add each MEI to the database
    this.meiMap = meiMap;
  }

  /**
   * Initialize the PouchDb database based on the provided MEI.
   * This should only be run if previous data does not exist.
   */
  async initDb () {
    for (let pair of this.meiMap) {
      let key = pair[0];
      let value = pair[1];
      await this.db.get(key.toString()).catch((err) => {
        if (err.name === 'not_found') {
          // Create new document
          return {
            _id: key.toString(),
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
   * @param {number} pageNo - The zero-indexed page number to load.
   * @returns {Promise} A promise that resolves to the cache entry.
   */
  loadPage (pageNo) {
    return new Promise((resolve, reject) => {
      if (this.neonCache.has(pageNo)) {
        resolve(this.neonCache.get(pageNo));
      } else if (this.blankPages.includes(pageNo)) {
        let e = new Error('No MEI file for page ' + pageNo);
        e.name = 'missing_mei';
        reject(e);
      } else {
        this.db.get(pageNo.toString()).then((doc) => {
          this.loadData(pageNo, doc.data);
          resolve(this.neonCache.get(pageNo));
        }).catch((err) => {
          if (err.name === 'not_found') {
            this.blankPages.push(pageNo);
          }
          reject(err);
        });
      }
    });
  }

  /**
   * Load data into the verovio toolkit and update the cache.
   * @param {number} pageNo - The zero-indexed page number.
   * @param {string} data - The MEI of the page as a string.
   * @param {boolean} [dirty] - If the cache entry should be marked as dirty. Defaults to false.
   */
  loadData (pageNo, data, dirty = false) {
    Validation.sendForValidation(data);
    let svg = this.parser.parseFromString(
      this.getToolkit(pageNo).renderData(data, {}),
      'image/svg+xml'
    ).documentElement;
    this.neonCache.set(pageNo, {
      svg: svg,
      mei: data,
      dirty: dirty
    });
  }

  /**
   * Get the SVG for a specific page number.
   * @param {number} pageNo - The zero-indexed page number.
   * @returns {Promise} A promise that resolves to the SVG.
   */
  getSVG (pageNo) {
    return new Promise((resolve, reject) => {
      this.loadPage(pageNo).then((entry) => {
        resolve(entry.svg);
      }).catch((err) => { reject(err); });
    });
  }

  /**
   * Get the MEI for a specific page number.
   * @param {number} pageNo - The zero-indexed page number.
   * @returns {Promise} A promise that resolves to the MEI as a string.
   */
  getMEI (pageNo) {
    return new Promise((resolve, reject) => {
      this.loadPage(pageNo).then((entry) => {
        resolve(entry.mei);
      }).catch((err) => { reject(err); });
    });
  }

  /**
   * Get musical element attributes from the verovio toolkit.
   * @param {string} elementId - The unique ID of the musical element.
   * @param {number} pageNo - The zero-indexed page number the element is on.
   * @returns {Promise} A promise that resolves to the attributes in an object.
   */
  getElementAttr (elementId, pageNo) {
    return new Promise((resolve) => {
      this.loadPage(pageNo).then(() => {
        resolve(this.getToolkit(pageNo).getElementAttr(elementId));
      });
    });
  }

  /**
   * Perform an editor action on a specific page.
   * @param {object} action - The editor toolkit action object.
   * @param {string} action.action - The name of the action to perform.
   * @param {object|array} action.param - The parameters of the action(s)
   * @param {number} pageNo - The zero-indexed page number to perform the action on.
   * @returns {boolean} If the action succeeded or not.
   */
  async edit (editorAction, pageNo) {
    if (this.currentPage !== pageNo) {
      await this.loadPage(pageNo);
    }
    let currentMEI = this.getMEI(pageNo);
    let result = this.getToolkit(pageNo).edit(editorAction);
    if (result) {
      if (!this.undoStacks.has(pageNo)) {
        this.undoStacks.set(pageNo, []);
      }
      this.undoStacks.get(pageNo).push(await currentMEI);
      this.redoStacks.set(pageNo, []);

      // Update cache
      this.neonCache.set(pageNo, {
        mei: this.getToolkit(pageNo).getMEI(0, true),
        svg: this.parser.parseFromString(this.getToolkit(pageNo).renderToSVG(1),
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
  info (pageNo) {
    return this.getToolkit(pageNo).editInfo();
  }

  /**
   * Undo the last action performed on a specific page.
   * @param {number} pageNo - The zero-indexed page number.
   * @returns {boolean} If an action undone.
   */
  undo (pageNo) {
    if (this.undoStacks.has(pageNo)) {
      let state = this.undoStacks.get(pageNo).pop();
      if (state !== undefined) {
        this.getMEI(0).then((mei) => {
          this.redoStacks.get(pageNo).push(mei);
        });
        this.loadData(pageNo, state, true);
        return true;
      }
    }
    return false;
  }

  /**
   * Redo the last action performed on a page.
   * @param {number} pageNo - The zero-indexed page number.
   * @returns {boolean} If an action was redone or not.
   */
  redo (pageNo) {
    if (this.redoStacks.has(pageNo)) {
      let state = this.redoStacks.get(pageNo).pop();
      if (state !== undefined) {
        this.getMEI(0).then((mei) => {
          this.undoStacks.get(pageNo).push(mei);
        });
        this.loadData(pageNo, state, true);
        return true;
      }
    }
    return false;
  }

  /**
   * Update the PouchDb database stored in the browser.
   * This is based on the data stored in the cache. To save time,
   * only entries marked as dirty will be updated.
   */
  async updateDatabase () {
    for (let pair of this.neonCache) {
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
    }
  }

  getToolkit (pageNo) {
    if (!this.toolkits.has(pageNo)) {
      this.toolkits.set(pageNo, new verovio.toolkit());
      this.toolkits.get(pageNo).setOptions(this.verovioOptions);
    }
    return this.toolkits.get(pageNo);
  }
}

export { NeonCore as default };
