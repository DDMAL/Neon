/** @module utils/SelectTools */

import * as Color from './Color.js';
import { updateHighlight } from '../DisplayPanel/DisplayControls.js';
import * as Grouping from '../SquareEdit/Grouping.js';
import { Resize } from './Resize.js';
import * as SelectOptions from '../SquareEdit/SelectOptions.js';

const d3 = require('d3');

/**
 * Get the selection mode chosen by the user.
 * @returns {string|null}
 */
export function getSelectionType () {
  let element = document.getElementsByClassName('sel-by is-active');
  if (element.length !== 0) {
    return element[0].id;
  } else {
    return null;
  }
}

/**
 * Unselect all selected elements and run undo any extra
 * actions.
 */
export function unselect () {
  document.querySelectorAll('.selected').forEach(selected => {
    selected.classList.remove('selected');
    if (selected.classList.contains('staff')) {
      selected.removeAttribute('style');
      Color.unhighlight(selected);
    } else {
      selected.removeAttribute('style');
      selected.style.fill = '';
    }
  });
  Array.from(document.getElementsByClassName('text-select')).forEach(el => {
    el.setAttribute('color', '');
    el.setAttribute('font-weight', '');
    el.classList.remove('text-select');
  });
  Array.from(document.getElementsByClassName('sylTextRect-display')).forEach(sylRect => {
    sylRect.style.fill = 'blue';
  });

  Array.from(document.getElementsByClassName('syllable-highlighted')).forEach(syllable => {
    syllable.style.fill = '';
    syllable.classList.add('syllable');
    syllable.classList.remove('syllable-highlighted');
  });

  d3.selectAll('#resizeRect').remove();
  d3.selectAll('.resizePoint').remove();
  d3.selectAll('.skewPoint').remove();

  if (!document.getElementById('selByStaff').classList.contains('is-active')) {
    Grouping.endGroupingSelection();
  } else {
    SelectOptions.endOptionsSelection();
  }
  updateHighlight();
}

/**
 * Generic select function.
 * @param {SVGGraphicsElement} el
 * @param {DragHandler} [dragHandler]
 */
export function select (el, dragHandler) {
  if (el.classList.contains('staff')) {
    return selectStaff(el, dragHandler);
  }
  if (!el.classList.contains('selected') && !el.classList.contains('sylTextRect') &&
      !el.classList.contains('sylTextRect-display')) {
    el.classList.add('selected');
    el.style.fill = '#d00';
    if (el.querySelectorAll('.sylTextRect-display').length) {
      el.querySelectorAll('.sylTextRect-display').forEach(elem => {
        elem.style.fill = 'red';
      });
    }
    var sylId;
    if (el.classList.contains('syllable')) {
      sylId = el.id;
    } else if (el.closest('.syllable') !== null) {
      sylId = el.closest('.syllable').id;
    }
    if (sylId !== undefined) {
      let spans = document.querySelectorAll('span.' + sylId);
      spans.forEach(span => {
        span.style.color = '#d00';
        span.style.fontWeight = 'bold';
        span.classList.add('text-select');
      });
    }
  }
  updateHighlight();
}

/**
 * Select an nc.
 * @param {SVGGraphicsElement} el - The nc element to select.
 * @param {DragHandler} dragHandler - An instantiated DragHandler.
 * @param {NeonView} neonView - The NeonView parent
 */
export async function selectNcs (el, neonView, dragHandler) {
  if (!el.parentNode.classList.contains('selected')) {
    var parent = el.parentNode;
    unselect();
    select(parent);
    if (await isLigature(parent, neonView)) {
      var prevNc = parent.previousSibling;
      if (await isLigature(prevNc, neonView)) {
        select(prevNc);
      } else {
        var nextNc = parent.nextSibling;
        if (await isLigature(nextNc, neonView)) {
          select(nextNc);
        } else {
          console.warn('Error: Neither prev or next nc are ligatures');
        }
      }
      Grouping.triggerGrouping('ligature');
    } else if (parent.classList.contains('nc')) {
      SelectOptions.triggerNcActions(parent);
    } else {
      console.warn('No action triggered!');
    }
    dragHandler.dragInit();
  }
}

/**
 * Check if neume component is part of a ligature
 * @param {SVGGraphicsElement} nc - The neume component to check.
 * @returns {boolean}
 */
export async function isLigature (nc, neonView) {
  var attributes = await neonView.getElementAttr(nc.id, neonView.view.getCurrentPageURI());
  return (attributes.ligated === 'true');
}

/**
 * Check if the elements have the same parent up two levels.
 * @param {Array<Element>} elements - The array of elements.
 * @returns {boolean} - If the elements share the same second level parent.
 */
export function sharedSecondLevelParent (elements) {
  let tempElements = Array.from(elements);
  let firstElement = tempElements.pop();
  let secondParent = firstElement.parentElement.parentElement;
  for (let element of tempElements) {
    let secPar = element.parentElement.parentElement;
    if (secPar.id !== secondParent.id) {
      return false;
    }
  }
  return true;
}

/**
 * Get the bounding box of a staff based on its staff lines.
 * @param {SVGGElement} staff
 * @returns {object}
 */
export function getStaffBBox (staff) {
  let ulx, uly, lrx, lry;
  staff.querySelectorAll('path').forEach(path => {
    let segments = path.pathSegList;
    if (uly === undefined || segments[0].y < uly) {
      uly = segments[0].y;
    }
    if (ulx === undefined || segments[0].x < ulx) {
      ulx = segments[0].x;
    }
    if (lry === undefined || segments[segments.length - 1].y > lry) {
      lry = segments[segments.length - 1].y;
    }
    if (lrx === undefined || segments[segments.length - 1].x > lrx) {
      lrx = segments[segments.length - 1].x;
    }
  });
  return { 'ulx': ulx, 'uly': uly, 'lrx': lrx, 'lry': lry };
}

/**
 * select a boundingbox element
 * @param {SVGGElement} el - the bbox (sylTextRect) element in the DOM
 * @param {DragHandler} dragHandler - the drag handler in use
 */
export function selectBBox (el, dragHandler, resizeHandler) {
  let bbox = el;
  let syl = bbox.closest('.syl');
  if (!syl.classList.contains('selected')) {
    syl.classList.add('selected');
    bbox.style.fill = '#d00';
    el.closest('.syllable').style.fill = 'red';
    el.closest('.syllable').classList.add('syllable-highlighted');
    if (resizeHandler !== undefined) {
      resizeHandler.drawInitialRect();
    }
    if (dragHandler !== undefined) {
      dragHandler.dragInit();
    }
    var sylId = el.closest('.syllable').id;
    if (sylId !== undefined) {
      let span = document.querySelector('span.' + sylId);
      if (span) {
        span.style.color = '#d00';
        span.style.fontWeight = 'bold';
        span.classList.add('text-select');
      }
    }
  }
}

/**
 * Select not neume elements.
 * @param {SVGGraphicsElement[]} notNeumes - An array of not neumes elements.
 */
export function selectNn (notNeumes) {
  if (notNeumes.length > 0) {
    notNeumes.forEach(nn => { select(nn); });
    return false;
  } else {
    return true;
  }
}

/**
 * Select a staff element.
 * @param {SVGGElement} staff - The staff element in the DOM.
 * @param {DragHandler} dragHandler - The drag handler in use.
 */
export function selectStaff (staff, dragHandler) {
  if (!staff.classList.contains('selected')) {
    staff.classList.add('selected');
    Color.highlight(staff, '#d00');
    dragHandler.dragInit();
  }
}

/**
 * Handle selecting an array of elements based on the selection type.
 * @param {SVGGraphicsElement[]} elements - The elements to select. Either <g> or <use>.
 * @param {NeonView} neonView
 * @param {InfoModule} info
 * @param {DragHandler} dragHandler
 */
export async function selectAll (elements, neonView, info, dragHandler) {
  let selectionType = getSelectionType();
  unselect();
  if (elements.length === 0) {
    return;
  }

  let selectionClass;
  let containsClefOrCustos = false;

  switch (selectionType) {
    case 'selBySyl':
      selectionClass = '.syllable';
      break;
    case 'selByNeume':
      selectionClass = '.neume';
      break;
    case 'selByNc':
      selectionClass = '.nc';
      break;
    case 'selByStaff':
      selectionClass = '.staff';
      break;
    case 'selByBBox':
      selectionClass = '.sylTextRect-display';
      break;
    default:
      console.error('Unknown selection type ' + selectionType);
      return;
  }

  // Get the groupings specified by selectionClass
  // that contain the provided elements to select.
  let groupsToSelect = new Set();
  for (let element of elements) {
    let grouping = element.closest(selectionClass);
    if (grouping === null) {
      // Check if we click-selected a clef or a custos
      grouping = element.closest('.clef, .custos');
      if (grouping === null) {
        console.warn('Element ' + element.id + ' is not part of specified group and is not a clef or custos.');
        continue;
      }
      containsClefOrCustos |= true;
    }
    groupsToSelect.add(grouping);

    // Check for precedes/follows
    let follows = grouping.getAttribute('mei:follows');
    if (follows) {
      groupsToSelect.add(document.getElementById(follows));
    }
    let precedes = grouping.getAttribute('mei:precedes');
    if (precedes) {
      groupsToSelect.add(document.getElementById(precedes));
    }
  }

  // Select the elements
  groupsToSelect.forEach(group => { select(group, dragHandler); });

  /* Determine the context menu to display (if any) */

  let groups = Array.from(groupsToSelect.values());

  // Handle occurance of clef or custos
  if (containsClefOrCustos) {
    // A context menu will only be displayed if there is a single clef
    if (groupsToSelect.size === 1 && groups[0].classList.contains('clef')) {
      SelectOptions.triggerClefActions(groups[0]);
    } else if (groupsToSelect.size === 1 && groups[0].classList.contains('custos')) {
      SelectOptions.triggerCustosActions(groups[0]);
    } else {
      SelectOptions.triggerDefaultActions();
    }
    return;
  }

  switch (selectionType) {
    case 'selByStaff':
      switch (groups.length) {
        case 1:
          SelectOptions.triggerSplitActions();
          let resize = new Resize(groups[0].id, neonView, dragHandler);
          resize.drawInitialRect();
          break;
        case 2:
          let bb1 = getStaffBBox(groups[0]);
          let bb2 = getStaffBBox(groups[1]);
          let avgStaffHeight = (bb1.lry - bb1.uly + bb2.lry - bb2.uly) / 2;
          if (Math.abs(bb1.uly - bb2.uly) < avgStaffHeight) {
            SelectOptions.triggerStaffActions();
          } else {
            SelectOptions.triggerDefaultActions();
          }
          break;
        default:
          SelectOptions.triggerDefaultActions();
      }
      break;

    case 'selBySyl':
      switch (groups.length) {
        case 1:
          // TODO change context if it is only a neume/nc.
          SelectOptions.triggerSylActions();
          break;
        case 2:
          // Check if this is a linked syllable split by a staff break
          if ((groups[0].getAttribute('mei:follows') === groups[1].id) || (groups[0].getAttribute('mei:precedes') === groups[1].id)) {
            Grouping.triggerGrouping('splitSyllable');
          } else if (sharedSecondLevelParent(groups)) {
            Grouping.triggerGrouping('syl');
          } else {
            // Check if this *could* be a selection with a single logical syllable split by a staff break.
            let staff0 = groups[0].closest('.staff');
            let staff1 = groups[1].closest('.staff');
            let staffChildren = Array.from(staff0.parentNode.children);
            // Check if these are adjacent staves (logically)
            if (Math.abs(staffChildren.indexOf(staff0) - staffChildren.indexOf(staff1)) === 1) {
              // Check if one syllable is the last in the first staff and the other is the first in the second.
              // Determine which staff is first.
              let firstStaff = (staffChildren.indexOf(staff0) < staffChildren.indexOf(staff1)) ? staff0 : staff1;
              let secondStaff = (firstStaff.id === staff0.id) ? staff1 : staff0;
              let firstLayer = firstStaff.querySelector('.layer');
              let secondLayer = secondStaff.querySelector('.layer');

              // Check that the first staff has either syllable as the last syllable
              let firstSyllableChildren = Array.from(firstLayer.children).filter(elem => elem.classList.contains('syllable'));
              let secondSyllableChildren = Array.from(secondLayer.children).filter(elem => elem.classList.contains('syllable'));
              let lastSyllable = firstSyllableChildren[firstSyllableChildren.length - 1];
              let firstSyllable = secondSyllableChildren[0];
              if (lastSyllable.id === groups[0].id && firstSyllable.id === groups[1].id) {
                Grouping.triggerGrouping('splitSyllable');
                break;
              } else if (lastSyllable.id === groups[1].id && firstSyllable.id === groups[0].id) {
                Grouping.triggerGrouping('splitSyllable');
                break;
              }
            }
            SelectOptions.triggerDefaultActions();
          }
          break;
        default:
          if (sharedSecondLevelParent(groups)) {
            Grouping.triggerGrouping('syl');
          } else {
            SelectOptions.triggerDefaultActions();
          }
      }
      break;

    case 'selByNeume':
      switch (groups.length) {
        case 1:
          // TODO change context if it is only a nc.
          SelectOptions.triggerNeumeActions();
          break;
        default:
          if (sharedSecondLevelParent(groups)) {
            Grouping.triggerGrouping('neume');
          } else {
            SelectOptions.triggerDefaultActions();
          }
      }
      break;

    case 'selByNc':
      switch (groups.length) {
        case 1:
          SelectOptions.triggerNcActions(groups[0]);
          break;
        case 2:
          if (sharedSecondLevelParent(groups)) {
            // Check if this selection is a ligature or can be a ligature
            // Check if these neume components are part of the same neume
            if (groups[0].parentNode === groups[1].parentNode) {
              let children = Array.from(groups[0].parentNode.children);
              // Check that neume components are adjacent
              if (Math.abs(children.indexOf(groups[0]) - children.indexOf(groups[1])) === 1) {
                // Check that second neume component is lower than first.
                // Note that the order in the list may not be the same as the
                // order by x-position.
                let orderFirstX = groups[0].children[0].x.baseVal.value;
                let orderSecondX = groups[1].children[0].x.baseVal.value;
                let posFirstY, posSecondY;

                if (orderFirstX < orderSecondX) {
                  posFirstY = groups[0].children[0].y.baseVal.value;
                  posSecondY = groups[1].children[0].y.baseVal.value;
                } else {
                  posFirstY = groups[1].children[0].y.baseVal.value;
                  posSecondY = groups[0].children[0].y.baseVal.value;
                }

                // Also ensure both components are marked or not marked as ligatures.
                let isFirstLigature = await isLigature(groups[0], neonView);
                let isSecondLigature = await isLigature(groups[1], neonView);
                if ((posSecondY > posFirstY) && !(isFirstLigature ^ isSecondLigature)) {
                  Grouping.triggerGrouping('ligature');
                  break;
                }
              }
            }
            Grouping.triggerGrouping('nc');
          } else {
            SelectOptions.triggerDefaultActions();
          }
          break;
        default:
          if (sharedSecondLevelParent(groups)) {
            Grouping.triggerGrouping('nc');
          } else {
            SelectOptions.triggerDefaultActions();
          }
      }
      break;
    case 'selByBBox':
      switch (groups.length) {
        case 1:
          let resize = new Resize(groups[0].closest('.syl').id, neonView, dragHandler);
          selectBBox(groups[0], dragHandler, resize);
          break;
        default:
          groups.forEach(g => selectBBox(g, dragHandler, undefined));
          break;
      }
      break;
    default:
      console.error('Unknown selection type. This should not have occurred.');
  }
}
