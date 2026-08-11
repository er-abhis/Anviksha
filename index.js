/**
 * @format
 */

// Must be the first import (react-native-gesture-handler requirement)
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import notifee from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';

// Required by notifee: must be registered at the top level (not inside a component).
// Taps are routed via getInitialNotification / onForegroundEvent once the app is up.
notifee.onBackgroundEvent(async () => {});

AppRegistry.registerComponent(appName, () => App);
