const DEFAULTS = { enabled: true, language: 'none', display: 'both', fontSize: 36, lineSpacing: 1.45, highContrast: false, reducedMotion: false };
const fields = Object.keys(DEFAULTS);
const status = document.getElementById('status');
const pageStatus = document.getElementById('pageStatus');
function refreshPageStatus() {
  if (!chrome.tabs?.query) {
    pageStatus.textContent = 'Open Spotify lyrics to see changes.';
    return;
  }
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tabId = tabs?.[0]?.id;
    if (!tabId) {
      pageStatus.textContent = 'Open Spotify lyrics to see changes.';
      return;
    }
    chrome.tabs.sendMessage(tabId, { type: 'LYRICSPLUS_STATUS' }, response => {
      if (chrome.runtime.lastError || !response) {
        pageStatus.textContent = 'Open Spotify, then refresh its tab after reloading the extension.';
      } else if (!response.enabled) {
        pageStatus.textContent = 'Enhancement is off.';
      } else if (!response.lineCount) {
        pageStatus.textContent = 'No lyrics detected. Click the microphone in Spotify.';
      } else if (response.display === 'original') {
        pageStatus.textContent = `Lyrics detected (${response.lineCount} lines). Read mode shows original text.`;
      } else if (!response.convertedCount) {
        pageStatus.textContent = `Lyrics detected (${response.lineCount} lines). No matching script for pronunciation.`;
      } else {
        pageStatus.textContent = `Working: ${response.convertedCount} lines have pronunciation.`;
      }
    });
  });
}
function showValues(values) {
  for (const key of fields) {
    if (key === 'display') {
      const selected = document.querySelector(`input[name="display"][value="${values.display}"]`);
      if (selected) selected.checked = true;
      continue;
    }
    const field = document.getElementById(key);
    if (field.type === 'checkbox') field.checked = Boolean(values[key]);
    else field.value = values[key];
  }
  document.getElementById('fontSizeValue').value = `${values.fontSize}px`;
  document.getElementById('lineSpacingValue').value = Number(values.lineSpacing).toFixed(2);
}
chrome.storage.sync.get(DEFAULTS, showValues);
refreshPageStatus();
function saveSetting(event) {
  const field = event.target;
  const key = field.name === 'display' ? 'display' : field.id;
  const value = field.type === 'checkbox' ? field.checked : field.type === 'range' ? Number(field.value) : field.value;
  if (key === 'fontSize') document.getElementById('fontSizeValue').value = `${value}px`;
  if (key === 'lineSpacing') document.getElementById('lineSpacingValue').value = Number(value).toFixed(2);
  chrome.storage.sync.set({ [key]: value }, () => {
    const error = chrome.runtime.lastError;
    status.textContent = error ? 'Could not save. Please retry.' : 'Saved';
    if (!error) setTimeout(refreshPageStatus, 150);
  });
}
for (const key of fields) {
  const inputs = key === 'display' ? document.querySelectorAll('input[name="display"]') : [document.getElementById(key)];
  for (const input of inputs) input.addEventListener(key === 'fontSize' || key === 'lineSpacing' ? 'input' : 'change', saveSetting);
}
document.getElementById('openLyrics').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tabId = tabs?.[0]?.id;
    if (!tabId) {
      status.textContent = 'Open a Spotify song first.';
      return;
    }
    chrome.tabs.sendMessage(tabId, { type: 'LYRICSPLUS_OPEN_LYRICS' }, response => {
      if (chrome.runtime.lastError || !response?.opened) {
        status.textContent = 'Play a song, then click its Lyrics button in Spotify.';
      } else {
        window.close();
      }
    });
  });
});
