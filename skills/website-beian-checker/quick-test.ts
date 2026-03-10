// Quick real test with Baidu
import skill from './index.ts';

const testData = {
  websites: [{
    url: 'https://www.baidu.com',
    expectedName: '百度',
    filingNumber: '京ICP证030173号'
  }],
  concurrency: 1,
  timeout: 15000
};

console.log('🧪 Running quick test with Baidu...\n');

try {
  const result = await skill.tools[0].handler(testData);
  console.log('\n' + '='.repeat(60));
  console.log('TEST RESULT:');
  console.log('='.repeat(60));
  console.log(result);
  console.log('='.repeat(60));
  console.log('\n✅ TEST PASSED!');
} catch (error) {
  console.error('\n❌ TEST FAILED:');
  console.error(error);
  process.exit(1);
}
