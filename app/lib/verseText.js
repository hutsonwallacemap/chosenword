// The KJV and KJV PCE files mark the words of Jesus with ‹ › (U+2039 / U+203A).
// The reader shows them in red ("red-letter edition"); everywhere else the marks are removed.

const OPEN = '‹';
const CLOSE = '›';
const MARKS = /[‹›]/g;

export const stripRedLetterMarks = (text = '') => text.replace(MARKS, '');

export const renderRedLetter = (text = '') => {
  if (!text.includes(OPEN) && !text.includes(CLOSE)) return text;

  const parts = [];
  let buffer = '';
  let isRed = false;
  const flush = () => {
    if (!buffer) return;
    parts.push(isRed
      ? <span key={parts.length} className="words-of-christ">{buffer}</span>
      : buffer);
    buffer = '';
  };

  for (const ch of text) {
    if (ch === OPEN || ch === CLOSE) {
      flush();
      isRed = ch === OPEN;
    } else {
      buffer += ch;
    }
  }
  flush();
  return parts;
};
