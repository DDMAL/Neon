/** @module utils/NeonManifest */
const NeonSchema = require('./manifest/NeonSchema.json');
const NeonContext = require('./manifest/context.json');

const validate = require('jsonschema').validate;

/**
 * Check if the provided Neon manifest is parseable.
 * @param {string} manifestString - The Neon manifest as a string.
 */
export function parseManifest (manifestString: NeonManifest): boolean {
  let results = validate(manifestString, NeonSchema);
  let instance = results.instance;
  if (results.errors.length > 0) {
    console.error(results.errors);
    return false;
  }
  let context = instance['@context'];
  if ((context[0] === NeonContext[0]) &&
      (context[1]['schema'] === NeonContext[1]['schema']) &&
      (context[1]['title'] === NeonContext[1]['title']) &&
      (context[1]['timestamp'] === NeonContext[1]['timestamp']) &&
      (context[1]['image']['@id'] === NeonContext[1]['image']['@id']) &&
      (context[1]['image']['@type'] === NeonContext[1]['image']['@type']) &&
      (context[1]['mei_annotations']['@id'] === NeonContext[1]['mei_annotations']['@id']) &&
      (context[1]['mei_annotations']['@type'] === NeonContext[1]['mei_annotations']['@type']) &&
      (context[1]['mei_annotations']['@container'] === NeonContext[1]['mei_annotations']['@container'])) {
    return true;
  } else {
    console.error('Context mismatch');
    console.error(context);
    console.error(NeonContext);
    return false;
  }
}

export interface Annotation {
  id: string,
  type: string,
  body: string,
  target: string
}

export interface NeonManifest {
  '@context': Array<any>,
  title: string,
  timestamp: string,
  image: string,
  mei_annotations: Annotation[]
}
