import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  Pressable,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider';

export interface SearchBarProps
  extends Omit<TextInputProps, 'style' | 'onChangeText' | 'value'> {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  /** Called when the clear (x) button is tapped. Defaults to clearing text. */
  onClear?: () => void;
  autoFocusGlow?: boolean;
  style?: ViewStyle;
}

/**
 * Themed search input with an animated focus ring (border morphs to the brand
 * color + soft glow) and a clear button. Drop-in for any list/browse screen.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search',
  onClear,
  style,
  ...rest
}) => {
  const { colors, radius, spacing, elevation } = useTheme();
  const [focused, setFocused] = useState(false);
  const f = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      f.value,
      [0, 1],
      [colors.border, colors.primary],
    ),
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(f.value, { duration: 180 }),
  }));

  return (
    <View style={style}>
      <Animated.View
        style={[
          styles.wrap,
          {
            borderRadius: radius.pill,
            backgroundColor: colors.surface,
            paddingHorizontal: spacing.lg,
            gap: spacing.sm,
          },
          containerStyle,
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: radius.pill },
            elevation.glow,
            glowStyle,
          ]}
        />
        <Icon
          name="search"
          size={18}
          color={focused ? colors.primary : colors.textTertiary}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          onFocus={() => {
            setFocused(true);
            f.value = withTiming(1, { duration: 180 });
          }}
          onBlur={() => {
            setFocused(false);
            f.value = withTiming(0, { duration: 180 });
          }}
          returnKeyType="search"
          style={[styles.input, { color: colors.text }]}
          {...rest}
        />
        {value.length > 0 && (
          <Pressable
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => (onClear ? onClear() : onChangeText(''))}
          >
            <Icon name="close-circle" size={18} color={colors.textTertiary} />
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1.5,
  },
  input: { flex: 1, fontSize: 15, padding: 0, margin: 0 },
});
