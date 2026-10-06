---
name: public-apis
description: Comprehensive directory and discovery tool for 2,000+ free public APIs across 52 categories including Bible & Scripture, Books, Geocoding, Maps, Calendars, Translation, Dictionaries, Weather, and Developer Tools. Use whenever searching for external APIs or integrating third-party data services.
---

# Public APIs Directory Skill

This skill provides on-demand search, discovery, and integration guidance for the **Public APIs** repository ([public-apis/public-apis](https://github.com/public-apis/public-apis)), containing over **2,040+ free public APIs** organized into **52 categories**.

---

## Quick API Search Tool

You can instantly search the local database of all 2,040+ APIs using the included Node.js script:

```bash
# Search by keyword (e.g. bible, weather, geocoding, translation, book)
node "C:\Users\PC\.gemini\config\skills\public-apis\scripts\search.js" <query>

# Examples:
node "C:\Users\PC\.gemini\config\skills\public-apis\scripts\search.js" bible
node "C:\Users\PC\.gemini\config\skills\public-apis\scripts\search.js" geocoding
node "C:\Users\PC\.gemini\config\skills\public-apis\scripts\search.js" dictionary
node "C:\Users\PC\.gemini\config\skills\public-apis\scripts\search.js" calendar

# List all 52 categories and counts:
node "C:\Users\PC\.gemini\config\skills\public-apis\scripts\search.js"
```

---

## Key Categories Relevant to ChosenWord (Bible & Study Apps)

### 1. Scripture & Bible APIs
| API | Description | Auth | HTTPS | CORS | URL |
|---|---|---|---|---|---|
| **Bible-api.com** | Free REST API for scripture lookup in multiple languages | None | Yes | Yes | `https://bible-api.com/` |
| **The Bible (API.Bible)** | American Bible Society's platform with hundreds of licensed translations | apiKey | Yes | Unknown | `https://docs.api.bible` |
| **A Bíblia Digital** | Portuguese and international Bible versions API | apiKey | Yes | No | `https://www.abibliadigital.com.br/en` |
| **GetBible.net** | Lightweight JSON API for multi-translation scripture passages | None | Yes | Yes | `https://getbible.net/` |

#### Quick Usage Example (Bible-api.com):
```javascript
// Fetch John 3:16 in KJV or other translations
const res = await fetch('https://bible-api.com/john+3:16?translation=kjv');
const data = await res.json();
console.log(data.text); // "For God so loved the world..."
console.log(data.reference); // "John 3:16"
```

---

### 2. Hebrew & Biblical Calendar APIs
| API | Description | Auth | HTTPS | CORS | URL |
|---|---|---|---|---|---|
| **Hebrew Calendar (Hebcal)** | Gregorian ↔ Hebrew date conversion, Shabbat times, Jewish holidays (Passover, Pentecost, Tabernacles) | None | Yes | Yes | `https://www.hebcal.com/home/developer-apis` |

#### Quick Usage Example (Hebcal):
```javascript
// Get Jewish holiday dates for any year
const res = await fetch('https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=2026&month=x&ss=on&mf=on&c=on&geo=none');
const data = await res.json();
console.log(data.items); // Holiday events with dates
```

---

### 3. Geocoding & Biblical Locations (Mapping Jerusalem, Rome, Sinai)
| API | Description | Auth | HTTPS | CORS | URL |
|---|---|---|---|---|---|
| **Nominatim (OpenStreetMap)** | Free worldwide forward and reverse geocoding | None | Yes | Yes | `https://nominatim.org/` |
| **OpenCage** | High-reliability geocoding | apiKey | Yes | Yes | `https://opencagedata.com` |
| **Geoapify** | Address autocomplete and places lookup | apiKey | Yes | Yes | `https://www.geoapify.com/` |

#### Quick Usage Example (Nominatim):
```javascript
// Lookup coordinates for Jerusalem or Mount Sinai
const res = await fetch('https://nominatim.openstreetmap.org/search?q=Jerusalem&format=json', {
  headers: { 'User-Agent': 'ChosenWordApp' }
});
const places = await res.json();
console.log(places[0].lat, places[0].lon); // 31.7788, 35.2257
```

---

### 4. Dictionaries & Word Concordance
| API | Description | Auth | HTTPS | CORS | URL |
|---|---|---|---|---|---|
| **Free Dictionary API** | Definitions, etymology, phonetic audio pronunciation | None | Yes | Yes | `https://dictionaryapi.dev/` |
| **WordsAPI** | English word definitions, synonyms, word associations | apiKey | Yes | Unknown | `https://www.wordsapi.com/` |

---

### 5. Daily Inspiration & Quotes
| API | Description | Auth | HTTPS | CORS | URL |
|---|---|---|---|---|---|
| **ZenQuotes API** | Free inspirational quotes and daily sayings | None | Yes | Yes | `https://zenquotes.io/` |
| **FavQs** | Curated quote collections and quote of the day | apiKey | Yes | Yes | `https://favqs.com/` |

---

## All 52 Available Categories in the Index

- **Animals** (62 APIs)
- **Anime** (33 APIs)
- **Anti-Malware** (6 APIs)
- **Art & Design** (31 APIs)
- **Authentication & Authorization** (13 APIs)
- **Blockchain** (34 APIs)
- **Books** (38 APIs) — *Includes Bible APIs*
- **Business** (42 APIs)
- **Calendar** (23 APIs) — *Includes Hebrew & astronomical calendars*
- **Cloud Storage & File Sharing** (18 APIs)
- **Continuous Integration** (8 APIs)
- **Cryptocurrency** (84 APIs)
- **Currency Exchange** (24 APIs)
- **Data Validation** (12 APIs)
- **Development** (145 APIs)
- **Dictionaries** (18 APIs) — *Word meanings & etymology*
- **Documents & Productivity** (32 APIs)
- **Email** (18 APIs)
- **Entertainment** (87 APIs)
- **Environment** (36 APIs)
- **Events** (6 APIs)
- **Finance** (48 APIs)
- **Food & Drink** (35 APIs)
- **Games & Comics** (152 APIs)
- **Geocoding** (24 APIs) — *Maps, coordinates & places*
- **Government** (87 APIs)
- **Health** (46 APIs)
- **Jobs** (31 APIs)
- **Machine Learning** (74 APIs)
- **Music** (45 APIs)
- **News** (54 APIs)
- **Open Data** (48 APIs)
- **Open Source Projects** (16 APIs)
- **Patent** (5 APIs)
- **Personality** (14 APIs)
- **Phone** (7 APIs)
- **Photography** (22 APIs)
- **Science & Math** (118 APIs)
- **Security** (46 APIs)
- **Shopping** (15 APIs)
- **Social** (62 APIs)
- **Sports & Fitness** (68 APIs)
- **Test Data** (22 APIs)
- **Text Analysis** (28 APIs)
- **Tracking** (6 APIs)
- **Transportation** (64 APIs)
- **URL Shorteners** (11 APIs)
- **Vehicle** (24 APIs)
- **Video** (35 APIs)
- **Weather** (46 APIs)

---

## How to Integrate an API into ChosenWord Next.js App

When integrating any of these public APIs into this Next.js project:
1. **Direct client fetch (if CORS is Yes)**:
   ```javascript
   useEffect(() => {
     fetch('https://bible-api.com/john+3:16')
       .then(r => r.json())
       .then(data => setVerse(data));
   }, []);
   ```
2. **Next.js API Route / Server Proxy (if CORS is No or requires apiKey)**:
   Create a route at `app/api/<service>/route.js` to keep your API keys secret on the server:
   ```javascript
   // app/api/external-scripture/route.js
   export async function GET(request) {
     const { searchParams } = new URL(request.url);
     const query = searchParams.get('q') || 'John 1:1';
     const res = await fetch(`https://api.external.com/v1?ref=${query}`, {
       headers: { 'Authorization': `Bearer ${process.env.API_KEY}` }
     });
     const data = await res.json();
     return Response.json(data);
   }
   ```
