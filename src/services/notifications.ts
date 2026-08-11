/**
 * Offline local reminders (no backend / no FCM).
 *
 * Two daily reminders — a morning Daily-Challenge nudge and an evening
 * Continue-Learning nudge — are scheduled as repeating local triggers and
 * re-computed (fresh, context-aware content) whenever progress changes or the
 * app comes to the foreground. Adding a new reminder = add one entry to
 * REMINDERS; nothing else changes.
 */
import { Alert, AppState, Platform } from 'react-native';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  EventType,
  RepeatFrequency,
  TriggerType,
} from '@notifee/react-native';
import {
  LESSONS,
  isLessonInteractiveUnlocked,
  todayISO,
} from '../content';
import { useProgressStore, useSettingsStore } from '../store';
import { storage } from '../storage/mmkv';
import { navigateFromNotification, NotificationTarget } from '../navigation/navigationRef';

const CHANNEL_ID = 'reminders';
const PRIMER_KEY = 'notif.primerShown';

/* -------------------- context -------------------- */
type Completed = Record<string, number>;

/** First not-completed lesson whose interactive part is unlocked, if any. */
const nextPendingLesson = (completed: Completed) =>
  [...LESSONS]
    .sort((a, b) => a.order - b.order)
    .find(l => !(l.id in completed) && isLessonInteractiveUnlocked(l, completed));

const allAvailableDone = (completed: Completed): boolean => {
  const unlocked = LESSONS.filter(l => isLessonInteractiveUnlocked(l, completed));
  return unlocked.length > 0 && unlocked.every(l => l.id in completed);
};

/* -------------------- reminder definitions -------------------- */
interface Built {
  title: string;
  body: string;
  target: NotificationTarget;
  /** Hour (local, 24h) to fire. */
  hour: number;
  /** Skip today's fire if this returns true (e.g. already done today). */
  skipToday?: boolean;
}

/** Each reminder is a pure builder over current state — easy to extend. */
const REMINDERS: Record<string, (completed: Completed, dailyDone: boolean) => Built> = {
  'daily-challenge': (_c, dailyDone) => ({
    title: '🧠 Daily AI Challenge is Live!',
    body:
      "Your new AI challenge is ready. Complete today's challenge, earn XP, and keep your learning streak alive!",
    target: { screen: 'DailyChallenge' },
    hour: 9,
    // If already done today, don't nudge again today — fire tomorrow instead.
    skipToday: dailyDone,
  }),
  'evening-continue': completed => {
    const pending = nextPendingLesson(completed);
    if (pending) {
      return {
        title: '📚 Continue Your AI Journey',
        body:
          "You're just one lesson away from learning something amazing. Continue your next AI lesson and keep your streak going!",
        target: { screen: 'Lesson', lessonId: pending.id },
        hour: 19,
      };
    }
    if (allAvailableDone(completed)) {
      return {
        title: '🎉 Great Progress!',
        body:
          "You've completed all available lessons. Come back tomorrow for a new Daily Challenge!",
        target: { screen: 'Home' },
        hour: 19,
      };
    }
    // Fresh user with nothing unlocked yet — point them at lesson one.
    return {
      title: '📚 Continue Your AI Journey',
      body: 'Start your first AI lesson and begin your learning streak!',
      target: { screen: 'Home' },
      hour: 19,
    };
  },
};

/* -------------------- scheduling -------------------- */
/** Next local timestamp at `hour`:00, optionally skipping today. */
const nextAt = (hour: number, skipToday: boolean): number => {
  const t = new Date();
  t.setHours(hour, 0, 0, 0);
  if (skipToday || t.getTime() <= Date.now()) t.setDate(t.getDate() + 1);
  return t.getTime();
};

let permissionGranted = false;

/** (Re)create all reminder triggers from current state. Idempotent (fixed ids). */
export const rescheduleReminders = async (): Promise<void> => {
  if (Platform.OS !== 'android' && Platform.OS !== 'ios') return;
  const enabled = useSettingsStore.getState().notifications && permissionGranted;

  // Respect the user's toggle: off → clear everything.
  if (!enabled) {
    await notifee.cancelTriggerNotifications(Object.keys(REMINDERS)).catch(() => {});
    return;
  }

  const completed = useProgressStore.getState().completed;
  const dailyDone = useProgressStore.getState().dailyCompletedDate === todayISO();

  await Promise.all(
    Object.entries(REMINDERS).map(async ([id, build]) => {
      const r = build(completed, dailyDone);
      await notifee.createTriggerNotification(
        {
          id, // fixed id → replaces, never duplicates across updates/reinstalls
          title: r.title,
          body: r.body,
          data: r.target as unknown as Record<string, string>,
          android: {
            channelId: CHANNEL_ID,
            smallIcon: 'ic_launcher',
            pressAction: { id: 'default', launchActivity: 'default' },
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: nextAt(r.hour, !!r.skipToday),
          repeatFrequency: RepeatFrequency.DAILY,
          alarmManager: { allowWhileIdle: true },
        },
      ).catch(() => {
        // e.g. exact-alarm denied on Android 14 — non-fatal.
      });
    }),
  );
};

/* -------------------- permission + init -------------------- */
const readTarget = (data: unknown): NotificationTarget | undefined => {
  if (data && typeof data === 'object' && 'screen' in data) {
    return data as NotificationTarget;
  }
  return undefined;
};

/**
 * Call once on app start. Sets up the channel, requests permission (with a
 * friendly one-time primer), wires tap handling, and schedules reminders.
 * Never throws — denied permission just means no reminders.
 */
export const initNotifications = async (): Promise<void> => {
  try {
    await notifee.createChannel({
      id: CHANNEL_ID,
      name: 'Learning reminders',
      importance: AndroidImportance.DEFAULT,
    });

    // Friendly one-time explanation before the system prompt.
    if (!storage.getBoolean(PRIMER_KEY)) {
      storage.set(PRIMER_KEY, true);
      await new Promise<void>(resolve => {
        Alert.alert(
          'Stay on track 🔔',
          'Anviksha can send a gentle daily reminder for your AI challenge and next lesson. No spam — just a nudge to keep your streak alive.',
          [{ text: 'Sounds good', onPress: () => resolve() }],
          { cancelable: false, onDismiss: () => resolve() },
        );
      });
    }

    const settings = await notifee.requestPermission();
    permissionGranted =
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;

    // Foreground taps.
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        navigateFromNotification(readTarget(detail.notification?.data));
      }
    });

    // Cold-start tap (app launched from a notification).
    const initial = await notifee.getInitialNotification();
    if (initial) {
      setTimeout(
        () => navigateFromNotification(readTarget(initial.notification.data)),
        400,
      );
    }

    // Reschedule whenever progress changes (lesson/challenge complete, reset).
    useProgressStore.subscribe(() => {
      rescheduleReminders();
    });
    useSettingsStore.subscribe(() => {
      rescheduleReminders();
    });

    // Re-compute context each time the app is opened (covers "reschedule daily").
    AppState.addEventListener('change', s => {
      if (s === 'active') rescheduleReminders();
    });

    await rescheduleReminders();
  } catch {
    // Notifications are best-effort; the app must run fine without them.
  }
};
