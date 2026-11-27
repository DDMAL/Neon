/**
 * Editing handles (resize circles, rotate diamonds, dashed frame) keep a
 * constant CSS size, set by the "Editing handle size" slider.
 * https://github.com/DDMAL/Neon/issues/1392
 *
 * Handles are UI only: they never block a valid staff move, while real
 * content leaving the page still does.
 * https://github.com/DDMAL/Neon/issues/1409
 *
 * Sizes are measured on screen (getBoundingClientRect / screen CTM), and
 * edits are checked in the exported MEI, never only in internal values.
 */

import {
  clearNeonDb,
  expectSameContent,
  meiContent,
  readMei,
  staffZone,
} from '../support/neon-mei';

/** Default handle size: resize-circle radius in CSS px. */
const DEFAULT_SIZE = 6;

type Page = {
  name: string;
  manifest: string;
  notation: string;
  /** Scale the MEI surface and zones by this factor (default 1). */
  scale?: number;
};

const PAGES: Page[] = [
  // MEI surface 4872 x 6496, Square
  { name: 'normal page', manifest: 'test', notation: 'Square' },
  // Same surface size (only the JPEG is smaller), Hufnagel
  { name: 'Hufnagel page', manifest: 'St_Gall_022r_one_staff', notation: 'Hufnagel' },
  // MEI surface 7758 x 9853, Square
  { name: 'large page', manifest: 'CDN-Hsmu_M2149.L4_001r', notation: 'Square' },
  // Surface 487 x 650: the "ten times smaller image" of #1392 / #1409.
  { name: 'small page', manifest: 'test', notation: 'Square', scale: 0.1 },
  { name: 'small Hufnagel page', manifest: 'St_Gall_022r_one_staff', notation: 'Hufnagel', scale: 0.1 },
];

/**
 * Serve the page's MEI with its surface and every zone scaled by `factor`,
 * the way a transcription of a much smaller image would look. Nothing on
 * disk changes.
 */
function scaleMeiOnLoad(manifest: string, factor: number): void {
  // An earlier spec may have left the original MEI in the HTTP cache, in
  // which case the browser never asks for it and the intercept never runs.
  cy.then(() =>
    Cypress.automation('remote:debugger:protocol', {
      command: 'Network.clearBrowserCache',
    }),
  );
  cy.intercept('GET', `**/samples/mei/${manifest}.mei`, (req) => {
    req.continue((res) => {
      // Never let the scaled copy be reused by another test.
      res.headers['cache-control'] = 'no-store';
      res.body = String(res.body).replace(
        /\b(ulx|uly|lrx|lry)="(-?\d+(?:\.\d+)?)"/g,
        (_m, attr: string, value: string) =>
          `${attr}="${Math.round(Number(value) * factor)}"`,
      );
    });
  });
}

function openPage(page: Page): void {
  if (page.scale) scaleMeiOnLoad(page.manifest, page.scale);
  cy.visitEditor(`/editor.html?manifest=${page.manifest}`);
  if (page.scale) {
    // Both samples used here have a 4872-unit-wide surface.
    cy.get('#bgimg').should(
      'have.attr',
      'width',
      String(Math.round(4872 * page.scale)),
    );
  }
}

/** Set the editor zoom the way the zoom slider does. */
function zoomTo(percent: number): void {
  cy.get('#zoomSlider').then(($slider) => {
    ($slider[0] as HTMLInputElement).value = String(percent);
    $slider[0].dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  });
}

function setHandleSize(size: number): void {
  cy.get('#handleSizeSlider')
    .invoke('val', size)
    .trigger('input');
  cy.get('#handleSizeOutput').should('have.value', String(size));
}

function selectFirstStaff(): void {
  cy.clickAndExpectClass('#selByStaff', 'is-active');
  cy.clickStaff('.staff');
  cy.get('.staff').first().should('have.class', 'selected');
  cy.get('#rotateLeft').should('exist');
}

type Metrics = {
  circle: number;
  circleStroke: number;
  diamondW: number;
  diamondH: number;
  diamondOffsetX: number;
  diamondOffsetY: number;
  diamondStroke: number;
  frameStroke: number;
  dash: number[];
  /** Distance between the Left circle centre and the frame's left midpoint. */
  anchorError: number;
};

function centre(r: DOMRect): { x: number; y: number } {
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
}

/** Measure the handles of the selected staff on screen, in CSS px. */
function measure(doc: Document): Metrics {
  const circle = doc.querySelector<SVGCircleElement>('#p-Left');
  const diamond = doc.querySelector<SVGPolygonElement>('#rotateLeft');
  const frame = doc.querySelector<SVGPolygonElement>('#resizeRect');
  const c = circle.getBoundingClientRect();
  const d = diamond.getBoundingClientRect();
  const scale = (el: SVGGraphicsElement): number => el.getScreenCTM().a;

  // The Left handle sits midway between the frame's top-left and
  // bottom-left corners (vertices 0 and 3 of the polygon).
  const m = frame.getScreenCTM();
  const pts = frame.points;
  const tl = new DOMPoint(pts.getItem(0).x, pts.getItem(0).y).matrixTransform(m);
  const bl = new DOMPoint(pts.getItem(3).x, pts.getItem(3).y).matrixTransform(m);
  const anchor = { x: (tl.x + bl.x) / 2, y: (tl.y + bl.y) / 2 };

  return {
    circle: c.width,
    circleStroke: Number(circle.getAttribute('stroke-width')) * scale(circle),
    diamondW: d.width,
    diamondH: d.height,
    diamondOffsetX: centre(d).x - centre(c).x,
    diamondOffsetY: centre(d).y - centre(c).y,
    diamondStroke: Number(diamond.getAttribute('stroke-width')) * scale(diamond),
    frameStroke: Number(frame.getAttribute('stroke-width')) * scale(frame),
    dash: frame.style.strokeDasharray
      .split(/[\s,]+/)
      .map((v) => parseFloat(v) * scale(frame)),
    anchorError: Math.hypot(centre(c).x - anchor.x, centre(c).y - anchor.y),
  };
}

/** The handle geometry expected for size `h`, in CSS px. */
function expectSize(metrics: Metrics, h: number, label: string): void {
  const near = (actual: number, expected: number, what: string): void => {
    expect(actual, `${label}: ${what}`).to.be.closeTo(expected, 0.6);
  };
  near(metrics.circle, 2 * h, 'circle diameter');
  near(metrics.circleStroke, Math.max(1, 0.16 * h), 'circle stroke');
  near(metrics.diamondW, 2.4 * h, 'diamond width');
  near(metrics.diamondH, 2.8 * h, 'diamond height');
  near(metrics.diamondOffsetX, -4 * h, 'diamond x offset');
  near(metrics.diamondOffsetY, -2 * h, 'diamond y offset');
  near(metrics.diamondStroke, Math.max(1, 0.28 * h), 'diamond stroke');
  near(metrics.frameStroke, Math.max(1, 0.4 * h), 'frame stroke');
  near(metrics.dash[0], Math.max(2, 0.8 * h), 'frame dash');
  near(metrics.dash[1], Math.max(1, 0.4 * h), 'frame gap');
  expect(metrics.anchorError, `${label}: circle on its anchor`).to.be.lessThan(
    0.6,
  );
}

function expectHandles(h: number, label: string): void {
  cy.document().should((doc) => expectSize(measure(doc), h, label));
}

/**
 * Drag the selected first staff by (dx, dy) *page units*, converted to
 * screen pixels at the current zoom, so the same content-coordinate move
 * is requested whatever the zoom is.
 */
function dragStaffByUnits(dx: number, dy: number): void {
  cy.window().then((win) => {
    cy.get('.staff.selected').then(($staff) => {
      const staff = $staff[0] as unknown as SVGGraphicsElement;
      const k = staff.getScreenCTM().a;
      // Grab the staff by its first line, as a user does. (The <g>'s own
      // top-left corner is the left rotate diamond, which would put the
      // cursor itself off the image.)
      const g = staff.getBoundingClientRect();
      const line = staff.querySelector('path').getBoundingClientRect();
      const x = line.left + line.width / 2 - g.left;
      const y = line.top + line.height / 2 - g.top;
      cy.wrap($staff)
        .trigger('mousedown', x, y, { force: true, which: 1, view: win })
        .trigger('mousemove', x + dx * k, y + dy * k, { force: true })
        .trigger('mouseup', { force: true, view: win });
    });
  });
  // d3-drag swallows the next click for one task after a drag ends
  // (setTimeout 0). Cypress can click sooner than any user could, which
  // would eat the "Download MEI" click; let that task run first.
  cy.wait(100);
}

/**
 * Drag the selected staff up so that its highest glyph ends above the image
 * while its staff lines stay inside: half-way between the two, measured on
 * screen, so it works on any page size and zoom.
 */
function dragGlyphsAboveImage(): void {
  cy.get('#bgimg').then(($img) => {
    const imageTop = $img[0].getBoundingClientRect().top;
    cy.get('.staff.selected').then(($staff) => {
      const staff = $staff[0];
      const top = (sel: string): number =>
        Math.min(
          ...Array.from(staff.querySelectorAll(sel))
            .map((el) => el.getBoundingClientRect())
            .filter((r) => r.width > 0 || r.height > 0)
            .map((r) => r.top),
        );
      const glyphTop = top('use');
      const linesTop = top('path');
      expect(glyphTop, 'a glyph sits above the staff lines').to.be.lessThan(
        linesTop - 4,
      );
      const k = (staff as unknown as SVGGraphicsElement).getScreenCTM().a;
      const upPx = glyphTop - imageTop + (linesTop - glyphTop) / 2;
      dragStaffByUnits(0, -upPx / k);
    });
  });
}

/**
 * Measure the handles of a selected *text box* (no rotate diamonds), in CSS
 * px: circle diameter and stroke, frame stroke and dashes, and how far the
 * Left circle sits from the middle of the frame's left side.
 */
function measureTextBox(doc: Document): Omit<
  Metrics,
  'diamondW' | 'diamondH' | 'diamondOffsetX' | 'diamondOffsetY' | 'diamondStroke'
> {
  const circle = doc.querySelector<SVGCircleElement>('#p-Left');
  const frame = doc.querySelector<SVGPolygonElement>('#resizeRect');
  const c = circle.getBoundingClientRect();
  const scale = (el: SVGGraphicsElement): number => el.getScreenCTM().a;
  const m = frame.getScreenCTM();
  const pts = frame.points;
  const tl = new DOMPoint(pts.getItem(0).x, pts.getItem(0).y).matrixTransform(m);
  const bl = new DOMPoint(pts.getItem(3).x, pts.getItem(3).y).matrixTransform(m);
  return {
    circle: c.width,
    circleStroke: Number(circle.getAttribute('stroke-width')) * scale(circle),
    frameStroke: Number(frame.getAttribute('stroke-width')) * scale(frame),
    dash: frame.style.strokeDasharray
      .split(/[\s,]+/)
      .map((v) => parseFloat(v) * scale(frame)),
    anchorError: Math.hypot(
      centre(c).x - (tl.x + bl.x) / 2,
      centre(c).y - (tl.y + bl.y) / 2,
    ),
  };
}

function expectTextBoxHandles(h: number, label: string): void {
  cy.document().should((doc) => {
    const m = measureTextBox(doc);
    const near = (actual: number, expected: number, what: string): void => {
      expect(actual, `${label}: ${what}`).to.be.closeTo(expected, 0.6);
    };
    expect(doc.querySelectorAll('.resizePoint'), `${label}: 8 circles`).to.have.length(8);
    expect(doc.querySelector('.rotatePoint'), `${label}: no diamonds`).to.equal(null);
    near(m.circle, 2 * h, 'circle diameter');
    near(m.circleStroke, Math.max(1, 0.16 * h), 'circle stroke');
    near(m.frameStroke, Math.max(1, 0.4 * h), 'frame stroke');
    near(m.dash[0], Math.max(2, 0.8 * h), 'frame dash');
    near(m.dash[1], Math.max(1, 0.4 * h), 'frame gap');
    expect(m.anchorError, `${label}: circle on its anchor`).to.be.lessThan(0.6);
  });
}

/**
 * Ids of the two shown text boxes nearest the page's top-left corner that
 * have a real size (the first syllable of the sample has an incomplete zone)
 * and are fully on screen, so they stay reachable when zoomed in.
 */
function twoTextBoxes(): Cypress.Chainable<[string, string]> {
  return cy.get('.sylTextRect-display').then(($rects) => {
    const vh = Cypress.config('viewportHeight');
    const ids = $rects
      .toArray()
      .filter((r) => Number(r.getAttribute('width')) > 0)
      .map((r) => ({ id: r.closest('.syl').id, box: r.getBoundingClientRect() }))
      .filter(({ box }) => box.top > 130 && box.bottom < vh - 40 && box.left > 0)
      .sort((a, b) => a.box.top + a.box.left - (b.box.top + b.box.left))
      .map(({ id }) => id);
    expect(ids.length, 'text boxes on screen').to.be.greaterThan(1);
    return [ids[0], ids[1]] as [string, string];
  });
}

function selectTextBox(sylId: string): void {
  cy.get(`#${sylId} > .sylTextRect-display`).click({ force: true });
  cy.get(`#${sylId}`).should('have.class', 'selected');
  cy.get('#p-Left').should('exist');
}

describe('editing handles: constant CSS size (#1392)', () => {
  beforeEach(() => clearNeonDb());
  after(() => clearNeonDb(true));

  for (const page of PAGES) {
    it(`${page.name} (${page.notation}): same size at 25%, 100% and 400% zoom`, () => {
      openPage(page);
      selectFirstStaff();
      for (const zoom of [100, 25, 400, 100]) {
        zoomTo(zoom);
        expectHandles(DEFAULT_SIZE, `${page.name} @ ${zoom}%`);
      }
    });
  }

  it('slider is available with text bounding boxes hidden', () => {
    cy.visitEditor('/editor.html?manifest=test');
    cy.get('#displayBBox').should('not.be.checked');
    // The display panel scrolls; bring the slider into view first.
    cy.get('#edit-handle-size-slider')
      .scrollIntoView()
      .should('be.visible')
      .and('contain.text', 'Editing handle size');
    cy.get('#handleSizeSlider')
      .should('have.attr', 'min', '2')
      .and('have.attr', 'max', '20')
      .and('have.value', String(DEFAULT_SIZE));

    // Toggling text bboxes on and off does not hide it.
    cy.get('#displayBBox').click();
    cy.get('#displayBBox').click();
    cy.get('#edit-handle-size-slider')
      .scrollIntoView()
      .should('be.visible');
  });

  it('slider resizes the shown handles, resets, and is kept after reload', () => {
    cy.visitEditor('/editor.html?manifest=test');
    selectFirstStaff();

    setHandleSize(12);
    expectHandles(12, 'slider 12');
    setHandleSize(2);
    expectHandles(2, 'slider 2');

    setHandleSize(10);
    cy.reload();
    cy.get('svg.neon-container.active-page', { timeout: 15000 }).should(
      'be.visible',
    );
    cy.get('#handleSizeSlider').should('have.value', '10');
    selectFirstStaff();
    expectHandles(10, 'after reload');

    cy.get('#reset-handle-size').click();
    cy.get('#handleSizeOutput').should('have.value', String(DEFAULT_SIZE));
    expectHandles(DEFAULT_SIZE, 'after reset');
  });

  it('stored 0, NaN or legacy circleSize fall back to the default', () => {
    const cases: Array<[Record<string, unknown>, string]> = [
      [{ handleSize: 0 }, String(DEFAULT_SIZE)],
      [{ handleSize: -3 }, String(DEFAULT_SIZE)],
      [{ handleSize: 'abc' }, String(DEFAULT_SIZE)],
      [{ handleSize: 999 }, '20'],
      // Old setting in SVG units: not converted, not used.
      [{ circleSize: 25 }, String(DEFAULT_SIZE)],
    ];
    for (const [stored, expected] of cases) {
      cy.visit('/editor.html?manifest=test', {
        onBeforeLoad(win) {
          win.localStorage.setItem(
            'samples/manifests/test.jsonld',
            JSON.stringify(stored),
          );
        },
      });
      cy.get('#handleSizeSlider', { timeout: 15000 }).should(
        'have.value',
        expected,
      );
    }
  });

  it('handles follow the staff when panning and resizing the window', () => {
    cy.visitEditor('/editor.html?manifest=test');
    selectFirstStaff();
    zoomTo(200);
    expectHandles(DEFAULT_SIZE, 'zoom 200%');

    // Pan with the wheel (no shift = pan in Neon). Built from the page's own
    // WheelEvent: Cypress' synthetic wheel event lacks what d3 reads.
    cy.get('#svg_group')
      .invoke('attr', 'viewBox')
      .then((before) => {
        cy.window().then((win) => {
          win.document.getElementById('container').dispatchEvent(
            new win.WheelEvent('wheel', {
              bubbles: true,
              cancelable: true,
              deltaX: 120,
              deltaY: 80,
              clientX: 400,
              clientY: 300,
            }),
          );
        });
        cy.get('#svg_group').should('not.have.attr', 'viewBox', before);
      });
    expectHandles(DEFAULT_SIZE, 'after pan');

    cy.viewport(900, 700);
    expectHandles(DEFAULT_SIZE, 'narrow window');
    cy.viewport(1280, 800);
    expectHandles(DEFAULT_SIZE, 'wide window');
  });

  it('resize and rotate still work, and redrawn handles keep their size', () => {
    cy.visitEditor('/editor.html?manifest=test');
    selectFirstStaff();
    setHandleSize(8);

    cy.get('.staff path')
      .first()
      .invoke('attr', 'd')
      .then((before) => {
        cy.dragElementNoClick('#rotateRight', 0, 12);
        cy.get('.staff path').first().should('not.have.attr', 'd', before);
      });
    cy.get('.staff').first().should('have.class', 'selected');
    expectHandles(8, 'after rotate');

    cy.get('.staff path')
      .first()
      .invoke('attr', 'd')
      .then((before) => {
        cy.dragElementNoClick('#p-Right', -20, 0);
        cy.get('.staff path').first().should('not.have.attr', 'd', before);
      });
    expectHandles(8, 'after resize');
  });

  for (const page of PAGES.slice(0, 2)) {
    it(`${page.notation}: size, zoom, selection and window changes leave the MEI unchanged`, () => {
      cy.visitEditor(`/editor.html?manifest=${page.manifest}`);
      readMei().then((initial) => {
        const before = meiContent(initial);

        selectFirstStaff();
        setHandleSize(15);
        zoomTo(300);
        cy.viewport(1000, 700);
        cy.get('#reset-handle-size').click();
        zoomTo(50);
        cy.viewport(1280, 800);
        cy.get('#undo').click();
        cy.contains('There is nothing left to undo.').should('exist');

        readMei().then((after) =>
        expectSameContent(meiContent(after), before, 'MEI'),
      );
      });
    });
  }
});

describe('staff drag bounds ignore editing handles (#1409)', () => {
  beforeEach(() => {
    clearNeonDb();
    cy.visitEditor('/editor.html?manifest=test');
  });
  after(() => clearNeonDb(true));

  for (const zoom of [100, 25]) {
    it(`allowed at ${zoom}%: diamond leaves the image, content does not`, () => {
      zoomTo(zoom);
      selectFirstStaff();
      readMei().then((initial) => {
        const id = Cypress.$('.staff').first().attr('id');
        const start = staffZone(initial, id);

        // The left diamond sits 4h CSS px left of the staff; content
        // (staff lines at x=623) stays inside after moving 544 units left.
        cy.get('#rotateLeft').then(($d) => {
          const box = ($d[0] as unknown as SVGGraphicsElement).getBBox();
          expect(box.x - 544, 'diamond ends up off the image').to.be.lessThan(0);
        });
        dragStaffByUnits(-544, 0);
        // The gesture is in whole screen pixels: one CSS px is 1/k units, so
        // at low zoom the content move is only accurate to about one pixel.
        let tolerance = 3;
        cy.get('.staff')
          .first()
          .then(($s) => {
            const k = ($s[0] as unknown as SVGGraphicsElement).getScreenCTM().a;
            tolerance = Math.max(3, 1.5 / k);
          });

        cy.get('.staff path')
          .first()
          .should('have.attr', 'd')
          .and('match', /^M7\d /);
        cy.contains('Drag action failed').should('not.exist');
        readMei().then((after) => {
          const end = staffZone(after, id);
          expect(end.ulx - start.ulx).to.be.closeTo(-544, tolerance);
          expect(end.lrx - start.lrx).to.be.closeTo(-544, tolerance);
          expect(end.uly).to.be.closeTo(start.uly, tolerance);
        });
      });
    });
  }

  it('blocked: glyphs above the staff would leave the image', () => {
    selectFirstStaff();
    readMei().then((initial) => {
      const before = meiContent(initial);
      cy.get('.staff path')
        .first()
        .invoke('attr', 'd')
        .then((d) => {
          dragGlyphsAboveImage();
          cy.contains('Drag action failed').should('be.visible');
          cy.get('.staff path').first().should('have.attr', 'd', d);
          cy.get('.staff')
            .first()
            .should('not.have.attr', 'transform');
        });
      readMei().then((after) =>
        expectSameContent(meiContent(after), before, 'MEI'),
      );
    });
  });

  it('blocked: staff lines would leave the image', () => {
    selectFirstStaff();
    readMei().then((initial) => {
      const before = meiContent(initial);
      dragStaffByUnits(-700, 0);
      cy.contains('Drag action failed').should('be.visible');
      readMei().then((after) =>
        expectSameContent(meiContent(after), before, 'MEI'),
      );
    });
  });
});

describe('small page: staff drag bounds ignore editing handles (#1409)', () => {
  const small = PAGES.find((p) => p.name === 'small page');

  beforeEach(() => {
    clearNeonDb();
    openPage(small);
  });
  after(() => clearNeonDb(true));

  it('a staff near the edge can be moved (diamond used to start off-image)', () => {
    selectFirstStaff();
    readMei().then((initial) => {
      const id = Cypress.$('.staff').first().attr('id');
      const start = staffZone(initial, id);
      // Before #1409 the left diamond sat 130 units left of the staff
      // (x = 62 - 130 < 0 here), so every move of this staff was refused.
      dragStaffByUnits(20, 0);
      cy.contains('Drag action failed').should('not.exist');
      readMei().then((after) => {
        const end = staffZone(after, id);
        expect(end.ulx - start.ulx).to.be.closeTo(20, 2);
        expect(end.uly - start.uly).to.be.closeTo(0, 2);
      });
    });
  });

  it('blocked: glyphs above the staff would leave the image', () => {
    selectFirstStaff();
    readMei().then((initial) => {
      const before = meiContent(initial);
      dragGlyphsAboveImage();
      cy.contains('Drag action failed').should('be.visible');
      readMei().then((after) =>
        expectSameContent(meiContent(after), before, 'MEI'),
      );
    });
  });
});

describe('text boxes (#1392, #1409)', () => {
  beforeEach(() => {
    clearNeonDb();
    cy.visitEditor('/editor.html?manifest=test');
  });
  after(() => clearNeonDb(true));

  it('text box handles keep their size through slider, zoom and reselect; MEI unchanged', () => {
    readMei().then((initial) => {
      const before = meiContent(initial);

      cy.get('#displayBBox').click();
      cy.clickAndExpectClass('#selByBBox', 'is-active');
      twoTextBoxes().then(([first, second]) => {
        selectTextBox(first);
        expectTextBoxHandles(DEFAULT_SIZE, 'selected');

        setHandleSize(10);
        expectTextBoxHandles(10, 'slider 10');

        zoomTo(200);
        expectTextBoxHandles(10, 'zoom 200%');

        // Reselect: another box, then the first one again.
        selectTextBox(second);
        expectTextBoxHandles(10, 'other box');
        selectTextBox(first);
        expectTextBoxHandles(10, 'reselected');

        zoomTo(100);
        cy.get('#reset-handle-size').click();
        expectTextBoxHandles(DEFAULT_SIZE, 'reset');
      });

      cy.get('#undo').click();
      cy.contains('There is nothing left to undo.').should('exist');
      readMei().then((after) =>
        expectSameContent(meiContent(after), before, 'MEI'),
      );
    });
  });

  it('staff move with text boxes hidden: a text box leaving the page is refused', () => {
    cy.get('#displayBBox').should('not.be.checked');
    cy.get('.sylTextRect-display').should('not.exist');

    // Find an on-screen staff whose (hidden) text boxes reach further down
    // than its lines and glyphs, and the move that takes only the text box
    // off the bottom of the page.
    cy.document()
      .then((doc) => {
        const height = Number(doc.getElementById('bgimg').getAttribute('height'));
        const margin = doc.querySelector<SVGGraphicsElement>('.page-margin');
        const toPage = margin.getCTM().inverse();
        const screen = margin.getScreenCTM();
        const vh = Cypress.config('viewportHeight');

        const candidates = Array.from(doc.querySelectorAll('.staff'))
          .filter((staff) => {
            const line = staff.querySelector('path').getBoundingClientRect();
            return line.top > 130 && line.bottom < vh - 40;
          })
          .map((staff) => {
            // Hidden boxes have no layout box: use their attributes.
            const textBottoms = Array.from(
              staff.querySelectorAll<SVGRectElement>('rect.sylTextRect'),
            )
              .filter((r) => r.width.baseVal.value > 0 && r.height.baseVal.value > 0)
              .map((r) => {
                const corner = new DOMPoint(
                  r.x.baseVal.value,
                  r.y.baseVal.value + r.height.baseVal.value,
                );
                return corner.matrixTransform(toPage.multiply(r.getCTM())).y;
              });
            const otherBottoms = Array.from(staff.querySelectorAll('use, path'))
              .map((el) => el.getBoundingClientRect())
              .filter((r) => r.width > 0 || r.height > 0)
              .map((r) => (r.bottom - screen.f) / screen.d);
            const textBottom = Math.max(...textBottoms);
            const otherBottom = Math.max(...otherBottoms);
            return { id: staff.id, textBottom, otherBottom, gap: textBottom - otherBottom };
          })
          .filter((c) => Number.isFinite(c.gap))
          .sort((a, b) => b.gap - a.gap);

        expect(candidates.length, 'staves on screen').to.be.greaterThan(0);
        const best = candidates[0];
        expect(best.gap, 'text box reaches below the glyphs').to.be.greaterThan(20);
        // Text box ends gap/2 below the page; everything else stays on it.
        return { id: best.id, dy: height - best.textBottom + best.gap / 2 };
      })
      .then(({ id, dy }) => {
        readMei().then((initial) => {
          const before = meiContent(initial);
          cy.clickAndExpectClass('#selByStaff', 'is-active');
          cy.clickStaff(`#${id}`);
          cy.get(`#${id}`).should('have.class', 'selected');
          cy.get(`#${id} path`)
            .first()
            .invoke('attr', 'd')
            .then((d) => {
              dragStaffByUnits(0, dy);
              cy.contains('Drag action failed').should('be.visible');
              cy.get(`#${id} path`).first().should('have.attr', 'd', d);
              cy.get(`#${id}`).should('not.have.attr', 'transform');
            });
          readMei().then((after) =>
            expectSameContent(meiContent(after), before, 'MEI'),
          );
        });
      });
  });
});

export {};
