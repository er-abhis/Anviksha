import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export interface SectionTitleProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  actionLabel,
  onAction,
}) => {
  const { spacing } = useTheme();
  return (
    <View style={[styles.row, { marginBottom: spacing.md }]}>
      <Text variant="h3">{title}</Text>
      {actionLabel && onAction && (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
          <Text variant="label" color="primary">
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
