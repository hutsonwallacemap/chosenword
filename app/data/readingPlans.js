export const nt30Plan = [
  { day: 1, title: 'Matthew 1-4' }, { day: 2, title: 'Matthew 5-7' },
  { day: 3, title: 'Matthew 8-12' }, { day: 4, title: 'Matthew 13-16' },
  { day: 5, title: 'Matthew 17-21' }, { day: 6, title: 'Matthew 22-25' },
  { day: 7, title: 'Matthew 26-28' }, { day: 8, title: 'Mark 1-5' },
  { day: 9, title: 'Mark 6-9' }, { day: 10, title: 'Mark 10-12' },
  { day: 11, title: 'Mark 13-16' }, { day: 12, title: 'Luke 1-3' },
  { day: 13, title: 'Luke 4-6' }, { day: 14, title: 'Luke 7-9' },
  { day: 15, title: 'Luke 10-13' }, { day: 16, title: 'Luke 14-17' },
  { day: 17, title: 'Luke 18-21' }, { day: 18, title: 'Luke 22-24' },
  { day: 19, title: 'John 1-4' }, { day: 20, title: 'John 5-8' },
  { day: 21, title: 'John 9-12' }, { day: 22, title: 'John 13-16' },
  { day: 23, title: 'John 17-21' }, { day: 24, title: 'Acts 1-5' },
  { day: 25, title: 'Acts 6-10' }, { day: 26, title: 'Acts 11-15' },
  { day: 27, title: 'Acts 16-20' }, { day: 28, title: 'Acts 21-28' },
  { day: 29, title: 'Romans 1-8' }, { day: 30, title: 'Romans 9-16' }
];

const books = [
  { name: 'Genesis', chapters: 50 }, { name: 'Exodus', chapters: 40 }, { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 }, { name: 'Deuteronomy', chapters: 34 }, { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 }, { name: 'Ruth', chapters: 4 }, { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 }, { name: '1 Kings', chapters: 22 }, { name: '2 Kings', chapters: 25 },
  { name: '1 Chronicles', chapters: 29 }, { name: '2 Chronicles', chapters: 36 }, { name: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', chapters: 13 }, { name: 'Esther', chapters: 10 }, { name: 'Job', chapters: 42 },
  { name: 'Psalms', chapters: 150 }, { name: 'Proverbs', chapters: 31 }, { name: 'Ecclesiastes', chapters: 12 },
  { name: 'Song of Solomon', chapters: 8 }, { name: 'Isaiah', chapters: 66 }, { name: 'Jeremiah', chapters: 52 },
  { name: 'Lamentations', chapters: 5 }, { name: 'Ezekiel', chapters: 48 }, { name: 'Daniel', chapters: 12 },
  { name: 'Hosea', chapters: 14 }, { name: 'Joel', chapters: 3 }, { name: 'Amos', chapters: 9 },
  { name: 'Obadiah', chapters: 1 }, { name: 'Jonah', chapters: 4 }, { name: 'Micah', chapters: 7 },
  { name: 'Nahum', chapters: 3 }, { name: 'Habakkuk', chapters: 3 }, { name: 'Zephaniah', chapters: 3 },
  { name: 'Haggai', chapters: 2 }, { name: 'Zechariah', chapters: 14 }, { name: 'Malachi', chapters: 4 },
  { name: 'Matthew', chapters: 28 }, { name: 'Mark', chapters: 16 }, { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 }, { name: 'Acts', chapters: 28 }, { name: 'Romans', chapters: 16 },
  { name: '1 Corinthians', chapters: 16 }, { name: '2 Corinthians', chapters: 13 }, { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 }, { name: 'Philippians', chapters: 4 }, { name: 'Colossians', chapters: 4 },
  { name: '1 Thessalonians', chapters: 5 }, { name: '2 Thessalonians', chapters: 3 }, { name: '1 Timothy', chapters: 6 },
  { name: '2 Timothy', chapters: 4 }, { name: 'Titus', chapters: 3 }, { name: 'Philemon', chapters: 1 },
  { name: 'Hebrews', chapters: 13 }, { name: 'James', chapters: 5 }, { name: '1 Peter', chapters: 5 },
  { name: '2 Peter', chapters: 3 }, { name: '1 John', chapters: 5 }, { name: '2 John', chapters: 1 },
  { name: '3 John', chapters: 1 }, { name: 'Jude', chapters: 1 }, { name: 'Revelation', chapters: 22 }
];

function generatePlan(totalDays) {
  const totalChapters = 1189;
  const chaptersPerDay = totalChapters / totalDays;
  
  let currentBookIndex = 0;
  let currentChapter = 1;
  
  const plan = [];
  let fractionalAccumulator = 0;
  
  for (let day = 1; day <= totalDays; day++) {
    let chaptersToRead = Math.floor(chaptersPerDay);
    fractionalAccumulator += (chaptersPerDay - chaptersToRead);
    if (fractionalAccumulator >= 1) {
      chaptersToRead += 1;
      fractionalAccumulator -= 1;
    }
    
    if (day === totalDays && currentBookIndex < books.length) {
      chaptersToRead = 999;
    }
    
    if (currentBookIndex >= books.length) {
      break;
    }

    const startString = `${books[currentBookIndex].name} ${currentChapter}`;
    let endString = '';
    
    let chaptersRead = 0;
    while (chaptersRead < chaptersToRead && currentBookIndex < books.length) {
      const book = books[currentBookIndex];
      const chaptersLeftInBook = book.chapters - currentChapter + 1;
      
      if (chaptersRead + chaptersLeftInBook <= chaptersToRead) {
        chaptersRead += chaptersLeftInBook;
        endString = `${book.name} ${book.chapters}`;
        currentBookIndex++;
        currentChapter = 1;
      } else {
        const readInThisBook = chaptersToRead - chaptersRead;
        currentChapter += readInThisBook;
        chaptersRead += readInThisBook;
        endString = `${book.name} ${currentChapter - 1}`;
      }
    }
    
    let title = startString;
    if (startString !== endString && endString !== '') {
      title = `${startString} - ${endString}`;
    }
    
    plan.push({ day, title });
  }
  return plan;
}

export const plan180 = generatePlan(180);
export const plan365 = generatePlan(365);
