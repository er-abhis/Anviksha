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
  'morning-ai-news': (_c, dailyDone) => ({
    title: '🌅 Morning AI Digest',
    body:
      'DeepSeek-V3 & INT8 Quantization Latency Breakthrough! Tap to read today’s top AI research paper.',
    target: { screen: 'Home' },
    hour: 9,
    skipToday: dailyDone,
  }),
  'afternoon-ai-radar': () => ({
    title: '☀️ Afternoon AI Tech Pulse',
    body:
      'Small Language Models achieve sub-10ms token latency on mobile NPUs. Tap to check today’s AI performance radar!',
    target: { screen: 'Home' },
    hour: 14,
  }),
  'evening-ai-paper': completed => {
    const pending = nextPendingLesson(completed);
    return {
      title: '🌙 Evening AI Deep Dive',
      body: pending
        ? `Self-Rewarding LLMs & DPO alignment paper released. Tap to continue Chapter ${pending.order}: ${pending.title}!`
        : 'Self-Rewarding LLMs & DPO alignment paper released. Tap to explore latest AI research insights!',
      target: pending ? { screen: 'Lesson', lessonId: pending.id } : { screen: 'Home' },
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
  const wantsNotifications = useSettingsStore.getState().notifications;
  // Re-check permission live: the user may have enabled the Notifications toggle
  // AFTER launch, so a launch-time denial must not disable reminders forever.
  // If already denied at OS level this resolves to denied without re-prompting.
  if (wantsNotifications && !permissionGranted) {
    const s = await notifee.requestPermission().catch(() => null);
    permissionGranted =
      s?.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      s?.authorizationStatus === AuthorizationStatus.PROVISIONAL;
  }
  const enabled = wantsNotifications && permissionGranted;

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
      ).catch(async () => {
        // Fallback for devices without exact alarm permission (e.g. Android 12+)
        await notifee.createTriggerNotification(
          {
            id,
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
          },
        ).catch(() => {});
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

    // Set primer key
    if (!storage.getBoolean(PRIMER_KEY)) {
      storage.set(PRIMER_KEY, true);
    }

    const settings = await notifee.requestPermission().catch(() => ({ authorizationStatus: AuthorizationStatus.DENIED }));
    permissionGranted =
      settings?.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings?.authorizationStatus === AuthorizationStatus.PROVISIONAL;

    // Foreground taps.
    try {
      notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS) {
          navigateFromNotification(readTarget(detail.notification?.data));
        }
      });
    } catch {}

    // Cold-start tap (app launched from a notification).
    const initial = await notifee.getInitialNotification().catch(() => null);
    if (initial) {
      setTimeout(
        () => navigateFromNotification(readTarget(initial.notification?.data)),
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
