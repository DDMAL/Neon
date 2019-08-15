importScripts('./verovio-toolkit.js');

const toolkit = new verovio.toolkit();
toolkit.setOptions({
  format: 'mei',
  noFooter: 1,
  noHeader: 1,
  pageMarginLeft: 0,
  pageMarginTop: 0,
  font: 'Bravura',
  useFacsimile: true,
  createDefaultSyl: true,
  createDefaultSylBBox: true,
  useSkew: true
});

/**
 * Parse and respond to messages sent by NeonCore.
 * @param {MessageEvent} evt
 */
function handleNeonEvent (evt) {
  const data = evt.data;
  const result = {
    id: data.id
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
      result.mei = toolkit.getMEI(0, true);
      break;
    case 'editInfo':
      result.info = toolkit.editInfo();
      break;
    case 'renderToSVG':
      result.svg = toolkit.renderToSVG(1);
      break;
    default:
      break;
  }
  postMessage(result);
}

onmessage = handleNeonEvent;
