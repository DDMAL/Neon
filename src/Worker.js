const xmllint = require('./validation/xmllint.js');

onmessage = (event) => {
  const results = xmllint.validateXML({
    xml: event.data.mei,
    schema: event.data.schema,
    format: 'rng'
  });
  postMessage(results.errors);
};
