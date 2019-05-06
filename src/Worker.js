const xmllint = require('./validation/xmllint.js');

onmessage = (event) => {
  let results = xmllint.validateXML({
    xml: event.data.mei,
    schema: event.data.schema
  });
  postMessage(results.errors);
};
