import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { ActivityMock } from '../types';

export const ActivityRow: React.FC<{ item: ActivityMock }> = ({ item }) => {
  const { colors, radius, spacing } = useTheme();
  return (
    <Animated.View
      entering={FadeInDown.springify().damping(18)}
      style={[styles.row, { paddingVertical: spacing.sm, gap: spacing.md }]}
    >
      <View
        style={[
          styles.icon,
          { backgroundColor: colors.primaryMuted, borderRadius: radius.md },
        ]}
      >
        <Icon name={item.icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.flex}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {item.label}
        </Text>
        <Text variant="caption" color="textSecondary">
          {item.detail}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  icon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
