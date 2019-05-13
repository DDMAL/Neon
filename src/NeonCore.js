import * as Validation from './Validation.js';
import PouchDb from 'pouchdb';

const verovio = require('verovio-dev');

export default class NeonCore {
  /**
   * Constructor for NeonCore
   * @param {Map<number, string>} meiMap - Map of zero-indexed page no to MEI.
   */
  constructor (meiMap, title) {
    this.vrvToolkit = new verovio.toolkit();
    this.vrvToolkit.setOptions({
      inputFormat: 'mei',
      noFooter: 1,
      noHeader: 1,
      pageMarginLeft: 0,
      pageMarginTop: 0,
      font: 'Bravura'
    });

    Validation.init();

    this.undoStacks = new Map();
    this.redoStacks = new Map();
    this.neonCache = new Map();

    this.parser = new DOMParser();

    this.db = new PouchDb(title);
    // Add each MEI to the database
    this.meiMap = meiMap;
  }

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

  loadPage (pageNo) {
    return new Promise((resolve, reject) => {
      if (this.currentPage !== pageNo) {
        if (this.neonCache.has(pageNo)) {
          this.loadData(pageNo, this.neonCache.get(pageNo).mei);
          resolve(this.neonCache.get(pageNo));
        } else {
          this.db.get(pageNo.toString()).then((doc) => {
            this.loadData(pageNo, doc.data);
            resolve(this.neonCache.get(pageNo));
          }).catch((err) => {
            reject(err);
          });
        }
      } else {
        resolve(this.neonCache.get(pageNo));
      }
    });
  }

  loadData (pageNo, data, dirty = false) {
    Validation.sendForValidation(data);
    let svg = this.parser.parseFromString(
      this.vrvToolkit.renderData(data, {}),
      'image/svg+xml'
    ).documentElement;
    this.neonCache.set(pageNo, {
      svg: svg,
      mei: data,
      dirty: dirty
    });
    this.currentPage = pageNo;
  }

  getSVG (pageNo) {
    return new Promise((resolve, reject) => {
      this.loadPage(pageNo).then((entry) => {
        resolve(entry.svg);
      }).catch((err) => { reject(err); });
    });
  }

  getMEI (pageNo) {
    return new Promise((resolve, reject) => {
      this.loadPage(pageNo).then((entry) => {
        resolve(entry.mei);
      }).catch((err) => { reject(err); });
    });
  }

  async getElementAttr (elementId, pageNo) {
    return new Promise((resolve) => {
      this.loadPage(pageNo).then(() => {
        resolve(this.vrvToolkit.getElementAttr(elementId));
      });
    });
  }

  async edit (editorAction, pageNo) {
    if (this.currentPage !== pageNo) {
      await this.loadPage(pageNo);
    }
    let currentMEI = this.getMEI(pageNo);
    let result = this.vrvToolkit.edit(editorAction);
    if (result) {
      if (!this.undoStacks.has(pageNo)) {
        this.undoStacks.set(pageNo, []);
      }
      this.undoStacks.get(pageNo).push(await currentMEI);
      this.redoStacks.set(pageNo, []);

      // Update cache
      this.neonCache.set(pageNo, {
        mei: this.vrvToolkit.getMEI(0, true),
        svg: this.parser.parseFromString(this.vrvToolkit.renderToSVG(1),
          'image/svg+xml').documentElement,
        dirty: true
      });
    }
    return result;
  }

  info () {
    return this.vrvToolkit.editInfo();
  }

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

  updateDatabase () {
    this.neonCache.forEach(async (value, key) => {
      if (value.dirty) {
        await this.db.get(key.toString()).then((doc) => {
          doc.data = value.mei;
        }).then(() => {
          value.dirty = false;
        }).catch((err) => {
          console.error(err);
        });
      }
    });
  }
}
