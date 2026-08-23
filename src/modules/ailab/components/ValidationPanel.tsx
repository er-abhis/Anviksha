import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, Text } from '../../../components';
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

const Row: React.FC<{ issue: Diagnostic }> = ({ issue }) => {
  const { colors, spacing } = useTheme();
  const tint = colors[COLOR[issue.level]];
  return (
    <View style={[styles.row, { gap: spacing.sm }]}>
      <Icon name={ICON[issue.level]} size={18} color={tint} style={styles.icon} />
      <View style={styles.flex}>
        <Text variant="body">{issue.title}</Text>
        {issue.suggestion && (
          <Text variant="caption" color="textSecondary" style={styles.suggestion}>
            {issue.suggestion}
          </Text>
        )}
      </View>
    </View>
  );
};

/** Live feedback on the current build — explains what's wrong and why. */
export const ValidationPanel: React.FC<{ result: ValidationResult }> = ({
  result,
}) => {
  const { spacing } = useTheme();
  return (
    <Card elevation="sm">
      <View style={{ gap: spacing.md }}>
        {result.issues.map((issue, i) => (
          <Row key={i} issue={issue} />
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  flex: { flex: 1 },
  icon: { marginTop: 1 },
  suggestion: { marginTop: 2 },
});
