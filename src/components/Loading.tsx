import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { Logo } from './Logo';

export interface LoadingProps {
  label?: string;
  /** Fill the parent and center (default). Set false for inline use. */
  fill?: boolean;
  /** Show the app logo above the spinner (full-screen loading). */
  branded?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ label, fill = true, branded }) => {
  const { colors, spacing } = useTheme();
  return (
    <View style={[fill && styles.fill, styles.center, { gap: spacing.md }]}>
      {branded && <Logo size={64} />}
      <ActivityIndicator color={colors.primary} />
      {label && (
        <Text variant="label" color="textSecondary">
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
});
