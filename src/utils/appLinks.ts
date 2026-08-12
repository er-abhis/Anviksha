import { Alert, Linking, Share } from 'react-native';
import { APP, SHARE_MESSAGE } from '../constants/app';

/** Web Play Store listing (works in a browser even before the app is live). */
export const webStoreUrl = (): string =>
  APP.playStoreUrl ||
  `https://play.google.com/store/apps/details?id=${APP.androidPackageId}`;

/** Contact form. Opens blank so the user fills in their own details. */
export const CONTACT_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSegGLSx_D7qSQbZePAeZlBfF42d-0f-sq3zPOFJ5GfUFZKHcA/viewform';

export const DEVELOPER_LINKEDIN =
  'https://www.linkedin.com/in/er-abhishek-choudhary/';

/** Open a URL in the system browser; alert on failure instead of crashing. */
export const openExternal = async (url: string): Promise<void> => {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Could not open link', url);
  }
};

export const shareApp = async (): Promise<void> => {
  try {
    await Share.share({ message: `${SHARE_MESSAGE} ${webStoreUrl()}`.trim() });
  } catch {
    // User dismissed the sheet, or sharing is unavailable — nothing to do.
  }
};

export const rateApp = async (): Promise<void> => {
  // Prefer the native Play Store app; fall back to the web listing.
  const marketUrl = `market://details?id=${APP.androidPackageId}`;
  try {
    if (await Linking.canOpenURL(marketUrl)) {
      await Linking.openURL(marketUrl);
      return;
    }
    await Linking.openURL(webStoreUrl());
  } catch {
    Alert.alert(
      'Not available yet',
      `${APP.name} isn’t on the Play Store yet. Thanks for wanting to rate it!`,
    );
  }
};

export const openContactForm = (): Promise<void> => openExternal(CONTACT_FORM_URL);
