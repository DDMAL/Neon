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

  console.log(dfs(old, inc));

  return false;
}

// Helper functions:

type Edit = {
  type: 'add' | 'delete' | 'edit',
  id: string,
  elements: string[]
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
    if (
      (old.textContent !== '' && inc.textContent !== old.textContent) ||
      !hasSameAttrs(old, inc)
    )
      return [{
        type: 'edit',
        id: inc.getAttribute('xml:id'),
        elements: [old.outerHTML, inc.outerHTML]
      }];

    return [];
  }

  // Inductive case:
  const actions: Edit[] = [];

  if (!hasSameAttrs(old, inc)) {
    actions.push({
      type: 'edit',
      id: inc.getAttribute('xml:id'),
      elements: [old.outerHTML, inc.outerHTML]
    });
  }

  const olds = toSet(old.children);
  const incs = toSet(inc.children);

  const grandchildren = intersection(olds, incs).flatMap(([e1, e2]) => dfs(e1, e2));

  const toDelete = exclude(olds, incs);
  const toAdd = exclude(incs, olds);
  const deleteActions: Edit[] = toDelete.map(el => {
    return {
      type: 'delete',
      id: inc.getAttribute('xml:id'),
      elements: [el.outerHTML]
    };
  });
  const addActions: Edit[] = toAdd.map(el => {
    return {
      type: 'add',
      id: inc.getAttribute('xml:id'),
      elements: [el.outerHTML]
    };
  });

  return actions
    .concat(grandchildren)
    .concat(deleteActions)
    .concat(addActions);
}

// Helper Functions:
const isLeaf = (el: Element) => el.children.length === 0;
const attrs = (el: Element) => {
  return el.getAttributeNames().reduce((acc, name) => {
    return { ...acc, [name]: el.getAttribute(name) };
  }, {});
};
const hasSameAttrs = (e1: Element, e2: Element) => JSON.stringify(attrs(e1)) === JSON.stringify(attrs(e2));
const toSet = (els: HTMLCollection) => new Map(
  Array
    .from(els)
    .map(e => [!e.getAttribute('xml:id') ? e.tagName : e.getAttribute('xml:id'), e])
);

const intersection = (m1: Map<string, Element>, m2: Map<string, Element>): Array<[Element, Element]> => {
  return Array
    .from(m1)
    .filter(([key, _]) => m2.has(key))
    .map(([key, el]) => [el, m2.get(key)]);
};

const exclude = (toCheck: Map<string, Element>, existing: Map<string, Element>) => {
  return Array
    .from(toCheck)
    .filter(([key, _]) => !existing.has(key))
    .map(([_, el]) => el);
};

export default { push, pop, compare };
