import React from 'react';
import { StyleSheet, Text as RNText, TextProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { TypographyVariant } from '../theme/typography';
import { ColorPalette } from '../theme/colors';
import { scaleFont } from '../utils/responsive';

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  /** Semantic color role from the theme; defaults to primary text color. */
  color?: keyof ColorPalette;
  center?: boolean;
}

/** Themed, responsive text. Single place fonts/scale are applied. */
export const Text: React.FC<AppTextProps> = ({
  variant = 'body',
  color = 'text',
  center,
  style,
  ...rest
}) => {
  const theme = useTheme();
  const base = theme.typography[variant];

  return (
    <RNText
      {...rest}
      style={[
        base,
        base.fontSize ? { fontSize: scaleFont(base.fontSize) } : null,
        { color: theme.colors[color] },
        center && styles.center,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
});
