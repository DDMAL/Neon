import { unselect } from './utils/SelectTools';
import DragHandler from './utils/DragHandler';
import NeonView from './NeonView';
import { setSelectHelperObjects, dragSelect, clickSelect } from './utils/Select';
import { setGroupingHighlight } from './utils/Color';
import { TextEditInterface } from './Interfaces';
import  { ModalWindowView } from './utils/ModalWindow';

/**
 * Format a string for prompting the user.
 * @param rawString - The unformatted string.
 */
/*
function formatRaw (rawString: string): string {
  const removeSymbol = /\u{25CA}/u;
  return rawString.replace(removeSymbol, '').trim();
}
*/

function selBySyllableListener (): void {
  if (!document.getElementById('selByBBox').classList.contains('is-active')) {
    unselect();
    try {
      document.getElementById('moreEdit').innerHTML = '';
      document.getElementById('extraEdit').innerHTML = '';
      document.getElementById('moreEdit').parentElement.classList.add('hidden');
      document.getElementById('extraEdit').parentElement.classList.add('hidden');
    } catch (e) {}
    document.getElementById('selByBBox').classList.add('is-active');
    try {
      document.getElementById('selByNc').classList.remove('is-active');
      document.getElementById('selByNeume').classList.remove('is-active');
      document.getElementById('selByStaff').classList.remove('is-active');
      document.getElementById('selBySyllable').classList.remove('is-active');
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
    this.initTextEdit();
  }


  /**
  * Set text to edit mode
  */
  initTextEdit (): void {
    const spans = document.getElementById('syl_text').querySelectorAll('span');
    const modal = this.neonView.modal;
    spans.forEach((span: HTMLSpanElement) => {
      function selectSylText (): void {
        span.classList.add('selected-to-edit');
        modal.setModalWindowView(ModalWindowView.EDIT_TEXT);
        modal.openModalWindow();
        modal.updateSelectedBBox(span);
      }

      span.removeEventListener('click', selectSylText);
      span.addEventListener('click', selectSylText);
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

      const block = document.getElementById('selection-mode-btns-container');
      const button = document.createElement('button');
      button.classList.add('side-panel-btn', 'sel-by');
      button.id = 'selByBBox';
      button.textContent = 'BBox';
      block.appendChild(button);
      button.addEventListener('click', selBySyllableListener.bind(this));
      document.body.addEventListener('keydown', (evt) => {
        if (evt.key === '6') {
          if (document.getElementById('selByBBox').style.display === '') {
            selBySyllableListener.bind(this)();
          }
        }
      });
      this.neonView.view.addUpdateCallback(this.addBBoxListeners.bind(this));
    } else {
      const block = document.getElementById('undo').closest('.control');
      const p = document.createElement('p');
      p.classList.add('control');
      const button = document.createElement('button');
      button.classList.add('side-panel-btn', 'sel-by');
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
}
