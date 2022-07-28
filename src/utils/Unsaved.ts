let saved = true;

function updateIndicator (): void {
  const indicator = document.querySelector<HTMLDivElement>('#file-saved');
  const path = saved? '/Neon/assets/img/saved-icon.svg' : '/Neon/assets/img/unsaved-icon.svg';
  indicator.setAttribute('src', path);
}

export function setSavedStatus (status = false): void {
  saved = status;
  updateIndicator();
}

export function listenUnsavedChanges (): void {
  window.onbeforeunload = (e: BeforeUnloadEvent) => {
    if (!saved) {
      e.preventDefault();
      return 'You have unsaved changes!';
    }
  };
}