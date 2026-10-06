// Biblical Word Dictionary API Route (Zero API Key required)
// Proxies free Free Dictionary API with built-in theological fallback

const BIBLICAL_TERMS_FALLBACK = {
  "grace": {
    word: "grace",
    phonetic: "/ɡreɪs/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "God's unmerited, undeserved favor, love, and divine enablement freely given to humanity through Jesus Christ.",
        example: "For by grace you have been saved through faith (Ephesians 2:8)."
      }]
    }],
    biblicalContext: "In Greek (charis), grace signifies a gift of supreme goodwill that cannot be earned. In Hebrew (chen), it conveys finding favor in the eyes of God."
  },
  "faith": {
    word: "faith",
    phonetic: "/feɪθ/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "Complete trust, confidence, and allegiance to God and His promises.",
        example: "Now faith is the assurance of things hoped for, the conviction of things not seen (Hebrews 11:1)."
      }]
    }],
    biblicalContext: "In Greek (pistis) and Hebrew (emunah), faith is active fidelity and steadfast trust in God's character, not merely intellectual belief."
  },
  "covenant": {
    word: "covenant",
    phonetic: "/ˈkʌv.ən.ənt/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "A sacred, binding agreement establishing a relationship of mutual commitment, sealed by solemn promises and sacrifice.",
        example: "I will establish my covenant between me and you and your offspring (Genesis 17:7)."
      }]
    }],
    biblicalContext: "In Hebrew (berith), biblical covenants define God's relationship with humanity — Noahic, Abrahamic, Mosaic, Davidic, and the New Covenant in Christ's blood."
  },
  "righteousness": {
    word: "righteousness",
    phonetic: "/ˈraɪ.tʃəs.nəs/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "The state of moral perfection and right relationship with God's law and holiness.",
        example: "Seek first the kingdom of God and his righteousness (Matthew 6:33)."
      }]
    }],
    biblicalContext: "In Hebrew (tzedek/tzedakah) and Greek (dikaiosyne), righteousness is both God's perfect justice and the righteous standing credited to believers through faith."
  },
  "atonement": {
    word: "atonement",
    phonetic: "/əˈtoʊn.mənt/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "The reconciliation of God and humanity through the covering and forgiveness of sin by sacrifice.",
        example: "For the life of the flesh is in the blood, and I have given it for you on the altar to make atonement (Leviticus 17:11)."
      }]
    }],
    biblicalContext: "In Hebrew (kippur, from kaphar meaning 'to cover'), atonement culminates in Jesus Christ as the ultimate, once-for-all sacrifice for the sins of the world (Hebrews 9:12)."
  },
  "redemption": {
    word: "redemption",
    phonetic: "/rɪˈdɛmp.ʃən/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "The act of buying back or liberating a captive or slave through the payment of a ransom price.",
        example: "In him we have redemption through his blood, the forgiveness of our trespasses (Ephesians 1:7)."
      }]
    }],
    biblicalContext: "In Hebrew (go'el) and Greek (apolutrosis), redemption pictures God releasing people from the bondage of sin and death by the precious blood of Christ."
  },
  "salvation": {
    word: "salvation",
    phonetic: "/sælˈveɪ.ʃən/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "Deliverance from danger, sin, and eternal separation from God into eternal life and fellowship.",
        example: "Salvation belongs to our God who sits on the throne, and to the Lamb (Revelation 7:10)."
      }]
    }],
    biblicalContext: "In Hebrew (yeshua - the root of Jesus' name), salvation encompasses rescue, victory, spiritual restoration, and eternal peace."
  },
  "repentance": {
    word: "repentance",
    phonetic: "/rɪˈpɛn.təns/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "A sincere turning away from sin and turning toward God with a transformed mind and heart.",
        example: "Repent, for the kingdom of heaven is at hand (Matthew 4:17)."
      }]
    }],
    biblicalContext: "In Hebrew (teshuvah) meaning 'to return', and Greek (metanoia) meaning 'change of mind', true repentance is a complete reorientation of life toward God."
  },
  "holiness": {
    word: "holiness",
    phonetic: "/ˈhoʊ.li.nəs/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "Absolute purity, moral perfection, and being uniquely set apart for God's sacred purpose.",
        example: "Be holy, for I am holy (1 Peter 1:16)."
      }]
    }],
    biblicalContext: "In Hebrew (kadosh), holiness means set apart, distinct, and pure — separated from the profane and dedicated wholly to God."
  },
  "mercy": {
    word: "mercy",
    phonetic: "/ˈmɜːr.si/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "Compassionate kindness and forbearance shown to offenders who deserve punishment.",
        example: "The LORD is merciful and gracious, slow to anger and abounding in steadfast love (Psalm 103:8)."
      }]
    }],
    biblicalContext: "In Hebrew (chesed / rachamim), mercy expresses God's steadfast covenant love, maternal compassion, and relief from deserved judgment."
  },
  "gospel": {
    word: "gospel",
    phonetic: "/ˈɡɒs.pəl/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "The good news of salvation offered to all people through the life, death, and resurrection of Jesus Christ.",
        example: "For I am not ashamed of the gospel, for it is the power of God for salvation to everyone who believes (Romans 1:16)."
      }]
    }],
    biblicalContext: "From the Greek euangelion ('glad tidings' or 'good news'), in antiquity used for royal proclamations of military victory or a king's coronation."
  },
  "propitiation": {
    word: "propitiation",
    phonetic: "/prəˌpɪʃ.iˈeɪ.ʃən/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "An appeasing sacrifice that turns away divine wrath against sin and restores fellowship with God.",
        example: "He is the propitiation for our sins, and not for ours only but also for the sins of the whole world (1 John 2:2)."
      }]
    }],
    biblicalContext: "In Greek (hilasmos), connected to the mercy seat (hilasterion) in the Tabernacle where the blood was sprinkled to cover sin."
  },
  "justification": {
    word: "justification",
    phonetic: "/ˌdʒʌs.tə.fɪˈkeɪ.ʃən/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "The judicial act of God declaring a guilty sinner righteous solely on the basis of Christ's finished work received by faith.",
        example: "Therefore, since we have been justified by faith, we have peace with God through our Lord Jesus Christ (Romans 5:1)."
      }]
    }],
    biblicalContext: "In Greek (dikaiosis), a legal forensic declaration where Christ's righteousness is credited to the believer."
  },
  "sanctification": {
    word: "sanctification",
    phonetic: "/ˌsæŋk.tə.fɪˈkeɪ.ʃən/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "The ongoing work of God's Holy Spirit transforming a believer into the likeness of Jesus Christ.",
        example: "May the God of peace himself sanctify you completely (1 Thessalonians 5:23)."
      }]
    }],
    biblicalContext: "In Greek (hagiasmos), progressive growth in practical holiness and dedication to God following initial salvation."
  },
  "messiah": {
    word: "messiah",
    phonetic: "/məˈsaɪ.ə/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "The promised Deliverer and King of Israel foretold by the Hebrew prophets, fulfilled in Jesus.",
        example: "We have found the Messiah (which means Christ) (John 1:41)."
      }]
    }],
    biblicalContext: "From Hebrew Mashiach ('anointed one'), translated into Greek as Christos (Christ), fulfilling the offices of Prophet, Priest, and King."
  },
  "shalom": {
    word: "shalom",
    phonetic: "/ʃəˈloʊm/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "Comprehensive peace, wholeness, completeness, sound health, safety, and prosperity that comes from God.",
        example: "The LORD lift up his countenance upon you and give you peace (shalom) (Numbers 6:26)."
      }]
    }],
    biblicalContext: "Far beyond the absence of conflict, shalom denotes harmony, complete restoration, and divine well-being in relation to God and neighbors."
  },
  "selah": {
    word: "selah",
    phonetic: "/ˈsiː.lə/",
    meanings: [{
      partOfSpeech: "interjection",
      definitions: [{
        definition: "A musical or liturgical pause in the Psalms indicating a time to pause, reflect, and meditate on what was just declared.",
        example: "God is our refuge and strength, a very present help in trouble. Selah (Psalm 46:1)."
      }]
    }],
    biblicalContext: "Appears 71 times in the Psalms and 3 times in Habakkuk. Encourages the reader to stop, weigh the truth, and lift praise."
  },
  "agape": {
    word: "agape",
    phonetic: "/ɑːˈɡɑː.peɪ/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "Unconditional, self-sacrificial divine love directed toward the highest good of another regardless of merit.",
        example: "God shows his love (agape) for us in that while we were still sinners, Christ died for us (Romans 5:8)."
      }]
    }],
    biblicalContext: "The highest form of love in the Greek New Testament, distinguished from philia (brotherly affection) and eros (romantic desire)."
  },
  "trinity": {
    word: "trinity",
    phonetic: "/ˈtrɪn.ə.ti/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "The biblical truth that God eternally exists as one divine essence in three distinct persons: Father, Son, and Holy Spirit.",
        example: "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit (Matthew 28:19)."
      }]
    }],
    biblicalContext: "Affirmed across Scripture: one true God (Deut 6:4), yet the Father is God (1 Cor 8:6), the Son is God (John 1:1, Col 2:9), and the Holy Spirit is God (Acts 5:3-4)."
  },
  "resurrection": {
    word: "resurrection",
    phonetic: "/ˌrez.əˈrek.ʃən/",
    meanings: [{
      partOfSpeech: "noun",
      definitions: [{
        definition: "The rising from death to bodily life, demonstrated in Christ's victory over the grave and promised to all believers.",
        example: "I am the resurrection and the life. Whoever believes in me, though he die, yet shall he live (John 11:25)."
      }]
    }],
    biblicalContext: "In Greek (anastasis, 'to stand up again'), Christ's bodily resurrection is the cornerstone of Christian hope (1 Cor 15)."
  }
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawWord = searchParams.get('word');

  if (!rawWord || !rawWord.trim()) {
    return Response.json({ error: 'Word parameter is required' }, { status: 400 });
  }

  // Clean word: remove punctuation, lowercase
  const word = rawWord.toLowerCase().replace(/[^a-z]/g, '').trim();

  // 1. Check if we have rich biblical context for this word
  const biblicalOverride = BIBLICAL_TERMS_FALLBACK[word];

  try {
    // 2. Fetch from Free Dictionary API (Zero auth required)
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      headers: { 'Accept': 'application/json' },
      cache: 'force-cache'
    });

    if (res.ok) {
      const data = await res.json();
      const firstEntry = data[0];

      // Extract pronunciation audio if available
      let audioUrl = '';
      if (firstEntry?.phonetics && Array.isArray(firstEntry.phonetics)) {
        const audioPhonetic = firstEntry.phonetics.find(p => p.audio && p.audio.trim().length > 0);
        if (audioPhonetic) audioUrl = audioPhonetic.audio;
      }

      return Response.json({
        word: firstEntry.word || word,
        phonetic: firstEntry.phonetic || (firstEntry.phonetics?.[0]?.text) || biblicalOverride?.phonetic || '',
        audio: audioUrl,
        meanings: firstEntry.meanings || [],
        biblicalContext: biblicalOverride?.biblicalContext || null,
        source: 'api'
      });
    }
  } catch (err) {
    console.error('Dictionary API fetch failed, falling back:', err);
  }

  // 3. Fallback to biblical dictionary entry if found
  if (biblicalOverride) {
    return Response.json({
      word: biblicalOverride.word,
      phonetic: biblicalOverride.phonetic,
      audio: '',
      meanings: biblicalOverride.meanings,
      biblicalContext: biblicalOverride.biblicalContext,
      source: 'biblical_fallback'
    });
  }

  return Response.json({
    error: `No definition found for "${word}".`
  }, { status: 404 });
}
