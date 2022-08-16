// `Unsaved.ts`
// Module that handles all logic about unsaved changes
//
// Initial saved status
let saved = true;

/**
 * Update status of saved status indicator
 */
function updateIndicator(): void {
  const indicator = document.querySelector<HTMLDivElement>('#file-saved');
  const path = saved ? `${__ASSET_PREFIX__}assets/img/saved-icon.svg` : `${__ASSET_PREFIX__}assets/img/unsaved-icon.svg`;
  indicator.setAttribute('src', path);
}


/**
 * Set the saved status of the folio
 * 
 * @param status boolean value. true if status is "saved", false if "not saved"
 */
export function setSavedStatus(status = false): void {
  saved = status;
  updateIndicator();
}


/**
 * Function that defines event listener that checks for unsaved changes on page reload
 */
function init(): void {
  window.onbeforeunload = (e: BeforeUnloadEvent) => {
    if (!saved) {
      e.preventDefault();
      return 'You have unsaved changes!';
    }
  };
}

export default { init, setSavedStatus };
