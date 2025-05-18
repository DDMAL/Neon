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
export function initNeonView(view: NeonView): void {
  neonView = view;
}

/**
 * Check if selected elements can be grouped or not
 * @returns true if can be grouped, false otherwise
 */
export function isGroupable(
  selectionType: string,
  elements: Array<SVGGraphicsElement>,
): boolean {
  const groups = Array.from(elements.values()) as SVGGraphicsElement[];

  if (groups.length < 2) {
    // cannot group if only 1 element is selected
    return false;
  }

  switch (selectionType) {
    case 'selByNeume':
      // if neumes are in same syllable, don't display grouping option
      if (SelectTools.sharedLogicalParent(selectionType, elements))
        return false;

    default:
      // check if all selected elements are adjacent to each other
      if (SelectTools.areAdjacent(selectionType, elements)) {
        return true;
      } else {
        return false;
      }
  }
}

export function containsLinked(
  selectionType: string,
  elements?: Array<SVGGraphicsElement>,
): boolean {
  if (!elements) {
    elements = Array.from(
      document.querySelectorAll('.selected'),
    ) as SVGGraphicsElement[];
  }
  switch (selectionType) {
    case 'selBySyllable':
      for (const element of elements) {
        if (
          element.hasAttribute('data-follows') ||
          element.hasAttribute('data-precedes')
        ) {
          Notification.queueNotification(
            'The action involves linked syllables, please untoggle them first',
            'warning',
          );
          return true;
        }
      }
      return false;

    case 'selByNeume':
      for (const element of elements) {
        if (
          element.parentElement.hasAttribute('data-follows') ||
          element.parentElement.hasAttribute('data-precedes')
        ) {
          Notification.queueNotification(
            'The action involves linked syllables, please untoggle them first',
            'warning',
          );
          return true;
        }
      }
      return false;

    case 'selByNc':
      for (const element of elements) {
        if (
          element.parentElement.parentElement.hasAttribute('data-follows') ||
          element.parentElement.parentElement.hasAttribute('data-precedes')
        ) {
          Notification.queueNotification(
            'The action involves linked syllables, please untoggle them first',
            'warning',
          );
          return true;
        }
      }
      return false;
  }
}

function hasInvalidLinkedSyllable(
  elements: Array<SVGGraphicsElement>,
): boolean {
  // Sort elements based on their order in the DOM
  elements.sort((a, b) => {
    if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) {
      return -1;
    } else if (
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING
    ) {
      return 1;
    }
    return 0;
  });

  for (let idx = 0; idx < elements.length; idx++) {
    const syllable = elements.at(idx);
    if (syllable.hasAttribute('data-precedes')) {
      // Get xml:id of the next syllable (without the #, if it exists)
      const nextSyllableId = syllable
        .getAttribute('data-precedes')
        .replace('#', '');

      // Find the next syllable and its index in the array
      let nextSyllableIdx: number;
      const nextSyllable = elements.find((element, idx) => {
        if (element.id === nextSyllableId) {
          nextSyllableIdx = idx;
          return true;
        }

        return false;
      });

      // Condition 1: The next (following) syllable cannot be found
      if (!nextSyllable) {
        return true;
      }

      // Condition 2: The next syllable has been found, but the @follows attribute does NOT EXIST
      if (!nextSyllable.hasAttribute('data-follows')) {
        return true;
      }

      // Condition 3: The next syllable's @follows attribute exists, but it is not in the correct format #id
      if (nextSyllable.getAttribute('data-follows') != '#' + syllable.id) {
        return true;
      }

      // Condition 4:
      // Since the @follows value is correct, a pair of syllables exist for the toggle-linked syllable.
      // Check if the @follows syllable is the next syllable (index-wise) in the array:
      if (nextSyllableIdx !== idx + 1) {
        return true;
      }
    }
    if (syllable.hasAttribute('data-follows')) {
      const prevSyllableId = syllable
        .getAttribute('data-follows')
        .replace('#', '');
      const prevSyllable = elements.find(
        (syllable) => syllable.id === prevSyllableId,
      );

      // Condition 1: The previous syllable does not exist
      if (!prevSyllable) {
        return true;
      }

      // Condition 2: The previous syllable exists, but the @precedes attribute does NOT EXIST
      if (!prevSyllable.hasAttribute('data-precedes')) {
        return true;
      }

      // Condition 3: The previous syllable's @precedes attribute exists, but it is not in the correct format #id
      if (prevSyllable.getAttribute('data-precedes') != '#' + syllable.id) {
        return true;
      }
    }

    return false;
  }
}

/**
 * Checks to see is a selection of elements is already linked
 * @param elements elements to be considered
 * @returns true is linked, false otherwise
 */
export function isLinked(elements: Array<SVGGraphicsElement>): boolean {
  // every element should be linked
  for (const element of elements) {
    if (
      !element.hasAttribute('data-precedes') &&
      !element.hasAttribute('data-follows')
    )
      return false;
  }
  return true;
}

/**
 * Assuming all elements are valid,
 * check if the elements can be linked:
 * 1. sort elements based on their order in the DOM
 * 2. ensure elements are adjacent in the DOM
 * 3. ensure elements belong to adjacent staves
 * 4. check if can be linked:
 *    4.1 if exactly two elements, both needs to be unlinked
 *    4.2 if more than two elements, only one element can be unlinked,
 *        at either beginning or end of the sequence
 * @param elements elements to be considered
 * @returns true can be linked
 */
export function canBeLinked(elements: Array<SVGGraphicsElement>): boolean {
  // 1. Sort elements based on their order in the DOM
  elements.sort((a, b) => {
    const staffA = a.closest('.staff');
    const staffB = b.closest('.staff');
    return staffA.compareDocumentPosition(staffB) &
      Node.DOCUMENT_POSITION_FOLLOWING
      ? -1
      : 1;
  });

  const staves = Array.from(document.querySelectorAll('.staff'));
  const syllables = Array.from(document.querySelectorAll('.syllable'));

  // 2. Ensure syllables are adjacent in the DOM
  for (let i = 0; i < elements.length - 1; i++) {
    const current = elements[i];
    const next = elements[i + 1];
    const currentSyllableIndex = syllables.indexOf(current);
    const nextSyllableIndex = syllables.indexOf(next);
    if (nextSyllableIndex - currentSyllableIndex !== 1) {
      return false; // Staves must be adjacent
    }
    // 3. Ensure syllables belong to adjacent staves
    const currentStaff = current.closest('.staff');
    const nextStaff = next.closest('.staff');

    const currentStaffIndex = staves.indexOf(currentStaff as HTMLElement);
    const nextStaffIndex = staves.indexOf(nextStaff as HTMLElement);
    if (nextStaffIndex - currentStaffIndex !== 1) {
      return false; // Staves must be adjacent
    }
  }

  // 4.1 Handle case for exactly two syllables
  if (elements.length === 2) {
    return elements.every(
      (element) =>
        !element.hasAttribute('data-precedes') &&
        !element.hasAttribute('data-follows'),
    );
  }

  // 4.2 Handle case for more than two syllables
  const unlinkedElements = elements.filter(
    (element) =>
      !element.hasAttribute('data-precedes') &&
      !element.hasAttribute('data-follows'),
  );

  if (unlinkedElements.length !== 1) {
    return false; // Only one unlinked syllable is allowed
  }

  // The unlinked syllable should be at the beginning or end
  const firstUnlinked = unlinkedElements[0];

  return (
    elements.indexOf(firstUnlinked) === 0 ||
    elements.indexOf(firstUnlinked) === elements.length - 1
  );
}

/**
 * Check if the selected elements can be linked or unlikned.
 * @param selectionType Current selection mode. Only certain elements can be linked
 * @param elements The elements under question
 * @returns true if user should be able to link or un-link elements, false otherwise
 */
export function isLinkable(
  selectionType: string,
  elements: Array<SVGGraphicsElement>,
): boolean {
  // cannot toggle link for syllable selection if number of selected
  // syllables is smaller than 2
  if (elements.length < 2) {
    return false;
  }

  // only Syllables can be linked or unlinked (?)
  if (selectionType !== 'selBySyllable') return false;

  // Check if has invalid linked syllables
  if (hasInvalidLinkedSyllable(elements)) {
    Notification.queueNotification(
      'The selected syllables include invalid linked syllable(s)!',
      'warning',
    );
    return false;
  }

  // if ALREADY linked
  if (isLinked(elements)) {
    return true;
  }
  // if CAN be linked
  else if (canBeLinked(elements)) {
    return true;
  }

  return false;
}

/**
 * Merge selected staves
 */
export function mergeStaves(): void {
  const systems = document.querySelectorAll('.staff.selected');
  const elementIds = [];
  systems.forEach((staff) => {
    elementIds.push(staff.id);
  });
  const editorAction: EditorAction = {
    action: 'merge',
    param: {
      elementIds: elementIds,
    },
  };
  neonView
    .edit(editorAction, neonView.view.getCurrentPageURI())
    .then((result) => {
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
export function triggerGrouping(type: string): void {
  const moreEdit = document.getElementById('moreEdit');
  moreEdit.parentElement.classList.remove('hidden');
  moreEdit.innerHTML += Contents.groupingMenu[type];
  initGroupingListeners();
}

/**
 * Remove the grouping selection menu.
 */
export function endGroupingSelection(): void {
  const moreEdit = document.getElementById('moreEdit');
  moreEdit.innerHTML = '';
  moreEdit.parentElement.classList.add('hidden');
  document.body.removeEventListener('keydown', deleteButtonHandler);
  document.body.removeEventListener('keydown', keydownListener);
}

/**
 * The grouping dropdown listener.
 */
export function initGroupingListeners(): void {
  const del = document.getElementById('delete');
  del.removeEventListener('click', removeHandler);
  del.addEventListener('click', removeHandler);
  document.body.addEventListener('keydown', deleteButtonHandler);
  document.body.addEventListener('keydown', keydownListener);

  try {
    document.getElementById('mergeSyls').addEventListener('click', () => {
      if (containsLinked(SelectTools.getSelectionType())) return;
      const elementIds = getChildrenIds().filter((e) =>
        document.getElementById(e).classList.contains('neume'),
      );
      groupingAction('group', 'neume', elementIds);
    });
  } catch (e) {}

  try {
    document.getElementById('groupNeumes').addEventListener('click', () => {
      if (containsLinked(SelectTools.getSelectionType())) return;
      const elementIds = getIds().filter((e) =>
        document.getElementById(e).classList.contains('neume'),
      );
      groupingAction('group', 'neume', elementIds);
    });
  } catch (e) {}

  try {
    document.getElementById('groupNcs').addEventListener('click', () => {
      const elementIds = getIds().filter((e) =>
        document.getElementById(e).classList.contains('nc'),
      );
      groupingAction('group', 'nc', elementIds);
    });
  } catch (e) {}

  try {
    document.getElementById('ungroupNeumes').addEventListener('click', () => {
      const elementIds = getChildrenIds().filter((e) =>
        document.getElementById(e).classList.contains('neume'),
      );
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
    document
      .getElementById('toggle-ligature')
      .addEventListener('click', async () => {
        const elementIds = getIds();

        const editorAction: ToggleLigatureAction = {
          action: 'toggleLigature',
          param: {
            elementIds: elementIds,
          },
        };
        neonView
          .edit(editorAction, neonView.view.getCurrentPageURI())
          .then((result) => {
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
const keydownListener = function (e) {
  if (e.key === 'g') {
    // get selected elements to check if they can be groupeds
    const elements = Array.from(
      document.querySelectorAll('.selected'),
    ) as SVGGraphicsElement[];
    if (elements.length == 0) return;

    const selectionType = SelectTools.getSelectionType();

    if (containsLinked(selectionType, elements)) return;

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
          const elementIds = getChildrenIds().filter((e) =>
            document.getElementById(e).classList.contains('neume'),
          );
          groupingAction('group', 'neume', elementIds);
        }
        // can only ungroup if length is 1 (one syllable selected)
        // cannot ungroup if multiple syllables are selected
        else if (elements.length === 1) {
          const elementIds = getChildrenIds().filter((e) =>
            document.getElementById(e).classList.contains('neume'),
          );
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
        console.error(
          `Can't perform grouping/ungrouping action on selection type ${selectionType}.`,
        );
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
function groupingAction(
  action: 'group' | 'ungroup',
  groupType: 'neume' | 'nc',
  elementIds: string[],
): void {
  if (elementIds.length <= 1) {
    Notification.queueNotification(
      `Cannot ${action} with less than 2 ${groupType}s`,
      'error',
    );
    return;
  }

  const editorAction: EditorAction = {
    action: action,
    param: {
      groupType: groupType,
      elementIds: elementIds,
    },
  };
  neonView
    .edit(editorAction, neonView.view.getCurrentPageURI())
    .then((result) => {
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
        const neumeParent = document.getElementById(
          elementIds[0],
        ).parentElement;
        const ncs = Array.from(neumeParent.children) as SVGGraphicsElement[];
        const contour = neonView.info.getContour(ncs);
        if (contour === undefined) {
          Warnings.groupingNotRecognized();
        }
      }
      endGroupingSelection();
    });
}

function unlink(elementIds: string[]): Array<EditorAction> {
  const param = new Array<EditorAction>();
  for (const id of elementIds) {
    const element = document.getElementById(id);
    if (element.getAttribute('data-precedes')) {
      param.push({
        action: 'set',
        param: {
          elementId: id,
          attrType: 'precedes',
          attrValue: '',
        },
      });
    }
    if (element.getAttribute('data-follows')) {
      param.push({
        action: 'set',
        param: {
          elementId: id,
          attrType: 'follows',
          attrValue: '',
        },
      });
      param.push({
        action: 'setText',
        param: {
          elementId: id,
          text: '',
        },
      });
    }
  }

  return param;
}

// Utility function to get an element by ID and ensure it's an SVGGraphicsElement
function getSVGGraphicsElementById(id: string): SVGGraphicsElement | null {
  const element = document.getElementById(id);
  if (element instanceof SVGGraphicsElement) {
    return element;
  }
  return null;
}

function getToggleSyllableIds(
  elements: Array<SVGGraphicsElement>,
): [SVGGraphicsElement, SVGGraphicsElement] {
  // Sort elements based on their order in the DOM
  elements.sort((a, b) => {
    const staffA = a.closest('.staff');
    const staffB = b.closest('.staff');
    return staffA.compareDocumentPosition(staffB) &
      Node.DOCUMENT_POSITION_FOLLOWING
      ? -1
      : 1;
  });

  if (elements.length === 2) {
    return [elements[0], elements[1]];
  }

  const unlinkedElement = elements.find(
    (el) =>
      !el.hasAttribute('data-precedes') && !el.hasAttribute('data-follows'),
  );

  if (unlinkedElement) {
    const index = elements.indexOf(unlinkedElement);

    if (index === 0) {
      return [elements[index], elements[index + 1]];
    } else if (index === elements.length - 1) {
      return [elements[index - 1], elements[index]];
    }
  }
}

/**
 * Determine what action (link/unlink) to perform when user clicks on "Toggle Linked Syllable"
 * Also called when correspinding hotkey is pressed.
 */
function toggleLinkedSyllables() {
  const elementIds = getIds();
  const chainAction: EditorAction = {
    action: 'chain',
    param: [],
  };
  const param = new Array<EditorAction>();

  const elements = elementIds
    .map(getSVGGraphicsElementById) // Map IDs to SVGGraphicsElement or null
    .filter((el): el is SVGGraphicsElement => el !== null);

  if (isLinked(elements)) {
    param.push(...unlink(elementIds));
  } else {
    const [firstSyllable, secondSyllable] = getToggleSyllableIds(elements);
    console.log(firstSyllable.id, secondSyllable.id);
    param.push({
      action: 'set',
      param: {
        elementId: firstSyllable.id,
        attrType: 'precedes',
        attrValue: '#' + secondSyllable.id,
      },
    });
    param.push({
      action: 'set',
      param: {
        elementId: secondSyllable.id,
        attrType: 'follows',
        attrValue: '#' + firstSyllable.id,
      },
    });
    // Delete syl on second syllable
    const syl = secondSyllable.querySelector('.syl');
    if (syl !== null) {
      param.push({
        action: 'remove',
        param: {
          elementId: syl.id,
        },
      });
    }
  }

  chainAction.param = param;
  neonView
    .edit(chainAction, neonView.view.getCurrentPageURI())
    .then((result) => {
      if (result) {
        Notification.queueNotification('Toggled Syllable Link', 'success');
      } else {
        Notification.queueNotification(
          'Failed to Toggle Syllable Link',
          'error',
        );
      }
      endGroupingSelection();
      neonView.updateForCurrentPage();
    });
}

/**
 * @returns The IDs of selected elements.
 */
function getIds(): string[] {
  const ids = [];
  const elements = Array.from(document.getElementsByClassName('selected'));
  elements.forEach((el) => {
    ids.push(el.id);
  });
  return ids;
}

/**
 * @returns The IDs of the selected elements' children.
 */
function getChildrenIds(): string[] {
  const childrenIds = [];
  const elements = Array.from(document.getElementsByClassName('selected'));
  elements.forEach((el) => {
    if (
      el.classList.contains('divLine') ||
      el.classList.contains('accid') ||
      el.classList.contains('clef')
    ) {
      return;
    }
    const children = Array.from(el.children);
    children.forEach((ch) => {
      childrenIds.push(ch.id);
    });
  });
  return childrenIds;
}
