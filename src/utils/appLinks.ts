import { Alert, Linking, Share } from 'react-native';
import { APP, SHARE_MESSAGE } from '../constants/app';
import { Lesson } from '../content/types';

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

/**
 * Build the achievement caption from the real lesson — title + what was
 * learned + Play Store link. Used as the share text (and travels alongside the
 * image so apps that show both, like WhatsApp, get context under the picture).
 */
export const buildAchievementMessage = (lesson: Lesson): string => {
  const bullets = (lesson.objectives.length ? lesson.objectives : lesson.keyTakeaways)
    .slice(0, 5)
    .map(o => `• ${o}`)
    .join('\n');
  return (
    `🎓 I just completed “${lesson.title}” on ${APP.name}.\n\n` +
    (bullets ? `Here’s what I learned:\n${bullets}\n\n` : '') +
    `Learn AI the fun way with ${APP.name}:\n${webStoreUrl()}`
  );
};

/**
 * Share an achievement through the native sheet. With an image it reaches
 * every app including image-first ones (Instagram, Stories); text-only is the
 * graceful fallback if capture fails. Uses react-native-share so image files
 * work on Android (core RN Share can't share files there).
 */
export const shareAchievement = async (message: string, imageUri?: string): Promise<void> => {
  try {
    // Lazy require: react-native-share initialises its native module at import
    // time, so importing it eagerly would crash the whole app on launch if the
    // native build is stale. Requiring it here keeps failure contained to share.
    const RNShare = require('react-native-share').default;
    if (imageUri) {
      const url =
        imageUri.startsWith('file://') || imageUri.startsWith('content://')
          ? imageUri
          : `file://${imageUri}`;
      await RNShare.open({ url, message, type: 'image/png', failOnCancel: false });
    } else {
      await RNShare.open({ message, failOnCancel: false });
    }
  } catch {
    // Native module missing (stale build), user dismissed, or unavailable —
    // fall back to the core RN share sheet (text only) so sharing still works.
    try {
      await Share.share({ message });
    } catch {
      // Nothing more to do.
    }
  }
};

export const rateApp = async (): Promise<void> => {
  const marketUrl = `market://details?id=${APP.androidPackageId}`;
  try {
    const canOpen = await Linking.canOpenURL(marketUrl).catch(() => false);
    if (canOpen) {
      await Linking.openURL(marketUrl).catch(() => {});
      return;
    }
    await Linking.openURL(webStoreUrl()).catch(() => {});
  } catch {
    Alert.alert(
      'Not available yet',
      `${APP.name} isn’t on the Play Store yet. Thanks for wanting to rate it!`,
    );
  }
};

export const openContactForm = (): Promise<void> => openExternal(CONTACT_FORM_URL);
