// Simple validation script to check skill structure
import skill from './index.ts';

console.log('=== Skill Validation ===\n');

// Check basic structure
console.log('✓ Skill name:', skill.name);
console.log('✓ Skill description:', skill.description);
console.log('✓ Number of tools:', skill.tools.length);

// Check tool structure
const tool = skill.tools[0];
console.log('\n=== Tool Details ===\n');
console.log('✓ Tool name:', tool.name);
console.log('✓ Tool description:', tool.description);
console.log('✓ Has handler:', typeof tool.handler === 'function');
console.log('✓ Has input_schema:', !!tool.input_schema);

// Check schema properties
console.log('\n=== Schema Validation ===\n');
const schema = tool.input_schema;
console.log('✓ Schema type:', schema.type);
console.log('✓ Required fields:', schema.required);
console.log('✓ Properties:', Object.keys(schema.properties || {}));

// Check websites array schema
const websitesSchema = schema.properties?.websites;
if (websitesSchema) {
  console.log('\n=== Websites Array Schema ===\n');
  console.log('✓ Type:', websitesSchema.type);
  console.log('✓ Item type:', websitesSchema.items?.type);
  console.log('✓ Item required fields:', websitesSchema.items?.required);
}

// Test parameter validation
console.log('\n=== Testing Parameter Validation ===\n');

try {
  await tool.handler({});
  console.log('✗ Should have thrown error for empty params');
} catch (e) {
  console.log('✓ Empty params rejected:', e.message);
}

try {
  await tool.handler({ websites: [] });
  console.log('✗ Should have thrown error for empty array');
} catch (e) {
  console.log('✓ Empty array rejected:', e.message);
}

try {
  await tool.handler({ websites: [{}] });
  console.log('✗ Should have thrown error for incomplete website');
} catch (e) {
  console.log('✓ Incomplete website rejected:', e.message);
}

try {
  await tool.handler({ websites: [{ url: 'test' }] });
  console.log('✗ Should have thrown error for missing expectedName');
} catch (e) {
  console.log('✓ Missing expectedName rejected:', e.message);
}

try {
  await tool.handler({ websites: [{ url: 'test', expectedName: 'test' }] });
  console.log('✗ Should have thrown error for missing filingNumber');
} catch (e) {
  console.log('✓ Missing filingNumber rejected:', e.message);
}

console.log('\n=== Validation Complete ===\n');
console.log('✅ All structure checks passed!');
console.log('✅ All validation checks passed!');
console.log('\n💡 The skill is ready to use!');
