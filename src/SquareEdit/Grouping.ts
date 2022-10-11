import * as Contents from './Contents';
import * as Warnings from '../Warnings';
import * as Notification from '../utils/Notification';
import * as SelectTools from '../utils/SelectTools';
import * as SelectOptions from '../SquareEdit/SelectOptions';
import NeonView from '../NeonView';
import { EditorAction, ToggleLigatureAction } from '../Types';
import { removeHandler, deleteButtonHandler } from './SelectOptions';


/**
 * The NeonView parent to access editor actions.
 */
let neonView: NeonView;


/**
 * Set the neonView member.
 */
export function initNeonView (view: NeonView): void {
  neonView = view;
}


/**
 * Check if selected elements can be grouped or not
 * @returns true if grouped, false otherwise
 */
export function isGroupable(selectionType: string, elements: Array<SVGGraphicsElement>): boolean {
  const groups = Array.from(elements.values()) as SVGGraphicsElement[];

  if (groups.length < 2) {
    // cannot group if only 1 element is selected
    return false;
  }

  switch(selectionType) {
    case 'selByNeume':
      // if neumes are in same syllable, don't display grouping option
      if (SelectTools.sharedLogicalParent(selectionType, elements)) return false;

    default:
      // check if all selected elements are adjacent to each other
      if (SelectTools.areAdjacent(selectionType, elements)) {
        return true;
      } else {
        return false;
      }
  }

}


/**
 * Checks to see is a selection of elements is already linked
 * @param elements elements to be considered
 * @returns true is linked, false otherwise
 */
export function isLinked(elements: Array<SVGGraphicsElement>): boolean {

  // if number of elements is not 2, elements cannot be linked by definition
  if (elements.length !== 2) return false;

  // if precedes and follows attributes exist and their IDs match
  if (((elements[0].getAttribute('mei:follows') === `#${elements[1].id}`) && 
      (elements[1].getAttribute('mei:precedes') === `#${elements[0].id}`)) ||
      ((elements[0].getAttribute('mei:precedes') === '#' + elements[1].id) &&
      (elements[1].getAttribute('mei:follows') === '#' + elements[0].id))) {
    return true;
  }
  else {
    return false;
  }
}


/**
 * Check if the selected elements can be linked or unlikned.
 * @param selectionType Current selection mode. Only certain elements can be linked
 * @param elements The elements under question 
 * @returns true if user should be able to link or un-link elements, false otherwise
 */
export function isLinkable(selectionType: string, elements: Array<SVGGraphicsElement>): boolean {

  switch(elements.length) {
    // only a selection of length 2 can lead to option to toggle syllable link
    case 2:
      // only Syllables can be linked or unlinked (?)
      if (selectionType !== 'selBySyllable') return false;
    
      // if ALREADY linked
      if (isLinked([elements[0], elements[1]])) {
        return true;
      }
      // if CAN be linked
      else {
        // Check if this *could* be a selection with a single logical syllable split by a staff break. 
        // Check if these are adjacent staves (logically)
        if (SelectTools.isMultiStaveSelection(elements)) {
          const staff0 = elements[0].closest('.staff');
          const staff1 = elements[1].closest('.staff');
          const staffChildren = Array.from(staff0.parentElement.children);

          // Check if one syllable is the last in the first staff and the other is the first in the second.
          // Determine which staff is first.
          const firstStaff = (staffChildren.indexOf(staff0) < staffChildren.indexOf(staff1)) ? staff0 : staff1;
          const secondStaff = (firstStaff.id === staff0.id) ? staff1 : staff0;
          const firstLayer = firstStaff.querySelector('.layer');
          const secondLayer = secondStaff.querySelector('.layer');
    
          // Check that the first staff has either syllable as the last syllable
          const firstSyllableChildren = Array.from(firstLayer.children).filter((elem: HTMLElement) => elem.classList.contains('syllable'));
          const secondSyllableChildren = Array.from(secondLayer.children).filter((elem: HTMLElement) => elem.classList.contains('syllable'));    
          const lastSyllable = firstSyllableChildren[firstSyllableChildren.length - 1];
          const firstSyllable = secondSyllableChildren[0];
    
          if (lastSyllable.id === elements[0].id && firstSyllable.id === elements[1].id) {
            return true;
          } 
          else if (lastSyllable.id === elements[1].id && firstSyllable.id === elements[0].id) {
            return true;
          }
        }
      }
      
    // cannot toggle link for syllable selection if number of selected
    // syllables is not equal to 2
    default:
      return false;
  }

  return false;
}


/**
 * Merge selected staves
 */
export function mergeStaves (): void {
  const systems = document.querySelectorAll('.staff.selected');
  const elementIds = [];
  systems.forEach(staff => {
    elementIds.push(staff.id);
  });
  const editorAction: EditorAction = {
    action: 'merge',
    param: {
      elementIds: elementIds
    }
  };
  neonView.edit(editorAction, neonView.view.getCurrentPageURI()).then((result) => {
    if (result) {
      Notification.queueNotification('Staff Merged', 'success');
      SelectOptions.endOptionsSelection();
      neonView.updateForCurrentPage();
    } else {
      Notification.queueNotification('Merge Failed', 'error');
    }
  });
}


/**
 * Trigger the grouping selection menu.
 * @param type - The grouping type: nc, neume, syl, ligatureNc, or ligature
 */
export function triggerGrouping (type: string): void {
  const moreEdit = document.getElementById('moreEdit');
  moreEdit.parentElement.classList.remove('hidden');
  moreEdit.innerHTML += Contents.groupingMenu[type];
  initGroupingListeners();
}


/**
 * Remove the grouping selection menu.
 */
export function endGroupingSelection (): void {
  const moreEdit = document.getElementById('moreEdit');
  moreEdit.innerHTML = '';
  moreEdit.parentElement.classList.add('hidden');
  document.body.removeEventListener('keydown', deleteButtonHandler);
  document.body.removeEventListener('keydown', keydownListener);
}


/**
 * The grouping dropdown listener.
 */
export function initGroupingListeners (): void {
  const del = document.getElementById('delete');
  del.removeEventListener('click', removeHandler);
  del.addEventListener('click', removeHandler);
  document.body.addEventListener('keydown', deleteButtonHandler);
  document.body.addEventListener('keydown', keydownListener);

  try {
    document.getElementById('mergeSyls').addEventListener('click', () => {
      const elementIds = getChildrenIds().filter(e =>
        document.getElementById(e).classList.contains('neume')
      );
      groupingAction('group', 'neume', elementIds);
    });
  } catch (e) {}

  try {
    document.getElementById('groupNeumes').addEventListener('click', () => {
      const elementIds = getIds();
      groupingAction('group', 'neume', elementIds);
    });
  } catch (e) {}

  try {
    document.getElementById('groupNcs').addEventListener('click', () => {
      const elementIds = getIds();
      groupingAction('group', 'nc', elementIds);
    });
  } catch (e) {}

  try {
    document.getElementById('ungroupNeumes').addEventListener('click', () => {
      const elementIds = getChildrenIds();
      groupingAction('ungroup', 'neume', elementIds);
    });
  } catch (e) {}

  try {
    document.getElementById('ungroupNcs').addEventListener('click', () => {
      const elementIds = getChildrenIds();
      groupingAction('ungroup', 'nc', elementIds);
    });
  } catch (e) {}

  try {
    document.getElementById('toggle-ligature').addEventListener('click', async () => {
      const elementIds = getIds();
      
      const editorAction: ToggleLigatureAction = {
        action: 'toggleLigature',
        param: {
          elementIds: elementIds
        }
      };
      neonView.edit(editorAction, neonView.view.getCurrentPageURI()).then((result) => {
        if (result) {
          Notification.queueNotification('Ligature Toggled', 'success');
        } else {
          Notification.queueNotification('Ligature Toggle Failed', 'error');
        }
        endGroupingSelection();
        neonView.updateForCurrentPage();
      });
    });
  } catch (e) {}

  try {
    document.getElementById('toggle-link').addEventListener('click', () => {
      toggleLinkedSyllables();
    });
  } catch (e) {}
}


/**
 * Grouping/Ungrouping keybinding event listener
 */
const keydownListener = function(e) {
  if (e.key === 'g') {
    // get selected elements to check if they can be groupeds
    const elements = Array.from(document.querySelectorAll('.selected')) as SVGGraphicsElement[];
    if (elements.length == 0) return;

    const selectionType = SelectTools.getSelectionType();

    // Group/merge or ungroup/split based on selection type
    switch (selectionType) {
      case 'selBySyllable':
        // if syllables are linnkable, toggle linked syllable
        // linked syllables cannot be grouped/ungrouped
        if (isLinkable(selectionType, elements)) {
          toggleLinkedSyllables();
        }
        // check if groupable before grouping
        else if (isGroupable(selectionType, elements)) {
          const elementIds = getChildrenIds().filter(e =>
            document.getElementById(e).classList.contains('neume')
          );
          groupingAction('group', 'neume', elementIds);

        } 
        // can only ungroup if length is 1 (one syllable selected)
        // cannot ungroup if multiple syllables are selected
        else if (elements.length === 1) {
          const elementIds = getChildrenIds();
          groupingAction('ungroup', 'neume', elementIds);
        }
        break;

      case 'selByNeume':
        if (isGroupable(selectionType, elements)) {
          const elementIds = getIds();
          groupingAction('group', 'neume', elementIds);
        } else {
          const elementIds = getChildrenIds();
          groupingAction('ungroup', 'nc', elementIds);
        }
        break;

      case 'selByNc':
        if (isGroupable(selectionType, elements)) {
          const elementIds = getIds();
          groupingAction('group', 'nc', elementIds);
        } else {
          const elementIds = getChildrenIds();
          groupingAction('ungroup', 'nc', elementIds);
        }
        break;

      case 'selByStaff':
        if (isGroupable(selectionType, elements)) {
          mergeStaves();
        } else {
          SelectOptions.triggerStaffSplitMode();
        }
        break;

      default:
        console.error(`Can't perform grouping/ungrouping action on selection type ${selectionType}.`);
        return;
    }
  }
};


/**
 * Form and execute a group/ungroup action.
 * @param action - The action to execute. Either "group" or "ungroup".
 * @param groupType - The type of elements to group. Either "neume" or "nc".
 * @param elementIds - The IDs of the elements.
 */
function groupingAction (action: 'group' | 'ungroup', groupType: 'neume' | 'nc', elementIds: string[]): void {
  const editorAction: EditorAction = {
    action: action,
    param: {
      groupType: groupType,
      elementIds: elementIds
    }
  };
  neonView.edit(editorAction, neonView.view.getCurrentPageURI()).then((result) => {
    if (result) {
      if (action === 'group') {
        Notification.queueNotification('Grouping Success', 'success');
      } else {
        Notification.queueNotification('Ungrouping Success', 'success');
      }
    } else {
      if (action === 'group') {
        Notification.queueNotification('Grouping Failed', 'error');
      } else {
        Notification.queueNotification('Ungrouping Failed', 'error');
      }
    }
    neonView.updateForCurrentPage();

    // Prompt user to confirm if Neon does not re cognize contour
    if (groupType === 'nc') {
      const neumeParent = document.getElementById(elementIds[0]).parentElement;
      const ncs = Array.from(neumeParent.children) as SVGGraphicsElement[];
      const contour = neonView.info.getContour(ncs);
      if (contour === undefined) {
        Warnings.groupingNotRecognized();
      }
    }
    endGroupingSelection();
  });
}


/**
 * Determine what action (link/unlink) to perform when user clicks on "Toggle Linked Syllable"
 * Also called when correspinding hotkey is pressed.
 */
function toggleLinkedSyllables() {
  const elementIds = getIds();
  const chainAction: EditorAction = {
    action: 'chain',
    param: []
  };
  const param = new Array<EditorAction>();
  if (document.getElementById(elementIds[0]).getAttribute('mei:precedes')) {
    param.push({
      action: 'set',
      param: {
        elementId: elementIds[0],
        attrType: 'precedes',
        attrValue: ''
      }
    });
    param.push({
      action: 'set',
      param: {
        elementId: elementIds[1],
        attrType: 'follows',
        attrValue: ''
      }
    });
    param.push({
      action: 'setText',
      param: {
        elementId: elementIds[1],
        text: ''
      }
    });
  } else if (document.getElementById(elementIds[0]).getAttribute('mei:follows')) {
    param.push({
      action: 'set',
      param: {
        elementId: elementIds[0],
        attrType: 'follows',
        attrValue: ''
      }
    });
    param.push({
      action: 'set',
      param: {
        elementId: elementIds[1],
        attrType: 'precedes',
        attrValue: ''
      }
    });
    param.push({
      action: 'setText',
      param: {
        elementId: elementIds[0],
        text: ''
      }
    });
  } else {
    // Associate syllables. Will need to find which is first. Use staves.
    const syllable0 = document.getElementById(elementIds[0]);
    const syllable1 = document.getElementById(elementIds[1]);
    const staff0 = syllable0.closest('.staff');
    const staff1 = syllable1.closest('.staff');
    const staffChildren = Array.from(staff0.parentElement.children).filter((elem: HTMLElement) => elem.classList.contains('staff'));

    let firstSyllable, secondSyllable;
    // Determine first syllable comes first by staff
    if (staffChildren.indexOf(staff0) < staffChildren.indexOf(staff1)) {
      firstSyllable = syllable0;
      secondSyllable = syllable1;
    } else {
      firstSyllable = syllable1;
      secondSyllable = syllable0;
    }

    param.push({
      action: 'set',
      param: {
        elementId: firstSyllable.id,
        attrType: 'precedes',
        attrValue: '#' + secondSyllable.id
      }
    });
    param.push({
      action: 'set',
      param: {
        elementId: secondSyllable.id,
        attrType: 'follows',
        attrValue: '#' + firstSyllable.id
      }
    });
    // Delete syl on second syllable
    const syl = secondSyllable.querySelector('.syl');
    if (syl !== null) {
      param.push({
        action: 'remove',
        param: {
          elementId: syl.id
        }
      });
    }
  }
  chainAction.param = param;
  neonView.edit(chainAction, neonView.view.getCurrentPageURI()).then((result) => {
    if (result) {
      Notification.queueNotification('Toggled Syllable Link');
    } else {
      Notification.queueNotification('Failed to Toggle Syllable Link');
    }
    endGroupingSelection();
    neonView.updateForCurrentPage();
  });
}


/**
 * @returns The IDs of selected elements.
 */
function getIds (): string[] {
  const ids = [];
  const elements = Array.from(document.getElementsByClassName('selected'));
  elements.forEach(el => {
    ids.push(el.id);
  });
  return ids;
}


/**
 * @returns The IDs of the selected elements' children.
 */
function getChildrenIds (): string[] {
  const childrenIds = [];
  const elements = Array.from(document.getElementsByClassName('selected'));
  elements.forEach(el => {
    if (el.classList.contains('divLine') || el.classList.contains('accid') || el.classList.contains('clef')) {
      return;
    }
    const children = Array.from(el.children);
    children.forEach(ch => {
      childrenIds.push(ch.id);
    });
  });
  return childrenIds;
}
