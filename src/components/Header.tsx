import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { IconButton } from './IconButton';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  large?: boolean;
}

/** Screen header. `large` renders a title-only hero style (Home/Profile). */
export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  right,
  large,
}) => {
  const { spacing } = useTheme();

  return (
    <View style={[styles.row, { paddingHorizontal: spacing.lg, gap: spacing.md }]}>
      {onBack && (
        <IconButton
          name="chevron-back"
          onPress={onBack}
          accessibilityLabel="Go back"
        />
      )}
      <View style={styles.titles}>
        {title && (
          <Text variant={large ? 'h1' : 'h3'} numberOfLines={1}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text variant="label" color="textSecondary" numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {right && <View>{right}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  titles: { flex: 1 },
});
