const { romanize: romanizeKorean } = require('@romanize/korean');
const { pinyin } = require('pinyin-pro');
const wanakana = require('wanakana');
const { romanize: romanizeThai } = require('@pcampus/thai-romanization');

function convert(text, language) {
  if (language === 'korean') {
    // The library rejects emoji, Japanese, Hanja and some symbols in mixed lyrics.
    // Convert only complete Hangul syllable runs and leave everything else intact.
    return text.replace(/[\uAC00-\uD7A3]+/g, syllables => romanizeKorean(syllables));
  }
  if (language === 'japanese') return wanakana.toRomaji(text);
  if (language === 'chinese') return pinyin(text, { toneType: 'none' });
  if (language === 'thai') return romanizeThai(text);
  return text;
}

module.exports = { convert };
