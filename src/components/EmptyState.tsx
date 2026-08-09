import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'sparkles-outline',
  title,
  message,
  actionLabel,
  onAction,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xl, gap: spacing.sm }]}>
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: colors.surfaceAlt, marginBottom: spacing.sm },
        ]}
      >
        <Icon name={icon} size={30} color={colors.textSecondary} />
      </View>
      <Text variant="h3" center>
        {title}
      </Text>
      {message && (
        <Text variant="body" color="textSecondary" center>
          {message}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant="secondary"
          size="sm"
          style={{ marginTop: spacing.md }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
