/** @module DisplayPanel/DisplayControls */

import * as Color from '../utils/Color';
import ZoomHandler from '../SingleView/Zoom';
import { GroupingType } from '../Types';
import { getSettings, setSettings } from '../utils/LocalSettings';
import * as d3 from 'd3';

let lastGlyphOpacity: number, lastImageOpacity: number, lastCircleSize: number;

/**
 * Set zoom control listener for button and slider
 * @param zoomHandler - A [[ZoomHandler]] is only necessary in Single Page mode as diva.js handles zooming otherwise.
 */
export function setZoomControls (zoomHandler?: ZoomHandler): void {
  if (zoomHandler === undefined) {
    return;
  }
  const zoomSlider = document.getElementById('zoomSlider') as HTMLInputElement;
  const zoomOutput = document.getElementById('zoomOutput') as HTMLOutputElement;

  const { zoom } = getSettings();
  zoomSlider.value = String(zoom);
  zoomOutput.value = String(zoom);
  zoomHandler.zoomTo(zoom / 100.0);
  document.getElementById('reset-zoom').addEventListener('click', () => {
    zoomOutput.value = '100';
    zoomSlider.value = '100';
    zoomHandler.resetZoomAndPan();
  });

  document.querySelector('#set-zoom-easy-edit').addEventListener('click', () => {
    zoomOutput.value = '180';
    zoomSlider.value = '180';
    zoomHandler.zoomTo(180/100);
  });

  function inputChangeHandler (): void {
    zoomOutput.value = zoomSlider.value;
    zoomHandler.zoomTo(Number(zoomOutput.value) / 100.0);
  }

  // zoomSlider.addEventListener('input', inputChangeHandler);
  zoomSlider.addEventListener('mouseup', inputChangeHandler);
  zoomSlider.disabled = false;

  document.body.addEventListener('keydown', (evt) => {
    const currentZoom = parseInt(zoomOutput.value);
    if (evt.key === 'ArrowUp' || evt.key === 'ArrowDown' || 
    evt.key === 'ArrowRight' || evt.key === 'ArrowLeft') {
      evt.preventDefault();
    } else if (evt.key === '+') { // increase zoom by 20
      const newZoom = Math.min(currentZoom + 20, parseInt(zoomSlider.getAttribute('max')));
      zoomHandler.zoomTo(newZoom / 100.0);
      zoomOutput.value = String(newZoom);
      zoomSlider.value = String(newZoom);
    } else if (evt.key === '_') { // decrease zoom by 20
      const newZoom = Math.max(currentZoom - 20, parseInt(zoomSlider.getAttribute('min')));
      zoomHandler.zoomTo(newZoom / 100.0);
      zoomOutput.value = String(newZoom);
      zoomSlider.value = String(newZoom);
    } else if (evt.key === '0') {
      zoomOutput.value = '100';
      zoomSlider.value = '100';
      zoomHandler.resetZoomAndPan();
    }
  });
}

/**
 * Update MEI opacity to value from the slider.
 * @param meiClassName - Class that contains the rendered MEI.
 */
export function setGlyphOpacityFromSlider (meiClassName?: string): void {
  const opacityOutput = document.getElementById('opacityOutput') as HTMLOutputElement;
  const opacitySlider = document.getElementById('opacitySlider') as HTMLInputElement;

  opacitySlider.value = opacityOutput.value;
  // this is where we load glyph opacity from localStorage on page-load
  setSettings({ glyphOpacity: Number(opacityOutput.value) });

  // dispay correct slider toggle display icon
  const hideGlyphImg = document.querySelector('#toggle-glyph-opacity > img');
  if (Number(opacityOutput.value) === 0) {
    hideGlyphImg.setAttribute('src', `${__ASSET_PREFIX__}assets/img/show-icon.svg`);
    hideGlyphImg.parentElement.setAttribute('title', 'Show glyph');
  }
  else {
    hideGlyphImg.setAttribute('src', `${__ASSET_PREFIX__}assets/img/hide-icon.svg`);
    hideGlyphImg.parentElement.setAttribute('title', 'Hide glyph');
  }

  try {
    ((document.querySelectorAll('.' + meiClassName)) as NodeListOf<HTMLElement>).forEach(g => {
      g.style.opacity = (Number(opacityOutput.value) / 100.0).toString();
    });
  } catch (e) {
    console.warn('Unable to properly set opacity to pages');
  }
}

/**
 * Set rendered MEI opacity button and slider listeners.
 * @param meiClassName - Class that contains the rendered MEI.
 */
function setGlyphOpacityControls (meiClassName: string): void {
  const opacitySlider = document.getElementById('opacitySlider') as HTMLInputElement;
  const opacityOutput = document.getElementById('opacityOutput') as HTMLOutputElement;

  const { glyphOpacity } = getSettings();
  lastGlyphOpacity = glyphOpacity;
  opacitySlider.value = String(glyphOpacity);
  opacityOutput.value = String(glyphOpacity);

  function inputChangeOpacity (): void {
    opacityOutput.value = opacitySlider.value;
    lastGlyphOpacity = Number(opacitySlider.value);
    setGlyphOpacityFromSlider(meiClassName);
  }

  const toggleOpacityBtn = document.getElementById('toggle-glyph-opacity');

  if (glyphOpacity == 100) {
    toggleOpacityBtn.classList.add('hide-icon');
  }

  toggleOpacityBtn?.addEventListener('click', () => {

    let newOpacity;
    if (toggleOpacityBtn.classList.contains('hide-icon')) {
      toggleOpacityBtn.classList.remove('hide-icon');
      newOpacity = 0;
    }
    else {
      toggleOpacityBtn.classList.add('hide-icon');
      newOpacity = 1;
    }

    // Definition scale is the root element of what is generated by verovio
    
    (document.querySelectorAll('.' + meiClassName) as NodeListOf<HTMLElement>).forEach(g => {
      g.style.opacity = newOpacity.toString();
    });

    lastGlyphOpacity = Number(opacitySlider.value);
    opacitySlider.value = String(newOpacity * 100);
    opacityOutput.value = String(Math.round(newOpacity * 100));

    setSettings({ glyphOpacity: newOpacity * 100 });

    inputChangeOpacity();
  });

  opacitySlider.addEventListener('input', inputChangeOpacity);
  opacitySlider.addEventListener('change', inputChangeOpacity);

  opacitySlider.disabled = false;
}


/**
 * Set background image opacity button and slider listeners.
 * @param background - The background image selector.
 */
function setBgOpacityControls (background: string): void {
  const bgOpacitySlider = document.getElementById('bgOpacitySlider') as HTMLInputElement;
  const bgOpacityOutput = document.getElementById('bgOpacityOutput') as HTMLOutputElement;

  const { imageOpacity } = getSettings();
  lastImageOpacity = imageOpacity;
  bgOpacitySlider.value = String(imageOpacity);
  bgOpacityOutput.value = String(imageOpacity);

  function bgInputChangeHandler (): void {
    bgOpacityOutput.value = bgOpacitySlider.value;
    lastImageOpacity = Number(bgOpacitySlider.value);
    setBgOpacityFromSlider(background);
  }


  const toggleBgOpacityBtn = document.getElementById('toggle-bg-opacity');

  if (imageOpacity == 100) {
    toggleBgOpacityBtn.classList.add('hide-icon');
  }

  toggleBgOpacityBtn.addEventListener('click', () => {

    let newOpacity;

    if (toggleBgOpacityBtn.classList.contains('hide-icon')) {
      toggleBgOpacityBtn.classList.remove('hide-icon');
      newOpacity = 0;
    }
    else {
      toggleBgOpacityBtn.classList.add('hide-icon');
      newOpacity = 1;
    }
    (document.getElementsByClassName(background)[0] as HTMLElement)
      .style.opacity = newOpacity.toString();

    lastImageOpacity = Number(bgOpacitySlider.value);
    bgOpacitySlider.value = String(newOpacity * 100);
    bgOpacityOutput.value = String(Math.round(newOpacity * 100));

    setSettings({ imageOpacity: newOpacity * 100 });
    bgInputChangeHandler();
  });

  bgOpacitySlider.addEventListener('input', bgInputChangeHandler);
  bgOpacitySlider.addEventListener('change', bgInputChangeHandler);

  bgOpacitySlider.disabled = false;
}


export function setBgOpacityFromSlider (background?: string): void {
  const bgOpacityOutput: HTMLOutputElement = document.querySelector('#bgOpacityOutput');
  
  setSettings({ imageOpacity: Number(bgOpacityOutput.value) });

  // dispay correct slider tiggle display icon
  const hideBgImg = document.querySelector('#toggle-bg-opacity > img');
  if (Number(bgOpacityOutput.value) === 0) {
    hideBgImg.setAttribute('src', `${__ASSET_PREFIX__}assets/img/show-icon.svg`);
    hideBgImg.parentElement.setAttribute('title', 'Show background image');
  }
  else {
    hideBgImg.setAttribute('src', `${__ASSET_PREFIX__}assets/img/hide-icon.svg`);
    hideBgImg.parentElement.setAttribute('title', 'Hide background image');
  }

  const bg: HTMLElement = document.querySelector(`.${background}`);
  if (bg) bg.style.opacity = String(Number(bgOpacityOutput.value) / 100);
}

/**
 * Set bbox adjustment circle size button and slider listeners.
 */
export function setCircleSizeControls (): void {
  const circleSlider = document.getElementById('circleSlider') as HTMLInputElement;
  const circleOutput = document.getElementById('circleOutput') as HTMLOutputElement;

  const { circleSize } = getSettings();
  lastCircleSize = circleSize;
  circleSlider.value = String(circleSize);
  circleOutput.value = String(circleSize);

  function circleSizeInputChangeHandler (): void {
    circleOutput.value = circleSlider.value;
    lastCircleSize = Number(circleSlider.value);
    setSettings({ circleSize: Number(lastCircleSize) });
    const resizePoints = d3.selectAll('.resizePoint');
    if (!resizePoints.empty()) {
      resizePoints.attr('r', lastCircleSize);
    }
  }

  const resetBtn = document.getElementById('reset-circle-size');
  resetBtn.addEventListener('click', () => {
    const defaultSize = 25; 
    // if has resizePoints displayed
    const resizePoints = d3.selectAll('.resizePoint');
    if (!resizePoints.empty()) {
      resizePoints.attr('r', defaultSize);
    }

    lastCircleSize = Number(defaultSize);
    circleSlider.value = String(defaultSize);
    circleOutput.value = String(defaultSize);

    setSettings({ circleSize: Number(defaultSize) });
    circleSizeInputChangeHandler();
  });

  circleSlider.addEventListener('input', circleSizeInputChangeHandler);
  circleSlider.addEventListener('change', circleSizeInputChangeHandler);

  circleSlider.disabled = false;
}

/**
 * Update highlight dropdown option + display
 * @param group - GroupingType / The DOM element's id as `highlight-${id}`
 */
function updateHighlightOption (group: GroupingType): void {
  const option = document.getElementById(`highlight-${group}`);
  const dropdown = document.getElementById('highlight-dropdown');
  const highlightType = document.getElementById('highlight-type');

  // save highlight option to localStorage
  setSettings({ highlightMode: group });

  dropdown.classList.remove('is-active');
  document.querySelectorAll('.highlight-selected').forEach(elem => {
    elem.classList.remove('highlight-selected');
  });

  if (group === 'none') {
    highlightType.textContent = '\xA0- Off';
    Color.unsetGroupingHighlight();
    return;
  }
  
  option.classList.add('highlight-selected');

  // Text content is the grouping type capitalized
  highlightType.textContent = `\xA0- ${group[0].toUpperCase() + group.slice(1)}`;
  Color.setGroupingHighlight(group);
}

/**
 * @returns The highlight mode chosen by the user.
 */
export function getHighlightType (): GroupingType {
  const highlightType = document.getElementById('highlight-type');
  return highlightType.textContent.slice(3).toLowerCase() as GroupingType;
}

/**
 * Set click listener for each highlight dropdown option
 * @param group - GroupingType / The DOM element's id as `highlight-${id}`
 */
export function setHighlightOption (group: GroupingType): void {
  const option = document.getElementById(`highlight-${group}`);
  option.addEventListener('click', () => {
    updateHighlightOption(group);
  });
}

/**
 * Clickaway listener for the highlight dropdown.
 */
function highlightClickaway (): void {
  document.body.removeEventListener('click', highlightClickaway);
  document.getElementById('highlight-dropdown').classList.remove('is-active');
}

/**
 * Set listener on staff highlighting checkbox.
 */
export function setHighlightControls (): void {
  const dropdown = document.getElementById('highlight-dropdown');

  document.getElementById('highlight-button').addEventListener('click', (evt) => {
    evt.stopPropagation();
    dropdown.classList.toggle('is-active');
    if (dropdown.classList.contains('is-active')) {
      document.body.addEventListener('click', highlightClickaway);

      setHighlightOption('column');
      setHighlightOption('staff');
      setHighlightOption('syllable');
      setHighlightOption('neume');
      setHighlightOption('layerElement');
      setHighlightOption('none');
    } else {
      document.body.removeEventListener('click', highlightClickaway);
    }
  });
}

/**
  * Set listener on key shortcuts for switching between highlights
  * 
  * The current plan is to use the keys q, w, e, r, t, and y
  */
function setHighlightKeyControls (): void {
  document.body.addEventListener('keydown', (evt) => {
    // Prevent cmd/ctrl+r from changing highlight option
    if (evt.metaKey) return;

    switch (evt.key) {
      case 'q':
        updateHighlightOption('staff');
        break;
      case 'w':
        updateHighlightOption('syllable');
        break;
      case 'e':
        updateHighlightOption('neume');
        break;
      case 'r':
        updateHighlightOption('layerElement');
        break;
      case 't':
        updateHighlightOption('selection');
        break;
      case 'y':
        updateHighlightOption('none');
        break;
    }
  });
}

export function setHighlightSelectionControls (): void {
  const highlightSelection = document.getElementById('highlight-selection');
  highlightSelection.addEventListener('click', () => {
    document.getElementById('highlight-dropdown').classList.remove('is-active');
    document.querySelectorAll('.highlight-selected').forEach(elem => {
      elem.classList.remove('highlight-selected');
    });
    highlightSelection.classList.add('highlight-selected');
    document.getElementById('highlight-type').textContent = ' - Selection';
    Color.setGroupingHighlight('selection');
  });
}

/**
 * Reset the highlight for different types based on the 'highlight-selected' class in the DOM.
 */
export function updateHighlight (): void {
  let highlightId: string;
  try {
    highlightId = document.querySelector('.highlight-selected').id;
  } catch (e) {
    highlightId = '';
  }
  switch (highlightId) {
    case 'highlight-column':
      Color.setGroupingHighlight('column');
      break;
    case 'highlight-staff':
      Color.setGroupingHighlight('staff');
      break;
    case 'highlight-syllable':
      Color.setGroupingHighlight('syllable');
      break;
    case 'highlight-neume':
      Color.setGroupingHighlight('neume');
      break;
    case 'highlight-layerElement':
      Color.setGroupingHighlight('layerElement');
      break;
    case 'highlight-selection':
      Color.setGroupingHighlight('selection');
      break;
    default:
      Color.unsetGroupingHighlight();
  }
}

/**
 * Set listener on burger menu for smaller screens.
 */
function setBurgerControls (): void {
  document.getElementById('burgerMenu').addEventListener('click', () => {
    document.getElementById('burgerMenu').classList.toggle('is-active');
    document.getElementById('navMenu').classList.toggle('is-active');
  });
}

/** 
 * Set listener for "Display All" button in Display panel.
*/
function setDisplayAllListener(): void {
  const selectAllBtn = document.querySelector('#display-all-btn');
  selectAllBtn.addEventListener('click', () => {
    // at the moment, classname 'selected' is only used for tracking purposes
    if (selectAllBtn.classList.contains('selected')) {
      selectAllBtn.classList.remove('selected');
      selectAllBtn.innerHTML = 'Display All';
      const options =  document.querySelectorAll('.checkbox-container > .checkbox');

      Array.from(options).forEach((option: HTMLInputElement) => {
        if (option.checked) option.click();
      });
    }
    else {
      selectAllBtn.classList.add('selected');
      selectAllBtn.innerHTML = 'Hide All';
      const options =  document.querySelectorAll('.checkbox-container > .checkbox');
      
      Array.from(options).forEach((option: HTMLInputElement) => {
        if (!option.checked) option.click();
      });
    }
  });
}

/** 
 * Update `Display All` button status
*/
export function updateDisplayAllBtn(): void {
  const displayAllBtn = document.getElementById('display-all-btn');
  const displayInfo = document.getElementById('displayInfo') as HTMLInputElement;
  const displayBBoxes = document.getElementById('displayBBox') as HTMLInputElement;
  const displayText = document.getElementById('displayText') as HTMLInputElement;
  const displayErrLog = document.getElementById('display-errors') as HTMLInputElement;

  // if all options are selected,
  // set "Display/Hide All" button to "Hide All".
  if (displayInfo?.checked && displayBBoxes?.checked && 
    displayText?.checked && displayErrLog?.checked) {
    displayAllBtn.classList.add('selected');
    displayAllBtn.innerHTML = 'Hide All';
  } else {
    // if "Display/Hide All" button is in "Hide All" mode, set it to "Display All" mode
    if (displayAllBtn.classList.contains('selected')) {
      displayAllBtn.classList.remove('selected');
      displayAllBtn.innerHTML = 'Display All';
    }
  }
}

/**
 * Load highlight settings from localStorage
 */
export function loadHighlightSettings (): void {
  const { highlightMode } = getSettings();
  updateHighlightOption(highlightMode);
}

/**
 * Initialize listeners and controls for display panel.
 * @param {string} meiClassName - The class used to signifiy the MEI element(s).
 * @param {string} background - The class used to signify the background.
 */
export function initDisplayControls (meiClassName: string, background: string): void {
  setGlyphOpacityControls(meiClassName);
  setBgOpacityControls(background);
  setHighlightControls();
  setBurgerControls();
  setHighlightKeyControls();
  setDisplayAllListener();
  loadHighlightSettings();

  const displayContents = document.getElementById('displayContents');
  const toggleDisplay = document.getElementById('toggleDisplay');
  const displayHeader = document.getElementById('displayHeader');

  displayHeader.addEventListener('click', (e) => {
    e.stopPropagation();
    // if display panel is closed, open it
    if (displayContents.classList.contains('closed')) {
      displayContents.classList.remove('closed');
      displayContents.style.padding = '0.5em 0.75em';
      setTimeout(() => {
        displayContents.style.overflow = 'visible';
      }, 200);
      toggleDisplay.setAttribute('xlink:href', `${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-down`);
    } 
    // if display panel is open, close it
    else {
      displayContents.classList.add('closed');
      displayContents.style.overflow = 'hidden';
      setTimeout(() => {
        displayContents.style.padding = '0px';
      }, 200);
      toggleDisplay.setAttribute('xlink:href', `${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-side`);
    }
  });
}

