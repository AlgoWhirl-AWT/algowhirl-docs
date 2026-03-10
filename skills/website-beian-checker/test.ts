// Test script to verify the skill works
import skill from './index.ts';

console.log('Skill name:', skill.name);
console.log('Skill description:', skill.description);
console.log('Tools:', skill.tools.map(t => t.name));

// Test with a simple case
const testWebsites = [
  {
    url: 'https://www.baidu.com',
    expectedName: '百度',
    filingNumber: '京ICP证030173号'
  }
];

console.log('\n🧪 Testing with Baidu...\n');

const tool = skill.tools[0];
try {
  const result = await tool.handler({
    websites: testWebsites,
    concurrency: 1,
    timeout: 10000
  });
  console.log('\n✅ Test passed!\n');
  console.log(result);
} catch (error) {
  console.error('\n❌ Test failed!');
  console.error(error);
  process.exit(1);
}
