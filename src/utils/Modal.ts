import NeonView from '../NeonView';
import { SetTextAction } from '../Types';
import { ModalInterface } from './../Interfaces';
import { hotkeysModal, editTextModal } from '../SquareEdit/Contents';



/**
 * Defines modal types.
 * To create new modal window types, add enum option and implement logic inside Modal class.
 */
export enum ModalView {
  EDIT_TEXT,
  HOTKEYS
}



/**
 * Modal class is used to create and control state/content 
 * of modal windows in Neon.
 */
export class Modal implements ModalInterface {
  private modalView: ModalView; // current modal type
  private neonView: NeonView; // neonView instance context


  /**
   * Set neonView instance context for this modal window instance.
   * @param neonView neonView context for Modal instance
   */
  constructor (neonView: NeonView) {
    this.neonView = neonView;
  }


  /**
   * Set the modal view of this Modal instance.
   * Update the content based on passed view.
   * @param view Type of modal to open (ModalView enum)
   */
  setModalView(view: ModalView): void {
    this.modalView = view;
    this.setModalContent();
  }


  /**
   * Return the current modal view as a string
   */
  getModalView(): string {
    return this.modalView.toString();
  }


  /**
   * Open a model window with content representing the current ModalView.
   */
  openModal(): void {
    switch(this.modalView) {
      case ModalView.EDIT_TEXT:
        this.openEditSylTextModal();
        break;
      case ModalView.HOTKEYS:
        this.openHotkeyModal();
      default:
        break;
    }

    // reset event listeners
    document.getElementById('neon-modal-header-close').removeEventListener('click', this.hideModal);
    document.getElementById('neon-modal').removeEventListener('keydown', this.keydownListener);
    document.getElementById('neon-modal-header-close').addEventListener('click', this.hideModal);
    document.getElementById('neon-modal').addEventListener('keydown', this.keydownListener.bind(this));
  }


  /**
   * Hide the Neon modal window
   */
  hideModal(): void {
    switch(this.modalView) {
      case ModalView.EDIT_TEXT:
        const span = <HTMLSpanElement> document.getElementById('syl_text').querySelectorAll('p>span.selected')[0];
        span.classList.remove('selected');

      default:
        document.getElementById('neon-modal-container').style.display = 'none';
    } 
  }

  /**
   * Set content of modal window
   */
  private setModalContent(): void {
    switch(this.modalView) {
      case ModalView.EDIT_TEXT:
        document.getElementById('neon-modal-content-container').innerHTML = editTextModal;
        break;

      case ModalView.HOTKEYS:
        document.getElementById('neon-modal-content-container').innerHTML = hotkeysModal;
        break;

      default:
    } 
  }


  /**
   * Fill modal window with content for updating syllable text
   */
  private openEditSylTextModal = function(): void {
    // span and current text of selected syllable and filter out unwanted chars
    const span = <HTMLSpanElement> document.getElementById('syl_text').querySelectorAll('p>span.selected')[0];
    const removeSymbol = /\u{25CA}/u;
    const orig = span.textContent.replace(removeSymbol, '').trim();

    // set modal window title
    document.getElementById('neon-modal-header-title').innerText = 'EDIT SYLLABLE TEXT';

    // make sure no other modal content is being displayed
    Array.from(document.getElementsByClassName('neon-modal-content')).forEach( (elem) => {
      elem.classList.remove('visible');
    });

    // set up Edit Syllable Text modal window
    document.getElementById('neon-modal-content-edit-text').classList.add('visible');

    // set value of input field to current syllable text
    (<HTMLInputElement> (document.getElementById('neon-modal-edit-text-input'))).value = orig;
    
    // Reset "Cancel" button event listener
    document.getElementById('neon-modal-edit-text-cancel').removeEventListener('click', this.hideModal.bind(this));
    document.getElementById('neon-modal-edit-text-cancel').addEventListener('click', this.hideModal.bind(this));

    // Reset "Save" button event listener
    document.getElementById('neon-modal-edit-text-save').removeEventListener('click', this.updateSylText.bind(this));
    document.getElementById('neon-modal-edit-text-save').addEventListener('click', this.updateSylText.bind(this));

    // display modal window
    document.getElementById('neon-modal-container').style.display = 'block';
    (<HTMLInputElement> document.getElementById('neon-modal-edit-text-input')).select();
  };


  /**
   * Update text of selected syllables with user-provided text
   */
  private updateSylText = function(): void {
    // span and current text of selected syllable and filter out unwanted chars
    const span = <HTMLSpanElement> document.getElementById('syl_text').querySelectorAll('p>span.selected')[0];
    const removeSymbol = /\u{25CA}/u;
    const orig = span.textContent.replace(removeSymbol, '').trim();
    

    const updatedSylText = (<HTMLInputElement> document.getElementById('neon-modal-edit-text-input')).value;

    if (updatedSylText !== null && updatedSylText !== orig) {
      // create "set text" action
      const elementId = [...span.classList.entries()].filter((className) => className[1] !== 'text-select' && className[1] !== 'selected')[0][1];
      const editorAction: SetTextAction = {
        action: 'setText',
        param: {
          elementId: elementId,
          text: updatedSylText,
        },
      };
      // send action to verovio for processing
      this.neonView.edit(editorAction, this.neonView.view.getCurrentPageURI()).then((response) => {
        if (response) {
          this.neonView.updateForCurrentPage();
        }
      });
    }
    // close modal window
    this.hideModal();
  };


  /**
   * Fill modal window with hotkey info content
   */
  private openHotkeyModal = function() {   
    // make sure no other modal content is being displayed
    Array.from(document.getElementsByClassName('neon-modal-content')).forEach((elem) => {
      elem.classList.remove('visible');
    });

    // set up and diplay hotkey modal content
    document.getElementById('neon-modal-content-hotkeys').classList.add('visible');
    document.getElementById('neon-modal-header-title').innerText = 'HOTKEYS';


    document.getElementById('neon-modal-container').style.display = 'block';
    document.getElementById('neon-modal').focus();
  };


  /**
   * Define event listeners for modal window based on modalView type
   */
  private keydownListener = function(e) {
    e.stopImmediatePropagation(); // prevent Neon hotkey events from firing when user is typing

    switch(this.modalView) {
      case ModalView.EDIT_TEXT:
        if (e.key === 'Enter') this.updateSylText();

      default:
        if (e.key === 'Escape') this.hideModal();
    }  
  };

}