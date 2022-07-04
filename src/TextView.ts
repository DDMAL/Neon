import * as Notification from './utils/Notification';
import NeonView from './NeonView';
import { unselect } from './utils/SelectTools';
import { updateHighlight } from './DisplayPanel/DisplayControls';
import { TextViewInterface } from './Interfaces';

/*
 * Class that manages getting the text for syllables in Neon from the mei file
 */
class TextView implements TextViewInterface {
  private neonView: NeonView;
  /** Whether or not the user has been notified about blank syllables. */
  private notificationSent: boolean;
  /**
   * A constructor for a TextView.
   * @param neonView - The calling [[NeonView]] for the instance.
   */
  constructor (neonView: NeonView) {
    this.neonView = neonView;
    this.notificationSent = false;

    // add checkbox to enable/disable the view
    const checkboxesContainer = document.getElementById('display-single-container');
    const textLabel = document.createElement('label');
    const bboxLabel = document.createElement('label');
    const textButton = document.createElement('input');
    const bboxButton = document.createElement('input');
    textButton.classList.add('checkbox');
    bboxButton.classList.add('checkbox');
    textLabel.classList.add('checkbox-container', 'side-panel-btn');
    bboxLabel.classList.add('checkbox-container', 'side-panel-btn');
    textLabel.textContent = 'Text';
    bboxLabel.textContent = 'BBoxes';
    textButton.id = 'displayText';
    textButton.type = 'checkbox';
    bboxButton.id = 'displayBBox';
    bboxButton.type = 'checkbox';
    textButton.checked = false;
    bboxButton.checked = false;
    textLabel.appendChild(textButton);
    bboxLabel.appendChild(bboxButton);
    checkboxesContainer.prepend(bboxLabel);
    checkboxesContainer.prepend(textLabel);

    this.setTextViewControls();
    this.neonView.view.addUpdateCallback(this.updateTextViewVisibility.bind(this));
    this.neonView.view.addUpdateCallback(this.updateBBoxViewVisibility.bind(this));
  }

  /**
  * Set listeners on textview visibility checkbox
  */
  setTextViewControls (): void {
    function textViewVis (): void { this.updateTextViewVisibility(); }
    function bboxViewVis (): void { this.updateBBoxViewVisibility(); }

    this.updateTextViewVisibility();
    this.updateBBoxViewVisibility();
    document.getElementById('displayText')
      .addEventListener('click', textViewVis.bind(this));
    document.getElementById('displayBBox') // Why is BBox logic is inside TextView.ts ???
      .addEventListener('click', bboxViewVis.bind(this));
  }

  /**
   * Update visibility of text bounding boxes
   */
  updateBBoxViewVisibility (): void {

    const displayAllBtn = document.getElementById('display-all-btn');
    const displayInfo = document.getElementById('displayInfo') as HTMLInputElement;
    const displayBBoxes = document.getElementById('displayBBox') as HTMLInputElement;
    const displayText = document.getElementById('displayText') as HTMLInputElement;

    if ((document.getElementById('displayBBox')as HTMLInputElement).checked) {
      document.querySelectorAll('.sylTextRect').forEach(rect => {
        rect.classList.add('sylTextRect-display');
        rect.classList.remove('sylTextRect');
      });
      document.querySelectorAll('.syl.selected .sylTextRect-display')
        .forEach((rect: HTMLElement) => { rect.style.fill = 'red'; });

      if (this.neonView.getUserMode() !== 'viewer' && this.neonView.TextEdit !== undefined) {
        this.neonView.TextEdit.initSelectByBBoxButton();
      }

      // if this is the 3rd option to be checked (all three are selected),
      // set "Display/Hide All" button to "Hide All".
      if (displayInfo.checked && displayBBoxes.checked && displayText.checked) {
        displayAllBtn.classList.add('selected');
        displayAllBtn.innerHTML = 'Hide All';
      }
    } 
    else {
      if (document.getElementById('selByBBox')?.classList.contains('is-active')) {
        unselect();
        document.getElementById('selByBBox').classList.remove('is-active');
        document.getElementById('selBySyllable').classList.add('is-active');
      }

      document.querySelectorAll('.sylTextRect-display').forEach(rect => {
        rect.classList.add('sylTextRect');
        rect.classList.remove('sylTextRect-display');
      });

      document.querySelectorAll('.syl.selected .sylTextRect').forEach((rect: HTMLElement) => {
        rect.style.fill = 'none';
      });

      try {
        document.getElementById('selByBBox').style.display = 'none';
      } 
      catch (e) {}

      // if "Display/Hide All" button is in "Hide All" mode, set it to "Display All" mode
      if (displayAllBtn.classList.contains('selected')) {
        displayAllBtn.classList.remove('selected');
        displayAllBtn.innerHTML = 'Display All';
      }
    }
    updateHighlight();
  }

  /**
  * Update the visibility of the textview box
  * and add the event listeners to make sure the syl highlights when moused over
  */
  updateTextViewVisibility (): void {

    const displayAllBtn = document.getElementById('display-all-btn');
    const displayInfo = document.getElementById('displayInfo') as HTMLInputElement;
    const displayBBoxes = document.getElementById('displayBBox') as HTMLInputElement;
    const displayText = document.getElementById('displayText') as HTMLInputElement;

    if ((document.getElementById('displayText') as HTMLInputElement).checked) {
      const sylText = document.getElementById('syl_text');
      sylText.style.display = '';
      sylText.innerHTML = 
        `<div class="info-bubble-container">
          <div class="info-bubble-header">Syllables on this page</div>
          <div class="info-bubble-body">${this.getSylText()}</div>
        </div>`;
      const spans = sylText.querySelectorAll('span');
      spans.forEach(span => {
        const syllable = document.getElementById(span.classList[0]);
        const syl = syllable.querySelector('.syl');
        const text = syl.querySelector('text');
        const rect = syl.querySelector('rect');
        if (text.classList.length === 0) {
          text.classList.add('text');
        }

        span.addEventListener('mouseover', () => {
          if (syllable.classList.contains('syllable-highlighted'))
            return;

          syllable.classList.add('selected');
          syllable.querySelectorAll('.neume').forEach(neume => {
            neume.classList.add('selected');
          });
          if (rect !== null) {
            rect.style.fill = '#d00';
          }
          // syl.attr('fill', '#ffc7c7');
          // this.highlightBoundingBox(span);
        });

        span.addEventListener('mouseleave', () => {
          if (syllable.classList.contains('syllable-highlighted'))
            return;

          syllable.classList.remove('selected');
          syllable.querySelectorAll('.neume').forEach(neume => {
            neume.classList.remove('selected');
          });
          if (rect !== null) {
            if (syllable.style.fill !== 'rgb(0, 0, 0)') { // syllable.getAttributeNS('http://www.w3.org/2000/SVG', 'fill');
              rect.style.fill = syllable.getAttribute('fill');
            } else {
              rect.style.fill = 'blue';
            }
          }
          // syl.attr('fill', null);
          // this.removeBoundingBox(span);
        });
      });
      if (this.neonView.getUserMode() !== 'viewer' && this.neonView.TextEdit !== undefined) {
        this.neonView.TextEdit.initTextEdit();
      }

      // scroll the syllable text bubble into view
      //sylText.scrollIntoView({ behavior: 'smooth' });

      // if this is the 3rd option to be checked (all three are selected),
      // set "Display/Hide All" button to "Hide All".
      if (displayInfo.checked && displayBBoxes.checked && displayText.checked) {
        displayAllBtn.classList.add('selected');
        displayAllBtn.innerHTML = 'Hide All';
      }
    } 
    else {
      document.getElementById('syl_text').style.display = 'none';
      // if "Display/Hide All" button is in "Hide All" mode, set it to "Display All" mode
      if (displayAllBtn.classList.contains('selected')) {
        displayAllBtn.classList.remove('selected');
        displayAllBtn.innerHTML = 'Display All';
      }
    }
  }

  /**
   * Get the syllable text of the loaded file
   */
  getSylText (): string {
    let lyrics = '';
    const uniToDash = /\ue551/g;
    const syllables = document.querySelectorAll('.active-page .syllable');
    syllables.forEach(syllable => {
      if (syllable.querySelector('.syl') !== null) {
        const syl = syllable.querySelector('.syl');
        lyrics += `<span class="${syllable.id} syl-text-side-panel">`;
        if (syl.textContent.trim() === '') {
          lyrics += '&#x25CA; ';
        } else {
          Array.from(syl.children[0].children[0].children).forEach(text => {
            lyrics += text.textContent !== '' ? text.textContent : '&#x25CA; ';
          });
        }
        lyrics += ' </span>';
      }
    });
    if (!this.notificationSent) {
      Notification.queueNotification('Blank syllables are represented by &#x25CA;!');
      this.notificationSent = true;
    }
    return lyrics.replace(uniToDash, '-');
  }
}

export { TextView as default };
