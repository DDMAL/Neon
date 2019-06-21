import NeonSchema from './NeonSchema.json';

const validate = require('jsonschema').validate;

export function parseManifest (manifestString) {
  console.log(validate(manifestString, NeonSchema));
}
