import NeonView from '../NeonView';
import { SetTextAction } from '../Types';
import { ModalWindowInterface } from '../Interfaces';
import { hotkeysModal, editTextModal } from '../SquareEdit/Contents';
import { uploadAreaHTML } from '../Dashboard/dashboard_components';


/**
 * Defines modal types.
 * To create new modal window types, add enum option and implement logic inside Modal class.
 */
export enum ModalWindowView {
  EDIT_TEXT,
  HOTKEYS,
  VALIDATION_STATUS,
  DOCUMENT_UPLOAD
}

enum ModalWindowState {
  OPEN,
  CLOSED
}



/**
 * Modal class is used to create and control state/content 
 * of modal windows in Neon.
 */
export class ModalWindow implements ModalWindowInterface {
  private modalWindowView: ModalWindowView; // current modal type
  private modalWindowState: ModalWindowState; // open or closed?
  private neonView: NeonView; // neonView instance context


  /**
   * Set neonView instance context for this modal window instance.
   * @param neonView neonView context for Modal instance
   */
  constructor (neonView?: NeonView) {
    this.neonView = neonView;
    this.modalWindowState = ModalWindowState.CLOSED;

    // set event listeners that apply to all modal windows
    document.getElementById('neon-modal-window-header-close').addEventListener('click', this.hideModalWindow.bind(this));
    document.getElementById('neon-modal-window').addEventListener('keydown', this.keydownListener.bind(this));
    document.getElementById('neon-modal-window-container').addEventListener('click', this.focusModalWindow.bind(this));
  }

  


  /**
   * Set the modal view of this Modal instance.
   * Update the content based on passed view.
   * @param view Type of modal to open (ModalView enum)
   */
  setModalWindowView(view: ModalWindowView, content?: string): void {
    this.modalWindowView = view;
    this.setModalWindowContent(content);
  }


  /**
   * Return the current modal view as a string
   */
  getModalWindowView(): string {
    return this.modalWindowView.toString();
  }


  /**
   * Open a model window with content representing the current ModalView.
   */
  openModalWindow(): void {
    // make sure no other modal content is being displayed
    Array.from(document.getElementsByClassName('neon-modal-window-content')).forEach((elem) => {
      elem.classList.remove('visible');
    });
    switch(this.modalWindowView) {
      
      case ModalWindowView.EDIT_TEXT:
        this.openEditSylTextModalWindow();
        break;
        
      case ModalWindowView.HOTKEYS:
        // set up and diplay hotkey modal content
        document.getElementById('neon-modal-window-content-hotkeys').classList.add('visible');

      case ModalWindowView.DOCUMENT_UPLOAD:
        // add function to pairing button
        
      default:
        document.getElementById('neon-modal-window-container').style.display = 'flex';
        this.focusModalWindow();
        break;
    }
    // make sure user can't scroll when modal is open
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'hidden';
    this.modalWindowState = ModalWindowState.OPEN;
  }



  /**
   * Hide the Neon modal window
   */
  hideModalWindow(): void {
    switch(this.modalWindowView) {
      case ModalWindowView.EDIT_TEXT:
        const span = (<HTMLSpanElement> document.getElementById('syl_text').querySelectorAll('span.selected-to-edit')[0]);
        span.classList.remove('selected-to-edit');

      default:
        document.getElementById('neon-modal-window-container').style.display = 'none';
      
        // after the modal is closed, no keyboard shortcuts work because
        // the document hasn't been focused; this forcefully focuses the container
        if (this.modalWindowView !== ModalWindowView.DOCUMENT_UPLOAD) {
          document.getElementById('container').focus();
        }
    } 
    // reset scroll behavior of body
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'scroll';
    this.modalWindowState = ModalWindowState.CLOSED;
  }


  /**
   * Set content of modal window
   */
  private setModalWindowContent(content?: string): void {
    switch (this.modalWindowView) {
      case ModalWindowView.EDIT_TEXT:
        document.getElementById('neon-modal-window-content-container').innerHTML = editTextModal;
        // set modal window title
        document.getElementById('neon-modal-window-header-title').innerText = 'EDIT SYLLABLE TEXT';

        // span and current text of selected-to-edit syllable and filter out unwanted chars
        const span = <HTMLSpanElement> document.getElementById('syl_text').querySelectorAll('span.selected-to-edit')[0];
        const removeSymbol = /\u{25CA}/u;
        const orig = span.textContent.replace(removeSymbol, '').trim();

        // set value of input field to current syllable text
        (<HTMLInputElement> (document.getElementById('neon-modal-window-edit-text-input'))).value = orig;
        break;

      case ModalWindowView.HOTKEYS:
        document.getElementById('neon-modal-window-content-container').innerHTML = hotkeysModal;
        document.getElementById('neon-modal-window-header-title').innerText = 'HOTKEYS';
        break;

      case ModalWindowView.VALIDATION_STATUS:
        document.getElementById('neon-modal-window-content-container').innerHTML = 
          `<div style="margin-bottom: 30px;white-space: pre-line;">${content}</div>
          <div class="neon-modal-window-btn">
            <a href="data:text/plain;charset=utf-8,${encodeURIComponent(content)}" download="validation.log">
              Export
            </a>
            </div>`;
        document.getElementById('neon-modal-window-header-title').innerText = 'ERROR LOG';
        break;

        case ModalWindowView.DOCUMENT_UPLOAD:
          document.getElementById('neon-modal-window-header-title').innerText = 'DOCUMENT UPLOAD';
          document.getElementById('neon-modal-window-content-container').innerHTML = uploadAreaHTML;
          break;

      default:
        console.error('Unknown selection type. This should not have occurred.');
    } 
  }


  /**
   * Fill modal window with content for updating syllable text
   */
  private openEditSylTextModalWindow = function(): void {
    // make sure no other modal content is being displayed
    Array.from(document.getElementsByClassName('neon-modal-window-content')).forEach( (elem) => {
      elem.classList.remove('visible');
    });

    // set up Edit Syllable Text modal window
    document.getElementById('neon-modal-window-content-edit-text').classList.add('visible');
    
    // Reset "Cancel" button event listener
    document.getElementById('neon-modal-window-edit-text-cancel').removeEventListener('click', this.hideModalWindow);
    document.getElementById('neon-modal-window-edit-text-cancel').addEventListener('click', this.hideModalWindow.bind(this));

    // Reset "Save" button event listener
    document.getElementById('neon-modal-window-edit-text-save').removeEventListener('click', this.updateSylText.bind(this));
    document.getElementById('neon-modal-window-edit-text-save').addEventListener('click', this.updateSylText.bind(this));

    // display modal window
    document.getElementById('neon-modal-window-container').style.display = 'flex';
    this.focusModalWindow();
  };



  /**
   * Update text of selected-to-edit syllables with user-provided text
   */
  private updateSylText = function () {
    // span and current text of selected-to-edit syllable and filter out unwanted chars
    const span = <HTMLSpanElement> document.getElementById('syl_text').querySelectorAll('span.selected-to-edit')[0];
    const removeSymbol = /\u{25CA}/u;
    const orig = span.textContent.replace(removeSymbol, '').trim();
    const updatedSylText = (<HTMLInputElement> document.getElementById('neon-modal-window-edit-text-input')).value;

    if (updatedSylText !== null && updatedSylText !== orig) {
      // create "set text" action
      const elementId = [...span.classList.entries()].filter((className) => className[1] !== 'text-select' && className[1] !== 'selected-to-edit')[0][1];
      const editorAction: SetTextAction = {
        action: 'setText',
        param: {
          elementId: elementId,
          text: updatedSylText,
        },
      };
      // send action to verovio for processing
      this.neonView.edit(editorAction, this.neonView.view.getCurrentPageURI()).then((response: boolean) => {
        if (response) {
          // update the SVG
          this.neonView.updateForCurrentPage().then(() => {
            // An update to the page will reload the entire svg;
            // We would like to then reselect the same selected syllable
            // if bboxes are enabled
            this.updateSelectedBBox(span);
          });
        }
      });
    }
    // close modal window
    this.hideModalWindow();
  };


  /**
   * Fill modal window with hotkey info content
   */
  /*
  private openHotkeyModalWindow = function() {   
    // make sure no other modal content is being displayed
    Array.from(document.getElementsByClassName('neon-modal-window-content')).forEach((elem) => {
      elem.classList.remove('visible');
    });

    // set up and diplay hotkey modal content
    document.getElementById('neon-modal-window-content-hotkeys').classList.add('visible');

    document.getElementById('neon-modal-window-container').style.display = 'flex';
    this.focusModalWindow();
  };
  */


  /**
   * Define event listeners for modal window based on modalView type
   */
  private keydownListener = function(e) {
    e.stopImmediatePropagation(); // prevent Neon hotkey events from firing when user is typing

    switch(this.modalWindowView) {
      case ModalWindowView.EDIT_TEXT:
        if (e.key === 'Enter') this.updateSylText();

      default:
        if (e.key === 'Escape') this.hideModalWindow();
    }  
  };


  /**
   * Event listener that focuses the modal window if user clicks anywhere outside of it
   */
  private focusModalWindow = function() {
    switch(this.modalWindowView) {
      case ModalWindowView.EDIT_TEXT:
        (<HTMLInputElement> document.getElementById('neon-modal-window-edit-text-input')).select();
        break;

      default:
        document.getElementById('neon-modal-window').focus();
    }
  };

}
