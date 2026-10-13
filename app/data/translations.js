// sizeMB = size of the full-Bible JSON file the browser downloads for that translation
export const offlineTranslations = [
  { id: 'kjv_offline', name: 'English: KJV', filename: 'KJV', sizeMB: 6.0 },
  { id: 'kjvpce_offline', name: 'English: KJV (PCE)', filename: 'kjvpce', sizeMB: 6.0 },
  { id: 'AKJV_offline', name: 'English: AKJV', filename: 'AKJV', sizeMB: 8.1 },
  { id: 'ASV_offline', name: 'English: ASV', filename: 'ASV', sizeMB: 5.9 },
  { id: 'BBE_offline', name: 'English: BBE', filename: 'BBE', sizeMB: 8.2 },
  { id: 'net_offline', name: 'English: NET', filename: 'net', sizeMB: 6.0 },
  { id: 'web_offline', name: 'English: WEB', filename: 'web', sizeMB: 5.8 },
  { id: 'geneva_offline', name: 'Geneva Bible (1599)', filename: 'geneva', sizeMB: 5.9 },
  { id: 'bishops_offline', name: 'Bishops Bible (1568)', filename: 'bishops', sizeMB: 6.0 },
  { id: 'coverdale_offline', name: 'Coverdale Bible (1535)', filename: 'coverdale', sizeMB: 5.9 },
  { id: 'tyndale_offline', name: 'Tyndale Bible (partial)', filename: 'tyndale', sizeMB: 2.5 },
  { id: 'asvs_offline', name: 'ASV (Strongs)', filename: 'asvs', sizeMB: 8.2 },
  { id: 'kjv_strongs_offline', name: 'KJV (Strongs)', filename: 'kjv_strongs', sizeMB: 9.1 },
  { id: 'hindi_offline', name: 'Hindi', filename: 'hindi_offline', sizeMB: 9.2 },
  { id: 'ta_offline', name: 'Tamil', filename: 'ta_offline', sizeMB: 12.1 },
];

export const getTtsLanguage = (translationId) => {
  if (translationId.includes('hindi')) return 'hi-IN';
  if (translationId.includes('ta_')) return 'ta-IN';
  if (translationId.includes('te_')) return 'te-IN';
  if (translationId.includes('bn_')) return 'bn-IN';
  if (translationId.includes('ml_')) return 'ml-IN';
  return 'en-US';
};
