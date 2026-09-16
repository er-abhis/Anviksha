/**
 * Anviksha — interactive AI simulation platform.
 * @format
 */

import React, { useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ErrorBoundary } from './src/components';
import { initNotifications } from './src/services/notifications';
import { checkForUpdates } from './src/services/appUpdate';
import { usePreferencesStore } from './src/store';

const App: React.FC = () => {
  useEffect(() => {
    initNotifications();
    checkForUpdates();
  }, []);

  // Respect the OS "Remove animations" accessibility setting: treat it as a
  // floor that forces reduced motion on, without clobbering a manual opt-in.
  useEffect(() => {
    const enable = (on: boolean) => {
      if (on) usePreferencesStore.getState().setReducedMotion(true);
    };
    AccessibilityInfo.isReduceMotionEnabled().then(enable).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', enable);
    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <RootNavigator />
          </ErrorBoundary>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
