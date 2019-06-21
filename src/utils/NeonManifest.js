import NeonSchema from './NeonSchema.json';

const validate = require('jsonschema').validate;

export function parseManifest (manifestString) {
  let results = validate(manifestString, NeonSchema);
  return results.errors.length === 0;
}
