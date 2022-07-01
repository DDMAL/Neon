let saved = true;

function updateIndicator (): void {
  const indicator = document.querySelector<HTMLDivElement>('#file-saved');
  indicator.style.display = saved ? 'none' : 'block';
}

export function setSavedStatus (status = false): void {
  saved = status;
  updateIndicator();
}
