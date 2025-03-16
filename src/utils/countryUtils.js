/**
 * Map of ISO 3166-1 alpha-2 country codes to country names
 */
export const countryCodeToName = {
  'AE': 'United Arab Emirates',
  'AR': 'Argentina',
  'AT': 'Austria',
  'AU': 'Australia',
  'BE': 'Belgium',
  'BG': 'Bulgaria',
  'BR': 'Brazil',
  'CA': 'Canada',
  'CH': 'Switzerland',
  'CN': 'China',
  'CO': 'Colombia',
  'CU': 'Cuba',
  'CZ': 'Czech Republic',
  'DE': 'Germany',
  'EG': 'Egypt',
  'ES': 'Spain',
  'FR': 'France',
  'GB': 'United Kingdom',
  'GR': 'Greece',
  'HK': 'Hong Kong',
  'HU': 'Hungary',
  'ID': 'Indonesia',
  'IE': 'Ireland',
  'IL': 'Israel',
  'IN': 'India',
  'IT': 'Italy',
  'JP': 'Japan',
  'KR': 'South Korea',
  'LT': 'Lithuania',
  'LV': 'Latvia',
  'MA': 'Morocco',
  'MX': 'Mexico',
  'MY': 'Malaysia',
  'NG': 'Nigeria',
  'NL': 'Netherlands',
  'NO': 'Norway',
  'NZ': 'New Zealand',
  'PH': 'Philippines',
  'PL': 'Poland',
  'PT': 'Portugal',
  'RO': 'Romania',
  'RS': 'Serbia',
  'RU': 'Russia',
  'SA': 'Saudi Arabia',
  'SE': 'Sweden',
  'SG': 'Singapore',
  'SI': 'Slovenia',
  'SK': 'Slovakia',
  'TH': 'Thailand',
  'TR': 'Turkey',
  'TW': 'Taiwan',
  'UA': 'Ukraine',
  'US': 'United States',
  'VE': 'Venezuela',
  'ZA': 'South Africa'
};

/**
 * Convert a country code to its full name
 * @param {string} code - ISO 3166-1 alpha-2 country code
 * @returns {string} Full country name or the original code if not found
 */
export const getCountryName = (code) => {
  if (!code) return '';
  const upperCode = code.toUpperCase();
  return countryCodeToName[upperCode] || upperCode;
};
