// Comprehensive Biblical Lexicon & Theological Dictionary
// Zero API Key required. Instant offline lookup with Hebrew/Greek origins, definitions, and scriptures.

export const biblicalDictionary = {
  // --- CORE THEOLOGICAL TERMS ---
  "grace": {
    word: "grace",
    phonetic: "/ɡreɪs/",
    partOfSpeech: "noun",
    origin: "Greek: χάρις (charis) | Hebrew: חֵן (chen)",
    definition: "God's unmerited, undeserved favor, divine kindness, and spiritual enablement freely given to humanity through Jesus Christ.",
    biblicalContext: "In the Old Testament, finding 'favor' (chen) in the eyes of the Lord. In the New Testament, charis is the sovereign gift of salvation and power to live godly, completely independent of human works.",
    keyVerse: "Ephesians 2:8-9",
    keyVerseText: "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast."
  },
  "faith": {
    word: "faith",
    phonetic: "/feɪθ/",
    partOfSpeech: "noun",
    origin: "Greek: πίστις (pistis) | Hebrew: אֱמוּנָה (emunah)",
    definition: "Firm persuasion, complete conviction, and steadfast allegiance to God and His revealed promises.",
    biblicalContext: "Biblical faith is not blind optimism; it is wholehearted reliance upon the integrity and power of God. In Hebrews 11, it is the bedrock evidence of realities not yet seen.",
    keyVerse: "Hebrews 11:1",
    keyVerseText: "Now faith is the assurance of things hoped for, the conviction of things not seen."
  },
  "covenant": {
    word: "covenant",
    phonetic: "/ˈkʌv.ən.ənt/",
    partOfSpeech: "noun",
    origin: "Hebrew: בְּרִית (berith) | Greek: διαθήκη (diatheke)",
    definition: "A sacred, solemn relationship of mutual commitment instituted by God, ratified by blood or sacrifice, with promises, terms, and oaths.",
    biblicalContext: "God established major covenants: with Noah (preservation), Abraham (seed & land), Moses (law), David (eternal dynasty), and the New Covenant in Christ's blood for eternal redemption.",
    keyVerse: "Jeremiah 31:31",
    keyVerseText: "Behold, the days are coming, declares the LORD, when I will make a new covenant with the house of Israel and the house of Judah."
  },
  "righteousness": {
    word: "righteousness",
    phonetic: "/ˈraɪ.tʃəs.nəs/",
    partOfSpeech: "noun",
    origin: "Hebrew: צֶדֶק (tsedeq) | Greek: δικαιοσύνη (dikaiosyne)",
    definition: "Conformity to God's holy standard of moral perfection, justice, and right relationship with Him.",
    biblicalContext: "Humanity lacks righteousness on its own (Rom 3:10). Through the Gospel, God credits ('imputes') Christ's perfect righteousness to those who trust in Him.",
    keyVerse: "2 Corinthians 5:21",
    keyVerseText: "For our sake he made him to be sin who knew no sin, so that in him we might become the righteousness of God."
  },
  "atonement": {
    word: "atonement",
    phonetic: "/əˈtoʊn.mənt/",
    partOfSpeech: "noun",
    origin: "Hebrew: כִּפֻּר (kippur) from כָּפַר (kaphar - 'to cover') | Greek: καταλλαγή (katallage)",
    definition: "The reconciliation of God and sinners through the covering, blotting out, and expiation of sin by an innocent substitute sacrifice.",
    biblicalContext: "Under the Mosaic Law, the Day of Atonement (Yom Kippur) cleansed the sanctuary and the nation. Jesus Christ made the final, once-for-all atonement on the cross.",
    keyVerse: "Leviticus 17:11",
    keyVerseText: "For the life of the flesh is in the blood, and I have given it for you on the altar to make atonement for your souls."
  },
  "redemption": {
    word: "redemption",
    phonetic: "/rɪˈdɛmp.ʃən/",
    partOfSpeech: "noun",
    origin: "Hebrew: גָּאַל (ga'al - kinsman redeemer) | Greek: ἀπολύτρωσις (apolutrosis)",
    definition: "The liberation and purchase of a slave or captive through the payment of a ransom price.",
    biblicalContext: "In ancient law, a kinsman-redeemer paid debts to free family members (as Boaz did for Ruth). Christ paid the ultimate ransom price with His own blood to free us from slavery to sin.",
    keyVerse: "Ephesians 1:7",
    keyVerseText: "In him we have redemption through his blood, the forgiveness of our trespasses, according to the riches of his grace."
  },
  "salvation": {
    word: "salvation",
    phonetic: "/sælˈveɪ.ʃən/",
    partOfSpeech: "noun",
    origin: "Hebrew: יְשׁוּעָה (yeshuah) | Greek: σωτηρία (soteria)",
    definition: "Rescue, deliverance, and eternal preservation from the guilt, power, and final penalty of sin, entering into eternal fellowship with God.",
    biblicalContext: "Yeshuah is the Hebrew root of Jesus' name ('The LORD is Salvation'). Salvation has past (justification), present (sanctification), and future (glorification) dimensions.",
    keyVerse: "Acts 4:12",
    keyVerseText: "And there is salvation in no one else, for there is no other name under heaven given among men by which we must be saved."
  },
  "repentance": {
    word: "repentance",
    phonetic: "/rɪˈpɛn.təns/",
    partOfSpeech: "noun",
    origin: "Hebrew: תְּשׁוּבָה (teshuvah - 'to turn back') | Greek: μετάνοια (metanoia - 'change of mind')",
    definition: "A radical change of heart, mind, and direction, turning away from sin and self-rule to surrender to the living God.",
    biblicalContext: "Biblical repentance is not mere remorse or feeling guilty; it is an active reorientation of the whole person producing fruits worthy of repentance.",
    keyVerse: "Acts 3:19",
    keyVerseText: "Repent therefore, and turn back, that your sins may be blotted out, that times of refreshing may come from the presence of the Lord."
  },
  "holiness": {
    word: "holiness",
    phonetic: "/ˈhoʊ.li.nəs/",
    partOfSpeech: "noun",
    origin: "Hebrew: קֹדֶשׁ (qodesh) | Greek: ἁγιωσύνη (hagiosyne)",
    definition: "Absolute moral purity and separation from all that is common, profane, or sinful; total dedication to God's sacred purpose.",
    biblicalContext: "God alone is inherently holy ('Holy, holy, holy'). Believers are made holy positionally in Christ and called to live holy lives in conduct.",
    keyVerse: "1 Peter 1:15-16",
    keyVerseText: "As he who called you is holy, you also be holy in all your conduct, since it is written, 'You shall be holy, for I am holy.'"
  },
  "mercy": {
    word: "mercy",
    phonetic: "/ˈmɜːr.si/",
    partOfSpeech: "noun",
    origin: "Hebrew: חֶסֶד (chesed) / רַחֲמִים (rachamim) | Greek: ἔλεος (eleos)",
    definition: "Compassionate kindness, tenderness, and forbearance shown toward the undeserving, withholding deserved punishment.",
    biblicalContext: "Chesed denotes God's steadfast, unfailing covenant loyalty. Mercy reaches down to misery and relieves human suffering and judgment.",
    keyVerse: "Titus 3:5",
    keyVerseText: "He saved us, not because of works done by us in righteousness, but according to his own mercy."
  },
  "propitiation": {
    word: "propitiation",
    phonetic: "/prəˌpɪʃ.iˈeɪ.ʃən/",
    partOfSpeech: "noun",
    origin: "Greek: ἱλασμός (hilasmos) | related to ἱλαστήριον (hilasterion - 'mercy seat')",
    definition: "The sacrificial offering that fully satisfies the holy wrath and justice of God against sin, turning judgment into mercy.",
    biblicalContext: "On the cross, Jesus did not merely set an example; He bore the wrath of God in our place, satisfying divine justice so God can remain just while justifying the ungodly.",
    keyVerse: "1 John 2:2",
    keyVerseText: "He is the propitiation for our sins, and not for ours only but also for the sins of the whole world."
  },
  "justification": {
    word: "justification",
    phonetic: "/ˌdʒʌs.tə.fɪˈkeɪ.ʃən/",
    partOfSpeech: "noun",
    origin: "Greek: δικαίωσις (dikaiosis)",
    definition: "The legal, judicial declaration of God where a sinner is pronounced fully forgiven and righteous before Him solely through faith in Christ.",
    biblicalContext: "Justification is not making someone morally perfect internally; it is declaring them legally righteous in the heavenly courtroom because Christ paid their penalty.",
    keyVerse: "Romans 5:1",
    keyVerseText: "Therefore, since we have been justified by faith, we have peace with God through our Lord Jesus Christ."
  },
  "sanctification": {
    word: "sanctification",
    phonetic: "/ˌsæŋk.tə.fɪˈkeɪ.ʃən/",
    partOfSpeech: "noun",
    origin: "Greek: ἁγιασμός (hagiasmos)",
    definition: "The continuous work of the Holy Spirit transforming a believer's character into the likeness of Jesus Christ.",
    biblicalContext: "Begins at regeneration (positional sanctification) and progresses throughout earthly life (progressive sanctification) until final glorification in heaven.",
    keyVerse: "1 Thessalonians 4:3",
    keyVerseText: "For this is the will of God, your sanctification: that you abstain from sexual immorality."
  },
  "glorification": {
    word: "glorification",
    phonetic: "/ˌɡlɔːr.ə.fɪˈkeɪ.ʃən/",
    partOfSpeech: "noun",
    origin: "Greek: δοξάζω (doxazo)",
    definition: "The final, ultimate stage of salvation when believers are resurrected, given immortal bodies, and delivered completely from the presence of sin.",
    biblicalContext: "Described in 1 Corinthians 15 and Romans 8:30 as the climax of redemption when we see Christ face-to-face and share His glory.",
    keyVerse: "Romans 8:30",
    keyVerseText: "And those whom he predestined he also called, and those whom he called he also justified, and those whom he justified he also glorified."
  },
  "gospel": {
    word: "gospel",
    phonetic: "/ˈɡɒs.pəl/",
    partOfSpeech: "noun",
    origin: "Greek: εὐαγγέλιον (euangelion - 'good news / glad tidings')",
    definition: "The joyful announcement of salvation: that Christ died for our sins according to the Scriptures, was buried, and rose again on the third day.",
    biblicalContext: "In Greco-Roman antiquity, euangelion was a herald's royal proclamation of a king's victory. In the Bible, it is the royal news that King Jesus has triumphed over sin and death.",
    keyVerse: "1 Corinthians 15:3-4",
    keyVerseText: "For I delivered to you as of first importance what I also received: that Christ died for our sins in accordance with the Scriptures, that he was buried, that he was raised on the third day."
  },
  "messiah": {
    word: "messiah",
    phonetic: "/məˈsaɪ.ə/",
    partOfSpeech: "noun",
    origin: "Hebrew: מָשִׁיחַ (Mashiach - 'Anointed One') | Greek: Χριστός (Christos)",
    definition: "The promised Redeemer, Prophet, Priest, and King of Israel prophesied throughout the Old Testament, fulfilled in Jesus of Nazareth.",
    biblicalContext: "Kings, priests, and prophets were anointed with oil in Israel. Jesus is the ultimate Anointed One, anointed with the Holy Spirit without measure.",
    keyVerse: "John 1:41",
    keyVerseText: "He first found his own brother Simon and said to him, 'We have found the Messiah' (which means Christ)."
  },
  "christ": {
    word: "christ",
    phonetic: "/kraɪst/",
    partOfSpeech: "noun",
    origin: "Greek: Χριστός (Christos - 'Anointed One')",
    definition: "The official title of Jesus denoting His divine appointment as the Savior, Messiah, and supreme Lord of all creation.",
    biblicalContext: "Not Jesus' last name, but His sovereign title affirming that all Old Testament prophecies concerning the Davidic King and Suffering Servant find their fulfillment in Him.",
    keyVerse: "Matthew 16:16",
    keyVerseText: "Simon Peter replied, 'You are the Christ, the Son of the living God.'"
  },
  "trinity": {
    word: "trinity",
    phonetic: "/ˈtrɪn.ə.ti/",
    partOfSpeech: "noun",
    origin: "Latin: Trinitas ('three in oneness')",
    definition: "The foundational biblical truth that there is only one true God, who eternally exists as three distinct co-equal persons: Father, Son, and Holy Spirit.",
    biblicalContext: "While the word 'Trinity' is theological terminology, the truth is pervasive across Scripture: Father is God (John 6:27), Son is God (John 1:1, Col 2:9), Holy Spirit is God (Acts 5:3-4), yet God is one (Deut 6:4).",
    keyVerse: "Matthew 28:19",
    keyVerseText: "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit."
  },
  "selah": {
    word: "selah",
    phonetic: "/ˈsiː.lə/",
    partOfSpeech: "interjection",
    origin: "Hebrew: סֶלָה (selah)",
    definition: "A musical, liturgical pause in the Psalms instructing the reader or choir to stop, weigh the truth, meditate, and reflect.",
    biblicalContext: "Appears 71 times in the Psalms and 3 times in Habakkuk. It calls for sacred silence before God to absorb what was just spoken.",
    keyVerse: "Psalm 46:10-11",
    keyVerseText: "'Be still, and know that I am God. I will be exalted among the nations, I will be exalted in the earth!' The LORD of hosts is with us; the God of Jacob is our fortress. Selah"
  },
  "shalom": {
    word: "shalom",
    phonetic: "/ʃəˈloʊm/",
    partOfSpeech: "noun",
    origin: "Hebrew: שָׁלוֹם (shalom from shalam - 'to be complete, sound, whole')",
    definition: "Comprehensive peace, completeness, harmony, sound health, safety, and divine well-being gifted by God.",
    biblicalContext: "Far beyond an absence of hostility, shalom expresses the holistic flourishing of person, family, and nation under God's covenant blessing.",
    keyVerse: "Numbers 6:24-26",
    keyVerseText: "The LORD bless you and keep you; the LORD make his face to shine upon you and be gracious to you; the LORD lift up his countenance upon you and give you peace."
  },
  "agape": {
    word: "agape",
    phonetic: "/ɑːˈɡɑː.peɪ/",
    partOfSpeech: "noun",
    origin: "Greek: ἀγάπη (agape)",
    definition: "Self-sacrificing, unconditional, benevolent love that actively seeks the highest good of another regardless of their worthiness.",
    biblicalContext: "Distinguished from philia (friendship) and eros (romantic desire). Agape is the very essence of God's character revealed on the Cross.",
    keyVerse: "1 John 4:8",
    keyVerseText: "Anyone who does not love does not know God, because God is love."
  },
  "yahweh": {
    word: "yahweh",
    phonetic: "/ˈjɑː.weɪ/",
    partOfSpeech: "noun",
    origin: "Hebrew: יהוה (YHWH - The Tetragrammaton, 'I AM THAT I AM')",
    definition: "The personal, covenantal, and eternal name of the one true God of Israel, revealed to Moses at the burning bush.",
    biblicalContext: "Appears over 6,800 times in the Old Testament, represented in most English Bibles as 'the LORD' in small capital letters.",
    keyVerse: "Exodus 3:14",
    keyVerseText: "God said to Moses, 'I AM WHO I AM.' And he said, 'Say this to the people of Israel: I AM has sent me to you.'"
  },
  "elohim": {
    word: "elohim",
    phonetic: "/ˌɛl.oʊˈhiːm/",
    partOfSpeech: "noun",
    origin: "Hebrew: אֱלֹהִים (Elohim - plural of majesty)",
    definition: "The supreme Creator God of the universe, possessing absolute sovereignty, majesty, and almighty power.",
    biblicalContext: "First name of God in Scripture ('In the beginning God [Elohim] created...'). The plural form indicates majesty and hints at the plurality within the Godhead.",
    keyVerse: "Genesis 1:1",
    keyVerseText: "In the beginning, God created the heavens and the earth."
  },
  "resurrection": {
    word: "resurrection",
    phonetic: "/ˌrez.əˈrek.ʃən/",
    partOfSpeech: "noun",
    origin: "Greek: ἀνάστασις (anastasis - 'a standing up again')",
    definition: "The bodily rising from the dead into glorious, incorruptible, and eternal physical life.",
    biblicalContext: "Jesus Christ's bodily resurrection on the third day is the historical pillar of Christianity, guaranteeing the future resurrection of all who belong to Him.",
    keyVerse: "John 11:25",
    keyVerseText: "Jesus said to her, 'I am the resurrection and the life. Whoever believes in me, though he die, yet shall he live.'"
  },
  "tabernacle": {
    word: "tabernacle",
    phonetic: "/ˈtæb.ərˌnæk.əl/",
    partOfSpeech: "noun",
    origin: "Hebrew: מִשְׁכָּן (mishkan - 'dwelling place') | Greek: σκηνή (skene)",
    definition: "The portable sanctuary tent constructed by Moses in the wilderness where God chose to dwell and meet with Israel.",
    biblicalContext: "Contained the Holy Place and Most Holy Place (Holy of Holies) with the Ark of the Covenant. In John 1:14, Jesus 'tabernacled' among us in the flesh.",
    keyVerse: "Exodus 25:8",
    keyVerseText: "And let them make me a sanctuary, that I may dwell in their midst."
  },
  "ark": {
    word: "ark",
    phonetic: "/ɑːrk/",
    partOfSpeech: "noun",
    origin: "Hebrew: תֵּבָה (tevah - box/chest) | אֲרוֹן (aron - chest)",
    definition: "A protective vessel of deliverance (Noah's Ark) or the sacred gold-plated chest containing the Ten Commandments (Ark of the Covenant).",
    biblicalContext: "Noah's ark delivered 8 souls through water (pointing to Christ). The Ark of the Covenant sat in the Holy of Holies beneath the Mercy Seat.",
    keyVerse: "Hebrews 9:4",
    keyVerseText: "Having the golden altar of incense and the ark of the covenant covered on all sides with gold."
  },
  "firmament": {
    word: "firmament",
    phonetic: "/ˈfɜːr.mə.mənt/",
    partOfSpeech: "noun",
    origin: "Hebrew: רָקִיעַ (raqia - 'expanse / hammered-out canopy')",
    definition: "The vast celestial expanse of the sky and heavens dividing the waters above from the waters below at Creation.",
    biblicalContext: "Genesis 1:6-8 describes God establishing the raqia, called 'Heaven', displaying His power and wisdom.",
    keyVerse: "Psalm 19:1",
    keyVerseText: "The heavens declare the glory of God, and the sky [firmament] above proclaims his handiwork."
  },
  "cherubim": {
    word: "cherubim",
    phonetic: "/ˈtʃɛr.ə.bɪm/",
    partOfSpeech: "noun",
    origin: "Hebrew: כְּרוּבִים (keruvim - plural of כְּרוּב keruv)",
    definition: "High-ranking angelic beings associated with God's throne, supreme holiness, and guarding sacred spaces.",
    biblicalContext: "Guarded the Garden of Eden after the Fall; gold statues of two cherubim overshadowed the Mercy Seat on the Ark of the Covenant with outspread wings.",
    keyVerse: "Exodus 25:20",
    keyVerseText: "The cherubim shall spread out their wings above, overshadowing the mercy seat with their wings, their faces one to another."
  },
  "begat": {
    word: "begat",
    phonetic: "/bɪˈɡæt/",
    partOfSpeech: "verb",
    origin: "Archaic English (past tense of beget) | Hebrew: יָלַד (yalad - to bear / father)",
    definition: "To father or generate offspring; used extensively in biblical genealogies to trace lineage.",
    biblicalContext: "Prominent in Genesis 5, Genesis 11, and Matthew 1, recording the unbroken prophetic royal lineage from Adam and Abraham to Jesus the Messiah.",
    keyVerse: "Matthew 1:1-2",
    keyVerseText: "The book of the genealogy of Jesus Christ, the son of David, the son of Abraham. Abraham begat Isaac, and Isaac begat Jacob..."
  },
  "unto": {
    word: "unto",
    phonetic: "/ˈʌn.tuː/",
    partOfSpeech: "preposition",
    origin: "Archaic / Middle English preposition",
    definition: "To, toward, or until; expressing motion, direction, purpose, or relational address.",
    biblicalContext: "Frequently used in the King James Version (e.g., 'The LORD said unto Moses', 'Unto us a child is born').",
    keyVerse: "Isaiah 9:6",
    keyVerseText: "For unto us a child is born, unto us a son is given; and the government shall be upon his shoulder."
  },
  "thou": {
    word: "thou",
    phonetic: "/ðaʊ/",
    partOfSpeech: "pronoun",
    origin: "Old English þū",
    definition: "The second-person singular pronoun ('you'), addressing one individual directly or addressing God with reverence.",
    biblicalContext: "In early modern English, 'thou' was singular while 'ye/you' was plural. In prayer, it expressed personal intimacy with God.",
    keyVerse: "Psalm 23:4",
    keyVerseText: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me."
  },
  "thee": {
    word: "thee",
    phonetic: "/ðiː/",
    partOfSpeech: "pronoun",
    origin: "Old English þē",
    definition: "Objective form of 'thou' (equivalent to 'you' as an object of a verb or preposition).",
    biblicalContext: "Used when one specific person or God is the recipient of an action (e.g., 'I will praise thee').",
    keyVerse: "Psalm 139:14",
    keyVerseText: "I will praise thee; for I am fearfully and wonderfully made."
  },
  "thy": {
    word: "thy",
    phonetic: "/ðaɪ/",
    partOfSpeech: "pronoun",
    origin: "Old English þīn",
    definition: "Possessive adjective meaning 'your' (used before words starting with a consonant).",
    biblicalContext: "Addresses one individual's possessions or attributes, as in 'Thy Kingdom come, Thy will be done'.",
    keyVerse: "Matthew 6:10",
    keyVerseText: "Thy kingdom come. Thy will be done in earth, as it is in heaven."
  },
  "hath": {
    word: "hath",
    phonetic: "/hæθ/",
    partOfSpeech: "verb",
    origin: "Archaic third-person singular present tense of 'have'",
    definition: "Has; possesses or holds.",
    biblicalContext: "Standard KJV phrasing for third-person singular (e.g. 'He that hath ears to hear, let him hear').",
    keyVerse: "John 3:36",
    keyVerseText: "He that believeth on the Son hath everlasting life."
  },
  "saith": {
    word: "saith",
    phonetic: "/sɛθ/",
    partOfSpeech: "verb",
    origin: "Archaic third-person singular present tense of 'say'",
    definition: "Says; speaks or declares authoritatively.",
    biblicalContext: "Foundational prophetic formula: 'Thus saith the LORD', certifying that the speaker conveys the direct, infallible revelation of God.",
    keyVerse: "Isaiah 44:6",
    keyVerseText: "Thus saith the LORD the King of Israel, and his redeemer the LORD of hosts; I am the first, and I am the last; and beside me there is no God."
  },
  "altar": {
    word: "altar",
    phonetic: "/ˈɔːl.tər/",
    partOfSpeech: "noun",
    origin: "Hebrew: מִזְבֵּחַ (mizbeach - 'place of slaughter') | Greek: θυσιαστήριον (thysiasterion)",
    definition: "A sacred elevated structure on which sacrifices, incense, or offerings are presented in worship to God.",
    biblicalContext: "Noah, Abraham, Isaac, and Jacob built altars. In the Tabernacle, the Bronze Altar received blood sacrifices, and the Golden Altar received sweet incense.",
    keyVerse: "Hebrews 13:10",
    keyVerseText: "We have an altar from which those who serve the tent have no right to eat."
  },
  "priest": {
    word: "priest",
    phonetic: "/priːst/",
    partOfSpeech: "noun",
    origin: "Hebrew: כֹּהֵן (kohen) | Greek: ἱερεύς (hiereus)",
    definition: "A mediator appointed to represent human beings before God, offering gifts, intercessions, and sacrifices for sins.",
    biblicalContext: "The Aaronic priesthood administered sacrifices in the Tabernacle and Temple. Jesus Christ is our eternal High Priest after the order of Melchizedek (Hebrews 7).",
    keyVerse: "Hebrews 4:14",
    keyVerseText: "Since then we have a great high priest who has passed through the heavens, Jesus, the Son of God, let us hold fast our confession."
  },
  "prophet": {
    word: "prophet",
    phonetic: "/ˈprɒf.ɪt/",
    partOfSpeech: "noun",
    origin: "Hebrew: נָבִיא (navi - 'spokesperson') | Greek: προφήτης (prophetes)",
    definition: "An authorized spokesperson called by God to proclaim divine truth, summon repentance, and reveal future events.",
    biblicalContext: "Old Testament prophets spoke 'Thus says the Lord'. Jesus is the supreme Prophet foretold by Moses (Deut 18:15).",
    keyVerse: "Hebrews 1:1-2",
    keyVerseText: "Long ago, at many times and in many ways, God spoke to our fathers by the prophets, but in these last days he has spoken to us by his Son."
  },
  "disciple": {
    word: "disciple",
    phonetic: "/dɪˈsaɪ.pəl/",
    partOfSpeech: "noun",
    origin: "Greek: μαθητής (mathetes - 'learner / apprentice')",
    definition: "A devoted student and follower who attaches themselves to a teacher to master and live out their doctrine and way of life.",
    biblicalContext: "Jesus called men and women to deny themselves, take up their cross daily, and follow Him as genuine disciples.",
    keyVerse: "Luke 9:23",
    keyVerseText: "And he said to all, 'If anyone would come after me, let him deny himself and take up his cross daily and follow me.'"
  },
  "apostle": {
    word: "apostle",
    phonetic: "/əˈpɒs.əl/",
    partOfSpeech: "noun",
    origin: "Greek: ἀπόστολος (apostolos - 'one sent forth with official authority')",
    definition: "An emissary or delegate commissioned directly by Jesus Christ with ambassadorial authority to proclaim the Gospel and establish churches.",
    biblicalContext: "Specifically the Twelve chosen by Jesus plus Paul, chosen as eyewitnesses of the risen Christ to lay the foundation of the Church.",
    keyVerse: "Galatians 1:1",
    keyVerseText: "Paul, an apostle—not from men nor through man, but through Jesus Christ and God the Father, who raised him from the dead."
  },
  "parable": {
    word: "parable",
    phonetic: "/ˈpær.ə.bəl/",
    partOfSpeech: "noun",
    origin: "Greek: παραβολή (parabole - 'placing side by side for comparison')",
    definition: "An earthly story with a profound heavenly and spiritual meaning used by Jesus to reveal truths about the Kingdom of God.",
    biblicalContext: "Jesus taught the crowds in parables (the Sower, Good Samaritan, Prodigal Son) to reveal truth to hungry hearts while confounding the proud.",
    keyVerse: "Matthew 13:34",
    keyVerseText: "All these things Jesus said to the crowds in parables; indeed, he said nothing to them without a parable."
  },
  "sabbath": {
    word: "sabbath",
    phonetic: "/ˈsæb.əθ/",
    partOfSpeech: "noun",
    origin: "Hebrew: שַׁבָּת (shabbat - 'to cease / rest')",
    definition: "The seventh day of the week ordained by God at Creation and commanded in the Law for holy rest and worship.",
    biblicalContext: "Points forward to the spiritual rest believers enter through faith in Jesus Christ (Hebrews 4:9-10), ceasing from works to earn salvation.",
    keyVerse: "Exodus 20:8",
    keyVerseText: "Remember the Sabbath day, to keep it holy."
  },
  "manna": {
    word: "manna",
    phonetic: "/ˈmæn.ə/",
    partOfSpeech: "noun",
    origin: "Hebrew: מָן (man - 'What is it?')",
    definition: "The miraculous white bread that rained from heaven every morning to sustain Israel for 40 years in the wilderness.",
    biblicalContext: "Foreshadows Jesus Christ, who proclaimed in John 6: 'I am the true bread from heaven. Whoever feeds on my flesh has eternal life.'",
    keyVerse: "John 6:35",
    keyVerseText: "Jesus said to them, 'I am the bread of life; whoever comes to me shall not hunger, and whoever believes in me shall never thirst.'"
  },
  "amen": {
    word: "amen",
    phonetic: "/ɑːˈmɛn/ or /ˈeɪ.mɛn/",
    partOfSpeech: "interjection",
    origin: "Hebrew: אָמֵן (amen - 'so be it / firmly reliable / true')",
    definition: "A solemn affirmation affirming truth, steadfast certainty, and wholehearted agreement with God's word.",
    biblicalContext: "In Revelation 3:14, Jesus is Himself called 'The Amen, the faithful and true witness'.",
    keyVerse: "2 Corinthians 1:20",
    keyVerseText: "For all the promises of God find their Yes in him. That is why it is through him that we utter our Amen to God for his glory."
  },
  "hallelujah": {
    word: "hallelujah",
    phonetic: "/ˌhæl.ɪˈluː.jə/",
    partOfSpeech: "interjection",
    origin: "Hebrew: הַלְלוּ יָהּ (Hallelu Yah - 'Praise the LORD / Yahweh')",
    definition: "A joyous exclamation of praise and adoration celebrating the majesty and victory of the Lord God Almighty.",
    biblicalContext: "Concludes the final Psalms and rings out in heaven in Revelation 19 at the marriage supper of the Lamb and Christ's triumph.",
    keyVerse: "Revelation 19:6",
    keyVerseText: "Then I heard what seemed to be the voice of a great multitude... crying out, 'Hallelujah! For the Lord our God the Almighty reigns.'"
  },
  "hosanna": {
    word: "hosanna",
    phonetic: "/hoʊˈzæn.ə/",
    partOfSpeech: "interjection",
    origin: "Hebrew: הוֹשִׁיעָה נָּא (Hoshia-na - 'Save, please! / Save now!')",
    definition: "An urgent cry of petition for salvation which transformed into a triumphant shout of praise welcoming the Messiah King.",
    biblicalContext: "Cried by the crowds waving palm branches as Jesus rode into Jerusalem on a donkey during the Triumphal Entry.",
    keyVerse: "Matthew 21:9",
    keyVerseText: "And the crowds that went before him and that followed him were shouting, 'Hosanna to the Son of David! Blessed is he who comes in the name of the Lord! Hosanna in the highest!'"
  }
};

// Helper: look up word in local dictionary with fuzzy matching
export function lookupBiblicalWord(raw) {
  if (!raw) return null;
  const clean = raw.toLowerCase().replace(/[^a-z]/g, '').trim();
  if (!clean) return null;

  // 1. Direct match
  if (biblicalDictionary[clean]) return biblicalDictionary[clean];

  // 2. Singular / Plural / Tense normalization
  const candidates = [
    clean,
    clean.replace(/s$/, ''),
    clean.replace(/es$/, ''),
    clean.replace(/ed$/, ''),
    clean.replace(/ing$/, ''),
    clean.replace(/eth$/, ''),
    clean.replace(/est$/, '')
  ];

  for (const c of candidates) {
    if (biblicalDictionary[c]) return biblicalDictionary[c];
  }

  // 3. Substring match
  const keys = Object.keys(biblicalDictionary);
  const foundKey = keys.find(k => k === clean || clean.startsWith(k) || k.startsWith(clean));
  if (foundKey && Math.abs(foundKey.length - clean.length) <= 3) {
    return biblicalDictionary[foundKey];
  }

  return null;
}
