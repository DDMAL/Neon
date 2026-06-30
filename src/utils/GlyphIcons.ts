// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSZip = require('jszip');

interface BBox { x: number; y: number; w: number; h: number; }

interface FontData {
  fontName: string;
  bboxMap: Map<string, BBox>;
}

const ICON_SIZE = 24;

const cache = new Map<string, Promise<FontData>>();

async function loadFontData(zipUrl: string): Promise<FontData> {
  const response = await fetch(zipUrl);
  const buf = await response.arrayBuffer();
  const zip = await JSZip.loadAsync(buf);
  const fontName = zipUrl.split('/').pop()!.replace('.zip', '');

  // Inject font CSS
  const cssFile = zip.file(`${fontName}.css`);
  if (cssFile) {
    const css = await cssFile.async('string');
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Parse bounding boxes
  const bboxMap = new Map<string, BBox>();
  const bboxFile = zip.file(`${fontName}.xml`);
  if (bboxFile) {
    const xml = await bboxFile.async('string');
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    doc.querySelectorAll('g[c]').forEach(el => {
      const c = el.getAttribute('c');
      const x = parseFloat(el.getAttribute('x') ?? '0');
      const y = parseFloat(el.getAttribute('y') ?? '0');
      const w = parseFloat(el.getAttribute('w') ?? '0');
      const h = parseFloat(el.getAttribute('h') ?? '0');
      if (c && w > 0 && h > 0) bboxMap.set(c, { x, y, w, h });
    });
  }

  return { fontName, bboxMap };
}

export function getFontData(zipUrl: string): Promise<FontData> {
  if (!cache.has(zipUrl)) cache.set(zipUrl, loadFontData(zipUrl));
  return cache.get(zipUrl)!;
}

export function buildGlyphIcon(codepoint: string, fontName: string, bbox: BBox): string {
  const pad = bbox.h * 0.08;
  const vx = bbox.x - pad;
  const vy = bbox.y - pad;
  const vw = bbox.w + pad * 2;
  const vh = bbox.h + pad * 2;
  const cp = parseInt(codepoint, 16);
  const char = String.fromCodePoint(cp);
  // font-size 1000 matches units-per-em=1000, so bbox coords directly frame the glyph
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}" width="${ICON_SIZE}" height="${ICON_SIZE}" aria-hidden="true" focusable="false">
  <text font-family="${fontName}" font-size="1000" x="0" y="0">${char}</text>
</svg>`;
}
