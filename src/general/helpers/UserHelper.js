import { removeAxiosApiKey } from 'api/axiosClient';
import AppResource from 'general/constants/AppResource';
import PreferenceKeys from 'general/constants/PreferenceKeys';
import Utils from 'general/utils/Utils';

const UserHelper = {
  // Get display name
  getDisplayName: (user) => {
    let displayName = '';
    if (user) {
      return user.displayName ?? user.username;
    }
    return displayName;
  },

  // Get display name and phone
  getDisplayNameAndPhone: (user) => {
    let displayName = '';
    if (user) {
      displayName = user.fullname ?? user.username;

      if (user.phone) {
        displayName = displayName.concat(` - ${user.phone}`);
      }
    }
    return displayName;
  },

  // Check api key valid
  checkApiKeyValid: () => {
    return true;
    const apiKey = localStorage.getItem(PreferenceKeys.apiKey);

    if (apiKey) {
      return true;
    }

    return false;
  },

  // Sign out
  signOut: () => {
    localStorage.removeItem(PreferenceKeys.apiKey);
    removeAxiosApiKey();
  },

  getAccountAvatar: (account) => {
    const avatar = account?.avatar;
    if (avatar) {
      return Utils.getFullUrl(avatar);
    } else {
      return AppResource.icons.keens.avatarBoy;
    }
  },
};

export default UserHelper;
