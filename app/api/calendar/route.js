// Biblical Feasts & Holy Days API Route (Zero API Key required)
// Blends real-time Hebrew calendar data from Hebcal with deep Biblical / Christological theology

const BIBLICAL_FEASTS = [
  {
    id: "passover",
    name: "Passover",
    hebrewName: "פֶּסַח",
    transliteration: "Pesach",
    englishTranslation: "To pass over / spare",
    season: "spring",
    biblicalTiming: "14th day of Nisan (1st biblical month at twilight)",
    scriptures: [
      { ref: "Leviticus 23:5", text: "In the fourteenth day of the first month at even is the LORD's passover." },
      { ref: "Exodus 12:1-14", text: "The blood shall be a sign for you on the houses where you are. And when I see the blood, I will pass over you." },
      { ref: "1 Corinthians 5:7", text: "For Christ, our Passover lamb, has been sacrificed for us." }
    ],
    primaryBook: "Leviticus",
    primaryChapter: 23,
    overview: "Commemorates the redemption of the children of Israel out of Egyptian slavery, when the blood of an unblemished lamb applied to the doorposts caused the angel of death to pass over their homes.",
    propheticFulfillment: "Fulfilled in Jesus Christ, the spotless Lamb of God (John 1:29) who was crucified at the exact hour the Passover lambs were slain, purchasing our eternal deliverance from sin and death with His precious blood.",
    observance: "Removal of all leaven, partaking of the Passover Seder (unleavened bread, bitter herbs, wine/grape juice), and retelling the story of redemption.",
    badgeColor: "#ea580c"
  },
  {
    id: "unleavened_bread",
    name: "Feast of Unleavened Bread",
    hebrewName: "חַג הַמַּצּוֹת",
    transliteration: "Chag HaMatzot",
    englishTranslation: "Festival of Matzot (Bread without yeast)",
    season: "spring",
    biblicalTiming: "15th to 21st of Nisan (7-day holy convocation)",
    scriptures: [
      { ref: "Leviticus 23:6-8", text: "On the fifteenth day of the same month is the Feast of Unleavened Bread to the LORD; for seven days you must eat unleavened bread." },
      { ref: "Exodus 12:15-20", text: "Seven days you shall eat unleavened bread... for whoever eats leavened bread shall be cut off." },
      { ref: "1 Corinthians 5:8", text: "Let us therefore celebrate the festival, not with the old leaven of malice and evil, but with the unleavened bread of sincerity and truth." }
    ],
    primaryBook: "Exodus",
    primaryChapter: 12,
    overview: "A seven-day celebration of purity and haste following Passover, marking Israel's departure from Egypt without time for dough to rise, and leaving behind the sinful corruptions of Egypt.",
    propheticFulfillment: "Points to Jesus Christ's sinless, pure life and His burial in the tomb. Leaven represents sin in Scripture; Christ was the uncorrupted Bread of Life who saw no decay.",
    observance: "Eating only unleavened bread (matzah) for seven days, resting on the first and seventh holy days, and sanctifying the heart from sinful habits.",
    badgeColor: "#d97706"
  },
  {
    id: "firstfruits",
    name: "Feast of Firstfruits",
    hebrewName: "יוֹם הַבִּכּוּרִים",
    transliteration: "Yom HaBikkurim",
    englishTranslation: "Day of the First Fruits",
    season: "spring",
    biblicalTiming: "Day after the Sabbath during Unleavened Bread",
    scriptures: [
      { ref: "Leviticus 23:9-14", text: "He shall wave the sheaf before the LORD, that you may be accepted. On the day after the Sabbath the priest shall wave it." },
      { ref: "1 Corinthians 15:20-23", text: "But in fact Christ has been raised from the dead, the firstfruits of those who have fallen asleep." }
    ],
    primaryBook: "Leviticus",
    primaryChapter: 23,
    overview: "The priest waved a single sheaf of the freshly ripened barley harvest before the Lord, dedicating the very beginning of the harvest to God as thanksgiving and a pledge of the greater harvest to come.",
    propheticFulfillment: "Fulfilled on the third day when Jesus rose victoriously from the tomb on the Sunday after the Sabbath — becoming the Firstfruits of the resurrection of all who believe.",
    observance: "Offering the best of the first harvest, offering praise for God's provision, and anticipating the full harvest season.",
    badgeColor: "#16a34a"
  },
  {
    id: "pentecost",
    name: "Pentecost (Feast of Weeks)",
    hebrewName: "שָׁבוּעוֹת",
    transliteration: "Shavuot",
    englishTranslation: "Weeks (Counting 50 days)",
    season: "spring",
    biblicalTiming: "50 days after Firstfruits (6th of Sivan)",
    scriptures: [
      { ref: "Leviticus 23:15-21", text: "You shall count seven full weeks from the day after the Sabbath... fifty days to the day after the seventh Sabbath." },
      { ref: "Acts 2:1-4", text: "When the day of Pentecost arrived, they were all together in one place... and they were all filled with the Holy Spirit." },
      { ref: "Exodus 19:1-6", text: "On the third new moon after the people of Israel had gone out of the land of Egypt, on that day they came into the wilderness of Sinai." }
    ],
    primaryBook: "Acts",
    primaryChapter: 2,
    overview: "Celebrates the summer wheat harvest and historically commemorates God giving the Torah (Ten Commandments) at Mount Sinai fifty days after leaving Egypt.",
    propheticFulfillment: "Fifty days after Christ's resurrection, the Holy Spirit descended with rushing wind and tongues of fire upon the disciples in Jerusalem, writing God's law upon human hearts and birthing the New Covenant Church.",
    observance: "All-night study of God's Word, reading the Book of Ruth (the Gentile bride of Boaz), joyfully celebrating spiritual harvest.",
    badgeColor: "#0284c7"
  },
  {
    id: "trumpets",
    name: "Feast of Trumpets",
    hebrewName: "יוֹם תְּרוּעָה",
    transliteration: "Yom Teruah / Rosh Hashanah",
    englishTranslation: "Day of Blasting / Shofar Awakening",
    season: "fall",
    biblicalTiming: "1st day of Tishrei (7th biblical month)",
    scriptures: [
      { ref: "Leviticus 23:23-25", text: "In the seventh month, on the first day of the month, you shall observe a day of solemn rest, a memorial proclaimed with blast of trumpets." },
      { ref: "1 Thessalonians 4:16-17", text: "For the Lord himself will descend from heaven with a cry of command... and with the sound of the trumpet of God." },
      { ref: "1 Corinthians 15:52", text: "In a moment, in the twinkling of an eye, at the last trumpet. For the trumpet will sound, and the dead will be raised imperishable." }
    ],
    primaryBook: "Leviticus",
    primaryChapter: 23,
    overview: "A sacred day of shofar trumpet blasts initiating the High Holy Days and the 'Ten Days of Awe', summoning all people to awaken, examine their hearts, and prepare for judgment.",
    propheticFulfillment: "Points forward to the glorious return of Jesus Christ and the resurrection of believers announced by the sound of the great trumpet of God.",
    observance: "Blowing of the ram's horn (shofar) 100 times, solemn self-examination, dipping apples in honey for a sweet new season.",
    badgeColor: "#9333ea"
  },
  {
    id: "atonement",
    name: "Day of Atonement",
    hebrewName: "יוֹם כִּפּוּר",
    transliteration: "Yom Kippur",
    englishTranslation: "Day of Covering / Cleansing",
    season: "fall",
    biblicalTiming: "10th day of Tishrei",
    scriptures: [
      { ref: "Leviticus 23:26-32", text: "On the tenth day of this seventh month is the Day of Atonement. It shall be for you a time of holy convocation, and you shall afflict yourselves." },
      { ref: "Leviticus 16:29-34", text: "For on this day shall atonement be made for you, to cleanse you from all your sins before the LORD." },
      { ref: "Hebrews 9:11-14", text: "He entered once for all into the holy places, not by means of the blood of goats and calves but by means of his own blood, thus securing an eternal redemption." }
    ],
    primaryBook: "Leviticus",
    primaryChapter: 16,
    overview: "The most solemn, holy day of the entire biblical calendar. Only on this day did the High Priest enter the Holy of Holies with blood to sprinkle on the Mercy Seat for the sins of the nation.",
    propheticFulfillment: "Jesus Christ is our ultimate Great High Priest who entered the true heavenly sanctuary once and for all with His own blood, blotting out our sins forever and granting us direct access to the throne of grace.",
    observance: "25-hour total fast from sunset to sunset, deep prayer, confession of sin, seeking reconciliation, and resting from all labor.",
    badgeColor: "#dc2626"
  },
  {
    id: "tabernacles",
    name: "Feast of Tabernacles (Booths)",
    hebrewName: "סֻכּוֹת",
    transliteration: "Sukkot",
    englishTranslation: "Booths / Temporary Shelters",
    season: "fall",
    biblicalTiming: "15th to 22nd of Tishrei (7-day feast + 8th day assembly)",
    scriptures: [
      { ref: "Leviticus 23:33-43", text: "You shall dwell in booths for seven days... that your generations may know that I made the people of Israel dwell in booths when I brought them out of the land of Egypt." },
      { ref: "John 1:14", text: "And the Word became flesh and tabernacled among us, and we have seen his glory." },
      { ref: "Revelation 21:3", text: "Behold, the dwelling place of God is with man. He will tabernacle with them, and they will be his people." }
    ],
    primaryBook: "Leviticus",
    primaryChapter: 23,
    overview: "Known as 'The Season of Our Joy', commemorating the 40 years Israel dwelt in temporary shelters under God's cloud of glory in the wilderness, and celebrating the final ingathering of the harvest.",
    propheticFulfillment: "Prophetically foreshadows Christ's Millennial reign and the eternal state when God tabernacles forever with redeemed humanity in the New Jerusalem.",
    observance: "Building and dwelling in outdoor temporary booths (sukkot) covered with palm branches, waving the four species (lulav and etrog), and rejoicing before the Lord.",
    badgeColor: "#059669"
  },
  {
    id: "purim",
    name: "Purim (Feast of Lots)",
    hebrewName: "פּוּרִים",
    transliteration: "Purim",
    englishTranslation: "Lots (Cast by Haman)",
    season: "historical",
    biblicalTiming: "14th of Adar (Late winter)",
    scriptures: [
      { ref: "Esther 9:20-22", text: "To keep the fourteenth day of the month Adar and also the fifteenth day of the same, year by year, as the days on which the Jews got relief from their enemies." },
      { ref: "Esther 4:14", text: "And who knows whether you have not come to the kingdom for such a time as this?" }
    ],
    primaryBook: "Esther",
    primaryChapter: 9,
    overview: "Commemorates how God secretly orchestrated events through Queen Esther and Mordecai to save the Jewish people from the genocide plotted by Haman in the Persian Empire.",
    propheticFulfillment: "Reminds us that even when God's name is not explicitly mentioned, His sovereign hand orchestrates history to preserve His covenant people and deliver those who trust Him.",
    observance: "Public reading of the Scroll of Esther (Megillah), giving gifts of food to friends (Mishloach Manot), charity to the poor, and joyful celebration.",
    badgeColor: "#ec4899"
  },
  {
    id: "hanukkah",
    name: "Hanukkah (Feast of Dedication)",
    hebrewName: "חֲנֻכָּה",
    transliteration: "Hanukkah",
    englishTranslation: "Dedication",
    season: "historical",
    biblicalTiming: "25th of Kislev (8 days in winter)",
    scriptures: [
      { ref: "John 10:22-23", text: "At that time the Feast of Dedication took place at Jerusalem. It was winter, and Jesus was walking in the temple, in the colonnade of Solomon." },
      { ref: "John 8:12", text: "Again Jesus spoke to them, saying, 'I am the light of the world. Whoever follows me will not walk in darkness, but will have the light of life.'" }
    ],
    primaryBook: "John",
    primaryChapter: 10,
    overview: "Celebrates the 2nd century BC rededication of the Temple in Jerusalem after the Maccabean revolt defeated Syrian-Greek oppressors, and the miracle of the menorah oil that burned for 8 days.",
    propheticFulfillment: "Jesus attended this festival at Solomon's Colonnade (John 10) and declared Himself the Light of the World and the Good Shepherd who lays down His life for His sheep.",
    observance: "Lighting the eight-branched Hanukkiah, placing lights in windows to shine in darkness, eating foods made with oil, praising God's deliverance.",
    badgeColor: "#3b82f6"
  },
  {
    id: "shabbat",
    name: "Shabbat (The Sabbath)",
    hebrewName: "שַׁבָּת",
    transliteration: "Shabbat",
    englishTranslation: "To cease / desist from labor",
    season: "weekly",
    biblicalTiming: "Every 7th Day (Friday sunset to Saturday sunset)",
    scriptures: [
      { ref: "Genesis 2:2-3", text: "And on the seventh day God finished his work that he had done, and he rested... So God blessed the seventh day and made it holy." },
      { ref: "Exodus 20:8-11", text: "Remember the Sabbath day, to keep it holy. Six days you shall labor, and do all your work, but the seventh day is a Sabbath to the LORD your God." },
      { ref: "Hebrews 4:9-10", text: "So then, there remains a Sabbath rest for the people of God, for whoever has entered God's rest has also rested from his works as God did from his." }
    ],
    primaryBook: "Genesis",
    primaryChapter: 2,
    overview: "Established by God at Creation and commanded in the Ten Commandments as a weekly covenant sign of holy rest, worship, family communion, and cessation of labor.",
    propheticFulfillment: "Jesus declared Himself 'Lord of the Sabbath' (Mark 2:28). In Him, believers enter into true, eternal rest from trying to earn righteousness by our own works.",
    observance: "Resting from vocational labor, gathering for prayer and Scripture reading, lighting candles, blessing family, and dining in gratitude.",
    badgeColor: "#6366f1"
  }
];

export async function GET() {
  let liveDates = {};
  let currentHebrewYear = 5786; // approximate fallback

  try {
    // Zero-auth Hebcal public API
    const res = await fetch('https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&year=now', {
      headers: { 'Accept': 'application/json' },
      cache: 'force-cache'
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.items)) {
        data.items.forEach(item => {
          const title = (item.title || '').toLowerCase();
          const date = item.date;
          if (title.includes('pesach') || title.includes('passover')) {
            if (!liveDates['passover']) liveDates['passover'] = date;
          }
          if (title.includes('shavuot') || title.includes('pentecost')) {
            if (!liveDates['pentecost']) liveDates['pentecost'] = date;
          }
          if (title.includes('rosh hashanah') || title.includes('yom teruah')) {
            if (!liveDates['trumpets']) liveDates['trumpets'] = date;
          }
          if (title.includes('yom kippur')) {
            if (!liveDates['atonement']) liveDates['atonement'] = date;
          }
          if (title.includes('sukkot')) {
            if (!liveDates['tabernacles']) liveDates['tabernacles'] = date;
          }
          if (title.includes('purim')) {
            if (!liveDates['purim']) liveDates['purim'] = date;
          }
          if (title.includes('chanukah') || title.includes('hanukkah')) {
            if (!liveDates['hanukkah']) liveDates['hanukkah'] = date;
          }
        });
      }
    }
  } catch (err) {
    console.warn('Hebcal live date fetch failed, using internal calculations:', err);
  }

  // Augment feasts with live dates and relative proximity
  const today = new Date();
  const enrichedFeasts = BIBLICAL_FEASTS.map(f => {
    const rawDate = liveDates[f.id] || null;
    let daysUntil = null;
    let formattedDate = null;

    if (rawDate) {
      const target = new Date(rawDate);
      formattedDate = target.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const diffMs = target - today;
      daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }

    return {
      ...f,
      gregorianDate: formattedDate,
      daysUntil: daysUntil
    };
  });

  return Response.json({
    currentYear: today.getFullYear(),
    hebrewYear: currentHebrewYear,
    feasts: enrichedFeasts
  });
}
