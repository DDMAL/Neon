// Exported functions:
function push(): void {
  console.log('todo');
}

function pop(): void {
  console.log('todo');
}


function compare(oldMEI: string, newMEI: string): boolean {
  const parser = new DOMParser();
  const old = parser.parseFromString(oldMEI, 'text/xml').documentElement;
  const inc = parser.parseFromString(newMEI, 'text/xml').documentElement;

  return false;
}

// Helper functions:

type Edit = {
  type: 'add' | 'delete' | 'edit',
  id: string,
  swap: [string, string]
};

/**
 * DFS: Returns an array of the different children
 * 
 * It is assumed that `old` and `inc` have the same ID (or are the unique <body> / <music> tags)
 */
function dfs(old: Element, inc: Element): Edit[] {
  // Base cases:
  if (!old || !inc) return [];

  // If leaf
  if (isLeaf(old) && isLeaf(inc)) {
    return [{
      type: 'edit',
      id: inc.getAttribute('xml:id'),
      swap: [old.outerHTML, inc.outerHTML]
    }]
  }

  // Inductive case:
  const actions: Edit[] = [];

  if (!hasSameAttrs(old, inc)) {
    actions.push({
      type: 'edit',
      id: inc.getAttribute('xml:id'),
      swap: [old.outerHTML, inc.outerHTML]
    });
  }

  const olds = toSet(old.children);
  const incs = toSet(inc.children);

  const test = intersection(olds, incs).flatMap(([e1, e2]) => dfs(e1, e2));

  const deleted = exclude(olds, incs);
  const added = exclude(incs, olds);

  return actions;
}

// Helper Functions:
const isLeaf = (el: Element) => el.children.length === 0;
const hasSameAttrs = (e1: Element, e2: Element) => JSON.stringify(e1.attributes) === JSON.stringify(e2.attributes);
const toSet = (els: HTMLCollection) => new Map(
  Array
    .from(els)
    .map(e => [e.id === "" ? e.tagName : e.id, e])
);
const intersection = (m1: Map<string, Element>, m2: Map<string, Element>): Array<[Element, Element]> => {
  return Array
    .from(m1)
    .filter(([key]) => m2.has(key))
    .map(([key, el]) => [el, m2.get(key)]);
}
const exclude = (existing: Map<string, Element>, toCheck: Map<string, Element>) => {
  return Array
    .from(toCheck)
    .filter(([key]) => !existing.has(key))
    .map(([_, el]) => el);
}

function deepCompare(old: Element, inc: Element): Element[] {
  if (!old || !inc) return [];

  const getMap = (els: HTMLCollection) => new Map(
    Array
      .from(els)
      .map(e => [e.id === "" ? e.tagName : e.id, e])
  );

  const ch1 = getMap(old.children);
  const ch2 = getMap(inc.children);
  
  const intersection = new Set(
    Array.from(ch1).filter(([key]) => ch2.has(key))
  );

  const a = Array.from(old.attributes)

  const exclude = (els: Map<string, Element>) => Array
    .from(els)
    .filter(key => !intersection.has(key))
    .map(([_, el]) => el);

  const symDiff1 = exclude(ch1);
  const symDiff2 = exclude(ch2);

  return symDiff1.concat(symDiff2);
}

export default { push, pop, compare };
