/** @module utils/Color */

/**
 * Set a highlight by a different grouping. Either staff, syllable, or neume.
 * @param {string} grouping - The grouping name.
 */
export function setGroupingHighlight (grouping: string) {
  unsetGroupingHighlight();
  if (grouping === 'staff') {
    setStaffHighlight();
    return;
  } else if (grouping === 'selection') {
    let temp = document.querySelector('.sel-by.is-active').id;
    switch (temp) {
      case 'selBySyl':
      case 'selByBBox':
        grouping = 'syllable';
        break;
      case 'selByStaff':
        grouping = 'staff';
        break;
      default:
        grouping = 'neume';
        break;
    }
    setGroupingHighlight(grouping);
    return;
  }

  let groups = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName(grouping);
  for (var i = 0; i < groups.length; i++) {
    let groupColor = ColorPalette[i % ColorPalette.length];
    if ((groups[i].closest('.selected') === null) && !groups[i].classList.contains('selected')) {
      groups[i].setAttribute('fill', groupColor);
      let rects = <NodeListOf<HTMLElement>>groups[i].querySelectorAll('.sylTextRect-display');
      rects.forEach(function (rect) {
        rect.style.fill = groupColor;
      });
      groups[i].classList.add('highlighted');
      groups[i].querySelectorAll('.sylTextRect-display').forEach(rect => {
        rect.classList.add('highlighted');
      });
    } else {
      if (!groups[i].classList.contains('selected')) {
        groups[i].setAttribute('fill', null);
      } else {
        groups[i].setAttribute('fill', '#d00');
      }
      groups[i].classList.remove('highlighted');
    }
  }
}

/**
 * Unset highlight for all grouping types
 */
export function unsetGroupingHighlight () {
  unsetStaffHighlight();
  let highlighted = Array.from(document.getElementsByClassName('highlighted'))
    .filter((elem: HTMLElement) => !elem.parentElement.classList.contains('selected'));
  highlighted.forEach((elem: HTMLElement) => {
    elem.setAttribute('fill', null);
    let rects = elem.querySelectorAll('.sylTextRect-display');
    if (!rects.length) {
      if (elem.closest('.syllable') !== null) {
        rects = elem.closest('.syllable').querySelectorAll('sylTextRect-display');
      }
    }
    rects.forEach(function (rect: HTMLElement) {
      if (rect.closest('.syllable').classList.contains('selected')) {
        rect.style.fill = 'red';
      } else {
        rect.style.fill = 'blue';
      }
      rect.classList.remove('highlighted');
    });
    elem.classList.remove('highlighted');
    elem.querySelectorAll('sylTextRect-display').forEach(rect => {
      rect.classList.remove('highlighted');
    });
  });
}

/**
 * Highlight each staff a different color.
 */
export function setStaffHighlight () {
  let staves = <SVGGElement[]>Array.from(document.getElementsByClassName('staff'));
  for (var i = 0; i < staves.length; i++) {
    let staffColor = ColorPalette[i % ColorPalette.length];
    highlight(staves[i], staffColor);
  }
}

/**
 * Remove the highlight from each staff.
 */
export function unsetStaffHighlight () {
  unhighlight();
}

/**
 * Highlight a staff a certain color.
 * @param {SVGGElement} staff - The staff's SVG element.
 * @param {string} color - The color to highlight the staff.
 */
export function highlight (staff: SVGGElement, color: string) {
  let children = Array.from(staff.children);
  children.forEach(child => {
    if (child.tagName === 'path') {
      child.setAttribute('stroke', color);
    } else if (child.classList.contains('resizePoint') || child.id === 'resizeRect' || child.classList.contains('skewPoint')) {
      return;
    } else {
      child.setAttribute('fill', color);
      let rects = child.querySelectorAll('.sylTextRect-display');
      if (!rects.length) {
        try {
          rects = child.closest('.syllable').querySelectorAll('.sylTextRect-display');
        } catch (e) {
          rects = <NodeListOf<Element>><unknown>[];
        }
      }
      rects.forEach(function (rect: HTMLElement) {
        let syllable = rect.closest('.syllable');
        if (!syllable.classList.contains('selected')) {
          rect.style.fill = color;
          rect.classList.add('highlighted');
        }
      });
    }
    child.classList.add('highlighted');
  });
}

/**
 * Remove the highlight from a staff.
 * @param {(SVGGElement)} staff - The staff's SVG element
 */
export function unhighlight (staff?: SVGGElement) {
  let children: NodeListOf<Element>;
  if (staff) {
    children = staff.querySelectorAll(':not(.selected) .highlighted');
  } else {
    children = document.querySelectorAll(':not(.selected) .highlighted');
  }
  children.forEach(elem => {
    if (elem.tagName === 'path') {
      elem.setAttribute('stroke', '#000000');
    } else {
      elem.removeAttribute('fill');
      let rects = elem.querySelectorAll('.sylTextRect-display');
      if (!rects.length) {
        try {
          rects = elem.closest('.syllable').querySelectorAll('.sylTextRect-display');
        } catch (e) {
          rects = <NodeListOf<Element>><unknown>[];
        }
      }
      rects.forEach(function (rect: HTMLElement) {
        if (rect.closest('.syllable').classList.contains('selected')) {
          rect.style.fill = 'red';
        } else {
          rect.style.fill = 'blue';
        }
        rect.classList.remove('highlighted');
      });
    }
    elem.classList.remove('highlighted');
  });
}

/**
 * Color palette from Figure 2 (Colors optimized for color-blind
 * individuals) from
 * ["Points of view: Color blindness" by Bang Wong published in Nature Methods volume 8 on 27 May 2011]{@link https://www.nature.com/articles/nmeth.1618?WT.ec_id=NMETH-201106}
 * @type {string[]}
 */
const ColorPalette: string[] = [
//    "rgb(0,0,0)",
  'rgb(230, 159, 0)',
  'rgb(86, 180, 233)',
  'rgb(0, 158, 115)',
  'rgb(240, 228, 66)',
  'rgb(0, 114, 178)',
  'rgb(213, 94, 0)',
  'rgb(204, 121, 167)'
];
