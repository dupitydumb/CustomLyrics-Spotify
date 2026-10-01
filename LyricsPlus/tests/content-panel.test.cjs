const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('enhances a Spotify lyrics line while the player is on a search route', () => {
  const classes = new Set();
  const root = {
    classList: { add: name => classes.add(name), remove: name => classes.delete(name), toggle: (name, on) => on ? classes.add(name) : classes.delete(name) },
    style: { setProperty() {}, removeProperty() {} }
  };
  const original = { textContent: '사랑' };
  const line = {
    textContent: '사랑', childNodes: [original], dataset: {},
    classList: { add: name => classes.add(name), remove: name => classes.delete(name) },
    parentElement: { closest: () => null },
    replaceChildren(...children) { this.childNodes = children; },
    append(child) { this.childNodes.push(child); }
  };
  const document = {
    documentElement: root,
    querySelectorAll: selector => selector.includes('[data-testid="lyrics-line"]') ? [line] : [],
    querySelector: () => ({ click() { clickedLyrics = true; } }),
    createElement: () => ({ className: '', textContent: '' })
  };
  let clickedLyrics = false;
  let statusListener;
  const chrome = {
    runtime: { onMessage: { addListener(listener) { statusListener = listener; } } },
    storage: {
      sync: { get: (_defaults, callback) => callback({ enabled: true, language: 'korean', display: 'both', fontSize: 36, lineSpacing: 1.45 }) },
      onChanged: { addListener() {} }
    }
  };
  const source = fs.readFileSync(path.join(__dirname, '../content.js'), 'utf8');
  vm.runInNewContext(source, {
    require: () => ({ convert: () => 'sarang' }),
    document, chrome,
    location: { href: 'https://open.spotify.com/search/Korean%20song', pathname: '/search/Korean%20song' },
    window: { addEventListener() {} },
    MutationObserver: class { observe() {} },
    setTimeout: () => 1,
    console
  });
  assert.equal(classes.has('lyricsplus-enabled'), true);
  assert.equal(classes.has('lyricsplus-line'), true);
  assert.equal(line.childNodes[0].textContent, '사랑');
  assert.equal(line.childNodes[1].textContent, 'sarang');
  let reported;
  statusListener({ type: 'LYRICSPLUS_STATUS' }, null, value => { reported = value; });
  assert.equal(reported.lineCount, 1);
  assert.equal(reported.convertedCount, 1);
  statusListener({ type: 'LYRICSPLUS_OPEN_LYRICS' }, null, value => { reported = value; });
  assert.equal(reported.opened, true);
  assert.equal(clickedLyrics, true);
});
