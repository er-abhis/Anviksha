import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, ProgressBar, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { ContinueItem } from '../types';

export const ContinueCard: React.FC<{
  item: ContinueItem;
  onPress?: () => void;
}> = ({ item, onPress }) => {
  const { colors, spacing } = useTheme();
  return (
    <Card onPress={onPress} elevation="md">
      <View style={[styles.row, { gap: spacing.md }]}>
        <View
          style={[styles.thumb, { backgroundColor: colors.primaryMuted }]}
        >
          <Icon name="play" size={22} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="label" color="textSecondary">
            {item.worldTitle}
          </Text>
          <Text variant="bodyStrong" numberOfLines={2}>
            {item.title}
          </Text>
          <View style={{ marginTop: spacing.sm }}>
            <ProgressBar progress={item.progress} />
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
