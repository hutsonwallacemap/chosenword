export const offlineTranslations = [
  { id: 'kjv_offline', name: 'English: KJV', filename: 'KJV' },
  { id: 'kjvpce_offline', name: 'English: KJV (PCE)', filename: 'kjvpce' },
  { id: 'AKJV_offline', name: 'English: AKJV', filename: 'AKJV' },
  { id: 'ASV_offline', name: 'English: ASV', filename: 'ASV' },
  { id: 'BBE_offline', name: 'English: BBE', filename: 'BBE' },
  { id: 'net_offline', name: 'English: NET', filename: 'net' },
  { id: 'web_offline', name: 'English: WEB', filename: 'web' },
  { id: 'geneva_offline', name: 'Geneva Bible (1599)', filename: 'geneva' },
  { id: 'bishops_offline', name: 'Bishops Bible (1568)', filename: 'bishops' },
  { id: 'coverdale_offline', name: 'Coverdale Bible (1535)', filename: 'coverdale' },
  { id: 'tyndale_offline', name: 'Tyndale Bible (partial)', filename: 'tyndale' },
  { id: 'asvs_offline', name: 'ASV (Strongs)', filename: 'asvs' },
  { id: 'kjv_strongs_offline', name: 'KJV (Strongs)', filename: 'kjv_strongs' },
  { id: 'hindi_offline', name: 'Hindi', filename: 'hindi_offline' },
  { id: 'ta_offline', name: 'Tamil', filename: 'ta_offline' },
];

export const getTtsLanguage = (translationId) => {
  if (translationId.includes('hindi')) return 'hi-IN';
  if (translationId.includes('ta_')) return 'ta-IN';
  if (translationId.includes('te_')) return 'te-IN';
  if (translationId.includes('bn_')) return 'bn-IN';
  if (translationId.includes('ml_')) return 'ml-IN';
  return 'en-US';
};
