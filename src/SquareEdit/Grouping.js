/** @module SingleEdit/Grouping */

import * as Contents from './Contents.js';
import * as Warnings from '../Warnings.js';
import * as Notification from '../utils/Notification.js';
import { unsetVirgaAction, unsetInclinatumAction } from './SelectOptions.js';
const $ = require('jquery');

/**
 * The NeonView parent to access editor actions.
 * @type {NeonView}
 */
var neonView;

/**
 * Set the neonView member.
 * @param {NeonView} view
 */
export function initNeonView (view) {
  neonView = view;
}

/**
 * Trigger the grouping selection menu.
 * @param {string} type - The grouping type: nc, neume, syl, ligatureNc, or ligature
 */
export function triggerGrouping (type) {
  $('#moreEdit').removeClass('is-invisible');
  $('#moreEdit').append(Contents.groupingMenu[type]);
  initGroupingListeners();
}

/**
 * Remove the grouping selection menu.
 */
export function endGroupingSelection () {
  $('#moreEdit').empty();
  $('#moreEdit').addClass('is-invisible');
}

/**
 * The grouping dropdown listener.
 */
export function initGroupingListeners () {
  $('#mergeSyls').on('click', function () {
    var elementIds = getChildrenIds().filter(e =>
      document.getElementById(e).classList.contains('neume')
    );
    groupingAction('group', 'neume', elementIds);
  });

  $('#groupNeumes').on('click', function () {
    var elementIds = getIds();
    groupingAction('group', 'neume', elementIds);
  });

  $('#groupNcs').on('click', function () {
    var elementIds = getIds();
    groupingAction('group', 'nc', elementIds);
  });

  $('#ungroupNeumes').on('click', function () {
    var elementIds = getChildrenIds();
    groupingAction('ungroup', 'neume', elementIds);
  });

  $('#ungroupNcs').on('click', function () {
    var elementIds = getChildrenIds();
    groupingAction('ungroup', 'nc', elementIds);
  });
  $('#toggle-ligature').on('click', async function () {
    var elementIds = getIds();
    var isLigature;
    let ligatureRegex = /#E99[016]/;
    if (!ligatureRegex.test(document.getElementById(elementIds[0]).children[0].getAttribute('xlink:href'))) { // SMUFL codes for ligature glyphs
      isLigature = true;
    } else {
      isLigature = false;
      let chainAction = { 'action': 'chain',
        'param': [
          unsetInclinatumAction(elementIds[0]), unsetVirgaAction(elementIds[0]),
          unsetInclinatumAction(elementIds[1]), unsetVirgaAction(elementIds[1])
        ] };
      await neonView.edit(chainAction, neonView.view.getCurrentPage());
    }

    let editorAction = {
      'action': 'toggleLigature',
      'param': {
        'elementIds': elementIds,
        'isLigature': isLigature.toString()
      }
    };
    neonView.edit(editorAction, neonView.view.getCurrentPage()).then((result) => {
      if (result) {
        Notification.queueNotification('Ligature Toggled');
      } else {
        Notification.queueNotification('Ligature Toggle Failed');
      }
      endGroupingSelection();
      neonView.updateForCurrentPage();
    });
  });
  $('#toggle-link').on('click', function (evt) {
    let elementIds = getIds();
    let chainAction = {
      'action': 'chain',
      'param': []
    };
    if (document.getElementById(elementIds[0]).getAttribute('mei:precedes')) {
      chainAction.param.push({
        'action': 'set',
        'param': {
          'elementId': elementIds[0],
          'attrType': 'precedes',
          'attrValue': ''
        }
      });
      chainAction.param.push({
        'action': 'set',
        'param': {
          'elementId': elementIds[1],
          'attrType': 'follows',
          'attrValue': ''
        }
      });
    } else if (document.getElementById(elementIds[0]).getAttribute('mei:follows')) {
      chainAction.param.push({
        'action': 'set',
        'param': {
          'elementId': elementIds[0],
          'attrType': 'follows',
          'attrValue': ''
        }
      });
      chainAction.param.push({
        'action': 'set',
        'param': {
          'elementId': elementIds[1],
          'attrType': 'precedes',
          'attrValue': ''
        }
      });
    } else {
      // Associate syllables. Will need to find which is first. Use staves.
      let syllable0 = document.getElementById(elementIds[0]);
      let syllable1 = document.getElementById(elementIds[1]);
      let staff0 = syllable0.closest('.staff');
      let staff1 = syllable1.closest('.staff');
      let staffChildren = Array.from(staff0.parentNode.children).filter(elem => elem.classList.contains('staff'));

      let firstSyllable, secondSyllable;
      // Determine first syllable comes first by staff
      if (staffChildren.indexOf(staff0) < staffChildren.indexOf(staff1)) {
        firstSyllable = syllable0;
        secondSyllable = syllable1;
      } else {
        firstSyllable = syllable1;
        secondSyllable = syllable0;
      }

      chainAction.param.push({
        'action': 'set',
        'param': {
          'elementId': firstSyllable.id,
          'attrType': 'precedes',
          'attrValue': secondSyllable.id
        }
      });
      chainAction.param.push({
        'action': 'set',
        'param': {
          'elementId': secondSyllable.id,
          'attrType': 'follows',
          'attrValue': firstSyllable.id
        }
      });
    }
    neonView.edit(chainAction, neonView.view.getCurrentPage()).then((result) => {
      if (result) {
        Notification.queueNotification('Toggled Syllable Link');
      } else {
        Notification.queueNotification('Failed to Toggle Syllable Link');
      }
      endGroupingSelection();
      neonView.updateForCurrentPage();
    });
  });
}

/**
 * Form and execute a group/ungroup action.
 * @param {string} action - The action to execute. Either "group" or "ungroup".
 * @param {string} groupType - The type of elements to group. Either "neume" or "nc".
 * @param {string[]} elementIds - The IDs of the elements.
 */
function groupingAction (action, groupType, elementIds) {
  let editorAction = {
    'action': action,
    'param': {
      'groupType': groupType,
      'elementIds': elementIds
    }
  };
  neonView.edit(editorAction, neonView.view.getCurrentPage()).then((result) => {
    if (result) {
      if (action === 'group') {
        Notification.queueNotification('Grouping Success');
      } else {
        Notification.queueNotification('Ungrouping Success');
      }
    } else {
      if (action === 'group') {
        Notification.queueNotification('Grouping Failed');
      } else {
        Notification.queueNotification('Ungrouping Failed');
      }
    }
    neonView.updateForCurrentPage();

    // Prompt user to confirm if Neon does not re cognize contour
    if (groupType === 'nc') {
      var neumeParent = $('#' + elementIds[0]).parent();
      var ncs = $(neumeParent).children();
      var contour = neonView.info.getContour((ncs));
      if (contour === undefined) {
        Warnings.groupingNotRecognized();
      }
    }
    endGroupingSelection();
  });
}

/**
 * Get the IDs of selected elements.
 */
function getIds () {
  var ids = [];
  var elements = Array.from($('.selected'));
  elements.forEach(el => {
    ids.push($(el)[0].id);
  });
  return ids;
}

/**
 * Get the IDs of the selected elements' children.
 */
function getChildrenIds () {
  var childrenIds = [];
  var elements = Array.from($('.selected'));
  elements.forEach(el => {
    var children = Array.from($(el).children());
    children.forEach(ch => {
      childrenIds.push($(ch)[0].id);
    });
  });
  return childrenIds;
}
