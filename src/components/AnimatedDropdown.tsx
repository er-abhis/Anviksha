import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { GlassCard } from './GlassCard';

export interface DropdownOption {
  key: string;
  label: string;
  icon?: string;
  flag?: string;
  colors?: readonly [string, string];
}

export interface AnimatedDropdownProps {
  label: string;
  options: DropdownOption[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

export const AnimatedDropdown: React.FC<AnimatedDropdownProps> = ({
  label,
  options,
  selectedKey,
  onSelect,
}) => {
  const { colors, radius, spacing } = useTheme();
  const [open, setOpen] = useState(false);

  const selectedOption = options.find(o => o.key === selectedKey) || options[0];

  return (
    <View style={styles.container}>
      <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.xs }}>
        {label}
      </Text>

      {/* Main Selected Header Button */}
      <Pressable
        onPress={() => setOpen(prev => !prev)}
        style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selectedOption?.label}`}
      >
        <GlassCard
          elevation="sm"
          style={[
            styles.headerCard,
            {
              borderRadius: radius.lg,
              borderColor: open ? colors.primary : colors.glassBorder,
              borderWidth: open ? 1.5 : 1,
              backgroundColor: colors.surfaceAlt,
            },
          ]}
        >
          <View style={styles.optionRow}>
            {selectedOption?.flag ? (
              <Text style={{ fontSize: 18 }}>{selectedOption.flag}</Text>
            ) : selectedOption?.colors ? (
              <View style={styles.dualDot}>
                <View style={{ flex: 1, backgroundColor: selectedOption.colors[0] }} />
                <View style={{ flex: 1, backgroundColor: selectedOption.colors[1] }} />
              </View>
            ) : null}

            {selectedOption?.icon && (
              <Icon name={selectedOption.icon} size={18} color={colors.primary} />
            )}

            <Text variant="bodyStrong" style={styles.flex}>
              {selectedOption?.label}
            </Text>

            <View style={[styles.badge, { backgroundColor: colors.primaryMuted }]}>
              <Text variant="caption" style={{ color: colors.primary, fontWeight: '800', fontSize: 10 }}>
                Active
              </Text>
            </View>

            <Icon
              name={open ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={colors.textSecondary}
            />
          </View>
        </GlassCard>
      </Pressable>

      {/* Animated Dropdown Items List */}
      {open && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          exiting={FadeOutUp.duration(150)}
          style={[
            styles.dropdownMenu,
            {
              borderRadius: radius.lg,
              borderColor: colors.border,
              backgroundColor: colors.surface,
              marginTop: 6,
            },
          ]}
        >
          {options.map((opt, idx) => {
            const active = selectedKey === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => {
                  onSelect(opt.key);
                  setOpen(false);
                }}
                style={({ pressed }) => [
                  styles.menuItem,
                  {
                    backgroundColor: active ? colors.primaryMuted : pressed ? colors.surfaceAlt : 'transparent',
                    borderBottomWidth: idx < options.length - 1 ? StyleSheet.hairlineWidth : 0,
                    borderBottomColor: colors.glassBorder,
                  },
                ]}
              >
                <View style={styles.optionRow}>
                  {opt.flag ? (
                    <Text style={{ fontSize: 18 }}>{opt.flag}</Text>
                  ) : opt.colors ? (
                    <View style={styles.dualDot}>
                      <View style={{ flex: 1, backgroundColor: opt.colors[0] }} />
                      <View style={{ flex: 1, backgroundColor: opt.colors[1] }} />
                    </View>
                  ) : null}

                  {opt.icon && (
                    <Icon
                      name={opt.icon}
                      size={18}
                      color={active ? colors.primary : colors.textSecondary}
                    />
                  )}

                  <Text
                    variant="body"
                    style={[
                      styles.flex,
                      { color: active ? colors.primary : colors.text, fontWeight: active ? '700' : '400' },
                    ]}
                  >
                    {opt.label}
                  </Text>

                  {active && <Icon name="checkmark-circle" size={18} color={colors.primary} />}
                </View>
              </Pressable>
            );
          })}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  flex: { flex: 1 },
  headerCard: { padding: 12 },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dualDot: { width: 18, height: 18, borderRadius: 9, overflow: 'hidden', flexDirection: 'row' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  dropdownMenu: { borderWidth: 1, overflow: 'hidden' },
  menuItem: { paddingHorizontal: 14, paddingVertical: 12 },
});
