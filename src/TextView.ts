import * as Notification from './utils/Notification';
import NeonView from './NeonView';
import { unselect } from './utils/SelectTools';
import { updateHighlight } from './DisplayPanel/DisplayControls';
import { TextViewInterface } from './Interfaces';

export function updateDisplayAll (): void {
  const displayAll = document.getElementById('display-all-btn');
  const displayInfo = document.getElementById('displayInfo') as HTMLInputElement;
  const displayBBoxes = document.getElementById('displayBBox') as HTMLInputElement;
  const displayText = document.getElementById('displayText') as HTMLInputElement;

  // if this is the 3rd option to be checked (all three are selected),
  // set "Display/Hide All" button to "Hide All".
  if (displayInfo.checked && displayBBoxes.checked && displayText.checked) {
    displayAll.classList.add('selected');
    displayAll.innerHTML = 'Hide All';

    return;
  }

  // if "Display/Hide All" button is in "Hide All" mode, set it to "Display All" mode
  if (displayAll.classList.contains('selected')) {
    displayAll.classList.remove('selected');
    displayAll.innerHTML = 'Display All';
  }
}

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

      updateDisplayAll();
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

      updateDisplayAll();
    }
    updateHighlight();
  }

  /**
  * Update the visibility of the textview box
  * and add the event listeners to make sure the syl highlights when moused over
  */
  updateTextViewVisibility (): void {
    if (document.querySelector<HTMLInputElement>('#displayText').checked) {
      // Create text spans with event listeners
      const spans = this.getSylSpans();
      spans.forEach(span => {
        const syllable = document.getElementById(span.classList[0]);

        const text = syllable.querySelector('.syl > text');
        if (text.classList.length === 0)
          text.classList.add('text');

        span.addEventListener('mouseover', this.mouseOverSpan(syllable));
        span.addEventListener('mouseleave', this.mouseLeaveSpan(syllable));
      });

      // Create text view with spans
      const sylText = document.getElementById('syl_text');
      sylText.style.display = '';
      sylText.innerHTML = 
        `<div class="info-bubble-container">
          <div class="info-bubble-header">Syllables on this page</div>
          <div class="info-bubble-body"></div>
        </div>`;
      sylText.querySelector('.info-bubble-body').append(...spans);

      // Set click listeners on syl texts
      if (this.neonView.getUserMode() !== 'viewer' && this.neonView.TextEdit !== undefined) {
        this.neonView.TextEdit.initTextEdit();
      }

      // If any syllables are highlighted at the moment of enabling syl text display,
      // highlight their text spans in syl_text
      const selSyllables = Array.from(document.querySelectorAll('.syllable.selected'));
      const sylTextSpans = selSyllables
        .filter(syllable => syllable.querySelector('.syl') !== null)
        .map(syllable => document.querySelector<HTMLSpanElement>(`.${syllable.id}`));
      // sylTextSpans.forEach(span => highlightSylText(span));

      this.sendBlankSyllableAlert();

      updateDisplayAll();

      // scroll the syllable text bubble into view
      // sylText.scrollIntoView({ behavior: 'smooth' });
    }
    else {
      document.getElementById('syl_text').style.display = 'none';
      updateDisplayAll();
    }
  }

  /**
   * Get syl text
   */
  getSylText (syl: Element): string {
    // If the syl text is empty, replace it with a diamond
    if (syl.textContent.trim() === '')
      return '&#x25CA; ';

    // Else, combine all the text of the syl's text children
    const textChildren = syl.firstElementChild.firstElementChild.children;
    const combinedText = Array.from(textChildren).map(
      text => text.textContent !== '' ? text.textContent : '&#x25CA; '
    );

    return combinedText.join('').replace(/\ue551/g, '-');
  }

  /**
   * Create the spans with syl text for "Syllables on this page"
   */
  getSylSpans (): HTMLSpanElement[] {
    const syllables = Array.from<SVGGElement>(document.querySelectorAll('.active-page .syllable'));
    const lyrics = syllables
      .filter((syllable) => syllable.querySelector('.syl') !== null)
      .map((syllable) => {
        const syl = syllable.querySelector('.syl');

        const span = document.createElement('span');
        span.classList.add(`${syllable.id}`, 'syl-text-side-panel');
        span.innerHTML = this.getSylText(syl) + ' ';

        return span;
      });

    return lyrics;
  }

  /**
   * Alert the user of what a blank syllable is represented by
   */
  sendBlankSyllableAlert (): void {
    if (!this.notificationSent) {
      Notification.queueNotification('Blank syllables are represented by &#x25CA;!');
      this.notificationSent = true;
    }
  }

  mouseOverSpan (syllable: HTMLElement) {
    return (): void => {
      if (syllable.classList.contains('syllable-highlighted'))
        return;

      syllable.classList.add('selected');
      syllable.querySelectorAll('.neume').forEach(neume => neume.classList.add('selected'));

      const rect = syllable.querySelector<SVGRectElement>('.syl > rect');
      if (rect !== null)
        rect.style.fill = '#d00';
    };
  }

  mouseLeaveSpan (syllable: HTMLElement) {
    return (): void => {
      if (syllable.classList.contains('syllable-highlighted'))
        return;

      syllable.classList.remove('selected');
      syllable.querySelectorAll('.neume').forEach(neume => neume.classList.remove('selected'));

      const rect = syllable.querySelector<SVGRectElement>('.syl > rect');
      if (rect !== null) {
        // If there is no highlight option enabled, all syllables have a fill color of black
        const isHighlightOff = syllable.style.fill === 'rgb(0, 0, 0)';
        rect.style.fill = (isHighlightOff) ? 'blue' : syllable.getAttribute('fill');
      }
    };
  }
}

export { TextView as default };
