import AppResource from 'general/constants/AppResource';
import i18n from 'i18n';

const LanguageHelper = {
  /**
   * Get current language
   * @returns
   */
  getCurrentLanguage: () => {
    return i18n.language;
  },

  /**
   * Change language
   * @param {string} language vi | en
   */
  changeLanguage: (language) => {
    i18n.changeLanguage(language);
  },

  /**
   * Get current language icon
   * @returns
   */
  getCurrentLanguageIcon: () => {
    const currentLanguage = i18n.language;
    if (currentLanguage === 'en') {
      return AppResource.icons.icFlagUs;
    } else {
      return AppResource.icons.icFlagVi;
    }
  },
};

export default LanguageHelper;
