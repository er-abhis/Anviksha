import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
// ponytail: gesture-handler v3 deprecates the Gesture.Pan() builder in favour
// of a new hook API (usePanGesture). The builder is stable until the next
// major; migrate when that API is documented and device-verifiable.
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider';
import { usePreferencesStore } from '../store';
import { Text } from './Text';

/**
 * A long-press drag-to-reorder list for SHORT ordered sets (quiz "arrange in
 * order", lesson step sequences). Rows are a fixed height so reordering is
 * exact and cheap — this list is not meant for long, variable-height content.
 *
 * ponytail: fixed ROW_HEIGHT (single reliable measure) instead of runtime
 * measurement. Items here are short phrases; bump the height or measure if a
 * future caller needs multi-line rows.
 */
const ROW_HEIGHT = 60; // includes the vertical gap between rows

type PositionMap = Record<number, string>;

export interface DraggableListProps {
  /** Current order. The list reorders a copy and reports via onChange. */
  items: string[];
  onChange: (next: string[]) => void;
  /** Lock dragging (e.g. after the learner has checked their answer). */
  disabled?: boolean;
  /** Optional per-row correctness tint applied to the row border. */
  rowStatus?: (item: string, index: number) => 'correct' | 'wrong' | undefined;
  /** Optional display label (items may be ids). Defaults to the item itself. */
  labelFor?: (item: string) => string;
  /** Optional leading Ionicons glyph per row. */
  iconFor?: (item: string) => string;
  /** When set, a tap-to-remove control is shown on each row. */
  onRemove?: (item: string) => void;
}

/** Current slot of an item (works on either thread). */
const indexOf = (positions: SharedValue<PositionMap>, item: string): number => {
  const found = Object.entries(positions.value).find(([, v]) => v === item);
  return found ? Number(found[0]) : 0;
};

/** Move value at `from` to `to` inside an index→item map (UI thread). */
const objectMove = (obj: PositionMap, from: number, to: number): PositionMap => {
  'worklet';
  const next: PositionMap = {};
  for (const key in obj) {
    const i = Number(key);
    if (i === from) next[to] = obj[from];
    else if (i >= to && i < from) next[i + 1] = obj[i];
    else if (i <= to && i > from) next[i - 1] = obj[i];
    else next[i] = obj[i];
  }
  return next;
};

export const DraggableList: React.FC<DraggableListProps> = ({
  items,
  onChange,
  disabled,
  rowStatus,
  labelFor,
  iconFor,
  onRemove,
}) => {
  const { spacing } = useTheme();
  const reducedMotion = usePreferencesStore(s => s.reducedMotion);
  // index -> item; the live ordering the UI thread mutates while dragging.
  const positions = useSharedValue<PositionMap>(
    Object.fromEntries(items.map((it, i) => [i, it])),
  );
  const active = useSharedValue(false);

  // Re-sync the shared ordering whenever the caller resets `items`.
  React.useEffect(() => {
    positions.value = Object.fromEntries(items.map((it, i) => [i, it]));
  }, [items, positions]);

  return (
    <View style={{ height: items.length * ROW_HEIGHT, marginTop: spacing.xs }}>
      {items.map(item => (
        <Row
          key={item}
          item={item}
          count={items.length}
          positions={positions}
          active={active}
          disabled={disabled}
          reducedMotion={reducedMotion}
          status={rowStatus?.(item, indexOf(positions, item))}
          onCommit={onChange}
          labelFor={labelFor}
          iconFor={iconFor}
          onRemove={onRemove}
        />
      ))}
    </View>
  );
};

interface RowProps {
  item: string;
  count: number;
  positions: SharedValue<PositionMap>;
  active: SharedValue<boolean>;
  disabled?: boolean;
  reducedMotion: boolean;
  status?: 'correct' | 'wrong';
  onCommit: (next: string[]) => void;
  labelFor?: (item: string) => string;
  iconFor?: (item: string) => string;
  onRemove?: (item: string) => void;
}

const Row: React.FC<RowProps> = ({
  item,
  count,
  positions,
  active,
  disabled,
  reducedMotion,
  status,
  onCommit,
  labelFor,
  iconFor,
  onRemove,
}) => {
  const { colors, radius } = useTheme();

  const slot = () => {
    'worklet';
    // Plain for-in loop — most worklet-safe way to read the shared map on the UI thread.
    const map = positions.value;
    for (const key in map) {
      if (map[key] === item) return Number(key);
    }
    return 0;
  };

  const top = useSharedValue(indexOf(positions, item) * ROW_HEIGHT);
  const dragging = useSharedValue(false);
  // Slot position captured at drag start; the card tracks finger from here so
  // it never jumps when the underlying ordering shifts mid-drag.
  const startTop = useSharedValue(0);

  // Follow this row's slot when the ordering changes (unless we're dragging it).
  useAnimatedReaction(
    () => slot(),
    (cur, prev) => {
      if (cur !== prev && !dragging.value) {
        top.value = reducedMotion ? cur * ROW_HEIGHT : withSpring(cur * ROW_HEIGHT);
      }
    },
  );

  const emit = () => {
    const arr: string[] = [];
    for (let i = 0; i < count; i++) arr.push(positions.value[i]);
    onCommit(arr);
  };

  const pan = Gesture.Pan()
    .activateAfterLongPress(200)
    .enabled(!disabled)
    .onStart(() => {
      dragging.value = true;
      active.value = true;
      startTop.value = slot() * ROW_HEIGHT;
    })
    .onUpdate(e => {
      // Track the finger from the captured start — never from the live slot,
      // which shifts as rows reorder underneath.
      top.value = startTop.value + e.translationY;
      const from = slot();
      const newSlot = Math.max(0, Math.min(count - 1, Math.round(top.value / ROW_HEIGHT)));
      if (newSlot !== from) {
        positions.value = objectMove(positions.value, from, newSlot);
      }
    })
    .onEnd(() => {
      const target = slot() * ROW_HEIGHT;
      top.value = reducedMotion ? target : withSpring(target);
    })
    .onFinalize(() => {
      dragging.value = false;
      active.value = false;
      runOnJS(emit)();
    });

  const style = useAnimatedStyle(() => ({
    top: top.value,
    zIndex: dragging.value ? 10 : 0,
    elevation: dragging.value ? 8 : 0,
    transform: [{ scale: dragging.value ? 1.03 : 1 }],
    shadowOpacity: dragging.value ? 0.25 : 0,
  }));

  const borderColor =
    status === 'correct' ? colors.success : status === 'wrong' ? colors.error : colors.border;

  return (
    <Animated.View style={[styles.rowWrap, style]}>
      <GestureDetector gesture={pan}>
        <View
          style={[
            styles.row,
            {
              borderRadius: radius.md,
              borderColor,
              backgroundColor: colors.surface,
              shadowColor: colors.text,
            },
          ]}
        >
          <View style={[styles.badge, { backgroundColor: colors.surfaceAlt, borderRadius: radius.sm }]}>
            <Text variant="label" color="textSecondary">{`${indexOf(positions, item) + 1}`}</Text>
          </View>
          {iconFor && <Icon name={iconFor(item)} size={18} color={colors.primary} />}
          <Text variant="body" style={styles.flex} numberOfLines={2}>
            {labelFor ? labelFor(item) : item}
          </Text>
          {onRemove && !disabled && (
            <Pressable hitSlop={8} onPress={() => onRemove(item)} accessibilityRole="button" accessibilityLabel="Remove">
              <Icon name="close-circle" size={20} color={colors.textTertiary} />
            </Pressable>
          )}
          <Icon
            name="reorder-three"
            size={22}
            color={disabled ? colors.textTertiary : colors.textSecondary}
          />
        </View>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  rowWrap: { position: 'absolute', left: 0, right: 0, height: ROW_HEIGHT, justifyContent: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderWidth: 1,
    height: ROW_HEIGHT - 8,
  },
  badge: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
});
