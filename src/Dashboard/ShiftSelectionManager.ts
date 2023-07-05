export default class shiftSelectionManager {
  private start: number;
  private end: number;
  private prevSelection: number[] = [];

  public constructor() {
    this.reset();
  }

  public setStart(start: number) {
    this.reset();
    this.start = Math.max(start, 0);
  }

  public setEnd(end: number) {
    this.end = end;
  }

  public reset() {
    this.start = 0;
    this.end = -1;
    this.prevSelection.splice(0);
  }

  public getPrevSelection() {
    return this.prevSelection;
  }

  public getSelection(orderedSelection: boolean[]): number[] {
    let start: number;
    let end: number;

    if (this.end === -1) {
      return [];
    }
    if (this.end < this.start) {
      start = this.end;
      end = this.start + 1;
    }
    else {
      start = this.start;
      end = this.end + 1;
    }
    const range = Array.from({ length: (end - start) }, (v, k) => k + start);

    // For each shift selection action: if the Shift key is still held, the end shift pos can change
    // with the previously (before-shift) selected elements still selected while the current shift selections unselect.
    const specificSelection = range.filter(idx => !(orderedSelection[idx]));
    this.prevSelection = specificSelection;
    return specificSelection;
  }
}