import * as Contents from './Contents';
import * as Warnings from '../Warnings';
import * as Notification from '../utils/Notification';
import NeonView from '../NeonView';
import { unsetVirgaAction, unsetInclinatumAction, removeHandler, deleteButtonHandler } from './SelectOptions';

/**
 * The NeonView parent to access editor actions.
 */
var neonView: NeonView;

/**
 * Set the neonView member.
 * @param {NeonView} view
 */
export function initNeonView (view: NeonView) {
  neonView = view;
}

/**
 * Trigger the grouping selection menu.
 * @param {string} type - The grouping type: nc, neume, syl, ligatureNc, or ligature
 */
export function triggerGrouping (type: string) {
  let moreEdit = document.getElementById('moreEdit');
  moreEdit.classList.remove('is-invisible');
  moreEdit.innerHTML += Contents.groupingMenu[type];
  initGroupingListeners();
}

/**
 * Remove the grouping selection menu.
 */
export function endGroupingSelection () {
  let moreEdit = document.getElementById('moreEdit');
  moreEdit.innerHTML = '';
  moreEdit.classList.add('is-invisible');
  document.body.removeEventListener('keydown', deleteButtonHandler);
}

/**
 * The grouping dropdown listener.
 */
export function initGroupingListeners () {
  let del = document.getElementById('delete');
  del.removeEventListener('click', removeHandler);
  del.addEventListener('click', removeHandler);
  document.body.addEventListener('keydown', deleteButtonHandler);
  try {
    document.getElementById('mergeSyls').addEventListener('click', () => {
      var elementIds = getChildrenIds().filter(e =>
        document.getElementById(e).classList.contains('neume')
      );
      groupingAction('group', 'neume', elementIds);
    });
  } catch (e) {}

  try {
    document.getElementById('groupNeumes').addEventListener('click', () => {
      var elementIds = getIds();
      groupingAction('group', 'neume', elementIds);
    });
  } catch (e) {}

  try {
    document.getElementById('groupNcs').addEventListener('click', () => {
      var elementIds = getIds();
      groupingAction('group', 'nc', elementIds);
    });
  } catch (e) {}

  try {
    document.getElementById('ungroupNeumes').addEventListener('click', () => {
      var elementIds = getChildrenIds();
      groupingAction('ungroup', 'neume', elementIds);
    });
  } catch (e) {}

  try {
    document.getElementById('ungroupNcs').addEventListener('click', () => {
      var elementIds = getChildrenIds();
      groupingAction('ungroup', 'nc', elementIds);
    });
  } catch (e) {}

  try {
    document.getElementById('toggle-ligature').addEventListener('click', async () => {
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
        await neonView.edit(chainAction, neonView.view.getCurrentPageURI());
      }

      let editorAction = {
        'action': 'toggleLigature',
        'param': {
          'elementIds': elementIds,
          'isLigature': isLigature.toString()
        }
      };
      neonView.edit(editorAction, neonView.view.getCurrentPageURI()).then((result) => {
        if (result) {
          Notification.queueNotification('Ligature Toggled');
        } else {
          Notification.queueNotification('Ligature Toggle Failed');
        }
        endGroupingSelection();
        neonView.updateForCurrentPage();
      });
    });
  } catch (e) {}

  try {
    document.getElementById('toggle-link').addEventListener('click', () => {
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
        chainAction.param.push({
          'action': 'setText',
          'param': {
            'elementId': elementIds[1],
            'text': ''
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
        chainAction.param.push({
          'action': 'setText',
          'param': {
            'elementId': elementIds[0],
            'text': ''
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
        // Delete syl on second syllable
        let syl = secondSyllable.querySelector('.syl');
        if (syl !== null) {
          chainAction.param.push({
            'action': 'remove',
            'param': {
              'elementId': syl.id
            }
          });
        }
      }
      neonView.edit(chainAction, neonView.view.getCurrentPageURI()).then((result) => {
        if (result) {
          Notification.queueNotification('Toggled Syllable Link');
        } else {
          Notification.queueNotification('Failed to Toggle Syllable Link');
        }
        endGroupingSelection();
        neonView.updateForCurrentPage();
      });
    });
  } catch (e) {}
}

/**
 * Form and execute a group/ungroup action.
 * @param action - The action to execute. Either "group" or "ungroup".
 * @param groupType - The type of elements to group. Either "neume" or "nc".
 * @param elementIds - The IDs of the elements.
 */
function groupingAction (action: string, groupType: string, elementIds: string[]) {
  let editorAction = {
    'action': action,
    'param': {
      'groupType': groupType,
      'elementIds': elementIds
    }
  };
  neonView.edit(editorAction, neonView.view.getCurrentPageURI()).then((result) => {
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
      var neumeParent = document.getElementById(elementIds[0]).parentNode;
      var ncs = <SVGGraphicsElement[]>Array.from(neumeParent.children);
      var contour = neonView.info.getContour(ncs);
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
function getIds (): string[] {
  var ids = [];
  var elements = Array.from(document.getElementsByClassName('selected'));
  elements.forEach(el => {
    ids.push(el.id);
  });
  return ids;
}

/**
 * Get the IDs of the selected elements' children.
 */
function getChildrenIds (): string[] {
  var childrenIds = [];
  var elements = Array.from(document.getElementsByClassName('selected'));
  elements.forEach(el => {
    var children = Array.from(el.children);
    children.forEach(ch => {
      childrenIds.push(ch.id);
    });
  });
  return childrenIds;
}
