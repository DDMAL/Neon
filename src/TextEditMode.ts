import { unselect } from './utils/SelectTools';
import DragHandler from './utils/DragHandler';
import NeonView from './NeonView';
import { setSelectHelperObjects, dragSelect, clickSelect } from './utils/Select';
import { setGroupingHighlight } from './utils/Color';
import { TextEditInterface } from './Interfaces';
import { SetTextAction } from './Types';

/**
 * Format a string for prompting the user.
 * @param rawString - The unformatted string.
 */
function formatRaw (rawString: string): string {
  const removeSymbol = /\u{25CA}/u;
  return rawString.replace(removeSymbol, '').trim();
}

function selBySylListener (): void {
  if (!document.getElementById('selByBBox').classList.contains('is-active')) {
    unselect();
    try {
      document.getElementById('moreEdit').innerHTML = '';
      document.getElementById('extraEdit').innerHTML = '';
      document.getElementById('extraEdit').classList.add('is-invisible');
    } catch (e) {}
    document.getElementById('selByBBox').classList.add('is-active');
    try {
      document.getElementById('selByNc').classList.remove('is-active');
      document.getElementById('selByNeume').classList.remove('is-active');
      document.getElementById('selByStaff').classList.remove('is-active');
      document.getElementById('selBySyl').classList.remove('is-active');
      document.getElementById('selByLayerElement').classList.remove('is-active');
    } catch (e) {}
    try {
      if (document.querySelector('.highlight-selected').id === 'highlight-selection') {
        setGroupingHighlight('syllable');
      }
    } catch (e) {}
  }
  this.addBBoxListeners();
}

/**
 * A Text editing module that works with the SingleView and DivaView modules
 */
export default class TextEditMode implements TextEditInterface {
  private dragHandler: DragHandler;
  private neonView: NeonView;

  /**
   * Constructor for a TextEdit
   * @param neonView - The calling [[NeonView]] for the instance.
   */
  constructor (neonView: NeonView) {
    this.neonView = neonView;
    this.initEditModeControls();
  }

  /**
   * Set listener on edit mode button to start editing.
   */
  initEditModeControls (): void {
    document.getElementById('edit_mode').addEventListener('click', () => {
      this.initTextEdit();
      if ((document.getElementById('displayBBox') as HTMLInputElement).checked) {
        this.initSelectByBBoxButton();
      }
    });
  }

  /**
  * Set text to edit mode
  */
  initTextEdit (): void {
    const spans = document.getElementById('syl_text').querySelectorAll('p > span');
    spans.forEach(span => {
      function updateSylText (): void {
        this.updateSylText(span);
      }

      span.removeEventListener('click', updateSylText.bind(this));
      span.addEventListener('click', updateSylText.bind(this));
    });
  }

  /**
  * Add the selectByBBox button.
  * If neume edit mode is there, add it to the bar with the other select by buttons.
  * Otherwise add an invisible button
  * since the only edit mode is selectByRect in that case
  */
  initSelectByBBoxButton (): void {
    if (this.neonView.NeumeEdit !== undefined) {
      const selByBBox = document.getElementById('selByBBox');
      if (selByBBox) {
        selByBBox.style.display = '';
        return;
      }

      const block = document.getElementById('selBySyl')
        .closest('.control')
        .closest('.field');
      const p = document.createElement('p');
      p.classList.add('control');
      const button = document.createElement('button');
      button.classList.add('button', 'sel-by');
      button.id = 'selByBBox';
      button.textContent = 'BBox';
      p.appendChild(button);
      block.appendChild(p);
      button.addEventListener('click', selBySylListener.bind(this));
      document.body.addEventListener('keydown', (evt) => {
        if (evt.key === '6') {
          if (document.getElementById('selByBBox').style.display === '') {
            selBySylListener.bind(this)();
          }
        }
      });
      this.neonView.view.addUpdateCallback(this.addBBoxListeners.bind(this));
    } else {
      const block = document.getElementById('undo').closest('.control');
      const p = document.createElement('p');
      p.classList.add('control');
      const button = document.createElement('button');
      button.classList.add('button', 'sel-by');
      button.id = 'selByBBox';
      button.textContent = 'BBox';
      p.appendChild(button);
      block.appendChild(p);
      button.classList.add('is-active');
      button.style.display = 'none';
      this.addBBoxListeners();
      this.neonView.view.addUpdateCallback(this.addBBoxListeners.bind(this));
    }
  }

  /**
   * Initialize select by bbox mode
   */
  addBBoxListeners (): void {
    if (document.getElementById('selByBBox').classList.contains('is-active')) {
      unselect();
      if (this.neonView.NeumeEdit === undefined) {
        // just in case
        this.dragHandler = new DragHandler(this.neonView, '.sylTextRect-display');
        setSelectHelperObjects(this.neonView, this.dragHandler);
        if (this.neonView.view.constructor.name === 'SingleView') {
          clickSelect('#mei_output, #mei_output rect');
          dragSelect('#svg_group');
        } else {
          clickSelect('.active-page > svg > svg, .active-page > svg > svg rect');
          dragSelect('.active-page svg');
        }
      }
    }
  }

  /**
  * Update the text for a single syl element
  */
  updateSylText (span: HTMLSpanElement): void {
    const orig = formatRaw(span.textContent);

    // make sure no other modal content is being displayed
    Array.from(document.getElementsByClassName('neon-modal-content')).forEach((elem) => {
      elem.classList.remove('visible');
    });

    // set up Edit Syllable Text modal window
    document.getElementById('neon-modal-content-edit-text').classList.add('visible');
    Array.from(document.getElementsByClassName('neon-modal-btn')).forEach((elem) => {
      elem.classList.add('visible');
    });
    (<HTMLInputElement>document.getElementById('neon-modal-edit-text-input')).value = orig;
    document.getElementById('neon-modal-header-title').innerText = 'EDIT SYLLABLE TEXT';
    document.getElementById('neon-modal-edit-text-input').addEventListener('keydown', this.updateSylTextKeydownEvent);

    // "Cancel" button event listener
    document.getElementById('neon-modal-edit-text-cancel').addEventListener('click', (function() {
      document.getElementById('neon-modal').style.display = 'none';
      document.getElementById('neon-modal-edit-text-input').removeEventListener('keydown', this.updateSylTextKeydownEvent);
    }).bind(this));

    // "Save" button event listener
    document.getElementById('neon-modal-edit-text-save').addEventListener('click', (function() {
      const updatedSylText = (<HTMLInputElement> document.getElementById('neon-modal-edit-text-input')).value;
      if (updatedSylText !== null && updatedSylText !== orig) {
        const editorAction: SetTextAction = {
          action: 'setText',
          param: {
            elementId: [...span.classList.entries()].filter(e => e[1] !== 'text-select')[0][1],
            text: updatedSylText
          }
        };
        this.neonView.edit(editorAction, this.neonView.view.getCurrentPageURI()).then((response) => {
          if (response) {
            this.neonView.updateForCurrentPage();
          }
        });
      }
      document.getElementById('neon-modal').style.display = 'none';
      document.getElementById('neon-modal-edit-text-input').removeEventListener('keydown', this.updateSylTextKeydownEvent);
    }).bind(this));

    // display modal window
    document.getElementById('neon-modal').style.display = 'flex';
  }

  /**
   * Need to add this event to register "Enter" key as well as 
   * to prevent firing of hotkey events when user types.
   */
  updateSylTextKeydownEvent = function(e) {
    e.stopImmediatePropagation();
    if (e.key === "Enter") document.getElementById('neon-modal-edit-text-save').click();
  }

}
