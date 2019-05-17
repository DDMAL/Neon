/** @module SingleEdit/Select */

import * as Color from '../utils/Color.js';
import { updateHighlight } from '../DisplayPanel/DisplayControls.js';
import { initSelectionButtons } from '../UnifiedEdit/EditControls.js';
import * as Grouping from './Grouping.js';
import * as SelectOptions from './SelectOptions.js';
import {
  unselect, getStaffBBox, selectNn, sharedSecondLevelParent,
  select, isLigature, selectNcs, selectStaff
} from '../UnifiedEdit/SelectTools.js';
import { Resize } from '../UnifiedEdit/StaffTools.js';

const d3 = require('d3');
const $ = require('jquery');

var dragHandler, neonView, info, zoomHandler;

/**
 * Get the selection mode chosen by the user.
 * @returns {string|null}
 */
function getSelectionType () {
  let element = document.getElementsByClassName('sel-by is-active');
  if (element.length !== 0) {
    return element[0].id;
  } else {
    return null;
  }
}

/**
 * Set the objects for this module.
 * @param {DragHandler} dh - The drag handler object
 * @param {NeonView} nv - The NeonView object
 */
export function setSelectHelperObjects (dh, nv) {
  dragHandler = dh;
  neonView = nv;
  info = neonView.info;
  zoomHandler = neonView.view.zoomHandler;

  initSelectionButtons();
  neonView.view.addUpdateCallback(clickSelect);
  neonView.view.addUpdateCallback(dragSelect);
}

/**
 * Apply listeners for click selection.
 */
export function clickSelect () {
  $('#mei_output, #mei_output use').off('mousedown', clickHandler);
  $('#mei_output, #mei_output use').on('mousedown', clickHandler);

  // Click away listeners
  $('body').on('keydown', (evt) => {
    if (evt.key === 'Escape') {
      if ($('.selected').length > 0) {
        info.infoListeners();
      }
      unselect();
    }
  });

  $('use').on('click', (e) => { e.stopPropagation(); });
  $('#moreEdit').on('click', (e) => { e.stopPropagation(); });
}

/**
 * Handle click events related to element selection.
 * @param {object} evt
 */
function clickHandler (evt) {
  let mode = neonView.getUserMode();

  // If in insert mode or panning is active from shift key
  if (mode === 'insert' || evt.shiftKey) { return; }

  // Check if the element being clicked on is part of a drag Selection
  if (this.tagName === 'use') {
    if ($(this).parents('.selected').length === 0) {
      selectAll([this]);
    }
  } else {
    // Check if the point being clicked on is a staff selection (if applicable)
    if (getSelectionType() !== 'selByStaff') {
      info.infoListeners();
      return;
    }

    // Check if the point is in a staff.
    let container = document.getElementsByClassName('definition-scale')[0];
    let pt = container.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    let transformMatrix = container.getScreenCTM();
    pt = pt.matrixTransform(transformMatrix.inverse());

    let selectedStaves = Array.from($('.staff')).filter((staff) => {
      let bbox = getStaffBBox(staff);
      return (bbox.ulx < pt.x && pt.x < bbox.lrx) && (bbox.uly < pt.y && pt.y < bbox.lry);
    });
    if (selectedStaves.length !== 1) {
      if ($('.selected').length > 0) {
        info.infoListeners();
      }
      unselect();
      return;
    }

    // Select a staff
    let staff = selectedStaves[0];
    if (!staff.classList.contains('selected')) {
      // Select previously unselected staff
      selectStaff(staff, dragHandler);
      let resize = new Resize(staff.id, neonView, dragHandler);
      resize.drawInitialRect();
      dragHandler.dragInit();
    }
    // Trigger mousedown event on the staff
    staff.dispatchEvent(new window.MouseEvent('mousedown', {
      screenX: evt.screenX,
      screenY: evt.screenY,
      clientX: evt.clientX,
      clientY: evt.clientY,
      ctrlKey: evt.ctrlKey,
      shiftKey: evt.shiftKey,
      altKey: evt.altKey,
      metaKey: evt.metaKey,
      view: evt.view
    }));
  }
}

/**
 * Apply listeners for drag selection.
 */
export function dragSelect () {
  var initialX = 0;
  var initialY = 0;
  var panning = false;
  var dragSelecting = false;
  var canvas = d3.select('#svg_group');
  var dragSelectAction = d3.drag()
    .on('start', selStart)
    .on('drag', selecting)
    .on('end', selEnd);
  canvas.call(dragSelectAction);
  dragHandler.resetTo(dragSelectAction);

  function selStart () {
    let userMode = neonView.getUserMode();
    if (d3.event.sourceEvent.target.nodeName !== 'use' && userMode !== 'insert') {
      if (!d3.event.sourceEvent.shiftKey) { // If not holding down shift key to pan
        if (!$('#selByStaff').hasClass('is-active') || pointNotInStaff(d3.mouse(this))) {
          unselect();
          dragSelecting = true;
          let initialP = d3.mouse(this);
          initialX = initialP[0];
          initialY = initialP[1];
          initRect(initialX, initialY);
        }
      } else {
        panning = true;
        zoomHandler.startDrag();
      }
    } else if (d3.event.sourceEvent.shiftKey) {
      panning = true;
      zoomHandler.startDrag();
    }
  }

  /**
   * Check if a point is in the bounds of a staff element.
   * @param {SVGPoint} point
   * @returns {boolean}
   */
  function pointNotInStaff (point) {
    let staves = Array.from(document.getElementsByClassName('staff'));
    let filtered = staves.filter((staff) => {
      let box = getStaffBBox(staff);
      return (box.ulx < point[0] && point[0] < box.lrx) && (box.uly < point[1] && point[1] < box.lry);
    });
    return (filtered.length === 0);
  }

  function selecting () {
    if (!panning && dragSelecting) {
      var currentPt = d3.mouse(this);
      var curX = currentPt[0];
      var curY = currentPt[1];

      var newX = curX < initialX ? curX : initialX;
      var newY = curY < initialY ? curY : initialY;
      var width = curX < initialX ? initialX - curX : curX - initialX;
      var height = curY < initialY ? initialY - curY : curY - initialY;

      updateRect(newX, newY, width, height);
    } else if (panning) {
      zoomHandler.dragging();
    }
  }

  function selEnd () {
    if (!panning && dragSelecting) {
      var rx = parseInt($('#selectRect').attr('x'));
      var ry = parseInt($('#selectRect').attr('y'));
      var lx = parseInt($('#selectRect').attr('x')) + parseInt($('#selectRect').attr('width'));
      var ly = parseInt($('#selectRect').attr('y')) + parseInt($('#selectRect').attr('height'));

      var nc;
      if ($('#selByStaff').hasClass('is-active')) {
        nc = d3.selectAll('#svg_group use, .staff')._groups[0];
      } else {
        nc = d3.selectAll('#svg_group use')._groups[0];
      }
      var els = Array.from(nc);

      var elements = els.filter(function (d) {
        if (d.tagName === 'use') {
          let box = d.parentNode.getBBox();
          let ulx = box.x;
          let uly = box.y;
          let lrx = box.x + box.width;
          let lry = box.y + box.height;
          return !(((rx < ulx && lx < ulx) || (rx > lrx && lx > lrx)) || ((ry < uly && ly < uly) || (ry > lry && ly > lry)));
        } else {
          let box = getStaffBBox(d);
          return !(((rx < box.ulx && lx < box.ulx) || (rx > box.lrx && lx > box.lrx)) || ((ry < box.uly && ly < box.uly) || (ry > box.lry && ly > box.lry)));
        }
      });

      selectAll(elements);

      dragHandler.dragInit();
      d3.selectAll('#selectRect').remove();
      dragSelecting = false;
    }
    panning = false;
  }

  /**
     * Create an initial dragging rectangle.
     * @param {number} ulx - The upper left x-position of the new rectangle.
     * @param {number} uly - The upper left y-position of the new rectangle.
     */
  function initRect (ulx, uly) {
    canvas.append('rect')
      .attr('x', ulx)
      .attr('y', uly)
      .attr('width', 0)
      .attr('height', 0)
      .attr('id', 'selectRect')
      .attr('stroke', 'black')
      .attr('stroke-width', 7)
      .attr('fill', 'none');
  }

  /**
     * Update the dragging rectangle.
     * @param {number} newX - The new ulx.
     * @param {number} newY - The new uly.
     * @param {number} currentWidth - The width of the rectangle in pixels.
     * @param {number} currentHeight - The height of the rectangle in pixels.
     */
  function updateRect (newX, newY, currentWidth, currentHeight) {
    d3.select('#selectRect')
      .attr('x', newX)
      .attr('y', newY)
      .attr('width', currentWidth)
      .attr('height', currentHeight);
  }
}

/**
 * Handle selecting an array of elements based on the selection type.
 * @param {SVGGraphicsElement[]} elements - The elements to select. Either <g> or <use>.
 */
async function selectAll (elements) {
  var syls = [];

  var neumes = [];

  var ncs = [];

  var notNeumes = [];

  elements.forEach(el => {
    var firstParent = el.parentNode;

    if ($(firstParent).hasClass('nc')) {
      ncs.push(firstParent);

      let neume = firstParent.parentNode;
      if (!neumes.includes(neume)) {
        neumes.push(neume);
      }

      var syl = neume.parentNode;
      if (!syls.includes(syl)) {
        syls.push(syl);
      }
    } else {
      notNeumes.push(firstParent);
    }
  });

  // Determine selection mode
  var selectMode = null;
  Array.from($('.sel-by')).forEach(tab => {
    if ($(tab).hasClass('is-active')) {
      selectMode = $(tab)[0].id;
    }
  });

  if (selectMode === 'selByStaff') {
    let toSelect = [];
    elements.forEach(el => {
      if (el.tagName === 'use') {
        let staff = $(el).parents('.staff')[0];
        if (!toSelect.includes(staff)) {
          toSelect.push(staff);
        }
      } else {
        if (!toSelect.includes(el)) {
          toSelect.push(el);
        }
      }
    });
    toSelect.forEach(elem => {
      $(elem).addClass('selected');
    });

    updateHighlight();
    toSelect.forEach(elem => {
      Color.highlight(elem, '#d00');
    });
    if (toSelect.length === 1) {
      SelectOptions.triggerSplitActions();
      let resize = new Resize(toSelect[0].id, neonView, dragHandler);
      resize.drawInitialRect();
    } else if (toSelect.length === 2) {
      let bb1 = getStaffBBox(toSelect[0]);
      let bb2 = getStaffBBox(toSelect[1]);
      var avgHeight = (bb1.lry - bb1.uly + bb2.lry - bb2.uly) / 2;
      if (Math.abs(bb1.uly - bb2.uly) < avgHeight) {
        SelectOptions.triggerStaffActions();
      }
    }
  } else if (selectMode === 'selBySyl') {
    let noClefOrCustos = selectNn(notNeumes);
    syls.forEach(s => { select(s); });
    if (!noClefOrCustos) {
      if (notNeumes.length === 1 && ncs.length === 0) {
        let el = notNeumes[0];
        // if ($(el).hasClass("custos")){
        //     SelectOptions.triggerNcActions([el]);
        // }
        if ($(el).hasClass('clef')) {
          SelectOptions.triggerClefActions([el]);
        }
      }
    } else if (syls.length > 1) {
      if (sharedSecondLevelParent(syls)) {
        Grouping.triggerGrouping('syl');
      }
    } else if (syls.length === 1) {
      var syl = syls[0];
      var nmChildren = $(syl).children('.neume');
      if (nmChildren.length === 1) {
        let neume = nmChildren[0];
        let ncChildren = neume.children;
        if (ncChildren.length === 1) {
          unselect();
          select(ncChildren[0]);
          SelectOptions.triggerNcActions(ncChildren[0]);
        } else if (ncChildren.length === 2) {
          unselect();
          if (await isLigature(ncChildren[0], neonView)) {
            selectNcs(ncChildren[0], dragHandler, neonView);
            if (sharedSecondLevelParent(Array.from(document.getElementsByClassName('selected')))) {
              Grouping.triggerGrouping('ligature');
            }
          } else {
            select(neume);
            SelectOptions.triggerNeumeActions();
          }
        } else {
          unselect();
          select(neume);
          SelectOptions.triggerNeumeActions();
        }
      } else {
        SelectOptions.triggerSylActions();
      }
    }
  } else if (selectMode === 'selByNeume') {
    unselect();
    let noClefOrCustos = selectNn(notNeumes);
    neumes.forEach(n => { select(n); });
    if (!noClefOrCustos) {
      if (notNeumes.length === 1 && ncs.length === 0) {
        let el = notNeumes[0];
        // if ($(el).hasClass("custos")){
        //     SelectOptions.triggerNcActions([el]);
        // }
        if ($(el).hasClass('clef')) {
          SelectOptions.triggerClefActions([el]);
        }
      }
    } else if (neumes.length > 1) {
      let syllable = neumes[0].parentElement;
      let group = false;
      for (var i = 1; i < neumes.length; i++) {
        if (syllable !== neumes[i].parentElement) {
          group = true;
          break;
        }
      }
      if (group) {
        if (sharedSecondLevelParent(neumes)) {
          Grouping.triggerGrouping('neume');
        }
      } else {
        let sylNeumes = Array.from(syllable.children).filter(child => $(child).hasClass('neume'));
        let result = true;
        sylNeumes.forEach(neume => { result = result && neumes.includes(neume); });
        if (result) {
          unselect();
          select(syllable);
          SelectOptions.triggerSylActions();
        }
      }
    } else if (neumes.length === 1) {
      let neume = neumes[0];
      let ncChildren = neume.children;
      if (ncChildren.length === 1) {
        unselect();
        select(ncChildren[0]);
        SelectOptions.triggerNcActions(ncChildren[0]);
      } else if (ncChildren.length === 2 && await isLigature(ncChildren[0], neonView)) {
        unselect();
        select(ncChildren[0]);
        select(ncChildren[1]);
        Grouping.triggerGrouping('ligature');
      } else {
        SelectOptions.triggerNeumeActions();
      }
    }
  } else if (selectMode === 'selByNc') {
    let noClefOrCustos = selectNn(notNeumes);
    if (ncs.length === 1 && noClefOrCustos) {
      selectNcs(ncs[0].children[0], dragHandler, neonView);
      return;
    }
    var prev = $(ncs[0]).prev();
    if (ncs.length !== 0 && await isLigature(ncs[0], neonView) && prev.length !== 0 && await isLigature($(ncs[0]).prev()[0], neonView)) {
      ncs.push($(ncs[0]).prev()[0]);
    }
    ncs.forEach(nc => { select(nc); });
    if (!noClefOrCustos) {
      if (notNeumes.length === 1 && ncs.length === 0) {
        var el = notNeumes[0];
        // if ($(el).hasClass("custos")){
        //     SelectOptions.triggerNcActions([el]);
        // }
        if ($(el).hasClass('clef')) {
          SelectOptions.triggerClefActions([el]);
        }
      }
    } else if (ncs.length === 2) {
      let firstChild = ncs[0].children[0];
      let secondChild = ncs[1].children[0];
      var firstX = firstChild.x.baseVal.value; // $(ncs[0]).children()[0].x.baseVal.value;
      var secondX = secondChild.x.baseVal.value; // $(ncs[1]).children()[0].x.baseVal.value;
      var firstY = 0;
      var secondY = 0;

      if (firstX === secondX) {
        firstY = secondChild.y.baseVal.value;
        secondY = firstChild.y.baseVal.value;
      } else {
        firstY = firstChild.y.baseVal.value;
        secondY = secondChild.y.baseVal.value;
      }

      if (secondY > firstY) {
        if (ncs[0].parentNode.id === ncs[1].parentNode.id) {
          let isFirstLigature = await isLigature(ncs[0], neonView);
          let isSecondLigature = await isLigature(ncs[1], neonView);
          if ((isFirstLigature && isSecondLigature) || (!isFirstLigature && !isSecondLigature)) {
            Grouping.triggerGrouping('ligature');
          }
          /* else{
                        Grouping.triggerGrouping("ligatureNc");
                    } */
        } else {
          if (ncs[0].parentElement !== ncs[1].parentElement) {
            if (sharedSecondLevelParent(ncs)) {
              Grouping.triggerGrouping('nc');
            }
          }
        }
      } else {
        if (ncs[0].parentElement !== ncs[1].parentElement) {
          if (sharedSecondLevelParent(ncs)) {
            Grouping.triggerGrouping('nc');
          }
        }
      }
    } else if (ncs.length > 1 && noClefOrCustos) {
      let neume = ncs[0].parentElement;
      let group = false;
      for (i = 1; i < ncs.length; i++) {
        if (ncs[i].parentElement !== neume) {
          group = true;
          break;
        }
      }
      if (group) {
        if (sharedSecondLevelParent(ncs)) {
          Grouping.triggerGrouping('nc');
        }
      } else {
        let neumeNcs = Array.from(neume.children).filter(nc => $(nc).hasClass('nc'));
        let result = true;
        neumeNcs.forEach(nc => { result = result && ncs.includes(nc); });
        if (result) {
          unselect();
          select(neume);
          SelectOptions.triggerNeumeActions();
        }
      }
    } else if (ncs.length === 1) {
      SelectOptions.triggerNcActions(ncs[0]);
    }
  }
  if ($('.selected').length > 0) {
    info.stopListeners();
  }
  dragHandler.dragInit();
}
