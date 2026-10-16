// Light per-book facts used by the Study book list and reader headers (author, summary, themes).
// The heavy parts (chapter teachings, key verses, notes) live in public/book-details/<book>.json
// and are fetched only when a book is opened; see app/lib/bookDetails.js.

export const bookIndex = {
  "Genesis": {
    "author": "Moses",
    "summary": "Genesis records the creation of the world, the fall of humanity, the flood, and God's covenant relationship with Abraham and his descendants. It establishes the foundation for God's redemptive plan through the patriarchs Abraham, Isaac, Jacob, and Joseph.",
    "keyThemes": [
      "Creation",
      "Fall of Man",
      "Covenant",
      "Providence",
      "Faith",
      "Promise"
    ],
    "chapterCount": 50
  },
  "Exodus": {
    "author": "Moses",
    "summary": "Exodus tells the story of Israel's deliverance from Egyptian slavery through God's mighty acts, the giving of the Law at Mount Sinai, and the construction of the Tabernacle. It reveals God as Redeemer and Lawgiver.",
    "keyThemes": [
      "Deliverance",
      "Redemption",
      "The Law",
      "God's Presence",
      "Worship",
      "Covenant"
    ],
    "chapterCount": 40
  },
  "Leviticus": {
    "author": "Moses",
    "summary": "Leviticus provides detailed instructions for worship, sacrifices, and holy living. It teaches Israel how to approach a holy God and live as His set-apart people, emphasizing the concepts of holiness, atonement, and purity.",
    "keyThemes": [
      "Holiness",
      "Sacrifice",
      "Atonement",
      "Purity",
      "Priesthood",
      "Worship"
    ],
    "chapterCount": 27
  },
  "Numbers": {
    "author": "Moses",
    "summary": "Numbers records Israel's wilderness wanderings after leaving Sinai, including two censuses, rebellions against God and Moses, and the consequences of unbelief. Despite Israel's failures, God remains faithful to His promises.",
    "keyThemes": [
      "Faithfulness of God",
      "Consequences of Unbelief",
      "Wandering",
      "Testing",
      "God's Provision"
    ],
    "chapterCount": 36
  },
  "Deuteronomy": {
    "author": "Moses",
    "summary": "Deuteronomy records Moses' farewell speeches to Israel on the plains of Moab. He recounts God's faithfulness, restates the Law, and urges obedience as they prepare to enter the Promised Land. The book emphasizes loving God wholeheartedly.",
    "keyThemes": [
      "Obedience",
      "Love for God",
      "Covenant Renewal",
      "Remembrance",
      "Blessings and Curses"
    ],
    "chapterCount": 34
  },
  "Joshua": {
    "author": "Joshua (likely completed by a later editor)",
    "summary": "Joshua records the conquest and division of the Promised Land under Joshua's leadership. It demonstrates God's faithfulness in fulfilling His promises to Abraham and shows that victory comes through obedience and trust in God.",
    "keyThemes": [
      "Promised Land",
      "Conquest",
      "Faithfulness",
      "Obedience",
      "Inheritance",
      "Courage"
    ],
    "chapterCount": 24
  },
  "Judges": {
    "author": "Unknown (possibly Samuel)",
    "summary": "Judges covers a turbulent period after Joshua's death when Israel repeatedly falls into a cycle of sin, oppression, crying out to God, and deliverance through appointed judges. It reveals the consequences of abandoning God and doing what is right in one's own eyes.",
    "keyThemes": [
      "Cycle of Sin",
      "God's Mercy",
      "Leadership",
      "Apostasy",
      "Deliverance",
      "Moral Decline"
    ],
    "chapterCount": 21
  },
  "Ruth": {
    "author": "Unknown (possibly Samuel)",
    "summary": "Ruth is a beautiful story of loyalty, love, and redemption set during the time of the Judges. A Moabite woman named Ruth shows extraordinary devotion to her mother-in-law Naomi, and through Boaz the kinsman-redeemer, she becomes part of the lineage of King David and ultimately Jesus Christ.",
    "keyThemes": [
      "Loyalty",
      "Redemption",
      "Providence",
      "Kindness",
      "Inclusion of Gentiles"
    ],
    "chapterCount": 4
  },
  "1 Samuel": {
    "author": "Samuel, Nathan, and Gad (1 Chronicles 29:29)",
    "summary": "1 Samuel records the transition from the period of judges to the monarchy. It covers Samuel's life as the last judge, Saul's rise and fall as Israel's first king, and David's anointing and early years as the chosen king after God's own heart.",
    "keyThemes": [
      "God's Sovereignty",
      "Obedience vs. Sacrifice",
      "The Heart",
      "Anointing",
      "Faithfulness"
    ],
    "chapterCount": 31
  },
  "2 Samuel": {
    "author": "Unknown (possibly Nathan and Gad)",
    "summary": "2 Samuel covers David's reign as king over Israel — his triumphs, his great sin with Bathsheba, and the painful consequences in his family. Despite David's failures, God makes an everlasting covenant with him, promising that his throne would endure forever.",
    "keyThemes": [
      "The Davidic Covenant",
      "Consequences of Sin",
      "Grace",
      "Leadership",
      "Repentance"
    ],
    "chapterCount": 24
  },
  "1 Kings": {
    "author": "Unknown (possibly Jeremiah or a prophetic school)",
    "summary": "1 Kings covers Solomon's glorious reign, the building of the Temple, the kingdom's division into Israel and Judah after Solomon, and the early history of both kingdoms. It also features the powerful ministry of Elijah the prophet.",
    "keyThemes": [
      "Wisdom",
      "The Temple",
      "Division",
      "Idolatry",
      "Prophetic Ministry",
      "Obedience"
    ],
    "chapterCount": 22
  },
  "2 Kings": {
    "author": "Unknown (possibly Jeremiah or a prophetic school)",
    "summary": "2 Kings continues the history of the divided kingdoms through Elisha's ministry, the fall of Israel to Assyria (722 BC), and the eventual fall of Judah to Babylon (586 BC). Despite occasional revivals, persistent idolatry leads to exile.",
    "keyThemes": [
      "Judgment",
      "Exile",
      "Revival",
      "Prophetic Ministry",
      "Consequences of Sin"
    ],
    "chapterCount": 25
  },
  "1 Chronicles": {
    "author": "Ezra (traditionally)",
    "summary": "1 Chronicles retells the history of Israel from Adam through David's reign, emphasizing the Davidic line, Temple worship, and God's covenant faithfulness. Written for the returned exiles, it reminds them of their identity and spiritual heritage.",
    "keyThemes": [
      "Davidic Covenant",
      "Temple Worship",
      "Genealogy",
      "God's Faithfulness",
      "Praise"
    ],
    "chapterCount": 29
  },
  "2 Chronicles": {
    "author": "Ezra (traditionally)",
    "summary": "2 Chronicles covers Solomon's reign, the building of the Temple, and the history of Judah's kings until the Babylonian exile. It emphasizes the importance of faithfulness in worship, the role of the Temple, and the pattern of revival.",
    "keyThemes": [
      "Temple",
      "Reform and Revival",
      "Faithfulness",
      "Worship",
      "Seeking God"
    ],
    "chapterCount": 36
  },
  "Ezra": {
    "author": "Ezra",
    "summary": "Ezra records the return of the Jewish exiles from Babylon to Jerusalem and the rebuilding of the Temple. It also covers Ezra's later mission to restore spiritual purity, confronting the problem of intermarriage with pagan nations.",
    "keyThemes": [
      "Restoration",
      "Rebuilding",
      "Purity",
      "God's Faithfulness",
      "Return from Exile"
    ],
    "chapterCount": 10
  },
  "Nehemiah": {
    "author": "Nehemiah (compiled by Ezra)",
    "summary": "Nehemiah records the rebuilding of Jerusalem's walls under Nehemiah's leadership, despite fierce opposition. It also covers spiritual reforms including public reading of the Law, confession of sins, and covenant renewal.",
    "keyThemes": [
      "Leadership",
      "Rebuilding",
      "Prayer",
      "Perseverance",
      "Reform",
      "Community"
    ],
    "chapterCount": 13
  },
  "Esther": {
    "author": "Unknown (possibly Mordecai)",
    "summary": "Esther tells the dramatic story of a young Jewish queen who risks her life to save her people from genocide during the Persian Empire. Though God's name is never mentioned, His providential hand is evident throughout.",
    "keyThemes": [
      "Providence",
      "Courage",
      "Deliverance",
      "Identity",
      "Reversal"
    ],
    "chapterCount": 10
  },
  "Job": {
    "author": "Unknown (possibly Job himself, Moses, or Solomon)",
    "summary": "Job explores the mystery of suffering through the story of a righteous man who loses everything. His friends offer flawed explanations, but God ultimately answers from a whirlwind, revealing His sovereignty and wisdom beyond human understanding.",
    "keyThemes": [
      "Suffering",
      "Sovereignty of God",
      "Faith in Trial",
      "Wisdom",
      "Restoration"
    ],
    "chapterCount": 42
  },
  "Psalms": {
    "author": "David (73 psalms), Asaph, Sons of Korah, Solomon, Moses, and others",
    "summary": "The Psalms are Israel's inspired hymnal — 150 poems and songs expressing the full range of human emotion before God. They include praise, lament, thanksgiving, confession, wisdom, and prophecy, all centered on the character and works of God.",
    "keyThemes": [
      "Worship",
      "Prayer",
      "Praise",
      "Lament",
      "Trust",
      "The Messiah",
      "God's Character"
    ],
    "chapterCount": 150
  },
  "Proverbs": {
    "author": "Solomon (primarily), Agur, and King Lemuel",
    "summary": "Proverbs is a collection of practical wisdom for everyday life. It teaches how to live skillfully in God's world — covering topics from relationships and work to money, speech, and character, all rooted in the fear of the LORD.",
    "keyThemes": [
      "Wisdom",
      "Fear of the LORD",
      "Discipline",
      "Speech",
      "Relationships",
      "Work Ethic"
    ],
    "chapterCount": 31
  },
  "Ecclesiastes": {
    "author": "Solomon (traditionally, 'the Teacher')",
    "summary": "Ecclesiastes is a philosophical exploration of life's meaning. The 'Teacher' examines pleasure, work, wealth, wisdom, and justice — finding that everything 'under the sun' is meaningless apart from God. The conclusion: fear God and keep His commandments.",
    "keyThemes": [
      "Meaning of Life",
      "Vanity",
      "Wisdom",
      "Time",
      "Fear of God",
      "Enjoyment of Life"
    ],
    "chapterCount": 12
  },
  "Song of Solomon": {
    "author": "Solomon",
    "summary": "The Song of Solomon is a poetic celebration of romantic love between a bridegroom and his bride. It celebrates the beauty, desire, and commitment of marital love as a gift from God, and has been allegorically interpreted as God's love for His people.",
    "keyThemes": [
      "Romantic Love",
      "Beauty",
      "Commitment",
      "Desire",
      "Marriage",
      "God's Love"
    ],
    "chapterCount": 8
  },
  "Isaiah": {
    "author": "Isaiah son of Amoz",
    "summary": "Isaiah is the greatest of the prophetic books — a majestic proclamation of God's holiness, judgment on sin, and the promise of salvation through the coming Messiah. It contains the most detailed Old Testament prophecies about Jesus Christ, especially the Suffering Servant songs.",
    "keyThemes": [
      "Holiness of God",
      "Judgment",
      "Salvation",
      "The Messiah",
      "Comfort",
      "Restoration"
    ],
    "chapterCount": 66
  },
  "Jeremiah": {
    "author": "Jeremiah (with Baruch as scribe)",
    "summary": "Jeremiah, the 'weeping prophet,' warned Judah for 40 years about coming judgment while offering hope of a new covenant. His message was largely rejected, and he witnessed the destruction of Jerusalem and the Temple.",
    "keyThemes": [
      "Judgment",
      "Repentance",
      "New Covenant",
      "Faithfulness",
      "Suffering of the Prophet"
    ],
    "chapterCount": 52
  },
  "Lamentations": {
    "author": "Jeremiah (traditionally)",
    "summary": "Lamentations is a collection of five poems mourning the destruction of Jerusalem and the Temple by Babylon in 586 BC. Written in acrostic form, it expresses deep grief while affirming God's faithfulness and the hope that He will restore His people.",
    "keyThemes": [
      "Grief",
      "Judgment",
      "God's Faithfulness",
      "Hope",
      "Repentance"
    ],
    "chapterCount": 5
  },
  "Ezekiel": {
    "author": "Ezekiel the priest",
    "summary": "Ezekiel prophesied to the exiles in Babylon, using vivid visions and symbolic actions to communicate God's judgment on Jerusalem, the nations, and the promise of future restoration. His vision of the valley of dry bones is one of the most powerful images of resurrection and national restoration.",
    "keyThemes": [
      "Glory of God",
      "Judgment",
      "Restoration",
      "God's Sovereignty",
      "New Heart"
    ],
    "chapterCount": 48
  },
  "Daniel": {
    "author": "Daniel",
    "summary": "Daniel records the faithfulness of Daniel and his friends during the Babylonian exile, along with apocalyptic visions revealing God's sovereign plan over world empires. It teaches that God is in control of history and will establish an everlasting kingdom.",
    "keyThemes": [
      "Sovereignty of God",
      "Faithfulness",
      "Prophecy",
      "World Empires",
      "The Kingdom of God"
    ],
    "chapterCount": 12
  },
  "Hosea": {
    "author": "Hosea",
    "summary": "Hosea's marriage to the unfaithful Gomer is a living parable of God's faithful love for unfaithful Israel. Despite Israel's spiritual adultery through idolatry, God's relentless love pursues His people and promises restoration.",
    "keyThemes": [
      "God's Faithful Love",
      "Spiritual Adultery",
      "Judgment",
      "Restoration",
      "Covenant"
    ],
    "chapterCount": 14
  },
  "Joel": {
    "author": "Joel",
    "summary": "Joel uses a devastating locust plague as a picture of God's coming judgment ('the Day of the LORD') and calls the people to repentance. He promises that God will restore what the locusts have eaten and pour out His Spirit on all people.",
    "keyThemes": [
      "Day of the LORD",
      "Repentance",
      "Restoration",
      "The Holy Spirit",
      "Judgment"
    ],
    "chapterCount": 3
  },
  "Amos": {
    "author": "Amos, a shepherd and fig-tree farmer from Tekoa",
    "summary": "Amos, a simple shepherd called to prophesy, condemned Israel's social injustice, exploitation of the poor, and hollow religious practices during a time of prosperity. He warned that God demands justice and righteousness, not empty worship.",
    "keyThemes": [
      "Social Justice",
      "Judgment",
      "Hypocrisy",
      "Righteousness",
      "God's Sovereignty"
    ],
    "chapterCount": 9
  },
  "Obadiah": {
    "author": "Obadiah",
    "summary": "Obadiah, the shortest book in the Old Testament, is a prophecy against Edom (descendants of Esau) for their arrogance and cruelty toward Judah during the Babylonian invasion. God will judge Edom and restore His people.",
    "keyThemes": [
      "Judgment on Pride",
      "Justice",
      "Brotherhood Betrayed",
      "God's Sovereignty"
    ],
    "chapterCount": 1
  },
  "Jonah": {
    "author": "Jonah",
    "summary": "Jonah tells the story of a reluctant prophet who flees from God's command to preach to Nineveh, is swallowed by a great fish, and eventually delivers God's message. Nineveh repents, but Jonah is angry because God shows mercy to Israel's enemies.",
    "keyThemes": [
      "God's Mercy to All Nations",
      "Obedience",
      "Compassion",
      "Repentance",
      "Running from God"
    ],
    "chapterCount": 4
  },
  "Micah": {
    "author": "Micah of Moresheth",
    "summary": "Micah prophesied judgment against both Israel and Judah for social injustice, corrupt leadership, and false prophecy. He also prophesied the birth of the Messiah in Bethlehem and called God's people to 'act justly, love mercy, and walk humbly with God.'",
    "keyThemes": [
      "Justice",
      "Mercy",
      "Humility",
      "Messianic Promise",
      "Judgment and Hope"
    ],
    "chapterCount": 7
  },
  "Nahum": {
    "author": "Nahum the Elkoshite",
    "summary": "Nahum prophesies the destruction of Nineveh, the capital of the Assyrian Empire. While Jonah's Nineveh repented, this later generation returned to extreme wickedness. God's patience has limits, and His justice will prevail.",
    "keyThemes": [
      "God's Justice",
      "Judgment",
      "God's Wrath Against Evil",
      "Comfort for the Oppressed"
    ],
    "chapterCount": 3
  },
  "Habakkuk": {
    "author": "Habakkuk the prophet",
    "summary": "Habakkuk is unique — it's not a prophecy to the people but a dialogue between the prophet and God. Habakkuk questions God about injustice and evil, and God reveals His sovereign plan, even using wicked Babylon as His instrument. The book concludes with a magnificent song of trust.",
    "keyThemes": [
      "Faith",
      "God's Justice",
      "Sovereignty",
      "Trust",
      "Questioning God"
    ],
    "chapterCount": 3
  },
  "Zephaniah": {
    "author": "Zephaniah, great-great-grandson of King Hezekiah",
    "summary": "Zephaniah warns of the coming Day of the LORD — a day of judgment not just on Judah but on all nations. Yet beyond the darkness, God promises to purify a humble remnant and rejoice over His people with singing.",
    "keyThemes": [
      "Day of the LORD",
      "Judgment",
      "Remnant",
      "Humility",
      "God's Joy"
    ],
    "chapterCount": 3
  },
  "Haggai": {
    "author": "Haggai",
    "summary": "Haggai urged the returned exiles to stop neglecting God's Temple while building their own comfortable homes. His message: put God first, rebuild the Temple, and God will bless and fill it with His glory.",
    "keyThemes": [
      "Priorities",
      "Obedience",
      "God's Presence",
      "Building God's House",
      "Blessing"
    ],
    "chapterCount": 2
  },
  "Zechariah": {
    "author": "Zechariah",
    "summary": "Zechariah encouraged the rebuilding of the Temple through a series of night visions and messianic prophecies. The book contains some of the most detailed prophecies about Christ's first and second comings, including His entry into Jerusalem and His piercing.",
    "keyThemes": [
      "Messianic Prophecy",
      "Restoration",
      "God's Sovereignty",
      "The Coming King",
      "Repentance"
    ],
    "chapterCount": 14
  },
  "Malachi": {
    "author": "Malachi",
    "summary": "Malachi, the last Old Testament prophet, confronted the spiritual apathy and half-hearted worship of the returned exiles. Through a series of disputations, God addresses their doubts about His love and calls them to faithfulness, promising the coming of a messenger before the great day of the LORD.",
    "keyThemes": [
      "God's Love",
      "Faithful Worship",
      "Tithes",
      "Covenant Faithfulness",
      "The Coming Messenger"
    ],
    "chapterCount": 4
  },
  "Matthew": {
    "author": "Matthew (Levi), the tax collector turned apostle",
    "summary": "Matthew presents Jesus as the promised Messiah and King of the Jews, fulfilling Old Testament prophecy. It features the Sermon on the Mount, extensive parables, and ends with the Great Commission — sending His followers to make disciples of all nations.",
    "keyThemes": [
      "Jesus as Messiah",
      "Kingdom of Heaven",
      "Fulfillment of Prophecy",
      "Discipleship",
      "The Great Commission"
    ],
    "chapterCount": 28
  },
  "Mark": {
    "author": "John Mark (companion of Peter)",
    "summary": "Mark is the shortest and most action-packed Gospel, presenting Jesus as the powerful Servant of God who came to serve and give His life as a ransom for many. The word 'immediately' appears frequently, portraying Jesus as a man of urgent, purposeful action.",
    "keyThemes": [
      "Jesus as Servant",
      "Action",
      "Suffering",
      "The Cross",
      "Discipleship"
    ],
    "chapterCount": 16
  },
  "Luke": {
    "author": "Luke, the physician and historian",
    "summary": "Luke presents the most complete account of Jesus' life, emphasizing His compassion for the poor, outcasts, women, and sinners. Written as careful history, it shows Jesus as the perfect Son of Man who came to seek and save the lost.",
    "keyThemes": [
      "Jesus as Son of Man",
      "Compassion",
      "Prayer",
      "Joy",
      "Salvation for All",
      "The Holy Spirit"
    ],
    "chapterCount": 24
  },
  "John": {
    "author": "John, the beloved disciple",
    "summary": "John presents Jesus as the eternal Word made flesh — fully God and fully man. Through seven signs and seven 'I AM' statements, John demonstrates that Jesus is the Christ, the Son of God, and that believing in Him gives eternal life.",
    "keyThemes": [
      "Jesus as God",
      "Belief",
      "Eternal Life",
      "Light and Darkness",
      "Love",
      "The Holy Spirit"
    ],
    "chapterCount": 21
  },
  "Acts": {
    "author": "Luke",
    "summary": "Acts records the birth and explosive growth of the early church from Jerusalem to Rome, empowered by the Holy Spirit. It follows the apostles — especially Peter and Paul — as they spread the gospel across the Roman Empire despite fierce opposition.",
    "keyThemes": [
      "The Holy Spirit",
      "The Church",
      "Mission",
      "Persecution",
      "Gospel Expansion"
    ],
    "chapterCount": 28
  },
  "Romans": {
    "author": "Paul",
    "summary": "Romans is Paul's most systematic presentation of the gospel — explaining humanity's sin, God's righteousness, justification by faith, sanctification through the Spirit, and God's sovereign plan for Israel and the Gentiles. It is the theological foundation of Christianity.",
    "keyThemes": [
      "Justification by Faith",
      "Righteousness of God",
      "Grace",
      "Sanctification",
      "God's Sovereignty"
    ],
    "chapterCount": 16
  },
  "1 Corinthians": {
    "author": "Paul",
    "summary": "Paul addresses a troubled church plagued by divisions, immorality, lawsuits, and confusion about spiritual gifts, worship, and the resurrection. He calls them to unity in Christ and provides practical guidance for living as the body of Christ.",
    "keyThemes": [
      "Unity",
      "Holiness",
      "Spiritual Gifts",
      "Love",
      "The Resurrection",
      "The Body of Christ"
    ],
    "chapterCount": 16
  },
  "2 Corinthians": {
    "author": "Paul",
    "summary": "Paul's most personal and emotional letter — he defends his apostleship, explains the nature of genuine ministry, and calls for generous giving. He reveals his own suffering and weakness as proof that God's power is made perfect in weakness.",
    "keyThemes": [
      "Comfort in Suffering",
      "Genuine Ministry",
      "Generosity",
      "Weakness and Power",
      "New Covenant"
    ],
    "chapterCount": 13
  },
  "Galatians": {
    "author": "Paul",
    "summary": "Galatians is Paul's passionate defense of the gospel of grace against those teaching that Gentile believers must follow the Jewish law to be saved. He argues forcefully that justification comes through faith in Christ alone, not through works of the law.",
    "keyThemes": [
      "Justification by Faith",
      "Freedom in Christ",
      "Grace vs. Law",
      "The Spirit vs. the Flesh"
    ],
    "chapterCount": 6
  },
  "Ephesians": {
    "author": "Paul",
    "summary": "Ephesians reveals the glorious riches of God's grace and the believer's position in Christ. The first half celebrates our spiritual blessings; the second half calls us to walk worthy of our calling — in unity, holiness, love, and spiritual warfare.",
    "keyThemes": [
      "In Christ",
      "Grace",
      "Unity",
      "The Church",
      "Spiritual Warfare",
      "New Life"
    ],
    "chapterCount": 6
  },
  "Philippians": {
    "author": "Paul",
    "summary": "Written from prison, Philippians overflows with joy. Paul encourages the Philippians to have the humble mind of Christ, to press on toward the goal, and to rejoice always. It contains the magnificent 'Christ hymn' describing Jesus' incarnation and exaltation.",
    "keyThemes": [
      "Joy",
      "Humility",
      "The Mind of Christ",
      "Contentment",
      "Press On"
    ],
    "chapterCount": 4
  },
  "Colossians": {
    "author": "Paul",
    "summary": "Colossians presents the supremacy and sufficiency of Christ over all things. Paul combats a false teaching that mixed philosophy, mysticism, and legalism, declaring that in Christ 'all the fullness of God dwells' — believers need nothing beyond Him.",
    "keyThemes": [
      "Supremacy of Christ",
      "Fullness in Christ",
      "False Teaching",
      "New Life",
      "Freedom"
    ],
    "chapterCount": 4
  },
  "1 Thessalonians": {
    "author": "Paul",
    "summary": "Paul's first letter to the Thessalonians is a warm encouragement to a young church facing persecution. He commends their faith, instructs them on holy living, and provides key teaching on the return of Christ and the resurrection of believers.",
    "keyThemes": [
      "The Second Coming",
      "Encouragement",
      "Holy Living",
      "Hope",
      "Faith Under Persecution"
    ],
    "chapterCount": 5
  },
  "2 Thessalonians": {
    "author": "Paul",
    "summary": "Paul writes again to clarify misconceptions about Christ's return, assuring them that the Day of the Lord has not yet come. He describes events that must occur first and calls for perseverance, right living, and productive work while waiting.",
    "keyThemes": [
      "The Day of the Lord",
      "Perseverance",
      "Work Ethic",
      "God's Justice",
      "Endurance"
    ],
    "chapterCount": 3
  },
  "1 Timothy": {
    "author": "Paul",
    "summary": "Paul writes to his younger colleague Timothy with instructions for leading the church at Ephesus. The letter covers sound doctrine, qualifications for leaders, the importance of godliness, and how to handle false teaching — practical wisdom for church leadership.",
    "keyThemes": [
      "Sound Doctrine",
      "Church Leadership",
      "Godliness",
      "False Teaching",
      "Mentorship"
    ],
    "chapterCount": 6
  },
  "2 Timothy": {
    "author": "Paul",
    "summary": "Paul's final letter, written from a Roman prison shortly before his execution. It is a deeply personal farewell, urging Timothy to remain faithful, endure suffering, preach the Word, and guard the gospel entrusted to him.",
    "keyThemes": [
      "Perseverance",
      "Faithfulness",
      "Suffering",
      "Scripture",
      "Finishing Well"
    ],
    "chapterCount": 4
  },
  "Titus": {
    "author": "Paul",
    "summary": "Paul instructs Titus on organizing churches on the island of Crete — appointing qualified leaders, confronting false teaching, and promoting godly living in every age group. Sound doctrine must produce godly behavior.",
    "keyThemes": [
      "Sound Doctrine and Good Works",
      "Church Order",
      "Grace",
      "Godly Living"
    ],
    "chapterCount": 3
  },
  "Philemon": {
    "author": "Paul",
    "summary": "Paul's shortest letter appeals to Philemon to welcome back his runaway slave Onesimus — no longer as a slave but as a beloved brother in Christ. It beautifully illustrates forgiveness, reconciliation, and the transforming power of the gospel on social relationships.",
    "keyThemes": [
      "Forgiveness",
      "Reconciliation",
      "Brotherhood in Christ",
      "Grace",
      "Transformation"
    ],
    "chapterCount": 1
  },
  "Hebrews": {
    "author": "Unknown (Paul, Apollos, Barnabas, or Luke have been suggested)",
    "summary": "Hebrews demonstrates that Jesus Christ is superior to everything in the old covenant — angels, Moses, Joshua, the priesthood, the sacrifices, and the Temple. He is the perfect High Priest and the final sacrifice, making the new covenant better in every way.",
    "keyThemes": [
      "Supremacy of Christ",
      "The New Covenant",
      "Faith",
      "Perseverance",
      "High Priest"
    ],
    "chapterCount": 13
  },
  "James": {
    "author": "James, the brother of Jesus",
    "summary": "James is the most practical book in the New Testament — a handbook for authentic Christian living. He insists that genuine faith must produce visible works, covering topics like trials, wisdom, favoritism, taming the tongue, and caring for the poor.",
    "keyThemes": [
      "Faith and Works",
      "Trials",
      "Wisdom",
      "The Tongue",
      "Practical Righteousness"
    ],
    "chapterCount": 5
  },
  "1 Peter": {
    "author": "Peter the apostle",
    "summary": "Peter writes to persecuted believers scattered across the Roman Empire, encouraging them to stand firm in their faith. He reminds them of their living hope in Christ, calls them to holy living, and teaches them how to endure suffering with grace.",
    "keyThemes": [
      "Hope",
      "Suffering",
      "Holy Living",
      "Submission",
      "Grace",
      "Identity in Christ"
    ],
    "chapterCount": 5
  },
  "2 Peter": {
    "author": "Peter the apostle",
    "summary": "Peter's farewell letter warns against false teachers and scoffers who deny the Lord's return. He calls believers to grow in knowledge and godliness, assures them that God's judgment on the wicked is certain, and reminds them that God's patience means salvation.",
    "keyThemes": [
      "Spiritual Growth",
      "False Teachers",
      "The Day of the Lord",
      "God's Patience",
      "Scripture"
    ],
    "chapterCount": 3
  },
  "1 John": {
    "author": "John the apostle",
    "summary": "John writes to give believers assurance of salvation and to combat false teaching. He establishes three tests of genuine faith: right belief about Christ, obedient living, and love for others. His message: God is light, God is love, and believers can know they have eternal life.",
    "keyThemes": [
      "Assurance",
      "Love",
      "Light and Darkness",
      "Truth",
      "Fellowship with God"
    ],
    "chapterCount": 5
  },
  "2 John": {
    "author": "John the apostle ('the elder')",
    "summary": "John's brief letter urges believers to walk in truth and love while warning against false teachers who deny that Jesus Christ came in the flesh. He instructs them not to welcome or support such deceivers.",
    "keyThemes": [
      "Truth",
      "Love",
      "Discernment",
      "False Teachers"
    ],
    "chapterCount": 1
  },
  "3 John": {
    "author": "John the apostle ('the elder')",
    "summary": "John commends Gaius for his hospitality toward traveling missionaries, condemns Diotrephes for his arrogant refusal to welcome them, and commends Demetrius for his good reputation. It highlights the importance of supporting gospel workers.",
    "keyThemes": [
      "Hospitality",
      "Truth",
      "Leadership",
      "Supporting Missionaries"
    ],
    "chapterCount": 1
  },
  "Jude": {
    "author": "Jude, brother of James and half-brother of Jesus",
    "summary": "Jude urgently warns against false teachers who have infiltrated the church, perverting God's grace into a license for immorality. He uses vivid Old Testament examples to describe their judgment and calls believers to contend earnestly for the faith.",
    "keyThemes": [
      "Contending for the Faith",
      "False Teachers",
      "Judgment",
      "Perseverance",
      "God's Keeping Power"
    ],
    "chapterCount": 1
  },
  "Revelation": {
    "author": "John the apostle",
    "summary": "Revelation is the grand finale of the Bible — a prophetic vision of the risen Christ, the spiritual battle between good and evil, God's final judgment on sin, and the glorious establishment of the new heaven and new earth. Despite its dramatic imagery, its core message is simple: Jesus wins.",
    "keyThemes": [
      "Victory of Christ",
      "Judgment",
      "Worship",
      "The Lamb",
      "New Creation",
      "Hope"
    ],
    "chapterCount": 22
  }
};
