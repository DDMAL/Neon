/** @module SelectOptions */
import * as Contents from '../utils/Contents.js';
import * as Grouping from './Grouping.js';
import * as Notification from '../Notification.js';
import InfoModule from '../InfoModule.js';
import SplitHandler from './SplitHandler.js';
const $ = require('jquery');

/**
 * The NeonView parent to call editor actions.
 * @type {NeonView}
 */
var neonView;

/**
 * Initialize NeonView for this and {@link module:Grouping}
 * @param {NeonView} view - The parent NeonView.
 */
export function initNeonView (view) {
  neonView = view;
  Grouping.initNeonView(view);
}

/**
 * Return a JSON action that unsets the inclinatum parameter of an nc.
 * @param {string} id - The id of the neume component.
 * @returns {object}
 */
export function unsetInclinatumAction (id) {
  return {
    'action': 'set',
    'param': {
      'elementId': id,
      'attrType': 'tilt',
      'attrValue': ''
    }
  };
}

/**
 * Return a JSON action that unsets the virga parameter of an nc.
 * @param {string} id - The id of the neume component.
 * @returns {object}
 */
export function unsetVirgaAction (id) {
  return {
    'action': 'set',
    'param': {
      'elementId': id,
      'attrType': 'tilt',
      'attrValue': ''
    }
  };
}

// TODO: CHANGE NAVABAR-LINK TO PROPER ICON//
/**
 * Trigger the extra nc action menu.
 * @param {SVGSVGElement} nc - The last selected elements.
 */
export function triggerNcActions (nc) {
  endOptionsSelection();
  $('#moreEdit').removeClass('is-invisible');
  $('#moreEdit').append(Contents.ncActionContents);

  $('#Punctum.dropdown-item').on('click', () => {
    let unsetInclinatum = unsetInclinatumAction(nc.id);
    let unsetVirga = unsetVirgaAction(nc.id);
    neonView.edit({ 'action': 'chain', 'param': [ unsetInclinatum, unsetVirga ] }).then((result) => {
      if (result) {
        Notification.queueNotification('Shape Changed');
      } else {
        Notification.queueNotification('Shape Change Failed');
      }
      endOptionsSelection();
      neonView.updateForCurrentPage();
    });
  });

  $('#Inclinatum.dropdown-item').on('click', () => {
    let setInclinatum = {
      'action': 'set',
      'param': {
        'elementId': nc.id,
        'attrType': 'tilt',
        'attrValue': 'se'
      }
    };
    neonView.edit(setInclinatum).then((result) => {
      if (result) {
        Notification.queueNotification('Shape Changed');
      } else {
        Notification.queueNotification('Shape Change Failed');
      }
      endOptionsSelection();
      neonView.updateForCurrentPage();
    });
  });

  $('#Virga.dropdown-item').on('click', () => {
    let unsetInclinatum = unsetInclinatumAction(nc.id);
    let setVirga = {
      'action': 'set',
      'param': {
        'elementId': nc.id,
        'attrType': 'tilt',
        'attrValue': 'n'
      }
    };
    neonView.edit({ 'action': 'chain', 'param': [ unsetInclinatum, setVirga ] }).then((result) => {
      if (result) {
        Notification.queueNotification('Shape Changed');
      } else {
        Notification.queueNotification('Shape Change Failed');
      }
      endOptionsSelection();
      neonView.updateForCurrentPage();
    });
  });

  initOptionsListeners();
}

/**
 * Trigger extra neume actions.
 */
export function triggerNeumeActions () {
  endOptionsSelection();
  $('#moreEdit').removeClass('is-invisible');
  $('#moreEdit').append(Contents.neumeActionContents);
  var neume = $('.selected');
  if (neume.length !== 1) {
    console.warn('More than one neume selected! Cannot trigger Neume ClickSelect actions.');
    return;
  }

  $('.grouping').on('click', (e) => {
    var contour = InfoModule.getContourByValue(e.target.id);
    triggerChangeGroup(contour);
  });

  function triggerChangeGroup (contour) {
    let changeGroupingAction = {
      'action': 'changeGroup',
      'param': {
        'elementId': neume[0].id,
        'contour': contour
      }
    };
    neonView.edit(changeGroupingAction).then((result) => {
      if (result) {
        Notification.queueNotification('Grouping Changed');
      } else {
        Notification.queueNotification('Grouping Failed');
      }
      endOptionsSelection();
      neonView.updateForCurrentPage();
    });
  }
  initOptionsListeners();
  Grouping.initGroupingListeners();
}

/**
 * Trigger extra syllable actions.
 */
export function triggerSylActions () {
  endOptionsSelection();
  $('#moreEdit').removeClass('is-invisible');
  $('#moreEdit').append(
    "<div><p class='control'>" +
        "<button class='button' id='ungroupNeumes'>Ungroup</button></p></div>"
  );
  Grouping.initGroupingListeners();
}

/**
 * Trigger extra clef actions.
 */
export function triggerClefActions (clef) {
  endOptionsSelection();
  $('#moreEdit').removeClass('is-invisible');
  $('#moreEdit').append(Contents.clefActionContents);
  $('#CClef.dropdown-item').on('click', () => {
    let setCClef = {
      'action': 'setClef',
      'param': {
        'elementId': clef.id,
        'shape': 'C'
      }
    };
    neonView.edit(setCClef).then((result) => {
      if (result) {
        Notification.queueNotification('Shape Changed');
      } else {
        Notification.queueNotification('Shape Change Failed');
      }
      endOptionsSelection();
      neonView.updateForCurrentPage();
    });
  });
  $('#FClef.dropdown-item').on('click', () => {
    let setFClef = {
      'action': 'setClef',
      'param': {
        'elementId': clef.id,
        'shape': 'F'
      }
    };
    neonView.edit(setFClef).then((result) => {
      if (result) {
        Notification.queueNotification('Shape Changed');
      } else {
        Notification.queueNotification('Shape Change Failed');
      }
      endOptionsSelection();
      neonView.updateForCurrentPage();
    });
  });
  initOptionsListeners();
}

/**
 * Trigger extra staff actions.
 */
export function triggerStaffActions () {
  endOptionsSelection();
  $('#moreEdit').removeClass('is-invisible');
  $('#moreEdit').append(Contents.staffActionContents);

  $('#merge-systems').on('click', () => {
    let systems = Array.from($('.staff.selected'));
    let elementIds = [];
    systems.forEach(staff => {
      elementIds.push(staff.id);
    });
    let editorAction = {
      'action': 'merge',
      'param': {
        'elementIds': elementIds
      }
    };
    neonView.edit(editorAction).then((result) => {
      if (result) {
        Notification.queueNotification('Staff Merged');
        endOptionsSelection();
        neonView.updateForCurrentPage();
      } else {
        Notification.queueNotification('Merge Failed');
      }
    });
  });
}

/**
 * Trigger split staff option
 */
export function triggerSplitActions () {
  endOptionsSelection();
  $('#moreEdit').removeClass('is-invisible');
  $('#moreEdit').append(Contents.splitActionContents);

  // TODO add trigger for split action
  $('#split-system').on('click', () => {
    var split = new SplitHandler(neonView);
    split.startSplit();
    endOptionsSelection();
  });
}

/**
 * End the extra options menu.
 */
export function endOptionsSelection () {
  $('#moreEdit').empty();
  $('#moreEdit').addClass('is-invisible');
}

/**
 * Initialize extra dropdown options.
 */
function initOptionsListeners () {
  $('#drop_select').on('click', function () {
    $(this).toggleClass('is-active');
  });
}
