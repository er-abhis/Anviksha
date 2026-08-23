import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { ColorPalette } from '../../../theme/colors';
import { Diagnostic, IssueLevel, ValidationResult } from '../validation/validate';

const ICON: Record<IssueLevel, string> = {
  error: 'close-circle',
  warn: 'alert-circle',
  info: 'information-circle',
  success: 'checkmark-circle',
};

const COLOR: Record<IssueLevel, keyof ColorPalette> = {
  error: 'error',
  warn: 'warning',
  info: 'textSecondary',
  success: 'success',
};

const Row: React.FC<{ issue: Diagnostic; index: number }> = ({ issue, index }) => {
  const { colors, spacing, radius } = useTheme();
  const tint = colors[COLOR[issue.level]];
  const toned = issue.level === 'success' || issue.level === 'error';
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).springify().damping(16)}
      style={[
        styles.row,
        {
          gap: spacing.sm,
          borderRadius: radius.lg,
          padding: toned ? spacing.sm : 0,
          backgroundColor: toned ? tint + '14' : 'transparent',
          borderWidth: toned ? StyleSheet.hairlineWidth : 0,
          borderColor: toned ? tint + '44' : 'transparent',
          ...(issue.level === 'success' ? { shadowColor: tint, shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 2 } : null),
        },
      ]}
    >
      <Icon name={ICON[issue.level]} size={18} color={tint} style={styles.icon} />
      <View style={styles.flex}>
        <Text variant="body">{issue.title}</Text>
        {issue.suggestion && (
          <Text variant="caption" color="textSecondary" style={styles.suggestion}>
            {issue.suggestion}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

/** Live feedback on the current build — explains what's wrong and why. */
export const ValidationPanel: React.FC<{ result: ValidationResult }> = ({
  result,
}) => {
  const { spacing } = useTheme();
  return (
    <GlassCard elevation="md">
      <View style={{ gap: spacing.sm }}>
        {result.issues.map((issue, i) => (
          <Row key={i} issue={issue} index={i} />
        ))}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  flex: { flex: 1 },
  icon: { marginTop: 1 },
  suggestion: { marginTop: 2 },
});
