/** @module UnifiedEdit/SelectTools */

import * as Color from '../utils/Color.js';
import { updateHighlight } from '../DisplayPanel/DisplayControls.js';
import * as Grouping from '../SingleEdit/Grouping.js';
import * as SelectOptions from '../SingleEdit/SelectOptions.js';

const d3 = require('d3');
const $ = require('jquery');

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
      $(selected[i]).removeClass('selected').attr('fill', null);
    }
  }
  $('.syl-select').css('color', '');
  $('.syl-select').css('font-weight', '');
  $('.syl-select').removeClass('syl-select');

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
 */
export function select (el) {
  if (!$(el).hasClass('selected')) {
    $(el).attr('fill', '#d00');
    $(el).addClass('selected');

    var sylId;
    if ($(el).hasClass('syllable')) {
      sylId = el.id;
    } else if ($(el).parents('.syllable').length) {
      sylId = $(el).parents('.syllable').attr('id');
    }
    if (sylId !== undefined) {
      if ($('span').filter('.' + sylId).length) {
        $('span').filter('.' + sylId).css('color', '#d00');
        $('span').filter('.' + sylId).css('font-weight', 'bold');
        $('span').filter('.' + sylId).addClass('syl-select');
      }
    }
  }
  updateHighlight();
}

/**
 * Select an nc.
 * @param {SVGGraphicsElement} el - The nc element to select.
 * @param {DragHandler} dragHandler - An instantiated DragHandler.
 */
export async function selectNcs (el, dragHandler) {
  if (!$(el).parent().hasClass('selected')) {
    var parent = el.parentNode;
    unselect();
    select(parent);
    if (await isLigature(parent)) {
      var prevNc = $(parent).prev()[0];
      if (await isLigature(prevNc)) {
        select(prevNc);
      } else {
        var nextNc = $(parent).next()[0];
        if (await isLigature(nextNc)) {
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
  var attributes = await neonView.getElementAttr(nc.id, 0);
  return (attributes.ligated === 'true');
}

/**
 * Check if the elements have the same parent up two levels.
 * @param {Array<Element>} elements - The array of elements.
 * @returns {boolean} - If the elements share the same second level parent.
 */
export function sharedSecondLevelParent (elements) {
  let firstElement = elements.pop();
  let secondParent = firstElement.parentElement.parentElement;
  for (let element of elements) {
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
    unselect();
    staff.addClass('selected');
    updateHighlight();
    Color.highlight(el, '#d00');
    dragHandler.dragInit();
  }
}
