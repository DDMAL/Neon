import NeonSchema from './manifest/NeonSchema.json';
import NeonContext from './manifest/context.json';

const validate = require('jsonschema').validate;

/**
 * Check if the provided Neon manifest is parseable.
 * @param {string} manifestString - The Neon manifest as a string.
 */
export function parseManifest (manifestString) {
  let results = validate(manifestString, NeonSchema);
  let instance = results.instance;
  if (results.errors.length > 0) {
    console.error(results.errors);
    return false;
  }
  if (JSON.stringify(instance['@context']) !== JSON.stringify(NeonContext)) {
    console.error('Context mismatch');
    console.error(instance['@context']);
    console.error(NeonContext);
    return false;
  }
  return true;
}
