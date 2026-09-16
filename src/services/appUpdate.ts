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
import SpInAppUpdates, {
  AndroidUpdateType,
  AndroidInstallStatus,
} from 'sp-react-native-in-app-updates';

let alreadyChecked = false;

export const checkForUpdates = async (): Promise<void> => {
  // In-app updates are Android-only; skip dev builds (not installed via Play).
  if (Platform.OS !== 'android' || __DEV__ || alreadyChecked) return;
  alreadyChecked = true;

  try {
    const updates = new SpInAppUpdates(false);
    const result = await updates.checkNeedsUpdate();
    if (!result.shouldUpdate) return;

    // Once the background download finishes, prompt the user to install (this
    // shows Play's "restart to update" snackbar/dialog).
    updates.addStatusUpdateListener(status => {
      if (status.status === AndroidInstallStatus.DOWNLOADED) {
        updates.installUpdate();
      }
    });

    await updates.startUpdate({ updateType: AndroidUpdateType.FLEXIBLE });
  } catch {
    // Best-effort: swallow (no Play services, offline, cancelled, dev build…).
  }
};
