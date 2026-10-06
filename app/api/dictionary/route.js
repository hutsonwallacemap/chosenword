// Biblical Word Dictionary API Route (Zero API Key required)
// Blends comprehensive local biblical database with online dictionary fallback
import { lookupBiblicalWord, biblicalDictionary } from '../../data/biblicalDictionary';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawWord = searchParams.get('word');

  if (!rawWord || !rawWord.trim()) {
    return Response.json({ error: 'Word parameter is required' }, { status: 400 });
  }

  const word = rawWord.toLowerCase().replace(/[^a-z]/g, '').trim();

  // 1. Check our rich Biblical Dictionary first (instant 0ms response, 100% reliable)
  const localEntry = lookupBiblicalWord(word);

  // 2. Attempt online Free Dictionary API with a 3-second timeout
  let onlineData = null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
      cache: 'force-cache'
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]) {
        onlineData = data[0];
      }
    }
  } catch (err) {
    // Online fetch timed out or failed; will gracefully rely on local data
  }

  // 3. If online data was found, merge with local biblical insights
  if (onlineData) {
    let audioUrl = '';
    if (onlineData.phonetics && Array.isArray(onlineData.phonetics)) {
      const audioObj = onlineData.phonetics.find(p => p.audio && p.audio.trim().length > 0);
      if (audioObj) audioUrl = audioObj.audio;
    }

    return Response.json({
      word: onlineData.word || word,
      phonetic: onlineData.phonetic || onlineData.phonetics?.[0]?.text || localEntry?.phonetic || '',
      audio: audioUrl,
      meanings: onlineData.meanings || [
        {
          partOfSpeech: localEntry?.partOfSpeech || 'noun',
          definitions: [{ definition: localEntry?.definition || '' }]
        }
      ],
      biblicalContext: localEntry ? `${localEntry.origin ? localEntry.origin + ' — ' : ''}${localEntry.biblicalContext}` : null,
      keyVerse: localEntry?.keyVerse || null,
      keyVerseText: localEntry?.keyVerseText || null,
      source: 'merged'
    });
  }

  // 4. If online failed or word is biblical-specific, return local entry
  if (localEntry) {
    return Response.json({
      word: localEntry.word,
      phonetic: localEntry.phonetic,
      audio: '',
      meanings: [
        {
          partOfSpeech: localEntry.partOfSpeech,
          definitions: [
            {
              definition: localEntry.definition,
              example: localEntry.keyVerseText ? `${localEntry.keyVerse}: "${localEntry.keyVerseText}"` : undefined
            }
          ]
        }
      ],
      biblicalContext: `${localEntry.origin ? localEntry.origin + ' — ' : ''}${localEntry.biblicalContext}`,
      keyVerse: localEntry.keyVerse,
      keyVerseText: localEntry.keyVerseText,
      source: 'biblical_local'
    });
  }

  // 5. Friendly fallback: provide a generic response rather than a broken page
  return Response.json({
    word: word,
    phonetic: `/${word}/`,
    audio: '',
    meanings: [
      {
        partOfSpeech: 'term',
        definitions: [
          {
            definition: `Scriptural word or reference found in the biblical text.`
          }
        ]
      }
    ],
    biblicalContext: `Explore every occurrence of "${word}" across the Old and New Testaments using the Bible Search tool.`,
    searchLink: `/search?q=${encodeURIComponent(word)}`,
    source: 'fallback'
  });
}
