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
  // Entering/exiting/layout builders are fluent: every modifier (.duration,
  // .delay, .springify, .damping, .stiffness, .withInitialValues…) returns the
  // same builder. A Proxy makes ANY method chainable so we never have to
  // enumerate Reanimated's fluent API in the mock.
  const makeChainable = () =>
    new Proxy(function () {}, {
      get: () => makeChainable(),
      apply: () => makeChainable(),
    });
  return {
    __esModule: true,
    default: { View, Text, ScrollView, createAnimatedComponent: c => c },
    View,
    Text,
    ScrollView,
    Easing,
    // Layout / entering / exiting presets — all chainable builders.
    FadeIn: makeChainable(),
    FadeOut: makeChainable(),
    FadeInDown: makeChainable(),
    FadeInUp: makeChainable(),
    FadeInLeft: makeChainable(),
    FadeInRight: makeChainable(),
    FadeOutDown: makeChainable(),
    FadeOutUp: makeChainable(),
    SlideInDown: makeChainable(),
    SlideInUp: makeChainable(),
    SlideInLeft: makeChainable(),
    SlideInRight: makeChainable(),
    SlideOutLeft: makeChainable(),
    SlideOutRight: makeChainable(),
    ZoomIn: makeChainable(),
    ZoomOut: makeChainable(),
    Layout: makeChainable(),
    LinearTransition: makeChainable(),
    Keyframe: function () { return makeChainable(); },
    // Worklet-thread helpers — no-op / pass-through in tests.
    useSharedValue: initial => ({ value: initial }),
    useAnimatedStyle: () => ({}),
    useAnimatedProps: () => ({}),
    useAnimatedReaction: () => {},
    useAnimatedScrollHandler: () => () => {},
    useDerivedValue: fn => ({ value: fn() }),
    runOnJS: fn => (...args) => fn(...args),
    runOnUI: fn => fn,
    withTiming: identity,
    withDelay: (_d, v) => v,
    withSpring: identity,
    withRepeat: identity,
    withSequence: (...vs) => vs[vs.length - 1],
    cancelAnimation: () => {},
    interpolate: () => 0,
    interpolateColor: () => 'rgba(0,0,0,0)',
    Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
    Extrapolate: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
  };
});

// react-native-share is native — stub the share API used by appLinks.
jest.mock('react-native-share', () => ({
  __esModule: true,
  default: { open: jest.fn(async () => ({ success: true })) },
}));

// react-native-view-shot is native — stub capture + the ViewShot wrapper.
jest.mock('react-native-view-shot', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: View, captureRef: jest.fn(async () => 'file://mock.png') };
});

// react-native-worklets is native (JSI) — stub runOnJS to call through on JS.
jest.mock('react-native-worklets', () => ({
  runOnJS: fn => (...args) => fn(...args),
  runOnUI: fn => fn,
  scheduleOnRN: (fn, ...args) => fn(...args),
}));

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
