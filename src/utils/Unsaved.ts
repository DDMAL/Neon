
// when page first loads, show default icon (saved)
let saved = true;
const indicator = document.querySelector<HTMLDivElement>('#file-saved');
indicator.setAttribute('src', `${__ASSET_PREFIX__}assets/img/saved-icon.svg`);


/**
 * Update status of saved status indicator
 */
function updateIndicator (): void {
  const path = saved? `${__ASSET_PREFIX__}assets/img/saved-icon.svg` : `${__ASSET_PREFIX__}assets/img/unsaved-icon.svg`;
  indicator.setAttribute('src', path);
}


/**
 * Set the saved status of the folio
 * 
 * @param status boolean value. true if status is "saved", false if "not saved"
 */
export function setSavedStatus (status: boolean = false): void {
  saved = status;
  updateIndicator();
}


/**
 * Function that defines event listener that checks for unsaved changes on page reload
 */
export function listenUnsavedChanges (): void {
  window.onbeforeunload = (e: BeforeUnloadEvent) => {
    if (!saved) {
      e.preventDefault();
      return 'You have unsaved changes!';
    }
  };
}