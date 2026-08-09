import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export interface LoadingProps {
  label?: string;
  /** Fill the parent and center (default). Set false for inline use. */
  fill?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ label, fill = true }) => {
  const { colors, spacing } = useTheme();
  return (
    <View style={[fill && styles.fill, styles.center, { gap: spacing.md }]}>
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
