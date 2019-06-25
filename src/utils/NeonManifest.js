import NeonSchema from './manifest/NeonSchema.json';
import NeonContext from './manifest/context.json';

const validate = require('jsonschema').validate;

export function parseManifest (manifestString) {
  let results = validate(manifestString, NeonSchema);
  let instance = results.instance;
  if (results.errors.length > 0) return false;
  if (JSON.stringify(instance['@context']) !== JSON.stringify(NeonContext)) return false;
  return true;
}
