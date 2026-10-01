const { convert } = require('./romanize');

const DEFAULTS = Object.freeze({
  enabled: true,
  language: 'none',
  display: 'both',
  fontSize: 36,
  lineSpacing: 1.45,
  highContrast: false,
  reducedMotion: false
});
// Spotify can show lyrics over any route; prefer its stable test IDs over CSS hashes.
const LINE_SELECTOR = '[data-testid="lyrics-line"], [data-testid="lyrics-line-always-visible"], [data-testid="fullscreen-lyric"], [data-testid="lyrics-container"] p, [data-testid="lyrics-container"] [dir="auto"], .BXlQFspJp_jq9SKhUSP3';
const processed = new Map();
let settings = { ...DEFAULTS };
let observer;
let renderTimer;
let currentUrl = location.href;
let backgroundTarget;
let lastArtworkUrl = '';
const trackPreviewLines = new Set();

function updateTrackPreview() {
  for (const line of trackPreviewLines) line.classList.remove('lyricsplus-track-preview');
  trackPreviewLines.clear();
  if (!location.pathname.startsWith('/track/')) return;
  const heading = [...document.querySelectorAll('h1,h2,h3,h4')].find(node => node.textContent.trim() === 'Lyrics');
  const section = heading?.closest('section') || heading?.parentElement?.parentElement;
  if (!section) return;
  for (const node of section.querySelectorAll('p,div,span')) {
    if (node.children.length || node.closest('button,a') || !(heading.compareDocumentPosition(node) & 4)) continue;
    const text = node.textContent.trim();
    if (text.length < 2 || text.length > 180 || text === 'Lyrics') continue;
    node.classList.add('lyricsplus-track-preview');
    trackPreviewLines.add(node);
  }
}

function currentArtwork() {
  const image = document.querySelector('[data-testid="now-playing-widget"] img') ||
    document.querySelector('[data-testid="now-playing-bar"] img') ||
    document.querySelector('footer img') ||
    document.querySelector('[data-testid="cover-art-image"]');
  return image?.currentSrc || image?.src || '';
}

function updateBackground(lines) {
  let target;
  if (location.pathname.startsWith('/lyrics') && lines.length >= 2) {
    target = lines[0].parentElement;
    while (target && !target.contains(lines[lines.length - 1])) target = target.parentElement;
    if (target === document.body || target === document.documentElement) target = undefined;
  }
  if (backgroundTarget !== target) {
    if (backgroundTarget) {
      backgroundTarget.classList.remove('lyricsplus-background');
      backgroundTarget.style.removeProperty('--lyricsplus-art');
    }
    backgroundTarget = target;
    if (target) target.classList.add('lyricsplus-background');
  }
  if (!target) return;
  const artwork = currentArtwork();
  if (artwork && artwork !== lastArtworkUrl) {
    lastArtworkUrl = artwork;
    backgroundTarget.style.setProperty('--lyricsplus-art', `url(${JSON.stringify(artwork)})`);
  } else if (artwork && !backgroundTarget.style.getPropertyValue('--lyricsplus-art')) {
    backgroundTarget.style.setProperty('--lyricsplus-art', `url(${JSON.stringify(artwork)})`);
  }
}

function openSpotifyLyrics() {
  if (location.pathname.startsWith('/lyrics')) return true;
  const button = document.querySelector('[data-testid="lyrics-button"], button[aria-label="Lyrics"], button[aria-label="Show lyrics"]');
  if (!button) return false;
  button.click();
  return true;
}

function findLines() {
  return [...document.querySelectorAll(LINE_SELECTOR)].filter(line =>
    !line.parentElement?.closest(LINE_SELECTOR)
  );
}

function cleanLine(line) {
  const original = processed.get(line);
  if (original) {
    line.replaceChildren(...original.nodes);
    processed.delete(line);
  }
  line.classList.remove('lyricsplus-line');
}

function cleanAll() {
  for (const line of [...processed.keys()]) cleanLine(line);
  for (const line of trackPreviewLines) line.classList.remove('lyricsplus-track-preview');
  trackPreviewLines.clear();
  if (backgroundTarget) {
    backgroundTarget.classList.remove('lyricsplus-background');
    backgroundTarget.style.removeProperty('--lyricsplus-art');
    backgroundTarget = undefined;
  }
  document.documentElement.classList.remove('lyricsplus-enabled', 'lyricsplus-contrast', 'lyricsplus-reduced-motion');
  document.documentElement.style.removeProperty('--lyricsplus-size');
  document.documentElement.style.removeProperty('--lyricsplus-spacing');
}

function render() {
  if (!settings.enabled) {
    cleanAll();
    return;
  }
  document.documentElement.classList.add('lyricsplus-enabled');
  document.documentElement.classList.toggle('lyricsplus-contrast', settings.highContrast);
  document.documentElement.classList.toggle('lyricsplus-reduced-motion', settings.reducedMotion);
  document.documentElement.style.setProperty('--lyricsplus-size', `${settings.fontSize}px`);
  document.documentElement.style.setProperty('--lyricsplus-spacing', String(settings.lineSpacing));

  const lines = findLines();
  updateTrackPreview();
  updateBackground(lines);
  const present = new Set(lines);
  for (const line of [...processed.keys()]) {
    if (!present.has(line) || line.dataset.lyricsplusLanguage !== settings.language || line.dataset.lyricsplusDisplay !== settings.display) cleanLine(line);
  }
  if (settings.language === 'none' || settings.display === 'original') return;

  for (const line of lines) {
    if (processed.has(line)) continue;
    const originalText = line.textContent.trim();
    if (!originalText) continue;
    let pronunciation;
    try {
      pronunciation = convert(originalText, settings.language);
    } catch (_error) {
      continue;
    }
    if (!pronunciation || pronunciation === originalText) continue;
    const nodes = [...line.childNodes];
    const original = document.createElement('span');
    original.className = 'lyricsplus-original';
    original.textContent = originalText;
    const phonetic = document.createElement('span');
    phonetic.className = 'lyricsplus-pronunciation';
    phonetic.textContent = pronunciation;
    line.replaceChildren();
    if (settings.display !== 'pronunciation') line.append(original);
    if (settings.display !== 'original') line.append(phonetic);
    line.classList.add('lyricsplus-line');
    line.dataset.lyricsplusLanguage = settings.language;
    line.dataset.lyricsplusDisplay = settings.display;
    processed.set(line, { nodes });
  }
}

function scheduleRender() {
  if (renderTimer) return;
  renderTimer = setTimeout(() => {
    renderTimer = undefined;
    if (location.href !== currentUrl) {
      currentUrl = location.href;
      cleanAll();
    }
    render();
  }, 100);
}

chrome.storage.sync.get(DEFAULTS, value => {
  settings = { ...DEFAULTS, ...value };
  render();
  observer = new MutationObserver(mutations => {
    if (mutations.some(mutation => {
      if (mutation.type === 'attributes') return mutation.attributeName === 'src';
      if (mutation.type === 'characterData') return mutation.target.parentElement?.closest(LINE_SELECTOR);
      return mutation.addedNodes.length || mutation.removedNodes.length;
    })) scheduleRender();
  });
  observer.observe(document.documentElement, { childList: true, characterData: true, attributes: true, attributeFilter: ['src'], subtree: true });
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  for (const [key, change] of Object.entries(changes)) {
    if (Object.hasOwn(DEFAULTS, key)) settings[key] = change.newValue ?? DEFAULTS[key];
  }
  cleanAll();
  scheduleRender();
});
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'LYRICSPLUS_OPEN_LYRICS') {
    sendResponse({ opened: openSpotifyLyrics() });
    return;
  }
  if (message?.type !== 'LYRICSPLUS_STATUS') return;
  sendResponse({ enabled: settings.enabled, lineCount: findLines().length, convertedCount: processed.size, display: settings.display, language: settings.language });
});
window.addEventListener('popstate', scheduleRender);
window.addEventListener('hashchange', scheduleRender);
