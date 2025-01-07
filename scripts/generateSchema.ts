import * as TJS from 'typescript-json-schema';
import { writeFileSync } from 'fs';

// Settings for the JSON schema generator
const settings: TJS.PartialArgs = {
  required: true
};

// Path to the TypeScript file
const compilerOptions = {
  strictNullChecks: true,
  types: [] // Exclude default types to avoid conflicts
};

// Generate the schema for the specified type
const program = TJS.getProgramFromFiles(['types.ts'], compilerOptions);

const schema = TJS.generateSchema(program, 'AiActionConfig', settings);

// Write the schema to a file
if (schema) {
  writeFileSync('schema.json', JSON.stringify(schema, null, 2));
  console.log('Schema generated successfully.');
} else {
  console.error('Failed to generate schema.');
}
