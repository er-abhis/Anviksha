import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { DraggableList, GlassCard, ProgressBar, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import {
  Activity,
  BucketConfig,
  SequenceConfig,
  SliderConfig,
  StepsConfig,
} from '../../../content';

/** Renders any lesson activity from its typed config. Purely presentational
 *  interactivity — no scoring is persisted; it exists to build intuition. */
export const ActivityRenderer: React.FC<{ activity: Activity }> = ({
  activity,
}) => {
  const { colors, radius, spacing } = useTheme();
  return (
    <GlassCard elevation="lg">
      <View style={[styles.titleRow, { gap: spacing.sm }]}>
        <View style={[styles.pill, { backgroundColor: colors.primaryMuted, borderRadius: radius.sm }]}>
          <Icon name="flask" size={14} color={colors.primary} />
          <Text variant="caption" color="primary">
            Interactive
          </Text>
        </View>
        <Text variant="bodyStrong" style={styles.flex}>
          {activity.title}
        </Text>
      </View>
      <Text variant="body" color="textSecondary" style={{ marginBottom: spacing.md }}>
        {activity.instructions}
      </Text>
      {activity.kind === 'sequence' && <Sequence config={activity.config} />}
      {activity.kind === 'bucket' && <Bucket config={activity.config} />}
      {activity.kind === 'slider' && <Slider config={activity.config} />}
      {activity.kind === 'steps' && <Steps config={activity.config} />}
    </GlassCard>
  );
};

/* ----------------------------- Sequence ----------------------------- */
const Sequence: React.FC<{ config: SequenceConfig }> = ({ config }) => {
  const { colors, radius, spacing } = useTheme();
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  return (
    <View style={{ gap: spacing.md }}>
      <View style={[styles.chipRow, { gap: spacing.xs }]}>
        {config.shown.map((s, i) => (
          <View key={i} style={[styles.chip, { backgroundColor: colors.surfaceAlt, borderRadius: radius.sm }]}>
            <Text variant="bodyStrong">{s}</Text>
          </View>
        ))}
        <View style={[styles.chip, { backgroundColor: colors.primaryMuted, borderRadius: radius.sm }]}>
          <Text variant="bodyStrong" color="primary">?</Text>
        </View>
      </View>
      <View style={{ gap: spacing.sm }}>
        {config.options.map((opt, i) => {
          const right = i === config.correctIndex;
          const show = answered && (i === picked || right);
          const tint = show ? (right ? colors.success : colors.error) : colors.glassBorder;
          return (
            <Animated.View key={i} entering={FadeInDown.delay(i * 60).duration(320)}>
              <Pressable
                disabled={answered}
                onPress={() => setPicked(i)}
                style={[
                  styles.option,
                  {
                    borderRadius: radius.lg,
                    borderColor: tint,
                    borderWidth: show ? 1.5 : 1,
                    backgroundColor: colors.glass,
                  },
                  show && { shadowColor: tint, shadowOpacity: 0.5, shadowRadius: 14, shadowOffset: { width: 0, height: 0 }, elevation: 6 },
                ]}
              >
                <Text variant="body" style={styles.flex}>{opt}</Text>
                {show && (
                  <Animated.View entering={ZoomIn.duration(240)}>
                    <Icon
                      name={right ? 'checkmark-circle' : 'close-circle'}
                      size={18}
                      color={right ? colors.success : colors.error}
                    />
                  </Animated.View>
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
      {answered && (
        <Text variant="caption" color="textSecondary">{config.reveal}</Text>
      )}
    </View>
  );
};

/* ------------------------------ Bucket ------------------------------ */
const Bucket: React.FC<{ config: BucketConfig }> = ({ config }) => {
  const { colors, radius, spacing } = useTheme();
  const [assign, setAssign] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);

  const allAssigned = config.items.every((_, i) => assign[i] !== undefined);
  const correctCount = config.items.filter((it, i) => assign[i] === it.bucket).length;

  return (
    <View style={{ gap: spacing.sm }}>
      {config.items.map((item, i) => {
        const chosen = assign[i];
        const isRight = chosen === item.bucket;
        return (
          <View key={i} style={{ gap: spacing.xs }}>
            <View style={styles.itemRow}>
              <Text variant="body" style={styles.flex}>{item.label}</Text>
              {checked && (
                <Icon
                  name={isRight ? 'checkmark-circle' : 'close-circle'}
                  size={18}
                  color={isRight ? colors.success : colors.error}
                />
              )}
            </View>
            <View style={[styles.chipRow, { gap: spacing.xs }]}>
              {config.buckets.map((b, bi) => {
                const active = chosen === bi;
                return (
                  <Pressable
                    key={bi}
                    disabled={checked}
                    onPress={() => setAssign(a => ({ ...a, [i]: bi }))}
                    style={[
                      styles.bucketChip,
                      {
                        borderRadius: radius.pill,
                        borderColor: active ? colors.accent : colors.glassBorder,
                        backgroundColor: active ? colors.primaryMuted : colors.glass,
                      },
                    ]}
                  >
                    <Text variant="label" color={active ? 'primary' : 'textSecondary'}>{b}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
      <ActionRow
        checked={checked}
        canCheck={allAssigned}
        onCheck={() => setChecked(true)}
        onReset={() => { setChecked(false); setAssign({}); }}
        resultText={`${correctCount} / ${config.items.length} correct`}
      />
    </View>
  );
};

/* ------------------------------ Slider ------------------------------ */
const Slider: React.FC<{ config: SliderConfig }> = ({ config }) => {
  const { colors, radius, spacing } = useTheme();
  const mid = Math.round((config.min + config.max) / 2);
  const [value, setValue] = useState(mid);

  const stop = config.stops.find(s => value <= s.upTo) ?? config.stops[config.stops.length - 1];
  const fraction = (value - config.min) / (config.max - config.min);
  const clamp = (v: number) => Math.max(config.min, Math.min(config.max, v));

  return (
    <View style={{ gap: spacing.md }}>
      <View style={styles.sliderHead}>
        <Text variant="label" color="textSecondary">{config.valueLabel}</Text>
        <Text variant="h3" color="primary">{value}</Text>
      </View>
      <ProgressBar progress={fraction} height={10} />
      <View style={styles.stepper}>
        <StepBtn icon="remove" onPress={() => setValue(v => clamp(v - config.step))} />
        <View style={[styles.stopBox, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md }]}>
          <Text variant="bodyStrong" center>{stop.title}</Text>
          <Text variant="caption" color="textSecondary" center>{stop.detail}</Text>
        </View>
        <StepBtn icon="add" onPress={() => setValue(v => clamp(v + config.step))} />
      </View>
    </View>
  );
};

const StepBtn: React.FC<{ icon: string; onPress: () => void }> = ({ icon, onPress }) => {
  const { colors, radius } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.stepBtn,
        { backgroundColor: colors.primary, borderRadius: radius.md, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Icon name={icon} size={22} color={colors.onPrimary} />
    </Pressable>
  );
};

/* ------------------------------- Steps ------------------------------ */
const Steps: React.FC<{ config: StepsConfig }> = ({ config }) => {
  const { spacing } = useTheme();
  // Deterministic derangement (rotate by 1) so it never starts already-solved.
  const n = config.steps.length;
  const [order, setOrder] = useState<string[]>(
    config.steps.map((_, i) => config.steps[(i + 1) % n]),
  );
  const [checked, setChecked] = useState(false);
  const correct = order.every((s, i) => s === config.steps[i]);

  return (
    <View style={{ gap: spacing.sm }}>
      <Text variant="caption" color="textTertiary">Long-press a step, then drag to arrange.</Text>
      <DraggableList
        items={order}
        disabled={checked}
        onChange={next => {
          setOrder(next);
          setChecked(false);
        }}
        rowStatus={
          checked
            ? (item, i) => (config.steps[i] === item ? 'correct' : 'wrong')
            : undefined
        }
      />
      <ActionRow
        checked={checked}
        canCheck
        onCheck={() => setChecked(true)}
        onReset={() => { setChecked(false); setOrder(config.steps.map((_, i) => config.steps[(i + 1) % n])); }}
        resultText={correct ? 'Correct order! 🎉' : 'Not yet — keep arranging'}
      />
    </View>
  );
};

/* ---------------------------- shared bits --------------------------- */
const ActionRow: React.FC<{
  checked: boolean;
  canCheck: boolean;
  onCheck: () => void;
  onReset: () => void;
  resultText: string;
}> = ({ checked, canCheck, onCheck, onReset, resultText }) => {
  const { colors, radius, spacing } = useTheme();
  return (
    <View style={[styles.actionRow, { marginTop: spacing.xs }]}>
      {checked ? (
        <>
          <Text variant="label" style={styles.flex}>{resultText}</Text>
          <Pressable onPress={onReset} style={[styles.smallBtn, { borderColor: colors.border, borderRadius: radius.pill }]}>
            <Text variant="label" color="primary">Try again</Text>
          </Pressable>
        </>
      ) : (
        <Pressable
          onPress={onCheck}
          disabled={!canCheck}
          style={[
            styles.smallBtn,
            {
              borderColor: canCheck ? colors.primary : colors.border,
              backgroundColor: canCheck ? colors.primaryMuted : 'transparent',
              borderRadius: radius.pill,
              opacity: canCheck ? 1 : 0.5,
            },
          ]}
        >
          <Text variant="label" color={canCheck ? 'primary' : 'textTertiary'}>Check answer</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  chip: { paddingHorizontal: 12, paddingVertical: 8 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderWidth: 1 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bucketChip: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
  sliderHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stopBox: { flex: 1, padding: 12, gap: 2 },
  stepBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  smallBtn: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
});
