/** @module DisplayPanel/DisplayControls */

import * as Color from '../utils/Color';
import ZoomHandler from '../SingleView/Zoom';
import { GroupingType } from '../Types';
import { getSettings, setSettings } from '../utils/LocalSettings';

let lastGlyphOpacity: number, lastImageOpacity: number;

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
export function setOpacityFromSlider (meiClassName?: string): void {
  const opacityOutput = document.getElementById('opacityOutput') as HTMLOutputElement;
  const opacitySlider = document.getElementById('opacitySlider') as HTMLInputElement;

  opacitySlider.value = opacityOutput.value;
  setSettings({ glyphOpacity: Number(opacityOutput.value) });

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
function setOpacityControls (meiClassName: string): void {
  const opacitySlider = document.getElementById('opacitySlider') as HTMLInputElement;
  const opacityOutput = document.getElementById('opacityOutput') as HTMLOutputElement;

  const { glyphOpacity } = getSettings();
  lastGlyphOpacity = glyphOpacity;
  opacitySlider.value = String(glyphOpacity);
  opacityOutput.value = String(glyphOpacity);

  document.getElementById('reset-opacity').addEventListener('click', () => {
    // Definition scale is the root element of what is generated by verovio
    const lowerOpacity = lastGlyphOpacity < 95 ? lastGlyphOpacity / 100.0 : 0;
    const newOpacity = opacitySlider.value === '100' ? lowerOpacity : 1;
    (document.querySelectorAll('.' + meiClassName) as NodeListOf<HTMLElement>).forEach(g => {
      g.style.opacity = newOpacity.toString();
    });

    lastGlyphOpacity = Number(opacitySlider.value);
    opacitySlider.value = String(newOpacity * 100);
    opacityOutput.value = String(Math.round(newOpacity * 100));

    setSettings({ glyphOpacity: newOpacity * 100 });
  });

  function inputChangeOpacity (): void {
    opacityOutput.value = opacitySlider.value;
    lastGlyphOpacity = Number(opacitySlider.value);
    setOpacityFromSlider(meiClassName);
  }

  opacitySlider.addEventListener('input', inputChangeOpacity);
  opacitySlider.addEventListener('change', inputChangeOpacity);

  opacitySlider.disabled = false;
}

/**
 * Set background image opacity button and slider listeners.
 * @param background - The background image selector.
 */
function setBackgroundOpacityControls (background: string): void {
  const bgOpacitySlider = document.getElementById('bgOpacitySlider') as HTMLInputElement;
  const bgOpacityOutput = document.getElementById('bgOpacityOutput') as HTMLOutputElement;

  const { imageOpacity } = getSettings();
  lastImageOpacity = imageOpacity;
  bgOpacitySlider.value = String(imageOpacity);
  bgOpacityOutput.value = String(imageOpacity);

  document.getElementById('reset-bg-opacity').addEventListener('click', () => {
    const lowerOpacity = lastImageOpacity < 95 ? lastImageOpacity / 100.0 : 0;
    const newOpacity = bgOpacitySlider.value === '100' ? lowerOpacity : 1;
    (document.getElementsByClassName(background)[0] as HTMLElement)
      .style.opacity = newOpacity.toString();

    lastImageOpacity = Number(bgOpacitySlider.value);
    bgOpacitySlider.value = String(newOpacity * 100);
    bgOpacityOutput.value = String(Math.round(newOpacity * 100));

    setSettings({ imageOpacity: newOpacity * 100 });
  });

  function bgInputChangeHandler (): void {
    bgOpacityOutput.value = bgOpacitySlider.value;
    lastImageOpacity = Number(bgOpacitySlider.value);
    setBgOpacityFromSlider(background);
  }

  bgOpacitySlider.addEventListener('input', bgInputChangeHandler);
  bgOpacitySlider.addEventListener('change', bgInputChangeHandler);

  bgOpacitySlider.disabled = false;
}

export function setBgOpacityFromSlider (background?: string): void {
  const bgOpacityOutput: HTMLOutputElement = document.querySelector('#bgOpacityOutput');
  setSettings({ imageOpacity: Number(bgOpacityOutput.value) });

  const bg: HTMLElement = document.querySelector(`.${background}`);
  if (bg) bg.style.opacity = String(Number(bgOpacityOutput.value) / 100);
}

/**
 * Update highlight dropdown option + display
 * @param id - The DOM element's id as `highlight-${id}`
 * @param grouping - Grouping
 * @param display - Text displayed on dropdown select
 */
function updateHighlightOption (id: string, grouping: GroupingType, display: string): void {
  const option = document.getElementById(`highlight-${id}`);
  const dropdown = document.getElementById('highlight-dropdown');
  const highlightType = document.getElementById('highlight-type');

  // save highlight option to localStorage
  setSettings({ highlightMode: grouping });

  dropdown.classList.remove('is-active');
  document.querySelectorAll('.highlight-selected').forEach(elem => {
    elem.classList.remove('highlight-selected');
  });

  if (id === 'none') {
    highlightType.textContent = '\xA0- Off';
    Color.unsetGroupingHighlight();
    return;
  }
  
  option.classList.add('highlight-selected');
  highlightType.textContent = `\xA0- ${display}`;
  Color.setGroupingHighlight(grouping);
}

/**
 * Set click listener for each highlight dropdown option
 * @param id - The DOM element's id as `highlight-${id}`
 * @param grouping - Grouping
 * @param display - Text displayed on dropdown select
 */
export function setHighlightOption (id: string, grouping: GroupingType, display: string): void {
  const option = document.getElementById(`highlight-${id}`);
  option.addEventListener('click', () => {
    updateHighlightOption(id, grouping, display);
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

      setHighlightOption('staff', 'staff', 'Staff');
      setHighlightOption('syllable', 'syllable', 'Syllable');
      setHighlightOption('neume', 'neume', 'Neume');
      setHighlightOption('layerElement', 'layer', 'LayerElement');
      setHighlightOption('none', 'none', 'Off');
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
    switch (evt.key) {
      case 'q':
        updateHighlightOption('staff', 'staff', 'Staff');
        break;
      case 'w':
        updateHighlightOption('syllable', 'syllable', 'Syllable');
        break;
      case 'e':
        updateHighlightOption('neume', 'neume', 'Neume');
        break;
      case 'r':
        updateHighlightOption('layerElement', 'layer', 'LayerElement');
        break;
      case 't':
        updateHighlightOption('selection', 'selection', 'Selection');
        break;
      case 'y':
        updateHighlightOption('none', 'none', 'highlight-none');
        break;
    }
  });
}



// Why does this exist separately?
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
      Color.setGroupingHighlight('layer');
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
 * Load highlight settings from localStorage
 */
export function loadHighlightSettings (): void {
  const { highlightMode } = getSettings();

  // For some reason, layer is the only one with the weird ID naming,
  // and thus we need to check for it and fix it
  const id = highlightMode === 'layer' ? 'layerElement' : highlightMode;

  // Display string = capitalized version of highlight-${id}
  const display = id.charAt(0).toUpperCase() + id.slice(1);

  updateHighlightOption(id, highlightMode, display);
}

/**
 * Initialize listeners and controls for display panel.
 * @param {string} meiClassName - The class used to signifiy the MEI element(s).
 * @param {string} background - The class used to signify the background.
 */
export function initDisplayControls (meiClassName: string, background: string): void {
  setOpacityControls(meiClassName);
  setBackgroundOpacityControls(background);
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

