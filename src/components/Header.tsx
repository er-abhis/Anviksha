import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { IconButton } from './IconButton';
import { GlobalSearchModal } from './GlobalSearchModal';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  large?: boolean;
  gutter?: boolean;
  searchable?: boolean;
}

/** Screen header. `large` renders a title-only hero style (Home/Profile). */
export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  right,
  large,
  gutter = false,
  searchable = true, // Default enabled for instant search capability across screens
}) => {
  const { spacing } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <View
        style={[
          styles.row,
          { gap: spacing.md },
          gutter && { paddingHorizontal: spacing.lg },
        ]}
      >
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

        <View style={styles.rightRow}>
          {searchable && (
            <IconButton
              name="search-outline"
              onPress={() => setSearchOpen(true)}
              accessibilityLabel="Open global search"
            />
          )}
          {right}
        </View>
      </View>

      {/* Global Command / Search Modal */}
      <GlobalSearchModal visible={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  titles: { flex: 1 },
  rightRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
