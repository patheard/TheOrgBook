/**
 * Returns the current lang for the application
 * using the existing base path
 * or the browser lang if there is no base path
 * @returns {string}
 */
export function getLang(): string | null {
  if(typeof window === 'undefined' || typeof window.navigator === 'undefined') {
    return null;
  }

  const basePath = window.location.pathname.replace('/', '').split('/');
  let lang: string = basePath.length ? basePath[0] : '';

  if(!lang) {
    lang = window.navigator['languages'] ? window.navigator['languages'][0] : null;
    lang = lang || window.navigator.language || window.navigator['browserLanguage'] || window.navigator['userLanguage'];

    if(lang.indexOf('-') !== -1) {
      lang = lang.split('-')[0];
    }

    if(lang.indexOf('_') !== -1) {
      lang = lang.split('_')[0];
    }
  }
  return lang.match(/^(en|fr)$/) ? lang : 'en';
}
