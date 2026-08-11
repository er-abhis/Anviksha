/* Test environment mocks for native-only modules. */
require('react-native-gesture-handler/jestSetup');

// Reanimated v4's shipped mock pulls in native worklets; use a light manual mock.
jest.mock('react-native-reanimated', () => {
  const { View, Text, ScrollView } = require('react-native');
  const identity = v => v;
  const easingFn = () => 0;
  const Easing = {
    bezier: () => easingFn,
    in: identity,
    out: identity,
    inOut: identity,
    cubic: easingFn,
    linear: easingFn,
  };
  const entering = { duration: () => entering, delay: () => entering };
  return {
    __esModule: true,
    default: { View, Text, ScrollView, createAnimatedComponent: c => c },
    View,
    Text,
    ScrollView,
    Easing,
    FadeIn: entering,
    FadeOut: entering,
    useSharedValue: initial => ({ value: initial }),
    useAnimatedStyle: () => ({}),
    withTiming: identity,
    withDelay: (_d, v) => v,
    withSpring: identity,
    withRepeat: identity,
    cancelAnimation: () => {},
  };
});

// MMKV is native (Nitro) — back it with an in-memory map for tests.
jest.mock('react-native-mmkv', () => {
  const store = new Map();
  const instance = {
    set: (k, v) => store.set(k, v),
    getString: k => store.get(k),
    getBoolean: k => store.get(k),
    getNumber: k => store.get(k),
    contains: k => store.has(k),
    remove: k => store.delete(k),
    clearAll: () => store.clear(),
    addOnValueChangedListener: () => ({ remove: () => {} }),
  };
  return { createMMKV: () => instance };
});

// notifee is native — stub methods + enums used by the notifications service.
jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    createChannel: jest.fn(async () => 'reminders'),
    requestPermission: jest.fn(async () => ({ authorizationStatus: 1 })),
    createTriggerNotification: jest.fn(async () => undefined),
    cancelTriggerNotifications: jest.fn(async () => undefined),
    onForegroundEvent: jest.fn(() => () => {}),
    onBackgroundEvent: jest.fn(() => {}),
    getInitialNotification: jest.fn(async () => null),
  },
  AndroidImportance: { DEFAULT: 3 },
  AuthorizationStatus: { AUTHORIZED: 1, PROVISIONAL: 4 },
  EventType: { PRESS: 1 },
  RepeatFrequency: { DAILY: 3 },
  TriggerType: { TIMESTAMP: 0 },
}));

// SQLite is native (JSI) — stub the quick-sqlite connection used by the runner.
jest.mock('react-native-quick-sqlite', () => ({
  open: () => ({
    execute: () => ({ rows: { _array: [], length: 0, item: () => ({}) } }),
    executeAsync: async () => ({
      rows: {
        _array: [{ user_version: 1 }],
        length: 1,
        item: () => ({ user_version: 1 }),
      },
    }),
    transaction: async cb => cb({ execute: () => ({}) }),
    close: () => {},
  }),
}));
