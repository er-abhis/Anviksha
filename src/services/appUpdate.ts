/**
 * Google Play in-app updates. On launch we ask Play whether a newer build is
 * available and, if so, start a FLEXIBLE update: it downloads in the background
 * while the user keeps using the app, then we prompt to install once it's ready.
 * Fully best-effort — no Play Store, offline, or a dev build just means no-op.
 *
 * Note: this only supplements Play's own auto-update; it can't run when the app
 * is sideloaded or installed from a non-Play source.
 */
import { Platform } from 'react-native';

let alreadyChecked = false;

export const checkForUpdates = async (): Promise<void> => {
  // In-app updates are Android-only; skip dev builds or non-Play Store installations (sideloaded APKs).
  if (Platform.OS !== 'android' || __DEV__ || alreadyChecked) return;
  alreadyChecked = true;

  try {
    const DeviceInfo = require('react-native-device-info').default || require('react-native-device-info');
    const installer = await DeviceInfo.getInstallerPackageName().catch(() => '');
    // Play Store in-app updates ONLY work when installed from Google Play (com.android.vending).
    // Running on sideloaded APKs, Oppo App Market, or manual release APKs causes Play Core to crash.
    if (installer !== 'com.android.vending') return;

    const SpInAppUpdates = require('sp-react-native-in-app-updates').default;
    const { AndroidUpdateType, AndroidInstallStatus } = require('sp-react-native-in-app-updates');
    const updates = new SpInAppUpdates(false);
    const result = await updates.checkNeedsUpdate().catch(() => null);
    if (!result || !result.shouldUpdate) return;

    updates.addStatusUpdateListener((status: any) => {
      if (status && status.status === AndroidInstallStatus.DOWNLOADED) {
        try {
          updates.installUpdate();
        } catch {
          // Swallow native install errors
        }
      }
    });

    await updates.startUpdate({ updateType: AndroidUpdateType.FLEXIBLE }).catch(() => {});
  } catch {
    // Best-effort: swallow (no Play services, offline, cancelled, dev build, sideloaded…).
  }
};

