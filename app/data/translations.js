export const offlineTranslations = [
  { id: 'AKJV_offline', name: 'English: AKJV', filename: 'AKJV' },
  { id: 'ASV_offline', name: 'English: ASV', filename: 'ASV' },
  { id: 'BBE_offline', name: 'English: BBE', filename: 'BBE' },
  { id: 'hindi_offline', name: 'Hindi', filename: 'hindi_offline' },
  { id: 'ta_offline', name: 'Tamil', filename: 'ta_offline' },
  { id: 'asvs', name: 'ASVS', filename: 'asvs' },
  { id: 'bishops', name: 'Bishops', filename: 'bishops' },
  { id: 'geneva', name: 'Geneva', filename: 'geneva' },
  { id: 'kjv_strongs', name: 'KJV (Strongs)', filename: 'kjv_strongs' },
  { id: 'net', name: 'NET', filename: 'net' },
  { id: 'web', name: 'WEB', filename: 'web' }
  // To add a new translation:
  // 1. Upload your JSON file to the public/ folder (e.g. telugu.json)
  // 2. Add a new line here: { id: 'telugu_offline', name: 'Telugu', filename: 'telugu' }
];

export const getTtsLanguage = (translationId) => {
  if (translationId.includes('hindi')) return 'hi-IN';
  if (translationId.includes('ta_')) return 'ta-IN';
  if (translationId.includes('te_')) return 'te-IN';
  if (translationId.includes('bn_')) return 'bn-IN';
  if (translationId.includes('ml_')) return 'ml-IN';
  return 'en-US';
};
