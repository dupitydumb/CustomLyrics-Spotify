const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('popup loads saved choices and saves display and size changes', () => {
  const values = { enabled: true, language: 'korean', display: 'both', fontSize: 36, lineSpacing: 1.45, highContrast: false, reducedMotion: false };
  const nodes = new Map();
  const makeNode = (id, type = 'text') => {
    const node = { id, type, value: '', checked: false, listeners: {}, addEventListener(name, handler) { this.listeners[name] = handler; } };
    nodes.set(id, node);
    return node;
  };
  for (const key of Object.keys(values)) if (key !== 'display') makeNode(key, typeof values[key] === 'boolean' ? 'checkbox' : typeof values[key] === 'number' ? 'range' : 'select-one');
  makeNode('fontSizeValue', 'output');
  makeNode('lineSpacingValue', 'output');
  const status = makeNode('status');
  makeNode('pageStatus');
  makeNode('openLyrics', 'button');
  const radios = ['original', 'pronunciation', 'both'].map(value => ({ name: 'display', value, type: 'radio', checked: false, listeners: {}, addEventListener(name, handler) { this.listeners[name] = handler; } }));
  const document = {
    getElementById: id => nodes.get(id),
    querySelector: selector => radios.find(radio => selector.includes(`value="${radio.value}"`)),
    querySelectorAll: () => radios
  };
  const chrome = { runtime: { lastError: null }, storage: { sync: { get(_defaults, callback) { callback(values); }, set(update, callback) { Object.assign(values, update); callback(); } } } };
  const source = fs.readFileSync(path.join(__dirname, '../popup.js'), 'utf8');
  vm.runInNewContext(source, { document, chrome, setTimeout: callback => callback() });
  assert.equal(nodes.get('language').value, 'korean');
  assert.equal(radios[2].checked, true);
  radios[1].listeners.change({ target: radios[1] });
  assert.equal(values.display, 'pronunciation');
  const size = nodes.get('fontSize');
  size.value = '48';
  size.listeners.input({ target: size });
  assert.equal(values.fontSize, 48);
  assert.equal(nodes.get('fontSizeValue').value, '48px');
  assert.equal(status.textContent, 'Saved');
});
