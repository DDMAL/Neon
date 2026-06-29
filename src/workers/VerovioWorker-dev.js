importScripts('../assets/js/verovio-toolkit-wasm.js');

let toolkit;
const backlog = [];

let hufnagelBase64Promise = null;

function fetchHufnagelBase64() {
  if (!hufnagelBase64Promise) {
    hufnagelBase64Promise = fetch('../assets/Hufnagel.zip')
      .then(r => r.arrayBuffer())
      .then(buf => {
        const bytes = new Uint8Array(buf);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
      });
  }
  return hufnagelBase64Promise;
}

/**
 * Parse and respond to messages sent by NeonCore.
 * @param {MessageEvent} evt
 */
async function handleNeonEvent(evt) {
  const data = evt.data;
  const result = {
    id: data.id,
  };

  switch (data.action) {
    case 'renderData':
      result.svg = toolkit.renderData(data.mei, {});
      break;
    case 'getElementAttr':
      result.attributes = toolkit.getElementAttr(data.elementId);
      break;
    case 'edit':
      result.result = toolkit.edit(data.editorAction);
      break;
    case 'getMEI':
      result.mei = toolkit.getMEI({
        pageNo: 0,
        scoreBased: true,
      });
      break;
    case 'editInfo':
      result.info = toolkit.editInfo();
      break;
    case 'renderToSVG':
      result.svg = toolkit.renderToSVG(1);
      break;
    case 'setFont': {
      const baseOptions = {
        inputFrom: 'mei',
        footer: 'none',
        header: 'none',
        pageMarginLeft: 0,
        pageMarginTop: 0,
        useFacsimile: false,
        svgAdditionalAttribute: ['syllable@precedes', 'syllable@follows'],
        svgCss: 'g.nc, g.custos, g.clef, g.accid, g.divLine {stroke: currentColor; stroke-width: 30px;}',
      };
      try {
        if (data.fontType === 'hufnagel') {
          const b64 = await fetchHufnagelBase64();
          console.log('[VerovioWorker] b64 length:', b64.length);
          toolkit.setOptions({ ...baseOptions, font: 'Hufnagel', fontAddCustom: [b64] });
          console.log('[VerovioWorker] setOptions Hufnagel done');
        } else {
          toolkit.setOptions({ ...baseOptions, font: 'Bravura', fontAddCustom: '' });
          console.log('[VerovioWorker] setOptions Bravura done');
        }
        console.log('[VerovioWorker] setFont done:', data.fontType);
      } catch (e) {
        console.error('[VerovioWorker] setFont ERROR:', e);
      }
      break;
    }
    default:
      break;
  }
  postMessage(result);
}

verovio.module.onRuntimeInitialized = function () {
  toolkit = new verovio.toolkit();
  toolkit.setOptions({
    inputFrom: 'mei',
    footer: 'none',
    header: 'none',
    pageMarginLeft: 0,
    pageMarginTop: 0,
    font: 'Bravura',
    useFacsimile: false,
    svgAdditionalAttribute: ['syllable@precedes', 'syllable@follows'],
    svgCss:
      'g.nc, g.custos, g.clef, g.accid, g.divLine {stroke: currentColor; stroke-width: 30px;}',
  });
  console.log('Verovio toolkit: READY');
  onmessage = handleNeonEvent;
  for (const message of backlog) {
    handleNeonEvent(message);
  }
  postMessage('ready');
};

function tempHandler(evt) {
  backlog.push(evt);
}

onmessage = tempHandler;
