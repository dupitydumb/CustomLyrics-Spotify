const test = require('node:test');
const assert = require('node:assert/strict');
const { convert } = require('../romanize');

test('converts supported scripts and leaves unrelated text intact', () => {
  assert.equal(convert('かな', 'japanese'), 'kana');
  assert.equal(convert('你好', 'chinese'), 'ni hao');
  assert.equal(convert('Hello', 'none'), 'Hello');
});

test('unknown language never changes the original lyric', () => {
  assert.equal(convert('사랑', 'unknown'), '사랑');
});

test('Korean lyrics with emoji, Japanese and symbols do not throw', () => {
  assert.equal(convert('사랑 ❤️', 'korean'), 'sarang ❤️');
  assert.equal(convert('まどろみ', 'korean'), 'まどろみ');
  assert.equal(convert('널 위해서 ☆', 'korean'), 'neol wihaeseo ☆');
});
