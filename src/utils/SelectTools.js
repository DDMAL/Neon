/** @module UnifiedEdit/SelectTools */

import * as Color from './Color.js';
import { updateHighlight } from '../DisplayPanel/DisplayControls.js';
import * as Grouping from '../SquareEdit/Grouping.js';
import { Resize } from './Resize.js';
import * as SelectOptions from '../SquareEdit/SelectOptions.js';

const d3 = require('d3');
const $ = require('jquery');

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
  var selected = $('.selected');
  for (var i = 0; i < selected.length; i++) {
    if ($(selected[i]).hasClass('staff')) {
      $(selected[i]).removeClass('selected');
      Color.unhighlight(selected[i]);
    } else {
      $(selected[i]).removeClass('selected');
    }
  }
  $('.sylTextRect-select').css('fill', 'blue');
  $('.sylTextRect-select').addClass('sylTextRect-display');
  $('.sylTextRect-select').removeClass('sylTextRect-select');

  d3.select('#resizeRect').remove();

  if (!$('#selByStaff').hasClass('is-active')) {
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
  if (!$(el).hasClass('selected')) {
    $(el).addClass('selected');
    if ($(el).hasClass('sylTextRect-display')) {
      $(el).addClass('sylTextRect-select');
      $(el).removeClass('sylTextRect-display');
    } else if ($(el).find('.sylTextRect-display').length) {
      $(el).find('.sylTextRect-display').css('fill', 'red');
      $(el).find('.sylTextRect-display').addClass('sylTextRect-select');
      $(el).find('.sylTextRect-display').removeClass('sylTextRect-display');
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
  if (!$(el).parent().hasClass('selected')) {
    var parent = el.parentNode;
    unselect();
    select(parent);
    if (await isLigature(parent, neonView)) {
      var prevNc = $(parent).prev()[0];
      if (await isLigature(prevNc, neonView)) {
        select(prevNc);
      } else {
        var nextNc = $(parent).next()[0];
        if (await isLigature(nextNc, neonView)) {
          select(nextNc);
        } else {
          console.warn('Error: Neither prev or next nc are ligatures');
        }
      }
      Grouping.triggerGrouping('ligature');
    } else if ($(parent).hasClass('nc')) {
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
  var attributes = await neonView.getElementAttr(nc.id, neonView.view.getCurrentPage());
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
  Array.from($(staff).children('path')).forEach(path => {
    let box = path.getBBox();
    if (uly === undefined || box.y < uly) {
      uly = box.y;
    }
    if (ulx === undefined || box.x < ulx) {
      ulx = box.x;
    }
    if (lry === undefined || box.y + box.height > lry) {
      lry = box.y + box.height;
    }
    if (lrx === undefined || box.x + box.width > lrx) {
      lrx = box.x + box.width;
    }
  });
  return { 'ulx': ulx, 'uly': uly, 'lrx': lrx, 'lry': lry };
}

/**
 * select a boundingbox element
 * @param {SVGGElement} el - the bbox (sylTextRect) element in the DOM
 * @param {DragHandler} dragHandler - the drag handler in use
 */
export function selectBBox (el, dragHandler) {
  // -------this method is preliminary and will need to be fixed later------------ //

  let bbox = $(el);
  if (!bbox.hasClass('sylTextRect-select')) {
    unselect();
    bbox.removeClass('sylTextRect');
    bbox.addClass('sylTextRect-select');
    updateHighlight();
    dragHandler.dragInit();
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
 * @param {SVGGElement} el - The staff element in the DOM.
 * @param {DragHandler} dragHandler - The drag handler in use.
 */
export function selectStaff (el, dragHandler) {
  let staff = $(el);
  if (!staff.hasClass('selected')) {
    staff.addClass('selected');
    updateHighlight();
    Color.highlight(el, '#d00');
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

  let neumeSelectionClass;
  let containsClefOrCustos = false;

  switch (selectionType) {
    case 'selBySyl':
      neumeSelectionClass = '.syllable';
      break;
    case 'selByNeume':
      neumeSelectionClass = '.neume';
      break;
    case 'selByNc':
      neumeSelectionClass = '.nc';
      break;
    case 'selByStaff':
      neumeSelectionClass = '.staff';
      break;
    default:
      console.error('Unknown selection type ' + selectionType);
      return;
  }

  // Get the groupings specified by neumeSelectionClass
  // that contain the provided elements to select.
  let groupsToSelect = new Set();
  for (let element of elements) {
    let grouping = element.closest(neumeSelectionClass);
    if (grouping === null) {
      // Check if we click-selected a clef or a custos
      grouping = element.closest('.clef, .custos');
      if (grouping === null) {
        console.warning('Element ' + element.id + ' is not part of specified group and is not a clef or custos.');
        continue;
      }
      containsClefOrCustos |= true;
    }
    groupsToSelect.add(grouping);
  }

  // Select the elements
  groupsToSelect.forEach(group => { select(group, dragHandler); });

  /* Determine the context menu to display (if any) */

  let groups = Array.from(groupsToSelect.values());

  // Handle occurance of clef or custos
  if (containsClefOrCustos) {
    // A context menu will only be displayed if there is a single clef
    if (groupsToSelect.size === 1 && groups[0].classList.contains('clef')) {
      SelectOptions.triggerClefActions(groupsToSelect[0]);
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
    default:
      console.error('Unknown selection type. This should not have occurred.');
  }
}
