import * as Notification from './Notification';
import NeonView from '../NeonView';
import { convertStaffToSb } from './ConvertMei';
import { EditorAction } from '../Types';

/**
 * Set listener on switching EditMode button to File dropdown in the navbar.
 */
export function initNavbar (neonView: NeonView): void {
  // setup navbar listeners
  const navbarDropdowns = document.querySelectorAll('.navbar-item.has-dropdown.is-hoverable');
  Array.from(navbarDropdowns).forEach((dropDown) => {
    dropDown.addEventListener('mouseover', () => {
      //
    });
  });



  document.getElementById('save').addEventListener('click', () => {
    neonView.save().then(() => {
      Notification.queueNotification('Saved', 'success');
    });
  });
  document.body.addEventListener('keydown', (evt) => {
    if (evt.key === 's') {
      neonView.save().then(() => {
        Notification.queueNotification('Saved', 'success');
      });
    }
  });

  document.getElementById('export').addEventListener('click', () => {
    neonView.export().then(manifest => {
      const link: HTMLAnchorElement = document.createElement('a');
      link.href = manifest as string;
      link.download = neonView.name + '.jsonld';
      document.body.appendChild(link);
      link.click();
      link.remove();
      Notification.queueNotification('Saved', 'success');
    });
  });

  // Download link for MEI
  // Is an actual file with a valid URI except in local mode where it must be generated.
  document.getElementById('getmei').addEventListener('click', () => {
    const uri = neonView.view.getCurrentPageURI();
    neonView.getPageMEI(uri).then(mei => {
      const data = 'data:application/mei+xml;base64,' + window.btoa(convertStaffToSb(mei));
      document.getElementById('getmei').setAttribute('href', data);
      document.getElementById('getmei').setAttribute('download', neonView.view.getPageName() + '.mei');
    });
  });


  // Event listener for "Remove Empty Syllables" button inside "MEI Actions" dropdown
  document.getElementById('remove-empty-syls').addEventListener('click', function() {
    const uri = neonView.view.getCurrentPageURI();

    neonView.getPageMEI(uri).then(meiString => {
      const parser = new DOMParser();
      const meiDoc = parser.parseFromString(meiString, 'text/xml');
      const mei = meiDoc.documentElement;
      const syllables = Array.from(mei.getElementsByTagName('syllable'));

      // Check for syllables without neumes
      let hasEmptySyllables = false;
      const removeSyllableActions = [];
      for (const syllable of syllables) {
        // if empty syllable found, create action object for removing it
        if (syllable.getElementsByTagName('neume').length === 0) {
          const toRemove: EditorAction = {
            action: 'remove',
            param: {
              elementId: syllable.getAttribute('xml:id')
            }
          };
          // add action object to array (chain) of action objects
          removeSyllableActions.push(toRemove);
          hasEmptySyllables = true;
        }
      }

      // check if empty syllables were found
      if (!hasEmptySyllables) {
        Notification.queueNotification('No empty syllables found');
      }
      else {
        // create "chain action" object
        const chainRemoveAction: EditorAction = {
          action: 'chain',
          param: removeSyllableActions
        };

        // execute action that removes all empty syllables
        // "result" value is true or false (true if chain of actions was successful)
        neonView.edit(chainRemoveAction, uri).then((result) => {
          if (result) {
            neonView.updateForCurrentPage();
            Notification.queueNotification('Removed empty Syllables', 'success');
          }
          else {
            Notification.queueNotification('Failed to remove empty Syllables', 'error');
          }
        });
      }
    });
  });

  // Event listener for "Remove Empty Neumes" button inside "MEI Actions" dropdown
  document.getElementById('remove-empty-neumes').addEventListener('click', function() {
    const uri = neonView.view.getCurrentPageURI();

    neonView.getPageMEI(uri).then(meiString => {
      const parser = new DOMParser();
      const meiDoc = parser.parseFromString(meiString, 'text/xml');
      const mei = meiDoc.documentElement;
      const neumes = Array.from(mei.getElementsByTagName('neume'));

      // Check for neumes without neume components
      let hasEmptyNeumes = false;
      const removeNeumeActions = [];
      for (const neume of neumes) {
        // if empty neume found, create action object for removing it
        if (neume.getElementsByTagName('nc').length === 0) {
          const toRemove: EditorAction = {
            action: 'remove',
            param: {
              elementId: neume.getAttribute('xml:id')
            }
          };
          // add action object to array (chain) of action objects
          removeNeumeActions.push(toRemove);
          hasEmptyNeumes = true;
        }
      }

      // check if empty neumes were found
      if (!hasEmptyNeumes) {
        Notification.queueNotification('No empty Neumes found');
      }
      else {
        // create "chain action" object
        const chainRemoveAction: EditorAction = {
          action: 'chain',
          param: removeNeumeActions,
        };

        // execute action that removes all empty neumes
        // "result" value is true or false (true if chain of actions was successful)
        neonView.edit(chainRemoveAction, uri).then((result) => {
          if (result) {
            neonView.updateForCurrentPage();
            Notification.queueNotification('Removed empty Neumes', 'success');
          }
          else {
            Notification.queueNotification('Failed to remove empty Neumes', 'error');
          }
        });
      }
    });
  });

  // Event listener for "Revert" button inside "MEI Actions" dropdown
  document.getElementById('revert').addEventListener('click', function () {
    if (window.confirm('Reverting will cause all changes to be lost. Press OK to continue.')) {
      neonView.deleteDb().then(() => {
        window.location.reload();
      });
    }
  });
}

/**
 * Initialize the undo/redo panel
 */
export function initUndoRedoPanel (neonView: NeonView): void {
  /**
   * Tries to undo an action and update the page if it succeeds.
   */
  function undoHandler (): void {
    neonView.undo().then((result: boolean) => {
      if (result) {
        neonView.updateForCurrentPage();
      } else {
        console.error('Failed to undo action');
      }
    });
  }

  /**
   * Tries to redo an action and update the page if it succeeds.
   */
  function redoHandler (): void {
    neonView.redo().then((result: boolean) => {
      if (result) {
        neonView.updateForCurrentPage();
      } else {
        console.error('Failed to redo action');
      }
    });
  }

  document.getElementById('undo').addEventListener('click', undoHandler);
  document.body.addEventListener('keydown', (evt) => {
    if (evt.key === 'z' && (evt.ctrlKey || evt.metaKey)) {
      undoHandler();
    }
  });

  document.getElementById('redo').addEventListener('click', redoHandler);
  document.body.addEventListener('keydown', (evt) => {
    if ((evt.key === 'Z' || (evt.key === 'z' && evt.shiftKey)) && (evt.ctrlKey || evt.metaKey)) {
      redoHandler();
    }
  });
}