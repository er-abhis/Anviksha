import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Gradient, ProgressBar, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { CurrentWorldMock } from '../types';

export const CurrentWorldCard: React.FC<{
  data: CurrentWorldMock;
  onPress?: () => void;
}> = ({ data, onPress }) => {
  const { radius, spacing } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Gradient colors={data.gradient} style={{ borderRadius: radius.lg }}>
        <View style={{ padding: spacing.xl }}>
          <View style={styles.eyebrowRow}>
            <Text variant="label" color="textInverse" style={styles.eyebrow}>
              CURRENT WORLD
            </Text>
            <Icon name="chevron-forward" size={18} color="#FFFFFF" />
          </View>
          <Text
            variant="h2"
            color="textInverse"
            style={{ marginTop: spacing.xs }}
          >
            {data.title}
          </Text>
          <Text
            variant="body"
            color="textInverse"
            style={[styles.sub, { marginTop: spacing.xxs }]}
          >
            {data.subtitle}
          </Text>
          <View style={{ marginTop: spacing.lg }}>
            <ProgressBar
              progress={data.progress}
              trackColor="overlay"
              fillColor="textInverse"
            />
          </View>
        </View>
      </Gradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: { letterSpacing: 1, opacity: 0.85 },
  sub: { opacity: 0.9 },
  pressed: { opacity: 0.9 },
});
